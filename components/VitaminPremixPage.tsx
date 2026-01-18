import React, { useState, useMemo, useRef, useEffect } from 'react';
import { initialVitaminsData } from '../constants';
import type { Vitamin } from '../types';

const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => (
    <div className="relative flex items-center group">
        {children}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max max-w-xs p-2 bg-gray-800 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            {text}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
        </div>
    </div>
);

const EditableNumericCell: React.FC<{
    initialValue: number;
    onSave: (value: string) => void;
    className?: string;
}> = ({ initialValue, onSave, className }) => {
    const [value, setValue] = useState(String(initialValue || 0));
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (document.activeElement !== inputRef.current) {
            setValue(String(initialValue || 0));
        }
    }, [initialValue]);

    const handleBlur = () => {
        onSave(value);
    };

    return (
        <input
            ref={inputRef}
            type="text"
            inputMode="decimal"
            value={value}
            onChange={e => setValue(e.target.value)}
            onBlur={handleBlur}
            className={className}
        />
    );
};


const VitaminPremixPage: React.FC = () => {
    const [vitamins, setVitamins] = useState<Vitamin[]>(() => {
        const saved = localStorage.getItem('vitaminPremixData_v1');
        return saved ? JSON.parse(saved) : initialVitaminsData;
    });
    const [premixInclusionRate, setPremixInclusionRate] = useState<number>(() => {
        const saved = localStorage.getItem('vitaminInclusionRate_v1');
        return saved ? JSON.parse(saved) : 2.5;
    });
    const [premixBatchSize, setPremixBatchSize] = useState<number>(() => {
        const saved = localStorage.getItem('vitaminBatchSize_v1');
        return saved ? JSON.parse(saved) : 100;
    });

    useEffect(() => {
        localStorage.setItem('vitaminPremixData_v1', JSON.stringify(vitamins));
    }, [vitamins]);

    useEffect(() => {
        localStorage.setItem('vitaminInclusionRate_v1', JSON.stringify(premixInclusionRate));
    }, [premixInclusionRate]);

    useEffect(() => {
        localStorage.setItem('vitaminBatchSize_v1', JSON.stringify(premixBatchSize));
    }, [premixBatchSize]);
    
    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset all vitamin premix data to the application defaults?')) {
            localStorage.removeItem('vitaminPremixData_v1');
            localStorage.removeItem('vitaminInclusionRate_v1');
            localStorage.removeItem('vitaminBatchSize_v1');
            setVitamins(initialVitaminsData);
            setPremixInclusionRate(2.5);
            setPremixBatchSize(100);
        }
    };


    const handleVitaminChange = (id: string, field: keyof Vitamin, value: string) => {
        const numericValue = parseFloat(value);
        setVitamins(prev =>
            prev.map(v => {
                if (v.id === id) {
                    if (field === 'name' || field === 'unit') {
                        return { ...v, [field]: value };
                    }
                    return { ...v, [field]: isNaN(numericValue) || numericValue < 0 ? 0 : numericValue };
                }
                return v;
            })
        );
    };

    const calculations = useMemo(() => {
        const results = vitamins.map(vitamin => {
            const { requiredInFeed, processingLossPct, storageLossPct, purity, pricePerKg, unit } = vitamin;

            const totalRequiredLevelPerKgFeed = requiredInFeed / ((100 - (processingLossPct || 0)) / 100) / ((100 - (storageLossPct || 0)) / 100);
            const feedTreatedPerKgPremix = premixInclusionRate > 0 ? 1000 / premixInclusionRate : 0;
            const pureVitaminIn1kgPremix = totalRequiredLevelPerKgFeed * feedTreatedPerKgPremix;
            
            // Purity for IU vitamins is IU/g. For mg vitamins, it's mg/g.
            // To get product amount in kg, we need to convert everything to a consistent unit.
            // Let's use kg for weight and keep IU/mg for activity.
            // purity is in (IU or mg)/g. purityPerKgProduct is (IU or mg)/kg.
            const purityPerKgProduct = purity * 1000;
            
            const productPerKgPremix_kg = purityPerKgProduct > 0 ? pureVitaminIn1kgPremix / purityPerKgProduct : 0;
            const productAmountInBatch_kg = productPerKgPremix_kg * premixBatchSize;
            const costPerKgProduct = pricePerKg || 0;
            const productCostInBatch = productAmountInBatch_kg * costPerKgProduct;

            return {
                ...vitamin,
                productAmountInBatch_kg,
                productCostInBatch,
                purityUnit: `${unit}/g`,
                requiredUnit: `${unit}/kg feed`
            };
        });

        const totalProductWeight_kg = results.reduce((sum, r) => sum + r.productAmountInBatch_kg, 0);
        const carrierWeight_kg = premixBatchSize - totalProductWeight_kg;
        const totalCostForBatch = results.reduce((sum, r) => sum + r.productCostInBatch, 0);
        const costPerKgPremix = premixBatchSize > 0 && totalCostForBatch > 0 ? totalCostForBatch / premixBatchSize : 0;
        const costPerTonFeed = costPerKgPremix * premixInclusionRate;

        return {
            detailedResults: results,
            totalProductWeight_kg,
            carrierWeight_kg,
            totalCostForBatch,
            costPerKgPremix,
            costPerTonFeed,
        };
    }, [vitamins, premixInclusionRate, premixBatchSize]);


    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                    <h2 className="text-2xl font-bold text-gray-700">Vitamin Premix Formulation</h2>
                    <div className="flex items-center gap-2 no-print">
                        <button
                            onClick={() => window.print()}
                            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm"
                        >
                            Print Premix
                        </button>
                        <button
                            onClick={handleReset}
                            className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 transition-colors text-sm"
                        >
                            Reset Defaults
                        </button>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-4 bg-gray-50 rounded-lg border">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Premix Inclusion Rate (kg/ton)</label>
                         <EditableNumericCell
                            initialValue={premixInclusionRate}
                            onSave={value => setPremixInclusionRate(parseFloat(value) || 0)}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Premix Batch Size (kg)</label>
                        <EditableNumericCell
                            initialValue={premixBatchSize}
                            onSave={value => setPremixBatchSize(parseFloat(value) || 0)}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vitamin</th>
                                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase">Requirement</th>
                                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase">Purity</th>
                                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase">Processing Loss (%)</th>
                                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase">Storage Loss (%)</th>
                                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase">Product Price ($/kg)</th>
                                <th className="px-2 py-3 text-center text-xs font-bold text-blue-600 uppercase">Amount in Batch (g)</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {calculations.detailedResults.map(v => (
                                <tr key={v.id} className="hover:bg-gray-50">
                                    <td className="px-2 py-2 whitespace-nowrap font-medium">{v.name}</td>
                                    <td className="px-2 py-2">
                                        <div className="flex items-center">
                                            <EditableNumericCell initialValue={v.requiredInFeed} onSave={value => handleVitaminChange(v.id, 'requiredInFeed', value)} className="w-24 p-1 border rounded-md text-center" />
                                            <span className="text-xs text-gray-500 ml-1">{v.requiredUnit}</span>
                                        </div>
                                    </td>
                                     <td className="px-2 py-2">
                                         <Tooltip text={`Concentration of pure vitamin in the commercial product (${v.purityUnit})`}>
                                            <div className="flex items-center">
                                                <EditableNumericCell initialValue={v.purity} onSave={value => handleVitaminChange(v.id, 'purity', value)} className="w-24 p-1 border rounded-md text-center" />
                                                <span className="text-xs text-gray-500 ml-1">{v.purityUnit}</span>
                                            </div>
                                         </Tooltip>
                                    </td>
                                    <td className="px-2 py-2"><EditableNumericCell initialValue={v.processingLossPct} onSave={value => handleVitaminChange(v.id, 'processingLossPct', value)} className="w-20 p-1 border rounded-md text-center" /></td>
                                    <td className="px-2 py-2"><EditableNumericCell initialValue={v.storageLossPct} onSave={value => handleVitaminChange(v.id, 'storageLossPct', value)} className="w-20 p-1 border rounded-md text-center" /></td>
                                    <td className="px-2 py-2"><EditableNumericCell initialValue={v.pricePerKg} onSave={value => handleVitaminChange(v.id, 'pricePerKg', value)} className="w-20 p-1 border rounded-md text-center" /></td>
                                    <td className="px-2 py-2 text-center font-bold text-blue-800 bg-blue-50">{(v.productAmountInBatch_kg * 1000).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

             <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-xl font-bold text-gray-700 mb-4">Premix Formulation Summary ({premixBatchSize} kg Batch)</h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <span className="font-medium text-gray-600">Total Vitamin Product Weight:</span>
                        <span className="font-bold text-lg text-gray-800">{calculations.totalProductWeight_kg.toFixed(3)} kg</span>
                    </div>
                     <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <span className="font-medium text-gray-600">Carrier Weight (e.g., Limestone):</span>
                        <span className="font-bold text-lg text-gray-800">{calculations.carrierWeight_kg.toFixed(3)} kg</span>
                    </div>
                     <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <span className="font-medium text-gray-600">Total Cost for Batch:</span>
                        <span className="font-bold text-lg text-green-700">${calculations.totalCostForBatch.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <span className="font-medium text-gray-600">Cost per kg of Premix:</span>
                        <span className="font-bold text-lg text-green-700">${calculations.costPerKgPremix.toFixed(2)} / kg</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <span className="font-medium text-gray-600">Added Cost per Ton of Feed:</span>
                        <span className="font-bold text-lg text-blue-800">${calculations.costPerTonFeed.toFixed(2)} / ton feed</span>
                    </div>
                </div>
             </div>
        </div>
    );
};

export default VitaminPremixPage;