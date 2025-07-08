import React, { useState } from 'react';
import { Plus, Play, AlertCircle, FileText, Briefcase } from 'lucide-react';
import FileUpload from './FileUpload';
import JobDescriptionForm from './JobDescriptionForm';
import { Resume, JobDescription, UploadProgress } from '../types';

interface UploadTabProps {
  resumes: Resume[];
  jobDescriptions: JobDescription[];
  uploadProgress: UploadProgress[];
  onResumeUpload: (files: FileList) => Promise<void>;
  onJobDescriptionUpload: (files: FileList) => Promise<void>;
  onJobDescriptionCreate: (jobData: Partial<JobDescription>) => Promise<void>;
  onStartMatching: () => Promise<void>;
  isMatching: boolean;
}

const UploadTab: React.FC<UploadTabProps> = ({
  resumes,
  jobDescriptions,
  uploadProgress,
  onResumeUpload,
  onJobDescriptionUpload,
  onJobDescriptionCreate,
  onStartMatching,
  isMatching,
}) => {
  const [showJobForm, setShowJobForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'resumes' | 'jobs'>('resumes');

  const canStartMatching = resumes.length > 0 && jobDescriptions.length > 0;

  const renderResumeUpload = () => (
    <div className="space-y-6">
      <FileUpload
        title="Upload Resumes"
        description="Upload candidate resumes in PDF, DOC, or DOCX format for AI-powered analysis"
        acceptedTypes=".pdf,.doc,.docx"
        onFileUpload={onResumeUpload}
        uploadProgress={uploadProgress.filter(p => !p.fileName.toLowerCase().includes('job'))}
        maxFiles={50}
      />
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Resume Processing</h4>
        <p className="text-sm text-blue-700">
          Our AI system extracts key information including skills, experience, education, and contact details 
          from uploaded resumes for comprehensive matching analysis.
        </p>
      </div>
    </div>
  );

  const renderJobUpload = () => (
    <div className="space-y-6">
      <FileUpload
        title="Upload Job Descriptions"
        description="Upload job descriptions in PDF, DOC, DOCX, or TXT format"
        acceptedTypes=".pdf,.doc,.docx,.txt"
        onFileUpload={onJobDescriptionUpload}
        uploadProgress={uploadProgress.filter(p => p.fileName.toLowerCase().includes('job'))}
        maxFiles={20}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Create Job Description Manually</h3>
          <button
            onClick={() => setShowJobForm(!showJobForm)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create New JD</span>
          </button>
        </div>
        
        {showJobForm && (
          <JobDescriptionForm
            onSubmit={async (jobData) => {
              await onJobDescriptionCreate(jobData);
              setShowJobForm(false);
            }}
            onCancel={() => setShowJobForm(false)}
          />
        )}
      </div>
      
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-medium text-green-900 mb-2">Job Description Analysis</h4>
        <p className="text-sm text-green-700">
          Job descriptions are analyzed to extract required skills, preferred qualifications, 
          and experience requirements for accurate candidate matching.
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('resumes')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'resumes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Upload Resumes</span>
                <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                  {resumes.length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'jobs'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5" />
                <span>Upload Job Descriptions</span>
                <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                  {jobDescriptions.length}
                </span>
              </div>
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'resumes' ? renderResumeUpload() : renderJobUpload()}
        </div>
      </div>

      {/* Status and Matching */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Powered Matching Status</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900">Resumes Uploaded</h4>
                <p className="text-2xl font-bold text-blue-600">{resumes.length}</p>
                <p className="text-sm text-blue-700">
                  {resumes.filter(r => r.status === 'completed').length} processed by AI
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-900">Job Descriptions</h4>
                <p className="text-2xl font-bold text-green-600">{jobDescriptions.length}</p>
                <p className="text-sm text-green-700">Ready for AI matching</p>
              </div>
            </div>
          </div>
        </div>

        {!canStartMatching && (
          <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg mb-4 border border-yellow-200">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800 mb-1">Ready for AI Matching?</h4>
              <p className="text-sm text-yellow-700">
                You need at least one resume and one job description to start the AI-powered matching process using Gemini 2.5 Pro.
              </p>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg mb-4 border border-purple-200">
          <h4 className="font-medium text-purple-900 mb-2">🤖 Powered by Gemini 2.5 Pro</h4>
          <p className="text-sm text-purple-700">
            Our advanced AI analyzes resumes against job requirements, considering skills, experience, 
            education, and cultural fit to provide accurate matching scores and detailed insights.
          </p>
        </div>

        <button
          onClick={onStartMatching}
          disabled={!canStartMatching || isMatching}
          className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            canStartMatching && !isMatching
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Play className="w-5 h-5" />
          <span>
            {isMatching ? 'AI is Processing Matches...' : 'Start AI-Powered Matching'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default UploadTab;