import React from 'react';
import UploadTab from './UploadTab';
import MatchingResults from './MatchingResults';
import HistoryTab from './HistoryTab';
import SkillsAssessment from './SkillsAssessment';
import ResumeAnalysis from './ResumeAnalysis';
import JobDescriptionManager from './JobDescriptionManager';
import DisplaySettings from './DisplaySettings';
import ExportOptions from './ExportOptions';
import { Resume, JobDescription, MatchResult, MatchingHistory, UploadProgress, MatchingConfig } from '../types';

interface MainContentProps {
  activeSection: string;
  resumes: Resume[];
  jobDescriptions: JobDescription[];
  matchResults: MatchResult[];
  matchingHistory: MatchingHistory[];
  uploadProgress: UploadProgress[];
  isMatching: boolean;
  onResumeUpload: (files: FileList) => Promise<void>;
  onJobDescriptionUpload: (files: FileList) => Promise<void>;
  onJobDescriptionCreate: (jobData: Partial<JobDescription>) => Promise<void>;
  onStartMatching: () => Promise<void>;
  onExportCSV: () => void;
  onExportExcel: () => void;
  onDownloadHistory: (historyId: string) => void;
  selectedResumes: Set<string>;
  onToggleResumeSelection: (resumeId: string) => void;
  onSelectAllResumes: () => void;
  onClearResumeSelection: () => void;
  onDeleteResume: (resumeId: string) => void;
  onBulkDeleteResumes: (resumeIds: string[]) => void;
  onDeleteJobDescription: (jobId: string) => void;
  onUpdateJobDescription: (jobId: string, jobData: Partial<JobDescription>) => void;
  matchingConfig: MatchingConfig | null;
  onSaveMatchingConfig: (config: MatchingConfig) => void;
  onClearResumeHistory: () => void;
  onClearJobDescriptionHistory: () => void;
}

const MainContent: React.FC<MainContentProps> = ({
  activeSection,
  resumes,
  jobDescriptions,
  matchResults,
  matchingHistory,
  uploadProgress,
  isMatching,
  onResumeUpload,
  onJobDescriptionUpload,
  onJobDescriptionCreate,
  onStartMatching,
  onExportCSV,
  onExportExcel,
  onDownloadHistory,
  selectedResumes,
  onToggleResumeSelection,
  onSelectAllResumes,
  onClearResumeSelection,
  onDeleteResume,
  onBulkDeleteResumes,
  onDeleteJobDescription,
  onUpdateJobDescription,
  matchingConfig,
  onSaveMatchingConfig,
  onClearResumeHistory,
  onClearJobDescriptionHistory,
}) => {
  const renderContent = () => {
    switch (activeSection) {
      case 'upload-resume':
      case 'upload':
        return (
          <UploadTab
            resumes={resumes}
            jobDescriptions={jobDescriptions}
            uploadProgress={uploadProgress}
            onResumeUpload={onResumeUpload}
            onJobDescriptionUpload={onJobDescriptionUpload}
            onJobDescriptionCreate={onJobDescriptionCreate}
            onStartMatching={onStartMatching}
            isMatching={isMatching}
          />
        );
      
      case 'view-resume-details':
      case 'resume-history':
        return (
          <ResumeAnalysis 
            resumes={resumes}
            selectedResumes={selectedResumes}
            onToggleResumeSelection={onToggleResumeSelection}
            onSelectAllResumes={onSelectAllResumes}
            onClearResumeSelection={onClearResumeSelection}
            onDeleteResume={onDeleteResume}
            onBulkDeleteResumes={onBulkDeleteResumes}
            onClearResumeHistory={onClearResumeHistory}
          />
        );
      
      case 'create-new-jd':
      case 'current-jd-details':
      case 'jd-history':
        return (
          <JobDescriptionManager 
            jobDescriptions={jobDescriptions}
            onJobDescriptionCreate={onJobDescriptionCreate}
            onDeleteJobDescription={onDeleteJobDescription}
            onUpdateJobDescription={onUpdateJobDescription}
            onClearJobDescriptionHistory={onClearJobDescriptionHistory}
          />
        );
      
      case 'mandatory-skills':
      case 'optional-skills':
      case 'experience-requirements':
      case 'education-requirements':
      case 'skills-assessment':
        return (
          <SkillsAssessment 
            activeSubSection={activeSection}
            matchingConfig={matchingConfig}
            onSaveMatchingConfig={onSaveMatchingConfig}
          />
        );
      
      case 'show-hide-sections':
      case 'sort-results':
      case 'display-settings':
        return <DisplaySettings />;
      
      case 'download-report':
      case 'share-results':
      case 'export-options':
        return (
          <ExportOptions 
            matchResults={matchResults}
            onExportCSV={onExportCSV}
            onExportExcel={onExportExcel}
          />
        );
      
      case 'results':
        return (
          <MatchingResults
            results={matchResults}
            onExportCSV={onExportCSV}
            onExportExcel={onExportExcel}
          />
        );
      
      case 'history':
        return (
          <HistoryTab
            history={matchingHistory}
            onDownloadHistory={onDownloadHistory}
          />
        );
      
      default:
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Welcome to HRMS Resume Matching
              </h3>
              <p className="text-gray-600 mb-4">
                Select an option from the left panel to get started with resume analysis and job matching.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Upload Resumes</h4>
                  <p className="text-sm text-gray-600">Start by uploading candidate resumes</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Create Job Descriptions</h4>
                  <p className="text-sm text-gray-600">Define job requirements and skills</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Match & Analyze</h4>
                  <p className="text-sm text-gray-600">Get AI-powered matching results</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
      {renderContent()}
    </div>
  );
};

export default MainContent;