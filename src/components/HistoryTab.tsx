import React, { useState } from 'react';
import { Calendar, Clock, Download, FileText, Users, Search, Filter } from 'lucide-react';
import { MatchingHistory } from '../types';

interface HistoryTabProps {
  history: MatchingHistory[];
  onDownloadHistory: (historyId: string) => void;
}

const HistoryTab: React.FC<HistoryTabProps> = ({ history, onDownloadHistory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterByDate, setFilterByDate] = useState('all');

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.jobDescriptions.some(job => 
      job.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesDateFilter = filterByDate === 'all' || (() => {
      const itemDate = new Date(item.date);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (filterByDate) {
        case 'week':
          return daysDiff <= 7;
        case 'month':
          return daysDiff <= 30;
        case 'quarter':
          return daysDiff <= 90;
        default:
          return true;
      }
    })();
    
    return matchesSearch && matchesDateFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateJobDescriptions = (jobs: string[]) => {
    if (jobs.length <= 3) {
      return jobs.join(', ');
    }
    return `${jobs.slice(0, 3).join(', ')} + ${jobs.length - 3} more`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Matching History</h3>
            <p className="text-sm text-gray-600">Past matching sessions and results</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search job descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterByDate}
              onChange={(e) => setFilterByDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Time</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {filteredHistory.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No History Found</h3>
            <p className="text-gray-600">
              {searchTerm || filterByDate !== 'all' 
                ? 'No matching history found for your search criteria.' 
                : 'Start matching resumes with job descriptions to see history here.'}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Descriptions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resumes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Results
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHistory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{formatDate(item.date)}</div>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(item.time)}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {truncateJobDescriptions(item.jobDescriptions)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.jobDescriptions.length} job{item.jobDescriptions.length !== 1 ? 's' : ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{item.resumeCount}</span>
                      <span className="text-sm text-gray-500">resumes</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.results.length} matches
                    </div>
                    <div className="text-sm text-gray-500">
                      Avg: {Math.round(item.results.reduce((sum, r) => sum + r.matchingScore, 0) / item.results.length)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onDownloadHistory(item.id)}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default HistoryTab;