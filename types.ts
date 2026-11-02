export interface ProfileLinks {
  github?: string;
  linkedin?: string;
  x?: string;
  instagram?: string;
  website?: string;
}

export interface ProfileSources {
  resume: string;
  linkedin: boolean;
}

export interface ProfileMeta {
  name: string;
  headline: string;
  tagline: string;
  summary: string;
  location: string;
  email: string;
  phone: string;
  profileImage: string;
  resumeUrl: string;
  links: ProfileLinks;
  sources: ProfileSources;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Experience {
  id: number;
  role: string;
  company: string;
  period: string;
  description: string[];
  source?: 'resume' | 'linkedin';
}

export interface Education {
  id: number;
  degree: string;
  institution: string;
  period: string;
  score?: string;
  label?: string;
  source?: 'resume' | 'linkedin';
}

export interface Project {
  id: number;
  title: string;
  year?: string;
  description: string;
  tools: string[];
  image?: string;
  link?: string;
  source?: 'resume' | 'linkedin';
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Certification {
  id: number;
  title: string;
  issuer: string;
  date: string;
  description?: string;
  link?: string;
  source?: 'resume' | 'linkedin';
}

export interface Profile {
  meta: ProfileMeta;
  stats: Stat[];
  experiences: Experience[];
  education: Education[];
  skillGroups: SkillGroup[];
  focusAreas: string[];
  projects: Project[];
  certifications: Certification[];
  tools: string[];
  achievements: string[];
  scholastic: string[];
  courses: string[];
  generatedAt: string;
}
