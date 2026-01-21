import React, { useState, useEffect } from 'react';
import type { Ingredient, IngredientCategory } from '../types';
import { COLUMN_HEADERS, CATEGORY_NAMES, initialIngredients } from '../constants';

interface IngredientEditModalProps {
  ingredient: Ingredient;
  onSave: (updatedIngredient: Ingredient) => void;
  onClose: () => void;
  isNew: boolean;
}

const allNutrientFields = Object.keys(COLUMN_HEADERS).filter(
    key => !['id', 'Name', 'description', 'category', 'Price_USD_per_ton', 'Inclusion_pct'].includes(key)
) as (keyof Ingredient)[];


const IngredientEditModal: React.FC<IngredientEditModalProps> = ({ ingredient, onSave, onClose, isNew }) => {
  const [formState, setFormState] = useState<Record<string, string>>({});

  useEffect(() => {
    const initialState: Record<string, string> = {};
     // Use a template to ensure all keys are present
    const template = initialIngredients[0]; 
    for (const key in template) {
        if (key !== 'matrix' && key !== 'id') {
            const ingredientValue = ingredient[key as keyof Ingredient];
            initialState[key] = ingredientValue !== undefined && ingredientValue !== null ? String(ingredientValue) : '';
        }
    }
    if (ingredient.matrix) {
        for (const key in ingredient.matrix) {
            initialState[key] = String(ingredient.matrix[key]);
        }
    }
    if (isNew) {
        initialState.category = 'Other';
    }
    setFormState(initialState);
  }, [ingredient, isNew]);

  const handleChange = (field: string, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const isEnzyme = formState.category === 'Enzymes';
    
    const baseData = {
      id: ingredient.id,
      Name: formState.Name || 'Unnamed Ingredient',
      description: formState.description || '',
      category: formState.category as IngredientCategory || 'Other',
      Price_USD_per_ton: parseFloat(formState.Price_USD_per_ton) || 0,
      Inclusion_pct: ingredient.Inclusion_pct, // Preserve inclusion percentage
    };

    let updatedIngredient: Ingredient;

    if (isEnzyme) {
      const matrix: Record<string, number> = {};
      allNutrientFields.forEach(field => {
        const value = parseFloat(formState[field]);
        if (!isNaN(value) && value !== 0) {
          matrix[field as string] = value;
        }
      });
      
      // Fix: Correctly construct the enzyme object by spreading baseData last to ensure the 'category' is set to 'Enzymes'.
      updatedIngredient = {
        ...initialIngredients[0],
        CP_pct: 0, ME_kcal_per_kg: 0, Ca_pct: 0, avP_pct: 0, phytateP_pct: 0, Na_pct: 0, K_pct: 0, Cl_pct: 0, Lys_pct: 0, TSAA_pct: 0, Thr_pct: 0, Val_pct: 0, Ile_pct: 0, Leu_pct: 0, Arg_pct: 0, Try_pct: 0, Starch_pct: 0, CF_pct: 0, NDF_pct: 0, ADF_pct: 0, Ash_pct: 0, Choline_mg_per_kg: 0,
        ...baseData,
        standard_dosage_g_per_ton: parseFloat(formState.standard_dosage_g_per_ton) || 100,
        matrix: matrix,
      };

    } else {
      const nutrientData: Partial<Ingredient> = {};
      allNutrientFields.forEach(field => {
        (nutrientData as any)[field] = parseFloat(formState[field]) || 0;
      });
      updatedIngredient = {
        ...initialIngredients[0], // Use a template to ensure all fields are present
        ...baseData,
        ...nutrientData,
        standard_dosage_g_per_ton: undefined,
        matrix: undefined,
      };
    }
    onSave(updatedIngredient);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 no-print" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-6 m-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-2xl font-bold text-gray-800">{isNew ? 'Add New Ingredient' : `Edit: ${ingredient.Name}`}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl">&times;</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">{COLUMN_HEADERS['Name']}</label>
                <input
                    type="text"
                    value={formState.Name || ''}
                    onChange={(e) => handleChange('Name', e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                />
            </div>
            <div>
                 <label className="block text-sm font-medium text-gray-700">{COLUMN_HEADERS['category']}</label>
                 <select
                    value={formState.category || 'Other'}
                    onChange={(e) => handleChange('category', e.target.value)}
                    disabled={!isNew}
                    className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 bg-white ${!isNew ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                 >
                    {Object.entries(CATEGORY_NAMES).map(([key, value]) => (
                        <option key={key} value={key}>{value}</option>
                    ))}
                 </select>
                 {!isNew && <p className="text-xs text-gray-500 mt-1">Category cannot be changed for existing ingredients.</p>}
            </div>
             <div>
                 <label className="block text-sm font-medium text-gray-700">{COLUMN_HEADERS['Price_USD_per_ton']}</label>
                 <input
                    type="text"
                    inputMode="decimal"
                    value={formState.Price_USD_per_ton || ''}
                    onChange={(e) => handleChange('Price_USD_per_ton', e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                />
            </div>
        </div>
        
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{COLUMN_HEADERS['description']}</label>
            <textarea
                value={formState.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={2}
                placeholder="Add notes or a description for the ingredient here..."
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
            />
        </div>

        <div className="border-t my-4"></div>

        {formState.category === 'Enzymes' ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-4">
                <div>
                     <label className="block text-sm font-medium text-gray-700">Standard Dosage (g/ton)</label>
                     <input
                        type="text"
                        inputMode="decimal"
                        value={formState.standard_dosage_g_per_ton || ''}
                        onChange={(e) => handleChange('standard_dosage_g_per_ton', e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>
            </div>
            <p className="text-sm text-gray-600 mb-4 bg-gray-100 p-3 rounded-md">
              <b>Nutrient Release Matrix:</b> Enter the nutrient values this enzyme releases in the final feed at its <b>standard dosage</b>. The enzyme's own nutrient content is assumed to be zero.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                {allNutrientFields.map(field => (
                     <div key={field}>
                         <label className="block text-sm font-medium text-gray-700">{COLUMN_HEADERS[field]}</label>
                         <input
                            type="text"
                            inputMode="decimal"
                            value={formState[field] || ''}
                            onChange={(e) => handleChange(field, e.target.value)}
                            placeholder="0.00"
                            className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 transition-colors ${
                                parseFloat(formState[field]) > 0 ? 'bg-teal-50 border-teal-400' : 'border-gray-300'
                            }`}
                        />
                     </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
              {allNutrientFields.map(field => (
                   <div key={field}>
                       <label className="block text-sm font-medium text-gray-700">{COLUMN_HEADERS[field]}</label>
                       <input
                          type="text"
                          inputMode="decimal"
                          value={formState[field] || ''}
                          onChange={(e) => handleChange(field, e.target.value)}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                      />
                   </div>
              ))}
          </div>
        )}

        <div className="mt-6 pt-4 border-t flex justify-end space-x-3">
          <button onClick={onClose} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-300">
            Cancel
          </button>
          <button onClick={handleSave} className="bg-teal-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-teal-700">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default IngredientEditModal;