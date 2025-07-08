import React, { useState } from 'react';
import { Download, Eye, ExternalLink, User, Mail, Phone, Globe, Github, Linkedin, ChevronDown, ChevronUp } from 'lucide-react';
import { MatchResult } from '../types';

interface MatchingResultsProps {
  results: MatchResult[];
  onExportCSV: () => void;
  onExportExcel: () => void;
}

const MatchingResults: React.FC<MatchingResultsProps> = ({ results, onExportCSV, onExportExcel }) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState<{
    key: keyof MatchResult | 'candidate.name';
    direction: 'asc' | 'desc';
  }>({ key: 'matchingScore', direction: 'desc' });

  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const sortedResults = React.useMemo(() => {
    return [...results].sort((a, b) => {
      let aValue, bValue;
      
      if (sortConfig.key === 'candidate.name') {
        aValue = a.candidate.name;
        bValue = b.candidate.name;
      } else {
        aValue = a[sortConfig.key as keyof MatchResult];
        bValue = b[sortConfig.key as keyof MatchResult];
      }
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [results, sortConfig]);

  const handleSort = (key: keyof MatchResult | 'candidate.name') => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreRing = (score: number) => {
    if (score >= 80) return 'stroke-green-500';
    if (score >= 60) return 'stroke-yellow-500';
    return 'stroke-red-500';
  };

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Yet</h3>
          <p className="text-gray-600">Upload resumes and job descriptions to see matching results here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Matching Results</h3>
            <p className="text-sm text-gray-600">{results.length} candidates analyzed</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onExportCSV}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onExportExcel}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Excel</span>
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('candidate.name')}
                  className="flex items-center space-x-1 hover:text-gray-700"
                >
                  <span>Candidate</span>
                  {sortConfig.key === 'candidate.name' && (
                    sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Job Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('matchingScore')}
                  className="flex items-center space-x-1 hover:text-gray-700"
                >
                  <span>Match Score</span>
                  {sortConfig.key === 'matchingScore' && (
                    sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedResults.map((result) => (
              <React.Fragment key={`${result.candidateId}-${result.jobId}`}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{result.candidate.name}</div>
                        <div className="text-sm text-gray-500">{result.candidate.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {result.candidate.email && (
                        <a
                          href={`mailto:${result.candidate.email}`}
                          className="text-blue-600 hover:text-blue-800"
                          title="Email"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      )}
                      {result.candidate.linkedin && (
                        <a
                          href={result.candidate.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                          title="LinkedIn"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {result.candidate.github && (
                        <a
                          href={result.candidate.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-800"
                          title="GitHub"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {result.candidate.personalWebsite && (
                        <a
                          href={result.candidate.personalWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-800"
                          title="Personal Website"
                        >
                          <Globe className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{result.job.title}</div>
                    <div className="text-sm text-gray-500">{result.job.company}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-12 h-12">
                        <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="2"
                          />
                          <path
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            className={getScoreRing(result.matchingScore)}
                            strokeWidth="2"
                            strokeDasharray={`${result.matchingScore}, 100`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-900">
                            {result.matchingScore}%
                          </span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(result.matchingScore)}`}>
                        {result.matchingScore >= 80 ? 'Excellent' : result.matchingScore >= 60 ? 'Good' : 'Fair'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleRowExpansion(`${result.candidateId}-${result.jobId}`)}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Details</span>
                      {expandedRows.has(`${result.candidateId}-${result.jobId}`) ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                </tr>
                {expandedRows.has(`${result.candidateId}-${result.jobId}`) && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Skill Matches</h4>
                          <div className="space-y-2">
                            {result.skillMatches.map((skillMatch, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium">{skillMatch.skill}</span>
                                  <span className={`px-2 py-1 rounded text-xs ${skillMatch.match ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {skillMatch.match ? 'Match' : 'No Match'}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-500">
                                  {skillMatch.candidateLevel} | {skillMatch.score}%
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Strengths</h4>
                            <div className="flex flex-wrap gap-2">
                              {result.strengths.map((strength, index) => (
                                <span key={index} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                  {strength}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Areas for Improvement</h4>
                            <div className="flex flex-wrap gap-2">
                              {result.gaps.map((gap, index) => (
                                <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                                  {gap}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MatchingResults;