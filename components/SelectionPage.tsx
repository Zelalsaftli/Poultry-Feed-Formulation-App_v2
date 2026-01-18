import React, { useState, useMemo, useRef } from 'react';
import type { Ingredient, IngredientCategory } from '../types';
import { CATEGORY_NAMES } from '../constants';
import IngredientEditModal from './IngredientEditModal';
import ConfirmationModal from './ConfirmationModal';
import { exportIngredientsToCSV, parseCSV } from '../services/csvService';


interface SelectionPageProps {
  masterIngredients: Ingredient[];
  recipeIngredients: Ingredient[];
  onProceed: (selectedIngredientIds: number[]) => void;
  onAddMasterIngredient: (ingredient: Ingredient) => void;
  onUpdateMasterIngredient: (ingredient: Ingredient) => void;
  onResetMasterIngredients: () => void;
  onMergeMasterIngredients: (ingredients: Ingredient[]) => void;
}

const SelectionPage: React.FC<SelectionPageProps> = ({ 
    masterIngredients, 
    recipeIngredients, 
    onProceed, 
    onAddMasterIngredient,
    onUpdateMasterIngredient, 
    onResetMasterIngredients,
    onMergeMasterIngredients,
}) => {
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<Set<number>>(() => 
    new Set(recipeIngredients.map(i => i.id))
  );
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [activeFilter, setActiveFilter] = useState<IngredientCategory | 'all'>('all');
  const [confirmation, setConfirmation] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);
  
  const premixFileInputRef = useRef<HTMLInputElement>(null);

  const groupedIngredients = useMemo(() => {
    return masterIngredients.reduce((acc, ingredient) => {
      const category = ingredient.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(ingredient);
      return acc;
    }, {} as Record<IngredientCategory, Ingredient[]>);
  }, [masterIngredients]);

  const [expandedCategories, setExpandedCategories] = useState<Set<IngredientCategory>>(() => {
    return new Set(Object.keys(groupedIngredients) as IngredientCategory[]);
  });

  const displayedCategories = useMemo(() => {
    const all = Object.keys(groupedIngredients).sort() as IngredientCategory[];
    if (activeFilter === 'all') {
      return all;
    }
    return all.filter(c => c === activeFilter);
  }, [activeFilter, groupedIngredients]);

  const handleFilterChange = (category: IngredientCategory | 'all') => {
    if (category === 'all') {
        setActiveFilter('all');
    } else {
        setActiveFilter(prev => (prev === category ? 'all' : category));
    }
  };

  const toggleCategory = (category: IngredientCategory) => {
    setExpandedCategories(prev => {
        const newSet = new Set(prev);
        if (newSet.has(category)) {
            newSet.delete(category);
        } else {
            newSet.add(category);
        }
        return newSet;
    });
  };

  const handleToggleIngredient = (id: number) => {
    setSelectedIngredientIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectCategory = (category: IngredientCategory, select: boolean) => {
    const categoryIds = groupedIngredients[category]?.map(ing => ing.id) || [];
    setSelectedIngredientIds(prev => {
      const newSet = new Set(prev);
      if (select) {
        categoryIds.forEach(id => newSet.add(id));
      } else {
        categoryIds.forEach(id => newSet.delete(id));
      }
      return newSet;
    });
  };
  
  const handleAddNewIngredient = () => {
    const newIngredient: Ingredient = {
      id: Date.now(),
      Name: 'New Ingredient',
      description: '',
      category: 'Other',
      Inclusion_pct: 0, CP_pct: 0, ME_kcal_per_kg: 0, Ca_pct: 0, avP_pct: 0, phytateP_pct: 0, Na_pct: 0, K_pct: 0, Cl_pct: 0, Lys_pct: 0, TSAA_pct: 0, Thr_pct: 0, Val_pct: 0, Ile_pct: 0, Leu_pct: 0, Arg_pct: 0, Try_pct: 0, Starch_pct: 0, CF_pct: 0, NDF_pct: 0, ADF_pct: 0, Ash_pct: 0, Choline_mg_per_kg: 0, Price_USD_per_ton: 0,
    };
    setEditingIngredient(newIngredient);
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

  const handleRequestResetIngredients = () => {
    setConfirmation({
      isOpen: true,
      title: 'Reset to Default Ingredients',
      message: 'Are you sure you want to restore the default ingredient list, including enzymes? All custom modifications will be lost.',
      onConfirm: onResetMasterIngredients
    });
  };
  
  const PREMIX_CATEGORIES: IngredientCategory[] = ['Other', 'MineralSupplements', 'AminoAcids', 'Medicated'];

  const handleExportPremix = () => {
      const premixIngredients = masterIngredients.filter(ing => PREMIX_CATEGORIES.includes(ing.category));
      if (premixIngredients.length === 0) {
          alert('No premix ingredients to export. Premix ingredients belong to the categories: Other Additives, Mineral Supplements, Amino Acids, and Medicated Additives.');
          return;
      }
      exportIngredientsToCSV(premixIngredients, 'premix_export.csv');
  };

  const handleImportPremixClick = () => {
      premixFileInputRef.current?.click();
  };

  const handlePremixFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
          const text = e.target?.result as string;
          if (text) {
              const importedIngredients = parseCSV(text);
              if (importedIngredients.length > 0) {
                  if (window.confirm(`Found ${importedIngredients.length} ingredients. This will update existing ingredients and add new ones to your master list. Proceed?`)) {
                      onMergeMasterIngredients(importedIngredients);
                  }
              } else {
                  alert('No valid ingredients found in the file.');
              }
          }
      };
      reader.readAsText(file, 'UTF-8');
      if (event.target) {
          event.target.value = '';
      }
  };

  const closeConfirmation = () => {
    setConfirmation(null);
  };

  return (
    <>
      <input type="file" ref={premixFileInputRef} onChange={handlePremixFileChange} style={{ display: 'none' }} accept=".csv" />
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex flex-wrap justify-between items-center mb-2 gap-4">
             <h2 className="text-2xl font-bold text-gray-700">Select Feed Ingredients</h2>
             <div className="flex gap-2 flex-wrap">
                <button
                    onClick={handleAddNewIngredient}
                    className="bg-teal-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-teal-700 transition-colors text-sm"
                >
                    Add New Ingredient
                </button>
                <button
                    onClick={handleImportPremixClick}
                    className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 transition-colors text-sm"
                >
                    Import Premix
                </button>
                 <button
                    onClick={handleExportPremix}
                    className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 transition-colors text-sm"
                 >
                    Export Premix
                 </button>
                <button
                    onClick={handleRequestResetIngredients}
                    className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 transition-colors text-sm"
                >
                    Reset Database
                </button>
             </div>
          </div>
          <p className="text-gray-600 mb-6">Choose the ingredients to be included in the feed. Edit any ingredient's analysis by clicking on its name.</p>
          
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-700 mb-3">Filter by Category:</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleFilterChange('all')}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  activeFilter === 'all'
                    ? 'bg-teal-600 text-white shadow'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All
              </button>
              {(Object.keys(CATEGORY_NAMES) as IngredientCategory[]).map(categoryKey => (
                <button
                  key={categoryKey}
                  onClick={() => handleFilterChange(categoryKey)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                    activeFilter === categoryKey
                      ? 'bg-teal-600 text-white shadow'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {CATEGORY_NAMES[categoryKey]}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            {displayedCategories.map(category => (
              <div key={category} className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300">
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
                  aria-expanded={expandedCategories.has(category)}
                  aria-controls={`category-content-${category}`}
                >
                  <h3 className="text-xl font-semibold text-teal-700">{CATEGORY_NAMES[category]}</h3>
                  <div className="flex items-center">
                    <div className="flex space-x-2 text-sm ml-4">
                       <span onClick={(e) => { e.stopPropagation(); handleSelectCategory(category, true); }} className="font-medium text-teal-600 hover:text-teal-800 cursor-pointer p-1">Select All</span>
                       <span onClick={(e) => { e.stopPropagation(); handleSelectCategory(category, false); }} className="font-medium text-gray-500 hover:text-gray-700 cursor-pointer p-1">Deselect All</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-gray-500 transform transition-transform ${expandedCategories.has(category) ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                {expandedCategories.has(category) && (
                  <div id={`category-content-${category}`} className="p-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {groupedIngredients[category].map(ingredient => (
                        <label key={ingredient.id} className="flex items-center group cursor-pointer justify-between">
                          <div className="flex items-center" title={ingredient.description || ''}>
                            <input
                              type="checkbox"
                              checked={selectedIngredientIds.has(ingredient.id)}
                              onChange={() => handleToggleIngredient(ingredient.id)}
                              className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                            />
                            <span 
                              onClick={(e) => { e.stopPropagation(); setEditingIngredient(ingredient); }}
                              className="ml-3 text-sm font-medium text-gray-700 select-none hover:text-teal-600 hover:underline"
                            >
                              {ingredient.Name}
                            </span>
                            {ingredient.description && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            )}
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setEditingIngredient(ingredient); }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-teal-600"
                            title={`Edit ${ingredient.Name}`}
                          >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                               <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                               <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                             </svg>
                          </button>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 sticky bottom-4">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-gray-700">
              Selected <span className="text-teal-600 text-lg">{selectedIngredientIds.size}</span> ingredients
            </p>
            <button
              onClick={() => onProceed(Array.from(selectedIngredientIds))}
              className="bg-teal-600 text-white font-bold py-3 px-8 rounded-md hover:bg-teal-700 transition-colors shadow-lg text-lg disabled:bg-gray-400"
              disabled={selectedIngredientIds.size === 0}
            >
              Proceed to Formulation &rarr;
            </button>
          </div>
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

      {confirmation?.isOpen && (
        <ConfirmationModal
          isOpen={confirmation.isOpen}
          title={confirmation.title}
          message={confirmation.message}
          onConfirm={() => {
            confirmation.onConfirm();
            closeConfirmation();
          }}
          onClose={closeConfirmation}
        />
      )}
    </>
  );
};

export default SelectionPage;