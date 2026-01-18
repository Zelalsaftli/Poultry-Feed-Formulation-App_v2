import React from 'react';
import type { PerformanceAnalysisReport } from '../types';

interface PerformanceAnalysisDisplayProps {
  report: PerformanceAnalysisReport;
}

const ReportCard: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode }> = ({ title, children, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center mb-3">
            <div className="text-teal-500 mr-3">{icon}</div>
            <h3 className="text-xl font-bold text-gray-700">{title}</h3>
        </div>
        <div className="text-gray-600 space-y-2">{children}</div>
    </div>
);

const PerformanceAnalysisDisplay: React.FC<PerformanceAnalysisDisplayProps> = ({ report }) => {
  return (
    <div className="space-y-6 mt-8 animate-fadeIn">
        
        {/* Summary for User */}
        <div className="bg-teal-50 border-l-4 border-teal-500 text-teal-800 p-6 rounded-lg shadow">
            <h3 className="text-2xl font-bold mb-2">Farmer's Summary</h3>
            <p className="text-lg">{report.farmer_summary}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <ReportCard title="Performance Evaluation" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}>
                <p>{report.performance_evaluation}</p>
            </ReportCard>
            
            <ReportCard title="Nutritional Analysis" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.443 2.216a2 2 0 002.103 1.776a2 2 0 001.776-2.103l-.443-2.216a2 2 0 011.022-.547l2.387.477a6 6 0 003.86-.517l.318-.158a6 6 0 013.86-.517l2.387.477a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.443-2.216zM12 6.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" /></svg>}>
                <p>{report.nutritional_analysis}</p>
            </ReportCard>
            
            <ReportCard title="Management & Environmental Analysis" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}>
                <p>{report.management_analysis}</p>
            </ReportCard>
            
            <ReportCard title="Economic Analysis" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}>
                <p>{report.economic_analysis || 'No economic data provided for analysis.'}</p>
            </ReportCard>

        </div>
        
        <ReportCard title="Recommendations" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}>
            <ul className="list-disc list-inside space-y-2">
                {report.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                ))}
            </ul>
        </ReportCard>
    </div>
  );
};

export default PerformanceAnalysisDisplay;