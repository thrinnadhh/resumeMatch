import React, { useState } from 'react';
import { Download, Share2, FileText, Table, Mail, Link, Calendar } from 'lucide-react';
import { MatchResult } from '../types';

interface ExportOptionsProps {
  matchResults: MatchResult[];
  onExportCSV: () => void;
  onExportExcel: () => void;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({
  matchResults,
  onExportCSV,
  onExportExcel,
}) => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [includeDetails, setIncludeDetails] = useState(true);
  const [shareMethod, setShareMethod] = useState('download');

  const exportFormats = [
    {
      value: 'csv',
      label: 'CSV File',
      description: 'Comma-separated values for spreadsheet applications',
      icon: FileText,
    },
    {
      value: 'excel',
      label: 'Excel File',
      description: 'Microsoft Excel format with multiple sheets',
      icon: Table,
    },
    {
      value: 'pdf',
      label: 'PDF Report',
      description: 'Formatted report for presentation and printing',
      icon: FileText,
    },
  ];

  const shareOptions = [
    {
      value: 'download',
      label: 'Download File',
      description: 'Save file to your computer',
      icon: Download,
    },
    {
      value: 'email',
      label: 'Send via Email',
      description: 'Email the report to stakeholders',
      icon: Mail,
    },
    {
      value: 'link',
      label: 'Generate Share Link',
      description: 'Create a secure link to share results',
      icon: Link,
    },
  ];

  const handleExport = () => {
    switch (exportFormat) {
      case 'csv':
        onExportCSV();
        break;
      case 'excel':
        onExportExcel();
        break;
      case 'pdf':
        // Handle PDF export
        console.log('PDF export not implemented yet');
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Format Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Download className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">Export Format</h3>
        </div>
        <p className="text-gray-600 mb-6">
          Choose the format for your analysis report. Each format has different advantages for different use cases.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {exportFormats.map((format) => {
            const Icon = format.icon;
            return (
              <label
                key={format.value}
                className={`flex flex-col p-4 border rounded-lg cursor-pointer transition-colors ${
                  exportFormat === format.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="exportFormat"
                  value={format.value}
                  checked={exportFormat === format.value}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center space-x-3 mb-2">
                  <Icon className={`w-6 h-6 ${
                    exportFormat === format.value ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <span className="font-medium text-gray-900">{format.label}</span>
                </div>
                <p className="text-sm text-gray-600">{format.description}</p>
              </label>
            );
          })}
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
        
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Include Detailed Analysis</div>
              <div className="text-sm text-gray-600">Include skill breakdowns, strengths, and gaps</div>
            </div>
            <input
              type="checkbox"
              checked={includeDetails}
              onChange={(e) => setIncludeDetails(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Include Contact Information</div>
              <div className="text-sm text-gray-600">Export candidate contact details</div>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Include Timestamps</div>
              <div className="text-sm text-gray-600">Add analysis date and time</div>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
        </div>
      </div>

      {/* Share Method */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Share2 className="w-5 h-5 text-green-500" />
          <h3 className="text-lg font-semibold text-gray-900">Share Method</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {shareOptions.map((option) => {
            const Icon = option.icon;
            return (
              <label
                key={option.value}
                className={`flex flex-col p-4 border rounded-lg cursor-pointer transition-colors ${
                  shareMethod === option.value
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="shareMethod"
                  value={option.value}
                  checked={shareMethod === option.value}
                  onChange={(e) => setShareMethod(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center space-x-3 mb-2">
                  <Icon className={`w-6 h-6 ${
                    shareMethod === option.value ? 'text-green-600' : 'text-gray-400'
                  }`} />
                  <span className="font-medium text-gray-900">{option.label}</span>
                </div>
                <p className="text-sm text-gray-600">{option.description}</p>
              </label>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Summary</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{matchResults.length}</div>
            <div className="text-sm text-blue-700">Total Matches</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {matchResults.filter(r => r.matchingScore >= 80).length}
            </div>
            <div className="text-sm text-green-700">High Matches</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {matchResults.filter(r => r.matchingScore >= 60 && r.matchingScore < 80).length}
            </div>
            <div className="text-sm text-yellow-700">Medium Matches</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {matchResults.filter(r => r.matchingScore < 60).length}
            </div>
            <div className="text-sm text-red-700">Low Matches</div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg mb-6">
          <h4 className="font-medium text-gray-900 mb-2">Export Configuration</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div>Format: <strong>{exportFormats.find(f => f.value === exportFormat)?.label}</strong></div>
            <div>Method: <strong>{shareOptions.find(s => s.value === shareMethod)?.label}</strong></div>
            <div>Details: <strong>{includeDetails ? 'Included' : 'Summary only'}</strong></div>
            <div>Generated: <strong>{new Date().toLocaleString()}</strong></div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleExport}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Generate Report
          </button>
          <button className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Preview
          </button>
        </div>
      </div>

      {/* Recent Exports */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Exports</h3>
        
        <div className="space-y-3">
          {[
            { name: 'Frontend_Developer_Analysis.xlsx', date: '2024-01-15 14:30', size: '2.3 MB' },
            { name: 'Backend_Engineer_Report.pdf', date: '2024-01-14 10:15', size: '1.8 MB' },
            { name: 'Full_Stack_Matches.csv', date: '2024-01-13 16:45', size: '0.5 MB' },
          ].map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">{file.name}</div>
                  <div className="text-sm text-gray-500">{file.date} • {file.size}</div>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800">
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExportOptions;