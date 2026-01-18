import React, { useRef } from 'react';
import type { Ingredient, InclusionMode } from '../types';
import IngredientTable from './IngredientTable';
import { exportIngredientsToCSV, parseCSV } from '../services/csvService';

interface InputPageProps {
  ingredients: Ingredient[];
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  onUpdateIngredient: (index: number, field: keyof Ingredient, value: string | number) => void;
  onAddIngredient: () => void;
  onDeleteIngredient: (id: number) => void;
  totalInclusion: number;
  inclusionMode: InclusionMode;
  setInclusionMode: (mode: InclusionMode) => void;
  runActionWithNormalizationCheck: (action: () => void) => void;
}

const InputPage: React.FC<InputPageProps> = ({ 
  ingredients, setIngredients, onUpdateIngredient, onAddIngredient, onDeleteIngredient, totalInclusion, inclusionMode, setInclusionMode, runActionWithNormalizationCheck
}) => {
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleNormalize = () => {
    if (totalInclusion === 0) return;
    const factor = 100 / totalInclusion;
    const newIngredients = ingredients.map(ing => ({
      ...ing,
      Inclusion_pct: ing.Inclusion_pct * factor,
    }));
    setIngredients(newIngredients);
  };

  const handleExportClick = () => {
    runActionWithNormalizationCheck(() => {
      exportIngredientsToCSV(ingredients, 'feed_formulation.csv');
    });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text) {
            const importedIngredients = parseCSV(text);
            if (importedIngredients.length > 0) {
                if (window.confirm(`Found ${importedIngredients.length} ingredients. This will replace the current ingredients in your feed. Proceed?`)) {
                   setIngredients(importedIngredients);
                }
            }
        }
    };
    reader.readAsText(file, 'UTF-8');
    // Reset file input value to allow re-uploading the same file
    if(event.target) {
        event.target.value = ''; 
    }
  };
  
  const totalValue = inclusionMode === 'percent' ? totalInclusion : totalInclusion * 10;
  const target = inclusionMode === 'percent' ? 100 : 1000;
  const unit = inclusionMode === 'percent' ? '%' : ' kg';
  const tolerance = inclusionMode === 'percent' ? 0.1 : 1;
  
  return (
    <div className="space-y-6">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept=".csv" />
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
            <div className="flex items-center gap-4 flex-wrap">
                <h2 className="text-2xl font-bold text-gray-700">Edit Feed Ingredients</h2>
                <div className={`p-2 rounded-md font-bold text-lg ${
                Math.abs(target - totalValue) > tolerance ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                Total Inclusion: {totalValue.toFixed(2)}{unit}
                </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
                 <button
                    onClick={onAddIngredient}
                    className="bg-teal-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-teal-700 transition-colors shadow-sm"
                >
                    Add Ingredient
                </button>
                 <button
                    onClick={handleNormalize}
                    className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                    title={`Adjust all ingredients to sum to ${target}${unit}`}
                >
                    Balance to {target}
                </button>
                <button
                    onClick={handleImportClick}
                    className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-purple-700 transition-colors shadow-sm"
                    title="Import ingredients from a CSV file"
                >
                    Import CSV
                </button>
                <button
                    onClick={handleExportClick}
                    className="bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 transition-colors shadow-sm"
                    title="Export current ingredients to a CSV file"
                >
                    Export CSV
                </button>
            </div>
        </div>
        
         <div className="mb-4 flex items-center justify-end">
          <span className="text-sm font-medium text-gray-700 mr-3">Input Unit:</span>
          <div className="relative flex w-40 items-center rounded-full bg-gray-200">
            {/* Sliding background */}
            <div
              className={`absolute top-0 left-0 h-full w-1/2 rounded-full bg-teal-600 shadow-md transition-transform duration-300 ease-in-out ${
                inclusionMode === 'percent' ? 'translate-x-0' : 'translate-x-full'
              }`}
            />
            {/* Buttons */}
            <button
              onClick={() => setInclusionMode('percent')}
              className={`relative z-10 flex-1 rounded-full py-2 text-center text-sm font-semibold transition-colors duration-300 ${
                inclusionMode === 'percent' ? 'text-white' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              %
            </button>
            <button
              onClick={() => setInclusionMode('kg_per_ton')}
              className={`relative z-10 flex-1 rounded-full py-2 text-center text-sm font-semibold transition-colors duration-300 ${
                inclusionMode === 'kg_per_ton' ? 'text-white' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              kg/ton
            </button>
          </div>
        </div>

        <IngredientTable
            ingredients={ingredients}
            onUpdateIngredient={onUpdateIngredient}
            onDeleteIngredient={onDeleteIngredient}
            inclusionMode={inclusionMode}
            totalInclusion={totalInclusion}
        />

      </div>
    </div>
  );
};

export default InputPage;