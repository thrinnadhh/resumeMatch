import React, { useState } from 'react';
import { Plus, Eye, Edit, Trash2, Briefcase, Calendar, FileText, RotateCcw } from 'lucide-react';
import JobDescriptionForm from './JobDescriptionForm';
import ConfirmDialog from './ConfirmDialog';
import { JobDescription } from '../types';

interface JobDescriptionManagerProps {
  jobDescriptions: JobDescription[];
  onJobDescriptionCreate: (jobData: Partial<JobDescription>) => Promise<void>;
  onDeleteJobDescription: (jobId: string) => void;
  onUpdateJobDescription: (jobId: string, jobData: Partial<JobDescription>) => void;
  onClearJobDescriptionHistory: () => void;
}

const JobDescriptionManager: React.FC<JobDescriptionManagerProps> = ({
  jobDescriptions,
  onJobDescriptionCreate,
  onDeleteJobDescription,
  onUpdateJobDescription,
  onClearJobDescriptionHistory,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobDescription | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'details'>('list');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showClearHistoryDialog, setShowClearHistoryDialog] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);

  const recentJobs = jobDescriptions.slice(0, 10);

  const handleDeleteClick = (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setJobToDelete(jobId);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (jobToDelete) {
      onDeleteJobDescription(jobToDelete);
      setJobToDelete(null);
      if (selectedJob?.id === jobToDelete) {
        setSelectedJob(null);
        setViewMode('list');
      }
    }
    setShowDeleteDialog(false);
  };

  const handleEditClick = (job: JobDescription, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedJob(job);
    setShowEditForm(true);
  };

  const handleUpdateJob = async (jobData: Partial<JobDescription>) => {
    if (selectedJob) {
      onUpdateJobDescription(selectedJob.id, jobData);
      setSelectedJob({ ...selectedJob, ...jobData } as JobDescription);
      setShowEditForm(false);
    }
  };

  const handleClearHistoryClick = () => {
    setShowClearHistoryDialog(true);
  };

  const handleConfirmClearHistory = () => {
    onClearJobDescriptionHistory();
    setShowClearHistoryDialog(false);
  };

  const renderJobList = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Job Descriptions</h3>
            <p className="text-sm text-gray-600">{jobDescriptions.length} total job descriptions</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleClearHistoryClick}
              className="flex items-center space-x-1 px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear History</span>
            </button>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Create New JD</span>
            </button>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {recentJobs.length === 0 ? (
          <div className="p-8 text-center">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Job Descriptions Yet</h3>
            <p className="text-gray-600">Create job descriptions to start matching with resumes.</p>
          </div>
        ) : (
          recentJobs.map((job) => (
            <div
              key={job.id}
              className="p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                setSelectedJob(job);
                setViewMode('details');
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{job.title}</div>
                    <div className="text-sm text-gray-500">{job.company}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-900">
                      {job.requirements.length} required skills
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(job.uploadDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => handleEditClick(job, e)}
                      className="text-blue-500 hover:text-blue-700 p-1"
                      title="Edit Job Description"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(job.id, e)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Delete Job Description"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <Eye className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Job Description"
        message="Are you sure you want to delete this job description? This action cannot be undone."
        confirmText="Delete"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
      
      <ConfirmDialog
        isOpen={showClearHistoryDialog}
        onClose={() => setShowClearHistoryDialog(false)}
        onConfirm={handleConfirmClearHistory}
        title="Clear Job Description History"
        message="Are you sure you want to clear all job description history? This action cannot be undone."
        confirmText="Clear History"
        confirmButtonClass="bg-orange-600 hover:bg-orange-700"
      />
    </div>
  );

  const renderJobDetails = () => {
    if (!selectedJob) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Job Description</h3>
            <p className="text-gray-600">Choose a job description from the list to view details.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{selectedJob.title}</h2>
                <p className="text-gray-600">{selectedJob.company}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(selectedJob.uploadDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FileText className="w-4 h-4" />
                    <span>{selectedJob.fileName}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowEditForm(true)}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button 
                onClick={() => {
                  setJobToDelete(selectedJob.id);
                  setShowDeleteDialog(true);
                }}
                className="flex items-center space-x-1 text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h3>
          <p className="text-gray-700 leading-relaxed">{selectedJob.description}</p>
        </div>

        {/* Required Skills */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {selectedJob.requirements.map((skill, index) => (
              <span
                key={index}
                className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Preferred Skills */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferred Skills</h3>
          <div className="flex flex-wrap gap-2">
            {selectedJob.preferredSkills.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (showEditForm && selectedJob) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Edit Job Description</h2>
          <button
            onClick={() => setShowEditForm(false)}
            className="text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>
        <JobDescriptionForm
          initialData={selectedJob}
          onSubmit={handleUpdateJob}
          onCancel={() => setShowEditForm(false)}
        />
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Create New Job Description</h2>
          <button
            onClick={() => setShowCreateForm(false)}
            className="text-gray-600 hover:text-gray-800"
          >
            Back to List
          </button>
        </div>
        <JobDescriptionForm
          onSubmit={async (jobData) => {
            await onJobDescriptionCreate(jobData);
            setShowCreateForm(false);
          }}
          onCancel={() => setShowCreateForm(false)}
        />
      </div>
    );
  }

  if (viewMode === 'details') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Job Description Details</h2>
          <button
            onClick={() => {
              setViewMode('list');
              setSelectedJob(null);
            }}
            className="text-gray-600 hover:text-gray-800"
          >
            Back to List
          </button>
        </div>
        {renderJobDetails()}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>{renderJobList()}</div>
      <div>{renderJobDetails()}</div>
    </div>
  );
};

export default JobDescriptionManager;