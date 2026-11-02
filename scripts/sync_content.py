#!/usr/bin/env python3
"""
Build data/profile.json from the resume PDF (and, optionally, a LinkedIn export).

The website never needs to be edited by hand when the resume changes:

    public/resume.pdf  ->  scripts/sync_content.py  ->  data/profile.json  ->  React

Run:
    python scripts/sync_content.py
    python scripts/sync_content.py --dump-sections   # debug the parser
"""

from __future__ import annotations

import argparse
import csv
import io
import json
import re
import sys
import zipfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable

try:
    import pymupdf  # type: ignore
except ImportError as exc:  # pragma: no cover - friendly setup error
    raise SystemExit(
        "PyMuPDF is required. Install it with:\n\n    python -m pip install -r requirements.txt\n"
    ) from exc


ROOT = Path(__file__).resolve().parent.parent
RESUME_PATH = ROOT / "public" / "resume.pdf"
OVERRIDES_PATH = ROOT / "data" / "overrides.json"
PROFILE_PATH = ROOT / "data" / "profile.json"
LINKEDIN_ZIP = ROOT / "data" / "linkedin-export.zip"
LINKEDIN_DIR = ROOT / "data" / "linkedin-export"
# A public, normalized snapshot of the professional parts of the export. The
# raw export stays private; this file lets GitHub Actions keep LinkedIn-only
# roles after a resume-only sync.
LINKEDIN_SNAPSHOT = ROOT / "data" / "linkedin.json"

MONTH = (
    r"(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|"
    r"Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|"
    r"Nov(?:ember)?|Dec(?:ember)?)"
)
DATE_TOKEN = rf"(?:{MONTH}\s+)?\d{{4}}"
DATE_RANGE_RE = re.compile(
    rf"({DATE_TOKEN})\s*[–—-]\s*(Present|Current|{DATE_TOKEN})", re.IGNORECASE
)
SINGLE_DATE_RE = re.compile(rf"\b({DATE_TOKEN})\b", re.IGNORECASE)
YEAR_RE = re.compile(r"\b(?:19|20)\d{2}\b")

BULLET_RE = re.compile(r"^[•▪◦●○·\uf0b7]\s*")
KEEP_HYPHEN = {
    "real", "multi", "cross", "end", "self", "non", "pre", "post", "well",
    "high", "low", "long", "short", "full", "part", "time", "user", "auto",
    "semi", "micro", "macro", "ultra", "inter", "intra", "over", "under",
    "open", "closed", "on", "off", "all", "one", "two", "three", "four",
    "five", "six", "seven", "eight", "nine", "ten", "state", "cloud",
    "data", "health", "risk", "web", "co", "re", "anti", "e",
}

SECTION_ALIASES: list[tuple[str, re.Pattern[str]]] = [
    ("education", re.compile(r"^(?:examination|education|academic background)$", re.I)),
    ("scholastic", re.compile(r"^(?:scholastic achievements?|academic achievements?)$", re.I)),
    ("experience", re.compile(r"^(?:work experience|professional experience|experience|internships?)$", re.I)),
    ("skills", re.compile(r"^(?:technical skills|skills|technical expertise)$", re.I)),
    ("projects", re.compile(r"^(?:projects?|academic projects?|key projects?)$", re.I)),
    ("achievements", re.compile(r"^(?:achievements? & highlights?|achievements?|highlights?)$", re.I)),
    ("certifications", re.compile(r"^(?:certifications? & training|certifications?|training)$", re.I)),
    ("courses", re.compile(r"^(?:relevant courses?|coursework|relevant coursework)(?:\s*\(\*?\s*ongoing\s*\))?$", re.I)),
]

EDUCATION_LABELS = re.compile(
    r"^(Graduation|Post[ -]?Graduation|Intermediate/\+?2|Intermediate|Matriculation|Class (?:X|XII)|Bachelor|Master)",
    re.I,
)

CERT_ISSUER_FALLBACK = [
    "National Forensic Sciences University", "NFSU", "IIT BHU", "IIT (BHU)",
    "EmergeSmart Health", "Vodafone Intelligent Solutions", "VOIS",
    "Amazon Web Services", "AWS", "Google", "Microsoft", "Cisco",
    "Cisco Networking Academy", "Security Blue Team", "Securiti", "Udemy",
    "GeeksforGeeks", "Zoho", "Coursera", "NPTEL", "IBM", "Oracle",
]


# ---------------------------------------------------------------------------
# Text extraction and normalisation
# ---------------------------------------------------------------------------

def extract_pdf_text(path: Path) -> str:
    if not path.exists():
        raise SystemExit(f"Resume not found: {path}\nAdd your resume as public/resume.pdf")
    with pymupdf.open(str(path)) as doc:
        return "\n".join(page.get_text("text") for page in doc)


def _dehyphenate(raw: str) -> str:
    """Join PDF line-wrap hyphens without destroying real compound words."""

    def repl(match: re.Match[str]) -> str:
        prefix = match.group("prefix")
        if prefix.count("-") > 0:
            return prefix + "-"  # farmer-distributor-\nretailer
        if prefix.lower() in KEEP_HYPHEN:
            return prefix + "-"  # real-\ntime
        return prefix  # Cy-\nbersecurity, Regres-\nsion

    return re.sub(r"(?m)(?P<prefix>[A-Za-z][A-Za-z-]*?)-\n(?=[a-z])", repl, raw)


def normalise_lines(raw: str) -> list[str]:
    raw = raw.replace("\r\n", "\n").replace("\r", "\n")
    raw = raw.replace("\x87", "•").replace("\uf0b7", "•").replace("\u2022", "•")
    raw = raw.replace("\u00a0", " ").replace("\u2013", "–").replace("\u2014", "—")
    raw = _dehyphenate(raw)

    lines: list[str] = []
    for line in raw.split("\n"):
        line = re.sub(r"[ \t]+", " ", line).strip()
        if not line:
            continue
        if re.fullmatch(r"\(\*?\s*ongoing\s*\)", line, re.I):
            continue
        # A date such as "May 2025 – Jul" can wrap onto the next line.
        if (
            lines
            and re.fullmatch(r"(?:19|20)\d{2}", line)
            and re.search(rf"{MONTH}$", lines[-1], re.I)
        ):
            lines[-1] = f"{lines[-1]} {line}"
        else:
            lines.append(line)
    return lines


def is_bullet(line: str) -> bool:
    return bool(BULLET_RE.match(line))


def strip_bullet(line: str) -> str:
    return BULLET_RE.sub("", line).strip()


def join_text(left: str, right: str) -> str:
    if not left:
        return right
    if not right:
        return left
    if left.endswith(("-", "/")) or right.startswith(("/", ",", ".", ")", ";")):
        return f"{left}{right}"
    return f"{left} {right}"


def split_sections(lines: list[str]) -> dict[str, list[str]]:
    sections: dict[str, list[str]] = {"header": []}
    current = "header"
    for line in lines:
        matched = None
        for key, pattern in SECTION_ALIASES:
            if pattern.match(line):
                matched = key
                break
        if matched:
            current = matched
            sections.setdefault(current, [])
        else:
            sections.setdefault(current, []).append(line)
    return sections


def parse_bullets(lines: Iterable[str]) -> list[str]:
    items: list[str] = []
    for line in lines:
        if is_bullet(line):
            items.append(strip_bullet(line))
        elif items:
            items[-1] = join_text(items[-1], line)
        else:
            items.append(line)
    return [item for item in items if item]


def short_date(value: str) -> str:
    value = re.sub(r"\s+", " ", value).strip()
    return value.replace(" - ", " – ").replace("—", "–")


def tool_label(value: str) -> str:
    """Give the technology marquee tidy, unique labels."""
    aliases = {
        "SQL (PostgreSQL)": "SQL",
        "Microsoft Azure (VM)": "Azure",
        "Microsoft Azure VM": "Azure",
        "Microsoft Azure": "Azure",
        "C/C++": "C++",
    }
    clean = re.sub(r"\s*\((?:[^)]*)\)\s*$", "", value).strip()
    return aliases.get(clean, clean)


def normalise_key(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", (value or "").lower())


def same_company(left: str, right: str) -> bool:
    a, b = normalise_key(left), normalise_key(right)
    return bool(a and b and (a == b or a in b or b in a))


# ---------------------------------------------------------------------------
# Section parsers
# ---------------------------------------------------------------------------

def parse_header(lines: list[str], overrides: dict[str, Any]) -> dict[str, Any]:
    text = "\n".join(lines)
    name = next((line for line in lines if re.fullmatch(r"[A-Z][A-Z .'-]{2,60}", line)), "")
    if not name and lines:
        name = lines[0]

    email = re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+", text)
    phone = re.search(r"(?:\+\d{1,3}[\s-]?)?(?:\d[\s-]?){9,13}\d", text)
    phone_text = ""
    if phone:
        phone_text = re.sub(r"(?<=\d)[- ](?=\d)", " ", phone.group(0)).strip()
        phone_text = re.sub(r"\s+", " ", phone_text)

    linkedin = re.search(r"(?:https?://)?(?:www\.)?linkedin\.com/in/[\w-]+", text, re.I)
    links = dict(overrides.get("links") or {})
    if linkedin and not links.get("linkedin"):
        links["linkedin"] = "https://" + linkedin.group(0).replace("https://", "").replace("http://", "")

    return {
        "name": name.title() if name.isupper() else name,
        "email": email.group(0) if email else "",
        "phone": phone_text,
        "links": links,
    }


def parse_education(lines: list[str]) -> list[dict[str, Any]]:
    # Drop the table header if it was extracted on its own line(s).
    cleaned: list[str] = []
    for line in lines:
        if re.match(r"^(Examination|Degree/Certificate|Institute|Year|GPA/%?)$", line, re.I):
            continue
        cleaned.append(line)

    starts = [i for i, line in enumerate(cleaned) if EDUCATION_LABELS.match(line)]
    if not starts:
        return []

    results: list[dict[str, Any]] = []
    for index, start in enumerate(starts):
        end = starts[index + 1] if index + 1 < len(starts) else len(cleaned)
        block = cleaned[start:end]
        label = block[0]
        body = block[1:]
        if not body:
            continue

        year_index = next((i for i, line in enumerate(body) if YEAR_RE.search(line) or "present" in line.lower()), None)
        if year_index is None:
            continue

        period_line = body[year_index]
        period_match = re.search(
            rf"{DATE_TOKEN}\s*[–—-]\s*(?:Present|Current|{DATE_TOKEN})|{DATE_TOKEN}|Present|Current",
            period_line,
            re.I,
        )
        period = short_date(period_match.group(0)) if period_match else period_line
        score = next(
            (line for line in body if re.search(r"\b\d+(?:\.\d+)?\s*(?:/\s*10|%)", line)),
            "",
        )

        degree = body[0] if body else label
        institution_lines = body[1:year_index]
        institution = " ".join(institution_lines).strip(" ,")
        if not institution:
            institution = ""
        results.append(
            {
                "id": index + 1,
                "degree": degree,
                "institution": institution,
                "period": period,
                "score": score,
                "label": label,
            }
        )
    return results


def parse_experience(lines: list[str]) -> list[dict[str, Any]]:
    date_indexes = [
        i for i, line in enumerate(lines) if DATE_RANGE_RE.search(line) or re.search(rf"\b{MONTH}\s+\d{{4}}$", line, re.I)
    ]
    results: list[dict[str, Any]] = []

    for n, index in enumerate(date_indexes):
        line = lines[index]
        range_match = DATE_RANGE_RE.search(line)
        if range_match:
            period = short_date(range_match.group(0))
            company = line[: range_match.start()].strip(" ,|–—-")
        else:
            single = re.search(rf"\b{MONTH}\s+\d{{4}}$", line, re.I)
            period = short_date(single.group(0)) if single else ""
            company = line[: single.start()].strip(" ,|–—-") if single else line

        if not company and index > 0:
            company = lines[index - 1].strip(" ,|–—-")

        # The next block may put its company on the line *before* its date
        # line. In that case that line belongs to the next block, not to this
        # block's bullet list.
        block_end = len(lines)
        if n + 1 < len(date_indexes):
            next_index = date_indexes[n + 1]
            next_line = lines[next_index]
            next_range = DATE_RANGE_RE.search(next_line)
            next_single = re.search(rf"\b{MONTH}\s+\d{{4}}$", next_line, re.I)
            if next_range:
                has_prefix = bool(next_line[: next_range.start()].strip(" ,|–—-"))
            elif next_single:
                has_prefix = bool(next_line[: next_single.start()].strip(" ,|–—-"))
            else:
                has_prefix = False
            block_end = next_index if has_prefix else max(index + 1, next_index - 1)

        following = lines[index + 1 : block_end]
        role_lines: list[str] = []
        description: list[str] = []
        for entry in following:
            if is_bullet(entry):
                description.append(strip_bullet(entry))
            elif description:
                description[-1] = join_text(description[-1], entry)
            else:
                role_lines.append(entry)

        role = " ".join(role_lines).strip()
        if not role and following:
            role = following[0]

        results.append(
            {
                "id": n + 1,
                "role": role,
                "company": company,
                "period": period,
                "description": [item for item in description if item],
            }
        )

    # Keep document order but make sure an empty block does not break the UI.
    return [item for item in results if item["company"] or item["role"]]


def parse_skill_groups(lines: list[str]) -> list[dict[str, Any]]:
    groups: list[dict[str, Any]] = []
    for item in parse_bullets(lines):
        if ":" not in item:
            continue
        category, values = item.split(":", 1)
        entries = [value.strip() for value in values.split(",") if value.strip()]
        if not entries:
            continue
        groups.append({"category": category.strip(), "items": entries})
    return groups


def parse_projects(lines: list[str], overrides: dict[str, Any]) -> list[dict[str, Any]]:
    year_indexes = [i for i, line in enumerate(lines) if re.fullmatch(r"(?:19|20)\d{2}", line)]
    links = overrides.get("projectLinks") or {}
    results: list[dict[str, Any]] = []

    for n, index in enumerate(year_indexes):
        if index == 0:
            continue
        title = lines[index - 1].strip()
        # The next project's title sits immediately before its year line.
        block_end = year_indexes[n + 1] - 1 if n + 1 < len(year_indexes) else len(lines)
        block = lines[index + 1 : block_end]
        if not block:
            continue

        tools_line = block[0] if not is_bullet(block[0]) else ""
        description = parse_bullets(block[1:] if tools_line else block)
        tools = [tool.strip() for tool in tools_line.split(",") if tool.strip()]
        link = next((url for key, url in links.items() if key.lower() in title.lower()), "")
        results.append(
            {
                "id": n + 1,
                "title": title,
                "year": lines[index],
                "description": " ".join(description),
                "tools": tools,
                "image": "",
                "link": link,
            }
        )
    return results


def _split_certification_date(text: str) -> tuple[str, str]:
    # "… ISO standards Jul 2025", "… 2025-26", "… May-Jul 2025"
    patterns = [
        rf"\b(?:{MONTH}\s*[–-]\s*{MONTH}\s+\d{{4}})\s*$",
        rf"\b(?:{MONTH}\s+)?\d{{4}}\s*[–-]\s*\d{{2,4}}\s*$",
        rf"\b{MONTH}\s+\d{{4}}\s*$",
        r"\b(?:19|20)\d{2}\s*$",
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.I)
        if match:
            return text[: match.start()].strip(" ,—-"), short_date(match.group(0))
    return text.strip(), ""


def parse_certifications(lines: list[str], overrides: dict[str, Any]) -> list[dict[str, Any]]:
    hints = list(overrides.get("certificationIssuers") or []) + CERT_ISSUER_FALLBACK
    # Longest hints first so "Cisco Networking Academy" wins over "Cisco".
    hints = sorted({hint for hint in hints if hint}, key=len, reverse=True)
    results: list[dict[str, Any]] = []

    for index, raw in enumerate(parse_bullets(lines)):
        text, date = _split_certification_date(raw)
        if not text:
            continue

        # Split "Title — Issuer / topics" when the right side names an issuer.
        issuer = ""
        title = text
        description = ""
        if "—" in text:
            left, right = [part.strip(" ,—-") for part in text.split("—", 1)]
            hint = next((h for h in hints if h.lower() in right.lower()), "")
            if hint:
                title, issuer = left, hint
            else:
                title, description = left, right
        elif " - " in text:
            left, right = [part.strip(" ,—-") for part in text.split(" - ", 1)]
            hint = next((h for h in hints if h.lower() in right.lower()), "")
            if hint:
                title, issuer = left, hint
            else:
                title, description = left, right

        if not issuer:
            hint = next((h for h in hints if h.lower() in title.lower()), "")
            if hint:
                issuer = hint
                title = re.sub(rf"\s*[,–—-]?\s*{re.escape(hint)}\s*$", "", title, flags=re.I).strip(" ,—-")

        results.append(
            {
                "id": index + 1,
                "title": title or raw,
                "issuer": issuer,
                "date": date,
                "description": description,
                "link": "",
            }
        )
    return results


def parse_courses(lines: list[str]) -> list[str]:
    courses: list[str] = []
    for line in lines:
        line = line.strip()
        if not line or line.startswith("*"):
            continue
        ongoing = line.endswith("*")
        line = line.rstrip("* ").strip()
        if line:
            courses.append(f"{line}*" if ongoing else line)
    return courses


def parse_achievements(lines: list[str]) -> list[str]:
    return parse_bullets(lines)


# ---------------------------------------------------------------------------
# LinkedIn export (optional)
# ---------------------------------------------------------------------------

def _read_csv(data: bytes) -> list[dict[str, str]]:
    text = data.decode("utf-8-sig", errors="replace")
    return list(csv.DictReader(io.StringIO(text)))


def load_linkedin_export() -> dict[str, list[dict[str, str]]]:
    """Read the official LinkedIn data export if one has been supplied.

    LinkedIn has no public "read my profile" API. The official route is
    Settings -> Data privacy -> Get a copy of your data. Drop the ZIP at
    data/linkedin-export.zip (or unzip it into data/linkedin-export/) and the
    sync script merges it. The ZIP is gitignored so it is never published.
    """
    wanted = {"profile", "positions", "education", "skills", "certifications", "projects"}
    result: dict[str, list[dict[str, str]]] = {key: [] for key in wanted}

    if LINKEDIN_DIR.exists():
        for path in LINKEDIN_DIR.rglob("*.csv"):
            key = path.stem.lower()
            if key in wanted:
                result[key] = _read_csv(path.read_bytes())
        return result

    if LINKEDIN_ZIP.exists():
        with zipfile.ZipFile(LINKEDIN_ZIP) as archive:
            for name in archive.namelist():
                if not name.lower().endswith(".csv"):
                    continue
                key = Path(name).stem.lower()
                if key in wanted:
                    result[key] = _read_csv(archive.read(name))
    return result


LINKEDIN_SECTIONS = ("profile", "positions", "education", "skills", "certifications", "projects")


def normalise_linkedin_export(raw: dict[str, list[dict[str, str]]]) -> dict[str, list[dict[str, str]]]:
    """Keep only the public professional fields the site uses.

    The official export also contains private data (address, birth date, ...).
    This whitelist is what makes it safe to commit the normalized snapshot.
    """
    fields = {
        "profile": ("Headline", "Summary", "Geo Location", "Websites"),
        "positions": ("Company Name", "Title", "Started On", "Finished On", "Description"),
        "education": ("School Name", "Degree Name", "Notes", "Start Date", "End Date"),
        "skills": ("Name",),
        "certifications": ("Name", "Authority", "Finished On", "Started On", "URL"),
        "projects": ("Title", "Description", "Url"),
    }
    snapshot: dict[str, list[dict[str, str]]] = {}
    for section, keys in fields.items():
        rows: list[dict[str, str]] = []
        for row in raw.get(section) or []:
            clean = {key: (row.get(key) or "").strip() for key in keys}
            if any(clean.values()):
                rows.append(clean)
        snapshot[section] = rows
    return snapshot


def has_linkedin_data(snapshot: dict[str, Any]) -> bool:
    return any(snapshot.get(section) for section in LINKEDIN_SECTIONS)


def load_linkedin_snapshot() -> dict[str, list[dict[str, str]]]:
    if not LINKEDIN_SNAPSHOT.exists():
        return {}
    try:
        data = json.loads(LINKEDIN_SNAPSHOT.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}
    if not isinstance(data, dict):
        return {}
    return {section: data.get(section) or [] for section in LINKEDIN_SECTIONS}


def write_linkedin_snapshot(snapshot: dict[str, Any]) -> None:
    """Write the normalized snapshot, preserving its timestamp when unchanged."""
    previous_text = LINKEDIN_SNAPSHOT.read_text(encoding="utf-8") if LINKEDIN_SNAPSHOT.exists() else ""
    try:
        previous = json.loads(previous_text) if previous_text else {}
    except json.JSONDecodeError:
        previous = {}

    stamp = datetime.now(timezone.utc).replace(microsecond=0).isoformat()
    snapshot["generatedAt"] = stamp
    comparable = {key: value for key, value in snapshot.items() if key != "generatedAt"}
    previous_comparable = {key: value for key, value in previous.items() if key != "generatedAt"}
    if comparable == previous_comparable and previous.get("generatedAt"):
        snapshot["generatedAt"] = previous["generatedAt"]

    serialized = json.dumps(snapshot, ensure_ascii=False, indent=2) + "\n"
    if serialized != previous_text:
        LINKEDIN_SNAPSHOT.parent.mkdir(parents=True, exist_ok=True)
        LINKEDIN_SNAPSHOT.write_text(serialized, encoding="utf-8")
        print(f"Updated {LINKEDIN_SNAPSHOT.relative_to(ROOT)}")


def load_linkedin_data(write_snapshot: bool = True) -> dict[str, list[dict[str, str]]]:
    """Load the raw export if present, otherwise the committed snapshot.

    GitHub Actions never receives the private ZIP, so the snapshot is what keeps
    LinkedIn-only entries alive when the workflow re-syncs from a new resume.
    """
    raw = load_linkedin_export()
    if any(raw.values()):
        snapshot = normalise_linkedin_export(raw)
        if has_linkedin_data(snapshot):
            if write_snapshot:
                write_linkedin_snapshot(snapshot)
            return {section: snapshot.get(section) or [] for section in LINKEDIN_SECTIONS}
    return load_linkedin_snapshot()


def linkedin_date(value: str) -> str:
    value = (value or "").strip()
    if not value:
        return ""
    value = value.replace("-", " – ")
    return re.sub(r"\s+", " ", value)


def merge_linkedin(profile: dict[str, Any], linkedin: dict[str, list[dict[str, str]]]) -> bool:
    """Merge exported LinkedIn data without destroying manual/resume content."""
    if not any(linkedin.values()):
        return False

    meta = profile["meta"]
    profile_rows = linkedin.get("profile") or []
    if profile_rows:
        row = profile_rows[0]
        if row.get("Headline"):
            meta["headline"] = row["Headline"].strip()
        if row.get("Summary") and not meta.get("summary"):
            meta["summary"] = row["Summary"].strip()
        if row.get("Geo Location") and not meta.get("location"):
            meta["location"] = row["Geo Location"].strip()
        if row.get("Websites") and not meta["links"].get("website"):
            meta["links"]["website"] = row["Websites"].strip()

    # Experience -----------------------------------------------------------
    added_experience = []
    for row in linkedin.get("positions") or []:
        company = (row.get("Company Name") or "").strip()
        title = (row.get("Title") or "").strip()
        if not company and not title:
            continue
        start = linkedin_date(row.get("Started On", ""))
        finish = linkedin_date(row.get("Finished On", ""))
        period = f"{start} – {finish}" if start and finish else (start or finish)
        description = [
            line.strip(" •-") for line in (row.get("Description") or "").splitlines() if line.strip()
        ]
        if not description and row.get("Description"):
            description = [row["Description"].strip()]

        match = next(
            (
                item
                for item in profile["experiences"]
                if same_company(item.get("company", ""), company)
                and (
                    normalise_key(item.get("role", "")) == normalise_key(title)
                    or normalise_key(title) in normalise_key(item.get("role", ""))
                    or normalise_key(item.get("role", "")) in normalise_key(title)
                )
            ),
            None,
        )
        if match:
            # The resume stays authoritative for dates and wording. LinkedIn
            # fills gaps and contributes roles that are not on the resume yet.
            if period and not match.get("period"):
                match["period"] = period
            if description and not match.get("description"):
                match["description"] = description
            continue

        added_experience.append(
            {
                "id": 0,
                "role": title,
                "company": company,
                "period": period,
                "description": description,
                "source": "linkedin",
            }
        )
    if added_experience:
        profile["experiences"] = added_experience + profile["experiences"]
        for index, item in enumerate(profile["experiences"], 1):
            item["id"] = index

    # Education ------------------------------------------------------------
    added_education = []
    for row in linkedin.get("education") or []:
        school = (row.get("School Name") or "").strip()
        if not school:
            continue
        start = linkedin_date(row.get("Start Date", ""))
        end = linkedin_date(row.get("End Date", ""))
        period = f"{start} – {end}" if start and end else (start or end)
        degree = (row.get("Degree Name") or "").strip() or (row.get("Notes") or "").strip()

        match = next(
            (item for item in profile["education"] if same_company(item.get("institution", ""), school)),
            None,
        )
        if match:
            if period and not match.get("period"):
                match["period"] = period
            if degree and not match.get("degree"):
                match["degree"] = degree
            continue

        added_education.append(
            {
                "id": 0,
                "degree": degree,
                "institution": school,
                "period": period,
                "score": "",
                "label": "",
                "source": "linkedin",
            }
        )
    if added_education:
        profile["education"].extend(added_education)
        for index, item in enumerate(profile["education"], 1):
            item["id"] = index

    # Skills ---------------------------------------------------------------
    existing_skills = {
        value.lower()
        for group in profile["skillGroups"]
        for value in group.get("items", [])
    }
    extra_skills = []
    for row in linkedin.get("skills") or []:
        name = (row.get("Name") or "").strip()
        if name and name.lower() not in existing_skills:
            existing_skills.add(name.lower())
            extra_skills.append(name)
    if extra_skills:
        profile["skillGroups"].append({"category": "Also on LinkedIn", "items": extra_skills})

    # Certifications -------------------------------------------------------
    known_certs = {item.get("title", "").lower() for item in profile["certifications"]}
    for row in linkedin.get("certifications") or []:
        title = (row.get("Name") or "").strip()
        if not title or title.lower() in known_certs:
            continue
        issuer = (row.get("Authority") or "").strip()
        date = linkedin_date(row.get("Finished On", "") or row.get("Started On", ""))
        profile["certifications"].append(
            {
                "id": 0,
                "title": title,
                "issuer": issuer,
                "date": date,
                "description": "",
                "link": (row.get("URL") or "").strip(),
                "source": "linkedin",
            }
        )
        known_certs.add(title.lower())
    for index, item in enumerate(profile["certifications"], 1):
        item["id"] = index

    # Projects -------------------------------------------------------------
    known_projects = {item.get("title", "").lower() for item in profile["projects"]}
    for row in linkedin.get("projects") or []:
        title = (row.get("Title") or "").strip()
        if not title or title.lower() in known_projects:
            continue
        description = (row.get("Description") or "").strip()
        profile["projects"].append(
            {
                "id": 0,
                "title": title,
                "year": "",
                "description": description,
                "tools": [],
                "image": "",
                "link": (row.get("Url") or "").strip(),
                "source": "linkedin",
            }
        )
        known_projects.add(title.lower())
    for index, item in enumerate(profile["projects"], 1):
        item["id"] = index

    meta["sources"]["linkedin"] = True
    return True


# ---------------------------------------------------------------------------
# Profile assembly
# ---------------------------------------------------------------------------

def build_profile(write_snapshot: bool = True) -> dict[str, Any]:
    overrides: dict[str, Any] = {}
    if OVERRIDES_PATH.exists():
        overrides = json.loads(OVERRIDES_PATH.read_text(encoding="utf-8"))

    lines = normalise_lines(extract_pdf_text(RESUME_PATH))
    sections = split_sections(lines)

    header = parse_header(sections.get("header", []), overrides)
    education = parse_education(sections.get("education", []))
    experiences = parse_experience(sections.get("experience", []))
    skill_groups = parse_skill_groups(sections.get("skills", []))
    projects = parse_projects(sections.get("projects", []), overrides)
    certifications = parse_certifications(sections.get("certifications", []), overrides)
    courses = parse_courses(sections.get("courses", []))
    achievements = parse_achievements(sections.get("achievements", []))
    scholastic = parse_achievements(sections.get("scholastic", []))

    if not education or not experiences or not projects:
        raise SystemExit(
            "Could not parse the main sections of the resume.\n"
            "Expected education, work experience and projects. "
            "Run with --dump-sections to see what the parser found."
        )

    # Hero numbers come from the resume, so they stay current automatically.
    gpa = next(
        (re.search(r"\d+(?:\.\d+)?(?=\s*/\s*10)", item.get("score", "")) for item in education),
        None,
    )
    stats = [
        {"value": gpa.group(0) if gpa else "—", "label": "GPA at NFSU"},
        {"value": str(len(experiences)), "label": "Internships & training"},
        {"value": str(len(projects)), "label": "Projects"},
    ]

    # A flat, deduplicated technology strip for the marquee.
    tools: list[str] = []
    for group in skill_groups:
        for value in group["items"]:
            clean = tool_label(value)
            if clean and clean.lower() not in {tool.lower() for tool in tools}:
                tools.append(clean)
    for project in projects:
        for value in project.get("tools", []):
            clean = tool_label(value)
            if clean and clean.lower() not in {tool.lower() for tool in tools}:
                tools.append(clean)

    links = dict(header.get("links") or {})
    meta = {
        "name": header.get("name") or "Atul Anand",
        "headline": "",
        "tagline": overrides.get("tagline", "Cybersecurity & AI Engineer"),
        "summary": overrides.get("summary", ""),
        "location": overrides.get("location", ""),
        "email": header.get("email", ""),
        "phone": header.get("phone", ""),
        "profileImage": overrides.get("profileImage", "profile image.png"),
        "resumeUrl": overrides.get("resumeUrl", "resume.pdf"),
        "links": links,
        "sources": {
            "resume": RESUME_PATH.relative_to(ROOT).as_posix(),
            "linkedin": False,
        },
    }

    # The headline is the line under the name in the resume, unless the
    # overrides file pins one explicitly.
    header_lines = sections.get("header", [])
    if len(header_lines) > 1:
        meta["headline"] = header_lines[1]
    if overrides.get("headline"):
        meta["headline"] = overrides["headline"]

    profile: dict[str, Any] = {
        "meta": meta,
        "stats": stats,
        "experiences": experiences,
        "education": education,
        "skillGroups": skill_groups,
        "focusAreas": overrides.get("focusAreas", []),
        "projects": projects,
        "certifications": certifications,
        "tools": tools,
        "achievements": achievements,
        "scholastic": scholastic,
        "courses": courses,
        "generatedAt": "",
    }

    linkedin = load_linkedin_data(write_snapshot=write_snapshot)
    merge_linkedin(profile, linkedin)

    # Do not churn data/profile.json (and create a commit) when nothing changed.
    previous: dict[str, Any] = {}
    if PROFILE_PATH.exists():
        try:
            previous = json.loads(PROFILE_PATH.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            previous = {}
    stamp = datetime.now(timezone.utc).replace(microsecond=0).isoformat()
    profile["generatedAt"] = stamp
    comparable = {key: value for key, value in profile.items() if key != "generatedAt"}
    previous_comparable = {key: value for key, value in previous.items() if key != "generatedAt"}
    if comparable == previous_comparable and previous.get("generatedAt"):
        profile["generatedAt"] = previous["generatedAt"]

    return profile


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dump-sections", action="store_true", help="Print the parsed sections and exit")
    parser.add_argument("--check", action="store_true", help="Validate the generated profile without writing")
    args = parser.parse_args()

    if args.dump_sections:
        lines = normalise_lines(extract_pdf_text(RESUME_PATH))
        sections = split_sections(lines)
        for name, entries in sections.items():
            print(f"\n=== {name} ({len(entries)}) ===")
            for entry in entries:
                print(entry)
        return

    profile = build_profile(write_snapshot=not args.check)

    if args.check:
        print("Profile validation passed.")
        print(f"  Experiences: {len(profile['experiences'])}")
        print(f"  Education:   {len(profile['education'])}")
        print(f"  Projects:    {len(profile['projects'])}")
        print(f"  Skills:      {sum(len(group['items']) for group in profile['skillGroups'])}")
        return

    PROFILE_PATH.parent.mkdir(parents=True, exist_ok=True)
    serialized = json.dumps(profile, ensure_ascii=False, indent=2) + "\n"
    previous = PROFILE_PATH.read_text(encoding="utf-8") if PROFILE_PATH.exists() else ""
    if serialized != previous:
        PROFILE_PATH.write_text(serialized, encoding="utf-8")
        print(f"Updated {PROFILE_PATH.relative_to(ROOT)}")
    else:
        print(f"No changes to {PROFILE_PATH.relative_to(ROOT)}")

    meta = profile["meta"]
    print(f"  {meta['name']} — {len(profile['experiences'])} roles, "
          f"{len(profile['projects'])} projects, {len(profile['education'])} education entries")
    print(f"  Resume: {meta['sources']['resume']}")
    if meta["sources"].get("linkedin"):
        print("  LinkedIn export: merged")
    else:
        print("  LinkedIn export: not supplied (optional)")


if __name__ == "__main__":
    main()
