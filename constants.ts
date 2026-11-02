import profileData from './data/profile.json';
import type { Profile } from './types';
import {
  Activity,
  Atom,
  Blocks,
  Bot,
  Box,
  Braces,
  BrainCircuit,
  Cloud,
  Code,
  Code2,
  Coffee,
  Database,
  FileCode2,
  Gem,
  GitBranch,
  Github,
  Globe,
  Layers,
  LineChart,
  Link,
  Link2,
  ScanFace,
  Server,
  Sigma,
  Table2,
  Terminal,
  TrendingUp,
  Zap,
  type LucideIcon,
} from 'lucide-react';

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
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Certifications', href: '#certifications' },
  { name: 'Tools', href: '#tools' },
  { name: 'Contact', href: '#contact' },
];

export const PROFILE_IMAGE_URL = assetUrl(PROFILE.meta.profileImage);
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

const TOOL_ICON_MAP: Record<string, LucideIcon> = {
  Python: Code,
  Java: Coffee,
  'C++': Braces,
  SQL: Database,
  PostgreSQL: Database,
  JavaScript: Braces,
  'HTML/CSS': Globe,
  Flask: Server,
  FastAPI: Zap,
  React: Atom,
  OpenCV: ScanFace,
  Pandas: Table2,
  NumPy: Sigma,
  Matplotlib: LineChart,
  'Scikit-learn': BrainCircuit,
  XGBoost: TrendingUp,
  KNN: Activity,
  SVM: Activity,
  'Logistic Regression': Activity,
  'Random Forests': Activity,
  Solidity: FileCode2,
  Ethereum: Gem,
  'Ethers.js': Link2,
  Azure: Cloud,
  Git: GitBranch,
  GitHub: Github,
  Docker: Box,
  Nginx: Server,
  'VS Code': Code2,
  PyCharm: Terminal,
  Blockchain: Blocks,
  'Agentic AI': Bot,
  LangChain: Link,
  DeepSeek: BrainCircuit,
  Networking: Layers,
};

export const TOOL_ICONS = PROFILE.tools.map((name) => ({
  name,
  icon: TOOL_ICON_MAP[name] ?? Code,
}));
