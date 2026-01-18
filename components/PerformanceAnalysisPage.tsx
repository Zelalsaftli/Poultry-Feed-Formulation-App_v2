import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import type { FeedAnalysisResult, PerformanceAnalysisReport } from '../types';
import PerformanceAnalysisDisplay from './PerformanceAnalysisDisplay';

interface PerformanceAnalysisPageProps {
  analysisResult: FeedAnalysisResult;
  report: PerformanceAnalysisReport | null;
  setReport: (report: PerformanceAnalysisReport | null) => void;
}

const PerformanceAnalysisPage: React.FC<PerformanceAnalysisPageProps> = ({ analysisResult, report, setReport }) => {
    const [formData, setFormData] = useState({
        breed: 'Ross 308',
        age: '35',
        birdsPlaced: '10000',
        avgBodyWeight: '2200',
        fcr: '1.65',
        mortality: '3.5',
        feedCost: analysisResult.totalCostPerTon.toFixed(2) || '',
        chickCost: '0.50',
        liveWeightPrice: '1.20',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAnalyze = async () => {
        setIsLoading(true);
        setError(null);
        setReport(null);

        const systemInstruction = `You are an expert poultry nutritionist and broiler production performance analyst. 
Your task is to analyze flock performance, feed formulation, and economic outcomes based on the data I provide.

When I send you flock data, you must:

1. Evaluate the flock performance compared to breed standards (Ross, Cobb, Hubbard).
2. Identify nutritional, management, or environmental factors that may explain deviations.
3. Provide practical, actionable recommendations to improve growth, FCR, health, and profitability.
4. Analyze the feed formulation or nutrient profile and comment on balance, limiting nutrients, and possible improvements.
5. Perform economic interpretation if cost data is provided.
6. Return the full analysis in a structured JSON format.

Always return your answer in the following JSON structure:

{
  "performance_evaluation": "",
  "nutritional_analysis": "",
  "management_analysis": "",
  "economic_analysis": "",
  "recommendations": [],
  "farmer_summary": ""
}`;

        const nutrientProfileString = Object.entries(analysisResult.nutrients)
            .map(([key, value]) => `  - ${key}: ${Number(value).toFixed(3)}`)
            .join('\n');

        const prompt = `
Please analyze the following broiler flock data:

1. Flock Information:
   - Breed: ${formData.breed}
   - Age of the birds (days): ${formData.age}
   - Number of birds placed: ${formData.birdsPlaced}

2. Performance Data:
   - Average body weight (g): ${formData.avgBodyWeight}
   - Cumulative Feed Conversion Ratio (FCR): ${formData.fcr}
   - Mortality (%): ${formData.mortality}

3. Feed Formulation / Nutrient Analysis:
   - This is the final nutrient profile of the feed being used:
${nutrientProfileString}

4. Economic Data (Optional):
   - Cost of feed ($/ton): ${formData.feedCost}
   - Cost per chick ($): ${formData.chickCost}
   - Price per kg of live weight at market ($): ${formData.liveWeightPrice}

Based on this data, provide your expert analysis in the required JSON format.
`;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: {
                    systemInstruction: systemInstruction,
                    responseMimeType: 'application/json',
                }
            });

            if (response.text) {
                const jsonText = response.text.replace(/```json|```/g, '').trim();
                const parsedReport = JSON.parse(jsonText) as PerformanceAnalysisReport;
                setReport(parsedReport);
            } else {
                throw new Error('No response text received from the API.');
            }
        } catch (err) {
            console.error('API Error:', err);
            setError('Failed to analyze data. The model may have returned an invalid format. Please check your inputs and try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const isFormIncomplete = !formData.breed || !formData.age || !formData.birdsPlaced || !formData.avgBodyWeight || !formData.fcr || !formData.mortality;

    const InputField: React.FC<{label: string, name: keyof typeof formData, value: string, note?: string}> = ({label, name, value, note}) => (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
                type="text"
                inputMode="decimal"
                name={name}
                value={value}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
            />
            {note && <p className="mt-1 text-xs text-gray-500">{note}</p>}
        </div>
    );


    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-700 mb-2">Performance & Economic Analysis</h2>
                <p className="text-gray-600 mb-6">Enter your flock's performance data below. The current feed's nutrient profile will be included automatically. The AI analyst will provide a detailed report.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Flock Info */}
                    <div className="md:col-span-1 lg:col-span-1 space-y-4 p-4 border rounded-lg bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Flock Information</h3>
                        <div>
                             <label className="block text-sm font-medium text-gray-700">Breed</label>
                             <select name="breed" value={formData.breed} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500">
                                <option>Ross 308</option>
                                <option>Cobb 500</option>
                                <option>Hubbard</option>
                                <option>Other</option>
                             </select>
                        </div>
                        <InputField label="Age at Depopulation (days)" name="age" value={formData.age} />
                        <InputField label="Number of Birds Placed" name="birdsPlaced" value={formData.birdsPlaced} />
                    </div>

                     {/* Performance Data */}
                    <div className="md:col-span-1 lg:col-span-1 space-y-4 p-4 border rounded-lg bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Performance Data</h3>
                        <InputField label="Average Body Weight (g)" name="avgBodyWeight" value={formData.avgBodyWeight} />
                        <InputField label="Feed Conversion Ratio (FCR)" name="fcr" value={formData.fcr} />
                        <InputField label="Mortality (%)" name="mortality" value={formData.mortality} />
                    </div>
                    
                    {/* Economic Data */}
                    <div className="md:col-span-2 lg:col-span-1 space-y-4 p-4 border rounded-lg bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Economic Data (Optional)</h3>
                        <InputField label="Cost of Feed ($/ton)" name="feedCost" value={formData.feedCost} note="Auto-filled from your formulation." />
                        <InputField label="Cost per Chick ($)" name="chickCost" value={formData.chickCost} />
                        <InputField label="Market Price ($/kg live weight)" name="liveWeightPrice" value={formData.liveWeightPrice} />
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <button
                        onClick={handleAnalyze}
                        disabled={isLoading || isFormIncomplete}
                        className="bg-teal-600 text-white font-bold py-3 px-10 rounded-md hover:bg-teal-700 transition-colors shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Analyzing...
                            </>
                        ) : 'Analyze Performance'}
                    </button>
                    {isFormIncomplete && <p className="text-xs text-red-600 mt-2">Please fill in all required flock and performance fields.</p>}
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md" role="alert">
                    <p className="font-bold">Analysis Failed</p>
                    <p>{error}</p>
                </div>
            )}
            
            {report && <PerformanceAnalysisDisplay report={report} />}

        </div>
    );
};

export default PerformanceAnalysisPage;