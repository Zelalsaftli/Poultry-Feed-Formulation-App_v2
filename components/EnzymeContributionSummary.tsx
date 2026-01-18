import React from 'react';
import type { FeedAnalysisResult } from '../types';
import { ANALYSIS_RESULTS } from '../constants';

interface EnzymeContributionSummaryProps {
    enzymeContributions?: FeedAnalysisResult['enzymeContributions'];
}

const EnzymeContributionSummary: React.FC<EnzymeContributionSummaryProps> = ({ enzymeContributions }) => {
    if (!enzymeContributions || Object.keys(enzymeContributions).length === 0) {
        return <p className="text-gray-500 text-center">No active enzymes are contributing to the nutrient profile.</p>;
    }
    
    // Dynamically create a reverse mapping for nutrient keys
    const nutrientKeyMap: Record<string, string> = {};
    for (const key in ANALYSIS_RESULTS) {
        const nutrientPart = key.split('.')[1];
        if (nutrientPart) {
            nutrientKeyMap[nutrientPart] = key;
        }
    }
    nutrientKeyMap['ME_kcal_per_kg'] = 'nutrients.ME_kcal_per_kg'; // Manual addition for ME

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(enzymeContributions).map((enzyme: { name: string; contributions: Record<string, number> }, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-gray-800 text-lg mb-2">{enzyme.name}</h4>
                    <ul className="space-y-1 text-sm">
                        {Object.entries(enzyme.contributions).map(([key, value]) => {
                            const fullKey = nutrientKeyMap[key] || `nutrients.${key}`;
                            const nutrientName = ANALYSIS_RESULTS[fullKey] || key;
                            const unit = nutrientName.includes('%') ? '%' : (nutrientName.includes('kcal/kg') ? ' kcal/kg' : '');
                            
                            return (
                                <li key={key} className="flex justify-between items-center">
                                    <span className="text-gray-600">{nutrientName.replace('%', '').trim()}:</span>
                                    <span className="font-mono font-semibold text-teal-700">+{value.toFixed(3)}{unit}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default EnzymeContributionSummary;