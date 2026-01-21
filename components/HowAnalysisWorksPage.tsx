import React from 'react';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h3 className="text-xl font-bold text-teal-700 mb-2">{title}</h3>
        <div className="text-gray-600 space-y-2">{children}</div>
    </div>
);

const HowAnalysisWorksPage: React.FC = () => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-4">How the Nutrition Intelligence Analysis Works</h2>
            <p className="text-gray-600 mb-8">
                This document explains how the application's AI-powered analysis engine processes your data to deliver a comprehensive and actionable report. The system is designed to act as an expert poultry nutritionist, providing insights to help you optimize performance and profitability.
            </p>

            <Section title="1. Combining Your Data Inputs">
                <p>The analysis begins by consolidating all the information you provide. This includes:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                    <li><strong>Flock Data:</strong> Breed, age, number of birds, and key performance indicators (body weight, FCR, mortality).</li>
                    <li><strong>Feed Formulation:</strong> The complete nutrient profile (protein, energy, amino acids, minerals, etc.) calculated from your ingredient inputs.</li>
                    <li><strong>Economic Data:</strong> Costs for feed and chicks, and the market price for live weight. This data is optional but allows for a full profitability analysis.</li>
                </ul>
            </Section>

            <Section title="2. Evaluating Performance Against Breed Standards">
                <p>The system compares your flock's performance metrics (average body weight, FCR, etc.) against the established genetic standards for the specific breed you selected (e.g., Ross 308, Cobb 500). It determines whether your flock is performing above, at, or below its genetic potential for its age, providing a clear "good," "average," or "poor" evaluation.</p>
            </Section>

            <Section title="3. Assessing Nutritional Balance and Quality">
                <p>The AI analyzes your feed's nutrient profile in detail. It checks for:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                    <li><strong>Nutrient Balance:</strong> It verifies if key ratios, like energy-to-protein and calcium-to-phosphorus, are within optimal ranges for the bird's growth phase.</li>
                    <li><strong>Limiting Nutrients:</strong> It identifies any essential amino acids or other nutrients that may be undersupplied, potentially bottlenecking growth and efficiency.</li>
                    <li><strong>Feed Quality:</strong> The analysis infers potential issues related to feed quality based on the nutrient profile and performance outcomes.</li>
                </ul>
            </Section>

            <Section title="4. Interpreting Management and Environmental Factors">
                <p>While the AI cannot see your farm, it can infer potential management or environmental issues by correlating performance deviations with the feed analysis. For example, poor FCR despite a well-balanced diet might suggest issues with feeder space, water quality, temperature stress, or underlying health challenges. The analysis will highlight these possibilities for your consideration.</p>
            </Section>

            <Section title="5. Calculating Profitability">
                <p>If you provide economic data, the system performs a thorough financial analysis. It calculates key metrics such as:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                    <li><strong>Cost per kg of Live Weight:</strong> Determines the total cost to produce one kilogram of broiler meat.</li>
                    <li><strong>Profit per Bird:</strong> Calculates the net profit for each bird sold.</li>
                    <li><strong>European Efficiency Factor (EEF/EEFP):</strong> A standard industry benchmark that combines livability, growth rate, and FCR into a single efficiency score.</li>
                </ul>
            </Section>

            <Section title="6. Generating Recommendations and a Farmer-Friendly Summary">
                <p>Finally, the AI synthesizes all its findings into two key outputs:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                    <li><strong>Actionable Recommendations:</strong> A list of 5-8 practical, specific steps you can take to address any identified issues and improve your flock's performance and profitability.</li>
                    <li><strong>Farmer's Summary:</strong> A concise, easy-to-understand conclusion that summarizes the most important findings without technical jargon, making it quick and easy to grasp the overall situation.</li>
                </ul>
            </Section>
        </div>
    );
};

export default HowAnalysisWorksPage;