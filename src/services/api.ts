import { Resume, JobDescription, MatchResult, CandidateData, MatchingConfig, ResumeHistory, JobDescriptionHistory } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

class ApiService {
  private storage = {
    get: (key: string) => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch {
        return null;
      }
    },
    set: (key: string, value: any) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.warn('Failed to save to localStorage:', error);
      }
    },
    remove: (key: string) => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn('Failed to remove from localStorage:', error);
      }
    }
  };

  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GEMINI_API_KEY}`,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.warn('API request failed, falling back to mock data:', error);
      return null;
    }
  }

  async uploadResumes(files: FileList): Promise<Resume[]> {
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('resumes', file);
      });

      const response = await fetch(`${API_BASE_URL}/api/resumes/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload resumes');
      }

      return response.json();
    } catch (error) {
      console.warn('Resume upload failed, using mock data');
      // Return mock resume data based on uploaded files
      const newResumes = Array.from(files).map((file, index) => ({
        id: `mock-resume-${index}`,
        fileName: file.name,
        uploadDate: new Date().toISOString(),
        status: 'completed' as const,
        extractedData: {
          name: `Candidate ${index + 1}`,
          email: `candidate${index + 1}@email.com`,
          phone: `+1-555-012${index}`,
          address: `${123 + index} Main St, City, State`,
          skills: [
            { name: 'JavaScript', level: 'advanced' as const, isProjectUsed: true, weightage: 0.9 },
            { name: 'React', level: 'intermediate' as const, isProjectUsed: true, weightage: 0.8 }
          ],
          experience: [{
            company: `Company ${index + 1}`,
            position: 'Developer',
            duration: '2020-2023',
            description: 'Software development',
            technologies: ['JavaScript', 'React']
          }],
          education: [{
            degree: 'Bachelor of Computer Science',
            institution: 'University',
            year: '2020'
          }]
        }
      }));
      
      // Save to localStorage
      const existingResumes = this.storage.get('resumes') || [];
      this.storage.set('resumes', [...existingResumes, ...newResumes]);
      
      return newResumes;
    }
  }

  async uploadJobDescriptions(files: FileList): Promise<JobDescription[]> {
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('jobDescriptions', file);
      });

      const response = await fetch(`${API_BASE_URL}/api/jobs/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload job descriptions');
      }

      return response.json();
    } catch (error) {
      console.warn('Job description upload failed, using mock data');
      // Return mock job descriptions based on uploaded files
      const newJobs = Array.from(files).map((file, index) => ({
        id: `mock-job-${index}`,
        title: `Job Position ${index + 1}`,
        company: `Company ${index + 1}`,
        description: 'Job description content...',
        requirements: ['JavaScript', 'React', 'TypeScript'],
        preferredSkills: ['Node.js', 'GraphQL'],
        uploadDate: new Date().toISOString(),
        fileName: file.name
      }));
      
      // Save to localStorage
      const existingJobs = this.storage.get('jobDescriptions') || [];
      this.storage.set('jobDescriptions', [...existingJobs, ...newJobs]);
      
      return newJobs;
    }
  }

  async createJobDescription(jobData: Partial<JobDescription>): Promise<JobDescription> {
    try {
      return this.fetchWithAuth('/api/jobs', {
        method: 'POST',
        body: JSON.stringify(jobData),
      });
    } catch (error) {
      console.warn('Create job description failed, using mock data');
      const newJob = {
        id: `mock-job-${Date.now()}`,
        title: jobData.title || 'New Job Position',
        company: jobData.company || 'Company Name',
        description: jobData.description || 'Job description...',
        requirements: jobData.requirements || [],
        preferredSkills: jobData.preferredSkills || [],
        uploadDate: new Date().toISOString(),
        fileName: 'manual-entry.txt'
      };
      
      // Save to localStorage
      const existingJobs = this.storage.get('jobDescriptions') || [];
      this.storage.set('jobDescriptions', [...existingJobs, newJob]);
      
      return newJob;
    }
  }

  async matchResumesWithJobs(resumeIds: string[], jobIds: string[]): Promise<MatchResult[]> {
    try {
      return this.fetchWithAuth('/api/matching/process', {
        method: 'POST',
        body: JSON.stringify({ resumeIds, jobIds }),
      });
    } catch (error) {
      console.warn('Matching failed, using mock results');
      // Return mock matching results
      return resumeIds.flatMap(resumeId => 
        jobIds.map(jobId => ({
          id: `match-${resumeId}-${jobId}`,
          resumeId,
          jobId,
          matchScore: Math.floor(Math.random() * 40) + 60, // 60-100%
          strengths: ['Strong technical skills', 'Relevant experience'],
          weaknesses: ['Could improve in specific areas'],
          recommendations: ['Consider for interview'],
          timestamp: new Date().toISOString()
        }))
      );
    }
  }

  async getMatchingHistory(): Promise<any[]> {
    try {
      return this.fetchWithAuth('/api/matching/history');
    } catch (error) {
      console.warn('History fetch failed, using mock data');
      // Return mock history data
      return [
        {
          id: 'history-1',
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          resumeCount: 5,
          jobCount: 2,
          matchCount: 10,
          averageScore: 78
        },
        {
          id: 'history-2',
          timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          resumeCount: 3,
          jobCount: 1,
          matchCount: 3,
          averageScore: 85
        }
      ];
    }
  }

  async exportResults(matchResults: MatchResult[], format: 'csv' | 'excel' = 'csv'): Promise<Blob> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ results: matchResults, format }),
      });

      if (!response.ok) {
        throw new Error('Failed to export results');
      }

      return response.blob();
    } catch (error) {
      console.warn('Export failed, generating mock file');
      // Generate a simple CSV as fallback
      const csvContent = [
        'Resume,Job,Score,Strengths,Weaknesses',
        ...matchResults.map(result => 
          `${result.resumeId},${result.jobId},${result.matchScore},"${result.strengths.join('; ')}","${result.weaknesses.join('; ')}"`
        )
      ].join('\n');
      
      return new Blob([csvContent], { type: 'text/csv' });
    }
  }

  // Enhanced CRUD operations
  async deleteJobDescription(jobId: string): Promise<void> {
    try {
      await this.fetchWithAuth(`/api/jobs/${jobId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.warn('Delete job description failed, using local storage');
      const jobs = this.storage.get('jobDescriptions') || [];
      const updatedJobs = jobs.filter((job: JobDescription) => job.id !== jobId);
      this.storage.set('jobDescriptions', updatedJobs);
      
      // Add to history
      this.addJobDescriptionHistory(jobId, 'deleted', 'Job description deleted');
    }
  }

  async updateJobDescription(jobId: string, jobData: Partial<JobDescription>): Promise<JobDescription> {
    try {
      return this.fetchWithAuth(`/api/jobs/${jobId}`, {
        method: 'PUT',
        body: JSON.stringify(jobData),
      });
    } catch (error) {
      console.warn('Update job description failed, using local storage');
      const jobs = this.storage.get('jobDescriptions') || [];
      const updatedJobs = jobs.map((job: JobDescription) => 
        job.id === jobId ? { ...job, ...jobData } : job
      );
      this.storage.set('jobDescriptions', updatedJobs);
      
      const updatedJob = updatedJobs.find((job: JobDescription) => job.id === jobId);
      
      // Add to history
      this.addJobDescriptionHistory(jobId, 'edited', 'Job description updated');
      
      return updatedJob;
    }
  }

  async deleteResume(resumeId: string): Promise<void> {
    try {
      await this.fetchWithAuth(`/api/resumes/${resumeId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.warn('Delete resume failed, using local storage');
      const resumes = this.storage.get('resumes') || [];
      const updatedResumes = resumes.filter((resume: Resume) => resume.id !== resumeId);
      this.storage.set('resumes', updatedResumes);
      
      // Add to history
      this.addResumeHistory(resumeId, 'deleted', 'Resume deleted');
    }
  }

  async deleteMultipleResumes(resumeIds: string[]): Promise<void> {
    try {
      await this.fetchWithAuth('/api/resumes/bulk-delete', {
        method: 'DELETE',
        body: JSON.stringify({ resumeIds }),
      });
    } catch (error) {
      console.warn('Bulk delete resumes failed, using local storage');
      const resumes = this.storage.get('resumes') || [];
      const updatedResumes = resumes.filter((resume: Resume) => !resumeIds.includes(resume.id));
      this.storage.set('resumes', updatedResumes);
      
      // Add to history
      resumeIds.forEach(id => this.addResumeHistory(id, 'deleted', 'Resume bulk deleted'));
    }
  }

  // History management
  addResumeHistory(resumeId: string, action: 'viewed' | 'processed' | 'deleted', details?: string): void {
    const history = this.storage.get('resumeHistory') || [];
    const newEntry: ResumeHistory = {
      id: `history-${Date.now()}-${Math.random()}`,
      resumeId,
      action,
      timestamp: new Date().toISOString(),
      details
    };
    history.unshift(newEntry);
    // Keep only last 100 entries
    this.storage.set('resumeHistory', history.slice(0, 100));
  }

  addJobDescriptionHistory(jobId: string, action: 'created' | 'edited' | 'deleted' | 'viewed', changes?: string): void {
    const history = this.storage.get('jobDescriptionHistory') || [];
    const newEntry: JobDescriptionHistory = {
      id: `history-${Date.now()}-${Math.random()}`,
      jobId,
      action,
      timestamp: new Date().toISOString(),
      changes
    };
    history.unshift(newEntry);
    // Keep only last 100 entries
    this.storage.set('jobDescriptionHistory', history.slice(0, 100));
  }

  getResumeHistory(): ResumeHistory[] {
    return this.storage.get('resumeHistory') || [];
  }

  getJobDescriptionHistory(): JobDescriptionHistory[] {
    return this.storage.get('jobDescriptionHistory') || [];
  }

  clearResumeHistory(): void {
    this.storage.remove('resumeHistory');
  }

  clearJobDescriptionHistory(): void {
    this.storage.remove('jobDescriptionHistory');
  }

  // Skills assessment configuration
  saveMatchingConfig(config: MatchingConfig): void {
    this.storage.set('matchingConfig', config);
  }

  getMatchingConfig(): MatchingConfig {
    return this.storage.get('matchingConfig') || {
      skillsWeightage: {
        mandatory: 40,
        optional: 30,
        experience: 20,
        education: 10
      },
      mandatorySkills: [],
      optionalSkills: [],
      minExperience: 0,
      requiredEducation: []
    };
  }

  // Enhanced matching with Gemini integration
  async matchResumesWithJobsEnhanced(resumeIds: string[], jobIds: string[], config?: MatchingConfig): Promise<MatchResult[]> {
    const matchingConfig = config || this.getMatchingConfig();
    
    try {
      const result = await this.fetchWithAuth('/api/matching/enhanced', {
        method: 'POST',
        body: JSON.stringify({ resumeIds, jobIds, config: matchingConfig }),
      });
      
      if (result) {
        return result;
      }
      
      // If API call failed (result is null), fall back to mock data
      console.warn('Enhanced matching failed, using mock results with configuration');
      
      // Get stored resumes and jobs
      const resumes = this.storage.get('resumes') || [];
      const jobs = this.storage.get('jobDescriptions') || [];
      
      return resumeIds.flatMap(resumeId => {
        const resume = resumes.find((r: Resume) => r.id === resumeId);
        return jobIds.map(jobId => {
          const job = jobs.find((j: JobDescription) => j.id === jobId);
          const score = this.calculateMatchScore(resume, job, matchingConfig);
          
          return {
            candidateId: resumeId,
            jobId,
            candidate: resume?.extractedData || this.getDefaultCandidateData(),
            job: job || this.getDefaultJobDescription(),
            matchingScore: score,
            skillMatches: this.generateSkillMatches(resume, job),
            strengths: this.generateStrengths(resume, job),
            gaps: this.generateGaps(resume, job)
          };
        });
      });
    } catch (error) {
      console.warn('Enhanced matching failed, using mock results with configuration');
      
      // Get stored resumes and jobs
      const resumes = this.storage.get('resumes') || [];
      const jobs = this.storage.get('jobDescriptions') || [];
      
      return resumeIds.flatMap(resumeId => {
        const resume = resumes.find((r: Resume) => r.id === resumeId);
        return jobIds.map(jobId => {
          const job = jobs.find((j: JobDescription) => j.id === jobId);
          const score = this.calculateMatchScore(resume, job, matchingConfig);
          
          return {
            candidateId: resumeId,
            jobId,
            candidate: resume?.extractedData || this.getDefaultCandidateData(),
            job: job || this.getDefaultJobDescription(),
            matchingScore: score,
            skillMatches: this.generateSkillMatches(resume, job),
            strengths: this.generateStrengths(resume, job),
            gaps: this.generateGaps(resume, job)
          };
        });
      });
    }
  }

  private calculateMatchScore(resume: Resume | undefined, job: JobDescription | undefined, config: MatchingConfig): number {
    if (!resume?.extractedData || !job) return 0;
    
    const { skillsWeightage } = config;
    let totalScore = 0;
    
    // Mandatory skills check
    const mandatorySkillsMatch = this.checkMandatorySkills(resume.extractedData, config.mandatorySkills);
    if (!mandatorySkillsMatch) return 0; // If any mandatory skill is missing, score is 0
    
    // Calculate weighted scores
    const skillScore = this.calculateSkillScore(resume.extractedData, job) * (skillsWeightage.mandatory + skillsWeightage.optional) / 100;
    const experienceScore = this.calculateExperienceScore(resume.extractedData, config.minExperience) * skillsWeightage.experience / 100;
    const educationScore = this.calculateEducationScore(resume.extractedData, config.requiredEducation) * skillsWeightage.education / 100;
    
    totalScore = skillScore + experienceScore + educationScore;
    
    return Math.min(Math.round(totalScore), 100);
  }

  private checkMandatorySkills(candidate: CandidateData, mandatorySkills: string[]): boolean {
    const candidateSkills = candidate.skills.map(s => s.name.toLowerCase());
    return mandatorySkills.every(skill => 
      candidateSkills.some(cs => cs.includes(skill.toLowerCase()))
    );
  }

  private calculateSkillScore(candidate: CandidateData, job: JobDescription): number {
    const jobSkills = [...job.requirements, ...job.preferredSkills].map(s => s.toLowerCase());
    const candidateSkills = candidate.skills.map(s => s.name.toLowerCase());
    
    const matchedSkills = jobSkills.filter(js => 
      candidateSkills.some(cs => cs.includes(js))
    );
    
    return jobSkills.length > 0 ? (matchedSkills.length / jobSkills.length) * 100 : 0;
  }

  private calculateExperienceScore(candidate: CandidateData, minExperience: number): number {
    const totalExperience = candidate.experience.length * 2; // Assume 2 years per job on average
    return totalExperience >= minExperience ? 100 : (totalExperience / minExperience) * 100;
  }

  private calculateEducationScore(candidate: CandidateData, requiredEducation: string[]): number {
    if (requiredEducation.length === 0) return 100;
    
    const candidateEducation = candidate.education.map(e => e.degree.toLowerCase());
    const matchedEducation = requiredEducation.filter(re => 
      candidateEducation.some(ce => ce.includes(re.toLowerCase()))
    );
    
    return (matchedEducation.length / requiredEducation.length) * 100;
  }

  private generateSkillMatches(resume: Resume | undefined, job: JobDescription | undefined) {
    if (!resume?.extractedData || !job) return [];
    
    const allJobSkills = [...job.requirements, ...job.preferredSkills];
    return allJobSkills.map(skill => {
      const candidateSkill = resume.extractedData!.skills.find(s => 
        s.name.toLowerCase().includes(skill.toLowerCase())
      );
      
      return {
        skill,
        candidateLevel: candidateSkill?.level || 'none',
        required: job.requirements.includes(skill),
        match: !!candidateSkill,
        score: candidateSkill ? candidateSkill.weightage * 100 : 0
      };
    });
  }

  private generateStrengths(resume: Resume | undefined, job: JobDescription | undefined): string[] {
    if (!resume?.extractedData || !job) return [];
    
    const strengths = [];
    const candidateSkills = resume.extractedData.skills.map(s => s.name.toLowerCase());
    const jobSkills = job.requirements.map(s => s.toLowerCase());
    
    const matchedSkills = jobSkills.filter(js => 
      candidateSkills.some(cs => cs.includes(js))
    );
    
    if (matchedSkills.length > jobSkills.length * 0.7) {
      strengths.push('Strong technical skill alignment');
    }
    
    if (resume.extractedData.experience.length >= 2) {
      strengths.push('Solid work experience');
    }
    
    return strengths;
  }

  private generateGaps(resume: Resume | undefined, job: JobDescription | undefined): string[] {
    if (!resume?.extractedData || !job) return [];
    
    const gaps = [];
    const candidateSkills = resume.extractedData.skills.map(s => s.name.toLowerCase());
    const jobSkills = job.requirements.map(s => s.toLowerCase());
    
    const missingSkills = jobSkills.filter(js => 
      !candidateSkills.some(cs => cs.includes(js))
    );
    
    if (missingSkills.length > 0) {
      gaps.push(`Missing skills: ${missingSkills.slice(0, 3).join(', ')}`);
    }
    
    return gaps;
  }

  private getDefaultCandidateData(): CandidateData {
    return {
      name: 'Unknown Candidate',
      email: 'unknown@email.com',
      phone: 'N/A',
      address: 'N/A',
      skills: [],
      experience: [],
      education: []
    };
  }

  private getDefaultJobDescription(): JobDescription {
    return {
      id: 'unknown',
      title: 'Unknown Position',
      company: 'Unknown Company',
      description: 'No description available',
      requirements: [],
      preferredSkills: [],
      uploadDate: new Date().toISOString(),
      fileName: 'unknown.txt'
    };
  }

  // Get stored data
  getStoredResumes(): Resume[] {
    return this.storage.get('resumes') || [];
  }

  getStoredJobDescriptions(): JobDescription[] {
    return this.storage.get('jobDescriptions') || [];
  }

  // Mock data for development
  async getMockCandidateData(): Promise<CandidateData[]> {
    return [
      {
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
    ];
  }

  async getMockJobDescriptions(): Promise<JobDescription[]> {
    return [
      {
        id: '1',
        title: 'Senior Frontend Developer',
        company: 'TechStart Inc.',
        description: 'We are looking for a Senior Frontend Developer to join our team...',
        requirements: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML'],
        preferredSkills: ['GraphQL', 'Node.js', 'Testing'],
        uploadDate: new Date().toISOString(),
        fileName: 'frontend-developer.txt'
      }
    ];
  }
}

export const apiService = new ApiService();