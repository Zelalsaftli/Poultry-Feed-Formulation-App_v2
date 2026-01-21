import React, { useState, useMemo } from 'react';
import type { Ingredient } from '../types';
import { COLUMN_HEADERS } from '../constants';
import IngredientEditModal from './IngredientEditModal';

interface EnzymeManagerPageProps {
  masterIngredients: Ingredient[];
  onAddMasterIngredient: (ingredient: Ingredient) => void;
  onUpdateMasterIngredient: (ingredient: Ingredient) => void;
}

const EnzymeManagerPage: React.FC<EnzymeManagerPageProps> = ({
  masterIngredients,
  onAddMasterIngredient,
  onUpdateMasterIngredient,
}) => {
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);

  const enzymes = useMemo(
    () => masterIngredients.filter(ing => ing.category === 'Enzymes').sort((a,b) => a.Name.localeCompare(b.Name)),
    [masterIngredients]
  );

  const handleAddNewEnzyme = () => {
    const newEnzyme: Ingredient = {
      id: Date.now(),
      Name: 'New Enzyme',
      description: '',
      category: 'Enzymes',
      standard_dosage_g_per_ton: 100,
      matrix: {},
      Inclusion_pct: 0, CP_pct: 0, ME_kcal_per_kg: 0, Ca_pct: 0, avP_pct: 0, phytateP_pct: 0, Na_pct: 0, K_pct: 0, Cl_pct: 0, Lys_pct: 0, TSAA_pct: 0, Thr_pct: 0, Val_pct: 0, Ile_pct: 0, Leu_pct: 0, Arg_pct: 0, Try_pct: 0, Starch_pct: 0, CF_pct: 0, NDF_pct: 0, ADF_pct: 0, Ash_pct: 0, Choline_mg_per_kg: 0, Price_USD_per_ton: 0,
    };
    setEditingIngredient(newEnzyme);
  };
  
  const handleSaveIngredient = (updatedIngredient: Ingredient) => {
    const isExisting = masterIngredients.some(ing => ing.id === updatedIngredient.id);
    if (isExisting) {
      onUpdateMasterIngredient(updatedIngredient);
    } else {
      onAddMasterIngredient(updatedIngredient);
    }
    setEditingIngredient(null);
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
          <div className="flex-grow">
            <h2 className="text-2xl font-bold text-gray-700">Enzyme Manager</h2>
            <p className="text-gray-600 mt-1">
              Manage the enzymes available in your ingredient database. Define their standard dosage and nutrient release matrix.
            </p>
          </div>
          <button
            onClick={handleAddNewEnzyme}
            className="bg-teal-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-teal-700 transition-colors"
          >
            Add New Enzyme
          </button>
        </div>
        
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enzyme Name</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Standard Dosage (g/ton)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nutrient Release Matrix</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enzymes.map(enzyme => (
                <tr key={enzyme.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{enzyme.Name}</div>
                    <div className="text-sm text-gray-500">{enzyme.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">{enzyme.standard_dosage_g_per_ton}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {enzyme.matrix && Object.keys(enzyme.matrix).length > 0 ? (
                      <ul className="list-disc list-inside space-y-1">
                        {Object.entries(enzyme.matrix).map(([key, value]) => (
                          <li key={key}>
                            <span className="font-semibold">{COLUMN_HEADERS[key as keyof typeof COLUMN_HEADERS] || key}:</span> +{value}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-400">Not defined</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button
                      onClick={() => setEditingIngredient(enzyme)}
                      className="text-teal-600 hover:text-teal-900 font-semibold py-1 px-3 rounded-md hover:bg-teal-100 transition-colors"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
               {enzymes.length === 0 && (
                <tr>
                    <td colSpan={4} className="text-center py-12 text-gray-500">
                        No enzymes found. Add one to get started.
                    </td>
                </tr>
               )}
            </tbody>
          </table>
        </div>
      </div>

      {editingIngredient && (
        <IngredientEditModal
          ingredient={editingIngredient}
          isNew={!masterIngredients.some(i => i.id === editingIngredient.id)}
          onSave={handleSaveIngredient}
          onClose={() => setEditingIngredient(null)}
        />
      )}
    </>
  );
};

export default EnzymeManagerPage;