import React, { useState, useMemo, useRef, useEffect } from 'react';
import { initialMineralsData } from '../constants';
import type { Mineral, MineralSource } from '../types';

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


const MineralPremixPage: React.FC = () => {
    const [minerals, setMinerals] = useState<Mineral[]>(() => {
        const saved = localStorage.getItem('mineralPremixData_v1');
        return saved ? JSON.parse(saved) : initialMineralsData;
    });
    const [premixInclusionRate, setPremixInclusionRate] = useState<number>(() => {
        const saved = localStorage.getItem('mineralInclusionRate_v1');
        return saved ? JSON.parse(saved) : 2.5;
    });
    const [premixBatchSize, setPremixBatchSize] = useState<number>(() => {
        const saved = localStorage.getItem('mineralBatchSize_v1');
        return saved ? JSON.parse(saved) : 100;
    });

    useEffect(() => {
        localStorage.setItem('mineralPremixData_v1', JSON.stringify(minerals));
    }, [minerals]);

    useEffect(() => {
        localStorage.setItem('mineralInclusionRate_v1', JSON.stringify(premixInclusionRate));
    }, [premixInclusionRate]);

    useEffect(() => {
        localStorage.setItem('mineralBatchSize_v1', JSON.stringify(premixBatchSize));
    }, [premixBatchSize]);
    
    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset all mineral premix data to the application defaults?')) {
            localStorage.removeItem('mineralPremixData_v1');
            localStorage.removeItem('mineralInclusionRate_v1');
            localStorage.removeItem('mineralBatchSize_v1');
            setMinerals(initialMineralsData);
            setPremixInclusionRate(2.5);
            setPremixBatchSize(100);
        }
    };

    const handleMineralChange = (id: string, field: 'requiredInFeed_mg_per_kg' | 'selectedSourceIndex', value: string) => {
        setMinerals(prev =>
            prev.map(m => {
                if (m.id === id) {
                    if (field === 'selectedSourceIndex') {
                        const numericValue = parseInt(value, 10);
                        return { ...m, [field]: isNaN(numericValue) || numericValue < 0 ? 0 : numericValue };
                    }
                    const numericValue = parseFloat(value);
                    return { ...m, [field]: isNaN(numericValue) || numericValue < 0 ? 0 : numericValue };
                }
                return m;
            })
        );
    };

    const handleSourceChange = (mineralId: string, sourceIndex: number, field: keyof MineralSource, value: string) => {
        setMinerals(prev =>
            prev.map(m => {
                if (m.id === mineralId) {
                    const newSources = [...m.sources];
                    const sourceToUpdate = { ...newSources[sourceIndex] };
                    
                    if (field === 'name') {
                        sourceToUpdate.name = value;
                    } else {
                        const numericValue = parseFloat(value);
                        (sourceToUpdate[field] as number) = isNaN(numericValue) || numericValue < 0 ? 0 : numericValue;
                    }

                    newSources[sourceIndex] = sourceToUpdate;
                    return { ...m, sources: newSources };
                }
                return m;
            })
        );
    };

    const calculations = useMemo(() => {
        const results = minerals.map(mineral => {
            const selectedSource = mineral.sources[mineral.selectedSourceIndex] || mineral.sources[0];
            const { requiredInFeed_mg_per_kg } = mineral;
            const { productConcentration_pct, pricePerKg } = selectedSource;
            
            const feedTreatedPerKgPremix = premixInclusionRate > 0 ? 1000 / premixInclusionRate : 0;
            const pureMineralIn1kgPremix_mg = requiredInFeed_mg_per_kg * feedTreatedPerKgPremix;
            const productPerKgPremix_mg = productConcentration_pct > 0 ? pureMineralIn1kgPremix_mg / (productConcentration_pct / 100) : 0;
            const productAmountInBatch_kg = (productPerKgPremix_mg / 1000000) * premixBatchSize;
            const costPerKgProduct = pricePerKg || 0;
            const productCostInBatch = productAmountInBatch_kg * costPerKgProduct;

            return {
                ...mineral,
                productAmountInBatch_kg,
                productCostInBatch,
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
    }, [minerals, premixInclusionRate, premixBatchSize]);


    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                    <h2 className="text-2xl font-bold text-gray-700">Mineral Premix Formulation</h2>
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
                                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mineral</th>
                                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase">Requirement (mg/kg feed)</th>
                                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase">Commercial Product</th>
                                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase">Element Conc. (%)</th>
                                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase">Product Price ($/kg)</th>
                                <th className="px-2 py-3 text-center text-xs font-bold text-blue-600 uppercase">Amount in Batch (g)</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {calculations.detailedResults.map(m => {
                                const selectedSource = m.sources[m.selectedSourceIndex];
                                return (
                                <tr key={m.id} className="hover:bg-gray-50">
                                    <td className="px-2 py-2 whitespace-nowrap font-medium">{m.name}</td>
                                    <td className="px-2 py-2"><EditableNumericCell initialValue={m.requiredInFeed_mg_per_kg} onSave={value => handleMineralChange(m.id, 'requiredInFeed_mg_per_kg', value)} className="w-28 p-1 border rounded-md text-center" /></td>
                                    <td className="px-2 py-2">
                                        <select 
                                            value={m.selectedSourceIndex} 
                                            onChange={e => handleMineralChange(m.id, 'selectedSourceIndex', e.target.value)}
                                            className="w-40 p-1 border rounded-md text-center bg-white"
                                        >
                                          {m.sources.map((source, index) => (
                                            <option key={index} value={index}>{source.name}</option>
                                          ))}
                                        </select>
                                    </td>
                                    <td className="px-2 py-2">
                                        <Tooltip text={`Percentage of the pure element in the commercial product`}>
                                            <EditableNumericCell initialValue={selectedSource.productConcentration_pct} onSave={value => handleSourceChange(m.id, m.selectedSourceIndex, 'productConcentration_pct', value)} className="w-24 p-1 border rounded-md text-center" />
                                        </Tooltip>
                                    </td>
                                    <td className="px-2 py-2"><EditableNumericCell initialValue={selectedSource.pricePerKg} onSave={value => handleSourceChange(m.id, m.selectedSourceIndex, 'pricePerKg', value)} className="w-24 p-1 border rounded-md text-center" /></td>
                                    <td className="px-2 py-2 text-center font-bold text-blue-800 bg-blue-50">{(m.productAmountInBatch_kg * 1000).toFixed(2)}</td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>

             <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-xl font-bold text-gray-700 mb-4">Premix Formulation Summary ({premixBatchSize} kg Batch)</h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <span className="font-medium text-gray-600">Total Mineral Product Weight:</span>
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

export default MineralPremixPage;