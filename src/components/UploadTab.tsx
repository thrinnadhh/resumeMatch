import React, { useState } from 'react';
import { Plus, Play, AlertCircle } from 'lucide-react';
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

  const canStartMatching = resumes.length > 0 && jobDescriptions.length > 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FileUpload
          title="Upload Resumes"
          description="Upload candidate resumes in PDF, DOC, or DOCX format"
          acceptedTypes=".pdf,.doc,.docx"
          onFileUpload={onResumeUpload}
          uploadProgress={uploadProgress.filter(p => p.fileName.includes('resume'))}
          maxFiles={50}
        />
        
        <FileUpload
          title="Upload Job Descriptions"
          description="Upload job descriptions in PDF, DOC, DOCX, or TXT format"
          acceptedTypes=".pdf,.doc,.docx,.txt"
          onFileUpload={onJobDescriptionUpload}
          uploadProgress={uploadProgress.filter(p => p.fileName.includes('job'))}
          maxFiles={20}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Job Description Options</h3>
          <button
            onClick={() => setShowJobForm(!showJobForm)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Job Description</span>
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

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Resumes Uploaded</h4>
            <p className="text-2xl font-bold text-blue-600">{resumes.length}</p>
            <p className="text-sm text-blue-700">
              {resumes.filter(r => r.status === 'completed').length} processed
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Job Descriptions</h4>
            <p className="text-2xl font-bold text-green-600">{jobDescriptions.length}</p>
            <p className="text-sm text-green-700">Ready for matching</p>
          </div>
        </div>

        {!canStartMatching && (
          <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg mb-4">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800 mb-1">Ready to Match?</h4>
              <p className="text-sm text-yellow-700">
                You need at least one resume and one job description to start the matching process.
              </p>
            </div>
          </div>
        )}

        <button
          onClick={onStartMatching}
          disabled={!canStartMatching || isMatching}
          className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            canStartMatching && !isMatching
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Play className="w-5 h-5" />
          <span>
            {isMatching ? 'Processing Matches...' : 'Start Matching Process'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default UploadTab;