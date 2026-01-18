import React from 'react';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h3 className="text-xl font-bold text-teal-700 mb-2">{title}</h3>
        <div className="text-gray-600 space-y-2">{children}</div>
    </div>
);

const InterpretResultsPage: React.FC = () => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-4">How to Interpret Your Analysis Report</h2>
            <p className="text-gray-600 mb-8">
                Your Nutrition Intelligence report is designed to give you a clear, 360-degree view of your flock's performance. This guide explains each section so you can get the most value from your results.
            </p>

            <Section title="1. Performance Evaluation">
                <p>This section gives you a high-level verdict on your flock's performance by comparing it to the genetic standards for its breed and age.
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                    <li><strong>Good:</strong> Your flock is outperforming the standard. This is an excellent result, and the analysis will focus on maintaining this high standard.</li>
                    <li><strong>Average:</strong> Your flock is performing as expected, meeting the breed standard. The analysis will identify opportunities for optimization to move from average to good.</li>
                    <li><strong>Poor:</strong> Your flock is underperforming compared to its genetic potential. This indicates there are significant opportunities for improvement, and the report will pinpoint the most likely causes.</li>
                </ul>
            </Section>

            <Section title="2. Nutritional Analysis">
                <p>Here, the AI acts as a nutritionist, critiquing the feed formula itself. Look for comments on:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                    <li><strong>Protein & Energy:</strong> Is the energy-to-protein ratio correct for the bird's age? Too much energy can lead to fat deposition, while too little can hinder growth.</li>
                    <li><strong>Amino Acids:</strong> This section will highlight if any essential amino acids (like lysine or methionine) are "limiting," meaning their short supply is preventing the bird from efficiently using other nutrients for growth.</li>
                    <li><strong>Mineral Balance:</strong> Comments may relate to the calcium-to-phosphorus ratio, which is crucial for bone development, or electrolyte balance (dEB), which affects litter quality and overall health.</li>
                </ul>
            </Section>

            <Section title="3. Management & Environmental Analysis">
                <p>This section connects the dots between the numbers on paper and the conditions on the farm. Even with a perfect diet, performance can suffer due to external factors. The analysis may suggest investigating:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                    <li><strong>Environmental Stress:</strong> High temperatures, poor ventilation, or wet litter can reduce feed intake and increase energy spent on maintenance rather than growth.</li>
                    <li><strong>Health Challenges:</strong> Sub-clinical diseases can negatively impact FCR and weight gain long before visible symptoms appear.</li>
                    <li><strong>Feed & Water Access:</strong> If birds cannot easily access feed and water, or if water quality is poor, performance will be compromised regardless of feed quality.</li>
                </ul>
            </Section>

            <Section title="4. Economic Analysis">
                <p>This is the bottom line. It translates the technical performance data into financial results.</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                    <li><strong>Cost per kg Live Weight:</strong> This key metric tells you how much it costs to produce each kilogram of meat. Lower is better.</li>
                    <li><strong>Profit per Bird:</strong> The ultimate measure of success, showing the net income after accounting for feed and chick costs.</li>
                    <li><strong>EEF/EEFP:</strong> The European Efficiency Factor is a comprehensive score that lets you benchmark your flock's overall efficiency against industry standards. A higher EEF score indicates better performance.</li>
                </ul>
            </Section>

            <Section title="5. Recommendations">
                <p>This is the most critical part of the report. It provides a checklist of <strong>practical, actionable steps</strong> based on all the preceding analysis. These are not generic suggestions; they are tailored to address the specific issues identified in your data. Prioritize these actions to see the most significant improvements in your next flock.</p>
            </Section>

            <Section title="6. Farmer's Summary">
                <p>This is the "big picture" conclusion. It's written in simple, non-technical language to give you an immediate understanding of your flock's status and the main takeaway from the detailed analysis. Use it as a starting point before diving into the other sections for more detail.</p>
            </Section>
        </div>
    );
};

export default InterpretResultsPage;
