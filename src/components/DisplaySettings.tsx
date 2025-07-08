import React, { useState } from 'react';
import { Eye, EyeOff, SortAsc, Filter, Settings } from 'lucide-react';

const DisplaySettings: React.FC = () => {
  const [visibleSections, setVisibleSections] = useState({
    personalInfo: true,
    skills: true,
    experience: true,
    education: true,
    matchScore: true,
    strengths: true,
    gaps: true,
  });

  const [sortBy, setSortBy] = useState('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const toggleSection = (section: keyof typeof visibleSections) => {
    setVisibleSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const sections = [
    { key: 'personalInfo', label: 'Personal Information', description: 'Name, email, contact details' },
    { key: 'skills', label: 'Skills Analysis', description: 'Skill matches and levels' },
    { key: 'experience', label: 'Work Experience', description: 'Employment history and roles' },
    { key: 'education', label: 'Education', description: 'Academic qualifications' },
    { key: 'matchScore', label: 'Match Score', description: 'Overall matching percentage' },
    { key: 'strengths', label: 'Strengths', description: 'Candidate strong points' },
    { key: 'gaps', label: 'Skill Gaps', description: 'Areas for improvement' },
  ];

  const sortOptions = [
    { value: 'score', label: 'Match Score', description: 'Sort by overall matching percentage' },
    { value: 'experience', label: 'Experience', description: 'Sort by years of experience' },
    { value: 'skills', label: 'Skills Match', description: 'Sort by number of matching skills' },
    { value: 'date', label: 'Date Added', description: 'Sort by upload date' },
    { value: 'name', label: 'Candidate Name', description: 'Sort alphabetically by name' },
  ];

  return (
    <div className="space-y-6">
      {/* Show/Hide Sections */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Eye className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">Show/Hide Sections</h3>
        </div>
        <p className="text-gray-600 mb-6">
          Control which sections are visible in the matching results display.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((section) => (
            <div
              key={section.key}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleSection(section.key as keyof typeof visibleSections)}
                    className={`p-1 rounded ${
                      visibleSections[section.key as keyof typeof visibleSections]
                        ? 'text-green-600'
                        : 'text-gray-400'
                    }`}
                  >
                    {visibleSections[section.key as keyof typeof visibleSections] ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                  <div>
                    <h4 className="font-medium text-gray-900">{section.label}</h4>
                    <p className="text-sm text-gray-600">{section.description}</p>
                  </div>
                </div>
              </div>
              <div className={`w-3 h-3 rounded-full ${
                visibleSections[section.key as keyof typeof visibleSections]
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`} />
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Quick Actions</h4>
          <div className="flex space-x-3">
            <button
              onClick={() => setVisibleSections(Object.keys(visibleSections).reduce((acc, key) => ({
                ...acc,
                [key]: true
              }), {} as typeof visibleSections))}
              className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Show All
            </button>
            <button
              onClick={() => setVisibleSections(Object.keys(visibleSections).reduce((acc, key) => ({
                ...acc,
                [key]: false
              }), {} as typeof visibleSections))}
              className="text-sm bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
            >
              Hide All
            </button>
            <button
              onClick={() => setVisibleSections({
                personalInfo: true,
                skills: true,
                experience: true,
                education: false,
                matchScore: true,
                strengths: true,
                gaps: false,
              })}
              className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Essential Only
            </button>
          </div>
        </div>
      </div>

      {/* Sort Results */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <SortAsc className="w-5 h-5 text-green-500" />
          <h3 className="text-lg font-semibold text-gray-900">Sort Results</h3>
        </div>
        <p className="text-gray-600 mb-6">
          Configure how matching results are sorted and displayed.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Sort By</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sortOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    sortBy === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="sortBy"
                    value={option.value}
                    checked={sortBy === option.value}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    sortBy === option.value
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {sortBy === option.value && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Sort Order</label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="sortOrder"
                  value="desc"
                  checked={sortOrder === 'desc'}
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Descending (High to Low)</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="sortOrder"
                  value="asc"
                  checked={sortOrder === 'asc'}
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Ascending (Low to High)</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Current Settings</h4>
          <p className="text-sm text-gray-600">
            Results will be sorted by <strong>{sortOptions.find(o => o.value === sortBy)?.label}</strong> in{' '}
            <strong>{sortOrder === 'desc' ? 'descending' : 'ascending'}</strong> order.
          </p>
        </div>
      </div>

      {/* Additional Display Options */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-900">Additional Options</h3>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Compact View</div>
              <div className="text-sm text-gray-600">Show more results per page with less detail</div>
            </div>
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Auto-refresh Results</div>
              <div className="text-sm text-gray-600">Automatically update when new matches are found</div>
            </div>
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Show Score Breakdown</div>
              <div className="text-sm text-gray-600">Display detailed scoring information</div>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default DisplaySettings;