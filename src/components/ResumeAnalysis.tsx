import React, { useState } from 'react';
import { FileText, User, Mail, Phone, MapPin, ExternalLink, Star, Calendar, Eye, Trash2, CheckSquare, Square, RotateCcw } from 'lucide-react';
import { Resume } from '../types';
import ConfirmDialog from './ConfirmDialog';

interface ResumeAnalysisProps {
  resumes: Resume[];
  selectedResumes: Set<string>;
  onToggleResumeSelection: (resumeId: string) => void;
  onSelectAllResumes: () => void;
  onClearResumeSelection: () => void;
  onDeleteResume: (resumeId: string) => void;
  onBulkDeleteResumes: (resumeIds: string[]) => void;
  onClearResumeHistory: () => void;
}

const ResumeAnalysis: React.FC<ResumeAnalysisProps> = ({ 
  resumes,
  selectedResumes,
  onToggleResumeSelection,
  onSelectAllResumes,
  onClearResumeSelection,
  onDeleteResume,
  onBulkDeleteResumes,
  onClearResumeHistory
}) => {
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [showClearHistoryDialog, setShowClearHistoryDialog] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null);

  const recentResumes = resumes.slice(0, 10);

  const handleDeleteClick = (resumeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setResumeToDelete(resumeId);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (resumeToDelete) {
      onDeleteResume(resumeToDelete);
      setResumeToDelete(null);
    }
    setShowDeleteDialog(false);
  };

  const handleBulkDeleteClick = () => {
    setShowBulkDeleteDialog(true);
  };

  const handleConfirmBulkDelete = () => {
    onBulkDeleteResumes(Array.from(selectedResumes));
    setShowBulkDeleteDialog(false);
  };

  const handleClearHistoryClick = () => {
    setShowClearHistoryDialog(true);
  };

  const handleConfirmClearHistory = () => {
    onClearResumeHistory();
    setShowClearHistoryDialog(false);
  };

  const renderResumeList = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Resume History (Last 10)</h3>
            <p className="text-sm text-gray-600">{resumes.length} total resumes uploaded</p>
          </div>
          <div className="flex items-center space-x-2">
            {selectedResumes.size > 0 && (
              <>
                <button
                  onClick={handleBulkDeleteClick}
                  className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Selected ({selectedResumes.size})</span>
                </button>
                <button
                  onClick={onClearResumeSelection}
                  className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Clear Selection</span>
                </button>
              </>
            )}
            <button
              onClick={selectedResumes.size === resumes.length ? onClearResumeSelection : onSelectAllResumes}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              {selectedResumes.size === resumes.length ? <Square className="w-4 h-4" /> : <CheckSquare className="w-4 h-4" />}
              <span>{selectedResumes.size === resumes.length ? 'Deselect All' : 'Select All'}</span>
            </button>
            <button
              onClick={handleClearHistoryClick}
              className="flex items-center space-x-1 px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear History</span>
            </button>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {recentResumes.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Resumes Yet</h3>
            <p className="text-gray-600">Upload resumes to see analysis here.</p>
          </div>
        ) : (
          recentResumes.map((resume) => (
            <div
              key={resume.id}
              className={`p-4 hover:bg-gray-50 cursor-pointer border-l-4 ${
                selectedResumes.has(resume.id) ? 'border-blue-500 bg-blue-50' : 'border-transparent'
              }`}
              onClick={() => setSelectedResume(resume)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleResumeSelection(resume.id);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {selectedResumes.has(resume.id) ? (
                      <CheckSquare className="w-5 h-5" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {resume.extractedData?.name || resume.fileName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {resume.extractedData?.email || 'Processing...'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="text-sm text-gray-900">{resume.uploadDate}</div>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      resume.status === 'completed' ? 'bg-green-100 text-green-600' :
                      resume.status === 'processing' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {resume.status}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteClick(resume.id, e)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Delete Resume"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <Eye className="w-4 h-4 text-gray-400" />
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
        title="Delete Resume"
        message="Are you sure you want to delete this resume? This action cannot be undone."
        confirmText="Delete"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
      
      <ConfirmDialog
        isOpen={showBulkDeleteDialog}
        onClose={() => setShowBulkDeleteDialog(false)}
        onConfirm={handleConfirmBulkDelete}
        title="Delete Selected Resumes"
        message={`Are you sure you want to delete ${selectedResumes.size} selected resume(s)? This action cannot be undone.`}
        confirmText="Delete All"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
      
      <ConfirmDialog
        isOpen={showClearHistoryDialog}
        onClose={() => setShowClearHistoryDialog(false)}
        onConfirm={handleConfirmClearHistory}
        title="Clear Resume History"
        message="Are you sure you want to clear all resume history? This action cannot be undone."
        confirmText="Clear History"
        confirmButtonClass="bg-orange-600 hover:bg-orange-700"
      />
    </div>
  );

  const renderResumeDetails = () => {
    if (!selectedResume || !selectedResume.extractedData) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Resume</h3>
            <p className="text-gray-600">Choose a resume from the list to view detailed analysis.</p>
          </div>
        </div>
      );
    }

    const candidate = selectedResume.extractedData;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{candidate.name}</h2>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>{candidate.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Phone className="w-4 h-4" />
                    <span>{candidate.phone}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{candidate.address}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              {candidate.linkedin && (
                <a
                  href={candidate.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              )}
              {candidate.github && (
                <a
                  href={candidate.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-800"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {candidate.skills.map((skill, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    skill.isProjectUsed ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <span className="font-medium">{skill.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    skill.level === 'expert' ? 'bg-green-100 text-green-600' :
                    skill.level === 'advanced' ? 'bg-blue-100 text-blue-600' :
                    skill.level === 'intermediate' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {skill.level}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">{(skill.weightage * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Experience</h3>
          <div className="space-y-4">
            {candidate.experience.map((exp, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{exp.position}</h4>
                  <span className="text-sm text-gray-500">{exp.duration}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{exp.company}</p>
                <p className="text-sm text-gray-700 mb-2">{exp.description}</p>
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Education</h3>
          <div className="space-y-3">
            {candidate.education.map((edu, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-900">{edu.year}</div>
                  {edu.gpa && (
                    <div className="text-sm text-gray-500">GPA: {edu.gpa}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>{renderResumeList()}</div>
      <div>{renderResumeDetails()}</div>
    </div>
  );
};

export default ResumeAnalysis;