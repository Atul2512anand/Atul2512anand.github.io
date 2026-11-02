import profileData from './data/profile.json';
import type { Profile } from './types';

export const PROFILE = profileData as unknown as Profile;

const BASE_URL = import.meta.env.BASE_URL || '/';

/** Resolve a public asset so it also works under a GitHub Pages sub-path. */
export const assetUrl = (path: string): string => {
  if (!path) return '';
  if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  return `${BASE_URL.replace(/\/$/, '')}/${path.replace(/^\/+/, '')}`;
};

export const NAV_LINKS = [
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Work', href: '#projects' },
  { name: 'Toolkit', href: '#skills' },
  { name: 'Contact', href: '#contact' },
];

export const PROFILE_IMAGE_URL = assetUrl(PROFILE.meta.profileImage);
export const CUTOUT_IMAGE_URL = assetUrl('atul-cutout.png');
export const RESUME_URL = assetUrl(PROFILE.meta.resumeUrl);

export const EXPERIENCES = PROFILE.experiences;
export const EDUCATION = PROFILE.education;
export const SKILL_GROUPS = PROFILE.skillGroups;
export const FOCUS_AREAS = PROFILE.focusAreas;
export const PROJECTS = PROFILE.projects;
export const CERTIFICATIONS = PROFILE.certifications;
export const COURSES = PROFILE.courses;
export const ACHIEVEMENTS = PROFILE.achievements;
export const SCHOLASTIC = PROFILE.scholastic;
export const STATS = PROFILE.stats;

const SHORT_COMPANY: Record<string, string> = {
  'EmergeSmart Health (UAE)': 'EmergeSmart',
  'Indian Institute of Technology (IIT) BHU': 'IIT (BHU)',
  'Vodafone Intelligent Solutions': 'Vodafone',
  'Centre of Excellence in Cybersecurity, NFSU': 'CoE-CS',
};

const leadInstitution = EDUCATION[0]?.institution
  ? EDUCATION[0].institution.includes('Forensic')
    ? 'NFSU'
    : EDUCATION[0].institution.split(',')[0]
  : '';

/** A typographic stand-in for the logo strip on the reference site. */
export const PROOF_LOGOS = Array.from(
  new Set(
    [leadInstitution, ...EXPERIENCES.map((item) => SHORT_COMPANY[item.company] ?? item.company)]
      .map((item) => item.trim())
      .filter(Boolean),
  ),
);
