import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import { apiService } from './services/api';
import { Resume, JobDescription, MatchResult, MatchingHistory, UploadProgress, MatchingConfig } from './types';

function App() {
  const [activeSection, setActiveSection] = useState('upload-resume');
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [matchingHistory, setMatchingHistory] = useState<MatchingHistory[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const [selectedResumes, setSelectedResumes] = useState<Set<string>>(new Set());
  const [matchingConfig, setMatchingConfig] = useState<MatchingConfig | null>(null);

  useEffect(() => {
    loadHistory();
    loadStoredData();
    loadMatchingConfig();
  }, []);

  const loadHistory = async () => {
    try {
      const history = await apiService.getMatchingHistory();
      setMatchingHistory(history);
    } catch (error) {
      // API service already handles fallback to mock data
      // If we reach here, use empty array as final fallback
      setMatchingHistory([]);
    }
  };

  const loadStoredData = () => {
    const storedResumes = apiService.getStoredResumes();
    const storedJobs = apiService.getStoredJobDescriptions();
    setResumes(storedResumes);
    setJobDescriptions(storedJobs);
  };

  const loadMatchingConfig = () => {
    const config = apiService.getMatchingConfig();
    setMatchingConfig(config);
  };

  const handleResumeUpload = async (files: FileList) => {
    const fileArray = Array.from(files);
    
    // Initialize upload progress
    const progressItems = fileArray.map(file => ({
      fileName: file.name,
      progress: 0,
      status: 'uploading' as const,
    }));
    setUploadProgress(prev => [...prev, ...progressItems]);

    try {
      // Simulate upload progress
      for (const item of progressItems) {
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setUploadProgress(prev => 
            prev.map(p => p.fileName === item.fileName ? { ...p, progress: i } : p)
          );
        }
        setUploadProgress(prev => 
          prev.map(p => p.fileName === item.fileName ? { ...p, status: 'completed' } : p)
        );
      }

      const uploadedResumes = await apiService.uploadResumes(files);
      setResumes(prev => [...prev, ...uploadedResumes]);
      
      // Clear progress after a delay
      setTimeout(() => {
        setUploadProgress(prev => prev.filter(p => !fileArray.some(f => f.name === p.fileName)));
      }, 2000);
    } catch (error) {
      console.error('Error uploading resumes:', error);
      setUploadProgress(prev => 
        prev.map(p => fileArray.some(f => f.name === p.fileName) ? { ...p, status: 'error' } : p)
      );
    }
  };

  const handleJobDescriptionUpload = async (files: FileList) => {
    const fileArray = Array.from(files);
    
    const progressItems = fileArray.map(file => ({
      fileName: file.name,
      progress: 0,
      status: 'uploading' as const,
    }));
    setUploadProgress(prev => [...prev, ...progressItems]);

    try {
      for (const item of progressItems) {
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setUploadProgress(prev => 
            prev.map(p => p.fileName === item.fileName ? { ...p, progress: i } : p)
          );
        }
        setUploadProgress(prev => 
          prev.map(p => p.fileName === item.fileName ? { ...p, status: 'completed' } : p)
        );
      }

      const uploadedJobs = await apiService.uploadJobDescriptions(files);
      setJobDescriptions(prev => [...prev, ...uploadedJobs]);
      
      setTimeout(() => {
        setUploadProgress(prev => prev.filter(p => !fileArray.some(f => f.name === p.fileName)));
      }, 2000);
    } catch (error) {
      console.error('Error uploading job descriptions:', error);
      setUploadProgress(prev => 
        prev.map(p => fileArray.some(f => f.name === p.fileName) ? { ...p, status: 'error' } : p)
      );
    }
  };

  const handleJobDescriptionCreate = async (jobData: Partial<JobDescription>) => {
    try {
      const newJob = await apiService.createJobDescription(jobData);
      setJobDescriptions(prev => [...prev, newJob]);
    } catch (error) {
      console.error('Error creating job description:', error);
    }
  };

  const handleStartMatching = async () => {
    setIsMatching(true);
    try {
      const resumeIds = resumes.map(r => r.id);
      const jobIds = jobDescriptions.map(j => j.id);
      
      const results = await apiService.matchResumesWithJobsEnhanced(resumeIds, jobIds, matchingConfig || undefined);
      setMatchResults(results);
      setActiveSection('results');
      
      // Reload history after matching
      await loadHistory();
    } catch (error) {
      console.error('Error during matching:', error);
    } finally {
      setIsMatching(false);
    }
  };

  const handleDeleteJobDescription = async (jobId: string) => {
    try {
      await apiService.deleteJobDescription(jobId);
      setJobDescriptions(prev => prev.filter(job => job.id !== jobId));
    } catch (error) {
      console.error('Error deleting job description:', error);
    }
  };

  const handleUpdateJobDescription = async (jobId: string, jobData: Partial<JobDescription>) => {
    try {
      const updatedJob = await apiService.updateJobDescription(jobId, jobData);
      setJobDescriptions(prev => prev.map(job => job.id === jobId ? updatedJob : job));
    } catch (error) {
      console.error('Error updating job description:', error);
    }
  };

  const handleDeleteResume = async (resumeId: string) => {
    try {
      await apiService.deleteResume(resumeId);
      setResumes(prev => prev.filter(resume => resume.id !== resumeId));
      setSelectedResumes(prev => {
        const newSet = new Set(prev);
        newSet.delete(resumeId);
        return newSet;
      });
    } catch (error) {
      console.error('Error deleting resume:', error);
    }
  };

  const handleBulkDeleteResumes = async (resumeIds: string[]) => {
    try {
      await apiService.deleteMultipleResumes(resumeIds);
      setResumes(prev => prev.filter(resume => !resumeIds.includes(resume.id)));
      setSelectedResumes(new Set());
    } catch (error) {
      console.error('Error bulk deleting resumes:', error);
    }
  };

  const handleToggleResumeSelection = (resumeId: string) => {
    setSelectedResumes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(resumeId)) {
        newSet.delete(resumeId);
      } else {
        newSet.add(resumeId);
      }
      return newSet;
    });
  };

  const handleSelectAllResumes = () => {
    setSelectedResumes(new Set(resumes.map(r => r.id)));
  };

  const handleClearResumeSelection = () => {
    setSelectedResumes(new Set());
  };

  const handleSaveMatchingConfig = (config: MatchingConfig) => {
    apiService.saveMatchingConfig(config);
    setMatchingConfig(config);
  };

  const handleClearResumeHistory = () => {
    apiService.clearResumeHistory();
  };

  const handleClearJobDescriptionHistory = () => {
    apiService.clearJobDescriptionHistory();
  };

  const handleSidebarAction = (action: string, data?: any) => {
    switch (action) {
      case 'quick-match':
        if (resumes.length > 0 && jobDescriptions.length > 0) {
          handleStartMatching();
        }
        break;
      case 'bulk-analysis':
        setActiveSection('upload-resume');
        break;
      case 'navigate':
        // Handle navigation actions
        break;
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await apiService.exportResults(matchResults, 'csv');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `matching_results_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  const handleExportExcel = async () => {
    try {
      const blob = await apiService.exportResults(matchResults, 'excel');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `matching_results_${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting Excel:', error);
    }
  };

  const handleDownloadHistory = async (historyId: string) => {
    try {
      const historyItem = matchingHistory.find(h => h.id === historyId);
      if (historyItem) {
        const blob = await apiService.exportResults(historyItem.results, 'csv');
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = historyItem.csvFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading history:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        resumeCount={resumes.length}
        jobCount={jobDescriptions.length}
        onAction={handleSidebarAction}
      />
      <MainContent
        activeSection={activeSection}
        resumes={resumes}
        jobDescriptions={jobDescriptions}
        matchResults={matchResults}
        matchingHistory={matchingHistory}
        uploadProgress={uploadProgress}
        isMatching={isMatching}
        onResumeUpload={handleResumeUpload}
        onJobDescriptionUpload={handleJobDescriptionUpload}
        onJobDescriptionCreate={handleJobDescriptionCreate}
        onStartMatching={handleStartMatching}
        onExportCSV={handleExportCSV}
        onExportExcel={handleExportExcel}
        onDownloadHistory={handleDownloadHistory}
        selectedResumes={selectedResumes}
        onToggleResumeSelection={handleToggleResumeSelection}
        onSelectAllResumes={handleSelectAllResumes}
        onClearResumeSelection={handleClearResumeSelection}
        onDeleteResume={handleDeleteResume}
        onBulkDeleteResumes={handleBulkDeleteResumes}
        onDeleteJobDescription={handleDeleteJobDescription}
        onUpdateJobDescription={handleUpdateJobDescription}
        matchingConfig={matchingConfig}
        onSaveMatchingConfig={handleSaveMatchingConfig}
        onClearResumeHistory={handleClearResumeHistory}
        onClearJobDescriptionHistory={handleClearJobDescriptionHistory}
      />
    </div>
  );
}

export default App;