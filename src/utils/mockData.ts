import { Resume, JobDescription, MatchResult, MatchingHistory, CandidateData } from '../types';

export const mockResumes: Resume[] = [
  {
    id: '1',
    fileName: 'john_doe_resume.pdf',
    uploadDate: '2024-01-15',
    status: 'completed',
    extractedData: {
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1-555-0123',
      address: '123 Main St, New York, NY 10001',
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
      personalWebsite: 'https://johndoe.dev',
      skills: [
        { name: 'JavaScript', level: 'advanced', isProjectUsed: true, weightage: 0.9 },
        { name: 'React', level: 'expert', isProjectUsed: true, weightage: 0.95 },
        { name: 'Node.js', level: 'intermediate', isProjectUsed: true, weightage: 0.8 },
        { name: 'Python', level: 'beginner', isProjectUsed: false, weightage: 0.4 },
      ],
      experience: [
        {
          company: 'Tech Corp',
          position: 'Senior Frontend Developer',
          duration: '2020-2023',
          description: 'Led frontend development for multiple projects',
          technologies: ['React', 'TypeScript', 'GraphQL']
        }
      ],
      education: [
        {
          degree: 'Bachelor of Computer Science',
          institution: 'University of Technology',
          year: '2020',
          gpa: '3.8'
        }
      ]
    }
  },
  {
    id: '2',
    fileName: 'jane_smith_resume.pdf',
    uploadDate: '2024-01-15',
    status: 'completed',
    extractedData: {
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+1-555-0124',
      address: '456 Oak Ave, San Francisco, CA 94102',
      linkedin: 'https://linkedin.com/in/janesmith',
      github: 'https://github.com/janesmith',
      skills: [
        { name: 'Python', level: 'expert', isProjectUsed: true, weightage: 0.95 },
        { name: 'Django', level: 'advanced', isProjectUsed: true, weightage: 0.9 },
        { name: 'PostgreSQL', level: 'intermediate', isProjectUsed: true, weightage: 0.8 },
        { name: 'JavaScript', level: 'intermediate', isProjectUsed: false, weightage: 0.6 },
      ],
      experience: [
        {
          company: 'Data Solutions Inc.',
          position: 'Backend Developer',
          duration: '2019-2023',
          description: 'Developed scalable backend systems',
          technologies: ['Python', 'Django', 'PostgreSQL']
        }
      ],
      education: [
        {
          degree: 'Master of Software Engineering',
          institution: 'Stanford University',
          year: '2019',
          gpa: '3.9'
        }
      ]
    }
  }
];

export const mockJobDescriptions: JobDescription[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechStart Inc.',
    description: 'We are looking for a Senior Frontend Developer to join our dynamic team...',
    requirements: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML'],
    preferredSkills: ['GraphQL', 'Node.js', 'Testing'],
    uploadDate: '2024-01-15',
    fileName: 'frontend-developer.txt'
  },
  {
    id: '2',
    title: 'Backend Engineer',
    company: 'DataTech Solutions',
    description: 'Seeking a skilled Backend Engineer to develop robust server-side applications...',
    requirements: ['Python', 'Django', 'PostgreSQL', 'REST APIs'],
    preferredSkills: ['AWS', 'Docker', 'Redis'],
    uploadDate: '2024-01-15',
    fileName: 'backend-engineer.txt'
  }
];

export const mockMatchResults: MatchResult[] = [
  {
    candidateId: '1',
    jobId: '1',
    candidate: mockResumes[0].extractedData!,
    job: mockJobDescriptions[0],
    matchingScore: 85,
    skillMatches: [
      { skill: 'React', candidateLevel: 'expert', required: true, match: true, score: 95 },
      { skill: 'JavaScript', candidateLevel: 'advanced', required: true, match: true, score: 90 },
      { skill: 'TypeScript', candidateLevel: 'intermediate', required: true, match: true, score: 75 },
      { skill: 'GraphQL', candidateLevel: 'beginner', required: false, match: true, score: 60 },
    ],
    strengths: ['React Expertise', 'JavaScript Proficiency', 'Frontend Experience'],
    gaps: ['TypeScript Advanced Skills', 'Testing Experience']
  },
  {
    candidateId: '2',
    jobId: '2',
    candidate: mockResumes[1].extractedData!,
    job: mockJobDescriptions[1],
    matchingScore: 92,
    skillMatches: [
      { skill: 'Python', candidateLevel: 'expert', required: true, match: true, score: 95 },
      { skill: 'Django', candidateLevel: 'advanced', required: true, match: true, score: 90 },
      { skill: 'PostgreSQL', candidateLevel: 'intermediate', required: true, match: true, score: 80 },
      { skill: 'REST APIs', candidateLevel: 'advanced', required: true, match: true, score: 85 },
    ],
    strengths: ['Python Mastery', 'Django Framework', 'Database Design'],
    gaps: ['Cloud Experience', 'DevOps Skills']
  }
];

export const mockMatchingHistory: MatchingHistory[] = [
  {
    id: '1',
    date: '2024-01-15',
    time: '14:30:00',
    jobDescriptions: ['Senior Frontend Developer', 'Backend Engineer'],
    resumeCount: 2,
    results: mockMatchResults,
    csvFileName: 'matching_results_20240115.csv'
  },
  {
    id: '2',
    date: '2024-01-14',
    time: '10:15:00',
    jobDescriptions: ['Full Stack Developer'],
    resumeCount: 5,
    results: [],
    csvFileName: 'matching_results_20240114.csv'
  }
];