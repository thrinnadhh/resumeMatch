import React, { useState } from 'react';
import { 
  FileText, 
  Users, 
  Briefcase, 
  Settings, 
  Download, 
  Share2,
  ChevronDown,
  ChevronRight,
  Plus,
  Eye,
  History,
  Star,
  Award,
  GraduationCap,
  Clock,
  Filter,
  SortAsc
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  resumeCount: number;
  jobCount: number;
  onAction: (action: string, data?: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection, 
  onSectionChange, 
  resumeCount, 
  jobCount,
  onAction 
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['resume-analysis', 'job-descriptions', 'skills-assessment'])
  );

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const menuItems = [
    {
      id: 'resume-analysis',
      title: 'Resume Analysis',
      icon: FileText,
      badge: resumeCount,
      children: [
        { id: 'upload-resume', title: 'Upload Files', icon: Plus },
        { id: 'view-resume-details', title: 'View Resume Details', icon: Eye },
        { id: 'resume-history', title: 'Resume History (Last 10)', icon: History }
      ]
    },
    {
      id: 'job-descriptions',
      title: 'Job Descriptions',
      icon: Briefcase,
      badge: jobCount,
      children: [
        { id: 'create-new-jd', title: 'Create New JD', icon: Plus },
        { id: 'current-jd-details', title: 'Current JD Details', icon: Eye },
        { id: 'jd-history', title: 'JD History (Last 10)', icon: History }
      ]
    },
    {
      id: 'skills-assessment',
      title: 'Skills Assessment',
      icon: Award,
      children: [
        { 
          id: 'mandatory-skills', 
          title: 'Mandatory Skills', 
          icon: Star,
          subtitle: 'Weight: 40% | Missing = Score 0',
          children: [
            { id: 'add-edit-mandatory', title: 'Add/Edit Skills', icon: Settings }
          ]
        },
        { 
          id: 'optional-skills', 
          title: 'Optional Skills', 
          icon: Users,
          subtitle: 'Weight: 30%',
          children: [
            { id: 'add-edit-optional', title: 'Add/Edit Skills', icon: Settings }
          ]
        },
        { 
          id: 'experience-requirements', 
          title: 'Experience Requirements', 
          icon: Clock,
          subtitle: 'Weight: 20%',
          children: [
            { id: 'min-years', title: 'Minimum Years Required', icon: Clock },
            { id: 'industry-experience', title: 'Industry-Specific Experience', icon: Briefcase }
          ]
        },
        { 
          id: 'education-requirements', 
          title: 'Education Requirements', 
          icon: GraduationCap,
          subtitle: 'Weight: 10%',
          children: [
            { id: 'required-qualifications', title: 'Required Qualifications', icon: GraduationCap }
          ]
        }
      ]
    },
    {
      id: 'display-settings',
      title: 'Display Settings',
      icon: Settings,
      children: [
        { id: 'show-hide-sections', title: 'Show/Hide Sections', icon: Eye },
        { 
          id: 'sort-results', 
          title: 'Sort Results By', 
          icon: SortAsc,
          children: [
            { id: 'sort-score', title: 'Score (Default)', icon: Star },
            { id: 'sort-experience', title: 'Experience', icon: Clock },
            { id: 'sort-skills', title: 'Skills Match', icon: Award },
            { id: 'sort-date', title: 'Date Added', icon: History }
          ]
        }
      ]
    },
    {
      id: 'export-options',
      title: 'Export Options',
      icon: Download,
      children: [
        { id: 'download-report', title: 'Download Analysis Report', icon: Download },
        { id: 'share-results', title: 'Share Results', icon: Share2 }
      ]
    }
  ];

  const renderMenuItem = (item: any, level = 0) => {
    const isExpanded = expandedSections.has(item.id);
    const isActive = activeSection === item.id;
    const hasChildren = item.children && item.children.length > 0;
    const Icon = item.icon;

    return (
      <div key={item.id} className={`${level > 0 ? 'ml-4' : ''}`}>
        <div
          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
            isActive 
              ? 'bg-blue-100 text-blue-700' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => {
            if (hasChildren) {
              toggleSection(item.id);
            } else {
              onSectionChange(item.id);
              onAction('navigate', item.id);
            }
          }}
        >
          <div className="flex items-center space-x-2 flex-1">
            <Icon className="w-4 h-4" />
            <div className="flex-1">
              <div className="text-sm font-medium">{item.title}</div>
              {item.subtitle && (
                <div className="text-xs text-gray-500 mt-0.5">{item.subtitle}</div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {item.badge !== undefined && (
              <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
            {hasChildren && (
              isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children.map((child: any) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">HRMS Control Panel</h2>
        <p className="text-sm text-gray-600">Resume & Job Matching System</p>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-blue-900">Resumes</div>
            <div className="text-xl font-bold text-blue-600">{resumeCount}</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-green-900">Jobs</div>
            <div className="text-xl font-bold text-green-600">{jobCount}</div>
          </div>
        </div>

        <div className="space-y-2">
          {menuItems.map(item => renderMenuItem(item))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 mt-auto">
        <div className="space-y-2">
          <button
            onClick={() => onAction('quick-match')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Quick Match
          </button>
          <button
            onClick={() => onAction('bulk-analysis')}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Bulk Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;