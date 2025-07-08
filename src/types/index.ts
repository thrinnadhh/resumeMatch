export interface Resume {
  id: string;
  fileName: string;
  uploadDate: string;
  status: 'processing' | 'completed' | 'error';
  extractedData?: CandidateData;
}

export interface CandidateData {
  name: string;
  email: string;
  phone: string;
  address: string;
  linkedin?: string;
  github?: string;
  personalWebsite?: string;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
}

export interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  isProjectUsed: boolean;
  weightage: number;
}

export interface Experience {
  company: string;
  position: string;
  duration: string;
  description: string;
  technologies: string[];
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
  gpa?: string;
}

export interface JobDescription {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  preferredSkills: string[];
  uploadDate: string;
  fileName: string;
}

export interface MatchResult {
  candidateId: string;
  jobId: string;
  candidate: CandidateData;
  job: JobDescription;
  matchingScore: number;
  skillMatches: SkillMatch[];
  strengths: string[];
  gaps: string[];
}

export interface SkillMatch {
  skill: string;
  candidateLevel: string;
  required: boolean;
  match: boolean;
  score: number;
}

export interface MatchingHistory {
  id: string;
  date: string;
  time: string;
  jobDescriptions: string[];
  resumeCount: number;
  results: MatchResult[];
  csvFileName: string;
}

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
}

export interface SkillsWeightage {
  mandatory: number;
  optional: number;
  experience: number;
  education: number;
}

export interface MatchingConfig {
  skillsWeightage: SkillsWeightage;
  mandatorySkills: string[];
  optionalSkills: string[];
  minExperience: number;
  requiredEducation: string[];
}

export interface ResumeHistory {
  id: string;
  resumeId: string;
  action: 'viewed' | 'processed' | 'deleted';
  timestamp: string;
  details?: string;
}

export interface JobDescriptionHistory {
  id: string;
  jobId: string;
  action: 'created' | 'edited' | 'deleted' | 'viewed';
  timestamp: string;
  changes?: string;
}