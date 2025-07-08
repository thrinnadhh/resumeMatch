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

  private async callGeminiAPI(prompt: string): Promise<any> {
    if (!GEMINI_API_KEY) {
      console.warn('Gemini API key not found, using mock analysis');
      return null;
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text;
    } catch (error) {
      console.warn('Gemini API call failed:', error);
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
        id: `resume-${Date.now()}-${index}`,
        fileName: file.name,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'completed' as const,
        extractedData: {
          name: `Candidate ${index + 1}`,
          email: `candidate${index + 1}@email.com`,
          phone: `+1-555-012${index}`,
          address: `${123 + index} Main St, City, State`,
          skills: [
            { name: 'JavaScript', level: 'advanced' as const, isProjectUsed: true, weightage: 0.9 },
            { name: 'React', level: 'intermediate' as const, isProjectUsed: true, weightage: 0.8 },
            { name: 'Python', level: 'beginner' as const, isProjectUsed: false, weightage: 0.6 },
            { name: 'Node.js', level: 'intermediate' as const, isProjectUsed: true, weightage: 0.7 }
          ],
          experience: [{
            company: `Company ${index + 1}`,
            position: 'Software Developer',
            duration: '2020-2023',
            description: 'Software development and maintenance',
            technologies: ['JavaScript', 'React', 'Node.js']
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
      const updatedResumes = [...existingResumes, ...newResumes];
      this.storage.set('resumes', updatedResumes);
      
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
        id: `job-${Date.now()}-${index}`,
        title: `Job Position ${index + 1}`,
        company: `Company ${index + 1}`,
        description: 'Job description content...',
        requirements: ['JavaScript', 'React', 'TypeScript'],
        preferredSkills: ['Node.js', 'GraphQL'],
        uploadDate: new Date().toISOString().split('T')[0],
        fileName: file.name
      }));
      
      // Save to localStorage
      const existingJobs = this.storage.get('jobDescriptions') || [];
      const updatedJobs = [...existingJobs, ...newJobs];
      this.storage.set('jobDescriptions', updatedJobs);
      
      return newJobs;
    }
  }

  async createJobDescription(jobData: Partial<JobDescription>): Promise<JobDescription> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        throw new Error('Failed to create job description');
      }

      return response.json();
    } catch (error) {
      console.warn('Create job description failed, using mock data');
      const newJob = {
        id: `job-${Date.now()}`,
        title: jobData.title || 'New Job Position',
        company: jobData.company || 'Company Name',
        description: jobData.description || 'Job description...',
        requirements: jobData.requirements || [],
        preferredSkills: jobData.preferredSkills || [],
        uploadDate: new Date().toISOString().split('T')[0],
        fileName: 'manual-entry.txt'
      };
      
      // Save to localStorage
      const existingJobs = this.storage.get('jobDescriptions') || [];
      const updatedJobs = [...existingJobs, newJob];
      this.storage.set('jobDescriptions', updatedJobs);
      
      return newJob;
    }
  }

  async getMatchingHistory(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/matching/history`);
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }
      return response.json();
    } catch (error) {
      console.warn('History fetch failed, using stored data');
      return this.storage.get('matchingHistory') || [];
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
        'Candidate Name,Job Title,Company,Match Score,Strengths,Gaps',
        ...matchResults.map(result => 
          `"${result.candidate.name}","${result.job.title}","${result.job.company}",${result.matchingScore},"${result.strengths.join('; ')}","${result.gaps.join('; ')}"`
        )
      ].join('\n');
      
      return new Blob([csvContent], { type: 'text/csv' });
    }
  }

  // Enhanced CRUD operations
  async deleteJobDescription(jobId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete job description');
      }
    } catch (error) {
      console.warn('Delete job description failed, using local storage');
    }
    
    // Always update local storage
    const jobs = this.storage.get('jobDescriptions') || [];
    const updatedJobs = jobs.filter((job: JobDescription) => job.id !== jobId);
    this.storage.set('jobDescriptions', updatedJobs);
    
    // Add to history
    this.addJobDescriptionHistory(jobId, 'deleted', 'Job description deleted');
  }

  async updateJobDescription(jobId: string, jobData: Partial<JobDescription>): Promise<JobDescription> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });
      if (!response.ok) {
        throw new Error('Failed to update job description');
      }
    } catch (error) {
      console.warn('Update job description failed, using local storage');
    }
    
    // Always update local storage
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

  async deleteResume(resumeId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/resumes/${resumeId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete resume');
      }
    } catch (error) {
      console.warn('Delete resume failed, using local storage');
    }
    
    // Always update local storage
    const resumes = this.storage.get('resumes') || [];
    const updatedResumes = resumes.filter((resume: Resume) => resume.id !== resumeId);
    this.storage.set('resumes', updatedResumes);
    
    // Add to history
    this.addResumeHistory(resumeId, 'deleted', 'Resume deleted');
  }

  async deleteMultipleResumes(resumeIds: string[]): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/resumes/bulk-delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumeIds }),
      });
      if (!response.ok) {
        throw new Error('Failed to bulk delete resumes');
      }
    } catch (error) {
      console.warn('Bulk delete resumes failed, using local storage');
    }
    
    // Always update local storage
    const resumes = this.storage.get('resumes') || [];
    const updatedResumes = resumes.filter((resume: Resume) => !resumeIds.includes(resume.id));
    this.storage.set('resumes', updatedResumes);
    
    // Add to history
    resumeIds.forEach(id => this.addResumeHistory(id, 'deleted', 'Resume bulk deleted'));
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
    this.storage.remove('resumes');
  }

  clearJobDescriptionHistory(): void {
    this.storage.remove('jobDescriptionHistory');
    this.storage.remove('jobDescriptions');
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
    
    // Get stored resumes and jobs
    const resumes = this.storage.get('resumes') || [];
    const jobs = this.storage.get('jobDescriptions') || [];
    
    const results: MatchResult[] = [];
    
    for (const resumeId of resumeIds) {
      const resume = resumes.find((r: Resume) => r.id === resumeId);
      if (!resume?.extractedData) continue;
      
      for (const jobId of jobIds) {
        const job = jobs.find((j: JobDescription) => j.id === jobId);
        if (!job) continue;
        
        // Use Gemini for enhanced analysis
        const geminiAnalysis = await this.analyzeWithGemini(resume.extractedData, job, matchingConfig);
        
        const result: MatchResult = {
          candidateId: resumeId,
          jobId,
          candidate: resume.extractedData,
          job,
          matchingScore: geminiAnalysis?.score || this.calculateMatchScore(resume, job, matchingConfig),
          skillMatches: geminiAnalysis?.skillMatches || this.generateSkillMatches(resume, job),
          strengths: geminiAnalysis?.strengths || this.generateStrengths(resume, job),
          gaps: geminiAnalysis?.gaps || this.generateGaps(resume, job)
        };
        
        results.push(result);
      }
    }
    
    // Save to history
    const historyItem = {
      id: `history-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0],
      jobDescriptions: jobs.filter((j: JobDescription) => jobIds.includes(j.id)).map((j: JobDescription) => j.title),
      resumeCount: resumeIds.length,
      results,
      csvFileName: `matching_results_${Date.now()}.csv`
    };
    
    const existingHistory = this.storage.get('matchingHistory') || [];
    this.storage.set('matchingHistory', [historyItem, ...existingHistory.slice(0, 49)]);
    
    return results;
  }

  private async analyzeWithGemini(candidate: CandidateData, job: JobDescription, config: MatchingConfig): Promise<any> {
    const prompt = `
    Analyze this candidate against the job requirements and provide a detailed matching score and analysis.

    CANDIDATE PROFILE:
    Name: ${candidate.name}
    Skills: ${candidate.skills.map(s => `${s.name} (${s.level})`).join(', ')}
    Experience: ${candidate.experience.map(e => `${e.position} at ${e.company} (${e.duration})`).join('; ')}
    Education: ${candidate.education.map(e => `${e.degree} from ${e.institution} (${e.year})`).join('; ')}

    JOB REQUIREMENTS:
    Title: ${job.title}
    Company: ${job.company}
    Required Skills: ${job.requirements.join(', ')}
    Preferred Skills: ${job.preferredSkills.join(', ')}
    Description: ${job.description}

    SCORING CONFIGURATION:
    - Mandatory Skills Weight: ${config.skillsWeightage.mandatory}%
    - Optional Skills Weight: ${config.skillsWeightage.optional}%
    - Experience Weight: ${config.skillsWeightage.experience}%
    - Education Weight: ${config.skillsWeightage.education}%
    - Mandatory Skills: ${config.mandatorySkills.join(', ')}
    - Minimum Experience: ${config.minExperience} years

    Please provide a JSON response with:
    {
      "score": <number 0-100>,
      "skillMatches": [
        {
          "skill": "<skill name>",
          "candidateLevel": "<level>",
          "required": <boolean>,
          "match": <boolean>,
          "score": <number 0-100>
        }
      ],
      "strengths": ["<strength 1>", "<strength 2>", ...],
      "gaps": ["<gap 1>", "<gap 2>", ...]
    }

    Consider the weightage configuration and ensure mandatory skills are properly evaluated.
    `;

    try {
      const response = await this.callGeminiAPI(prompt);
      if (response) {
        // Try to parse JSON from the response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }
    } catch (error) {
      console.warn('Gemini analysis failed, using fallback:', error);
    }
    
    return null;
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
    if (mandatorySkills.length === 0) return true;
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
    
    const expertSkills = resume.extractedData.skills.filter(s => s.level === 'expert' || s.level === 'advanced');
    if (expertSkills.length > 0) {
      strengths.push(`Expert level skills: ${expertSkills.slice(0, 3).map(s => s.name).join(', ')}`);
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
      gaps.push(`Missing required skills: ${missingSkills.slice(0, 3).join(', ')}`);
    }
    
    const beginnerSkills = resume.extractedData.skills.filter(s => s.level === 'beginner');
    if (beginnerSkills.length > 0) {
      gaps.push(`Skills needing improvement: ${beginnerSkills.slice(0, 2).map(s => s.name).join(', ')}`);
    }
    
    return gaps;
  }

  // Get stored data
  getStoredResumes(): Resume[] {
    return this.storage.get('resumes') || [];
  }

  getStoredJobDescriptions(): JobDescription[] {
    return this.storage.get('jobDescriptions') || [];
  }
}

export const apiService = new ApiService();