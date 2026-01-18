
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { Ingredient, FeedAnalysisResult, GrowthPhase, InclusionMode, RecommendationOverrides, PerformanceAnalysisReport } from './types';
import { Page } from './types';
import { calculateFeedAnalysis } from './services/calculationService';
import SelectionPage from './components/SelectionPage';
import InputPage from './components/InputPage';
import AnalysisPage from './components/AnalysisPage';
import VitaminPremixPage from './components/VitaminPremixPage';
import MineralPremixPage from './components/MineralPremixPage';
import PerformanceAnalysisPage from './components/PerformanceAnalysisPage';
import HowAnalysisWorksPage from './components/HowAnalysisWorksPage';
import InterpretResultsPage from './components/InterpretResultsPage';
import Header from './components/Header';
import Footer from './components/Footer';
import InclusionConfirmationModal from './components/InclusionConfirmationModal';
import SplashScreen from './components/SplashScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { initialIngredients, ANALYSIS_RESULTS, NUTRIENT_UNITS } from './constants';

const defaultNutrientVisibility = Object.keys(ANALYSIS_RESULTS).reduce((acc, key) => {
  acc[key] = true;
  return acc;
}, {} as Record<string, boolean>);

const defaultNutrientUnits = Object.keys(NUTRIENT_UNITS).reduce((acc, key) => {
  acc[key] = NUTRIENT_UNITS[key].baseUnit;
  return acc;
}, {} as Record<string, string>);


const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>(Page.SELECTION);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<FeedAnalysisResult>(() => calculateFeedAnalysis([]));
  const [animationClass, setAnimationClass] = useState('fade-in');
  const [isNormalizationModalOpen, setIsNormalizationModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [performanceAnalysisReport, setPerformanceAnalysisReport] = useState<PerformanceAnalysisReport | null>(null);
  
  // Load settings from localStorage with defaults
  const [growthPhase, setGrowthPhase] = useState<GrowthPhase>(() => {
    const saved = localStorage.getItem('growthPhase');
    return (saved as GrowthPhase) || 'Starter';
  });
  
  const [inclusionMode, setInclusionMode] = useState<InclusionMode>(() => {
    const saved = localStorage.getItem('inclusionMode');
    return (saved as InclusionMode) || 'percent';
  });

  const [masterIngredients, setMasterIngredients] = useState<Ingredient[]>(() => {
    const saved = localStorage.getItem('masterIngredients_v2');
    return saved ? JSON.parse(saved) : initialIngredients;
  });
  
  const [recommendationOverrides, setRecommendationOverrides] = useState<RecommendationOverrides>(() => {
    const saved = localStorage.getItem('recommendationOverrides');
    return saved ? JSON.parse(saved) : {};
  });

  const [nutrientVisibility, setNutrientVisibility] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('nutrientVisibility');
    return saved ? JSON.parse(saved) : defaultNutrientVisibility;
  });

  const [nutrientUnits, setNutrientUnits] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('nutrientUnits');
    return saved ? JSON.parse(saved) : defaultNutrientUnits;
  });
  
  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('masterIngredients_v2', JSON.stringify(masterIngredients));
  }, [masterIngredients]);

  useEffect(() => {
    localStorage.setItem('growthPhase', growthPhase);
  }, [growthPhase]);

  useEffect(() => {
    localStorage.setItem('inclusionMode', inclusionMode);
  }, [inclusionMode]);

  useEffect(() => {
    localStorage.setItem('recommendationOverrides', JSON.stringify(recommendationOverrides));
  }, [recommendationOverrides]);

  useEffect(() => {
    localStorage.setItem('nutrientVisibility', JSON.stringify(nutrientVisibility));
  }, [nutrientVisibility]);

  useEffect(() => {
    localStorage.setItem('nutrientUnits', JSON.stringify(nutrientUnits));
  }, [nutrientUnits]);


  useEffect(() => {
    setIsLoadingAnalysis(true);
    const timer = setTimeout(() => {
        setAnalysisResult(calculateFeedAnalysis(ingredients));
        setIsLoadingAnalysis(false);
    }, 50);

    return () => clearTimeout(timer);
  }, [ingredients]);

  const handleNavigate = useCallback((page: Page) => {
    setAnimationClass('fade-out');
    setTimeout(() => {
      setCurrentPage(page);
      setAnimationClass('fade-in');
    }, 300);
  }, []);

  const handleGoHome = useCallback(() => {
    setShowSplash(true);
  }, []);
  
  const handleResetError = useCallback(() => {
    handleNavigate(Page.SELECTION);
  }, [handleNavigate]);

  const handleProceed = useCallback((selectedIds: number[]) => {
    const selectedIngredients = masterIngredients
      .filter(ing => selectedIds.includes(ing.id))
      .map(ing => ({ ...ing, Inclusion_pct: ing.Inclusion_pct || 0 }));

    const currentIngredientsMap = new Map(ingredients.map(i => [i.id, i]));
    const newIngredients = selectedIngredients.map(s => currentIngredientsMap.get(s.id) || s);

    setIngredients(newIngredients);
    handleNavigate(Page.INPUT);
  }, [masterIngredients, ingredients, handleNavigate]);

  const handleAddMasterIngredient = useCallback((ingredient: Ingredient) => {
    setMasterIngredients(prev => [...prev, ingredient]);
  }, []);

  const handleUpdateMasterIngredient = useCallback((updatedIngredient: Ingredient) => {
    setMasterIngredients(prev => prev.map(ing => ing.id === updatedIngredient.id ? updatedIngredient : ing));
  }, []);

  const handleResetMasterIngredients = useCallback(() => {
    setMasterIngredients(initialIngredients);
  }, []);

  const handleMergeMasterIngredients = useCallback((newIngredients: Ingredient[]) => {
    setMasterIngredients(prev => {
        const existingMap = new Map(prev.map(i => [i.Name.toLowerCase(), i]));
        // FIX: Removed explicit type annotation on `newIng` to allow TypeScript to correctly infer its type from the `newIngredients` array, resolving the spread operator error.
        newIngredients.forEach(newIng => {
            const existing = existingMap.get(newIng.Name.toLowerCase());
            if (existing) {
                const updatedIngredient = { ...existing, ...newIng, id: existing.id }; // Preserve original ID
                existingMap.set(newIng.Name.toLowerCase(), updatedIngredient);
            } else {
                const newIngredient = { ...newIng, id: Date.now() + Math.random() };
                existingMap.set(newIng.Name.toLowerCase(), newIngredient);
            }
        });
        return Array.from(existingMap.values());
    });
  }, []);

  const handleUpdateIngredient = useCallback((index: number, field: keyof Ingredient, value: string | number) => {
    setIngredients(prev => {
        const newIngredients = [...prev];
        const ingredientToUpdate = { ...newIngredients[index] };
        if (typeof value === 'string' && !['Name', 'description', 'category'].includes(field)) {
            (ingredientToUpdate as any)[field] = parseFloat(value) || 0;
        } else {
            (ingredientToUpdate as any)[field] = value;
        }
        newIngredients[index] = ingredientToUpdate;
        return newIngredients;
    });
  }, []);
  
  const handleAddIngredient = useCallback(() => {
    const newIngredient: Ingredient = {
      id: Date.now(),
      Name: 'New Ingredient',
      description: '',
      category: 'Other',
      Inclusion_pct: 0, CP_pct: 0, ME_kcal_per_kg: 0, Ca_pct: 0, avP_pct: 0, phytateP_pct: 0, Na_pct: 0, K_pct: 0, Cl_pct: 0, Lys_pct: 0, TSAA_pct: 0, Thr_pct: 0, Val_pct: 0, Ile_pct: 0, Leu_pct: 0, Arg_pct: 0, Try_pct: 0, Starch_pct: 0, CF_pct: 0, NDF_pct: 0, ADF_pct: 0, Ash_pct: 0, Choline_mg_per_kg: 0, Price_USD_per_ton: 0,
    };
    setIngredients(prev => [...prev, newIngredient]);
  }, []);

  const handleDeleteIngredient = useCallback((id: number) => {
    setIngredients(prev => prev.filter(ing => ing.id !== id));
  }, []);
  
  const runActionWithNormalizationCheck = useCallback((action: () => void) => {
      const total = analysisResult.totalInclusion;
      if (Math.abs(100 - total) > 0.01 && total > 0) {
          setIsNormalizationModalOpen(true);
          setPendingAction(() => action);
      } else {
          action();
      }
  }, [analysisResult.totalInclusion]);

  const handleNormalizeAndProceed = useCallback(() => {
    if (pendingAction) {
        const total = analysisResult.totalInclusion;
        if (total > 0) {
            const factor = 100 / total;
            const normalizedIngredients = ingredients.map(ing => ({
                ...ing,
                Inclusion_pct: ing.Inclusion_pct * factor,
            }));
            setIngredients(normalizedIngredients);
            
            // Execute the original action after state has had a chance to update
            // Using a timeout to allow re-calculation to happen based on new ingredients
            setTimeout(() => pendingAction(), 100); 

        } else {
            pendingAction();
        }
    }
    setIsNormalizationModalOpen(false);
    setPendingAction(null);
  }, [pendingAction, analysisResult.totalInclusion, ingredients]);
  
  const handleProceedAnyway = useCallback(() => {
      if (pendingAction) {
          pendingAction();
      }
      setIsNormalizationModalOpen(false);
      setPendingAction(null);
  }, [pendingAction]);

  const handleUpdateOverride = useCallback((key: string, values: { min: number; max: number } | null) => {
    setRecommendationOverrides(prev => {
        const newOverrides = { ...prev };
        if (values === null) {
            delete newOverrides[key];
        } else {
            newOverrides[key] = values;
        }
        return newOverrides;
    });
  }, []);

  const handleResetAllOverrides = useCallback(() => {
    setRecommendationOverrides({});
  }, []);

  const handleUpdateNutrientVisibility = useCallback((newVisibility: Record<string, boolean>) => {
    setNutrientVisibility(newVisibility);
  }, []);

  const handleUpdateNutrientUnit = useCallback((key: string, unit: string) => {
    setNutrientUnits(prev => ({ ...prev, [key]: unit }));
  }, []);


  const renderPage = () => {
    switch (currentPage) {
      case Page.SELECTION:
        return <SelectionPage
          masterIngredients={masterIngredients}
          recipeIngredients={ingredients}
          onProceed={handleProceed}
          onAddMasterIngredient={handleAddMasterIngredient}
          onUpdateMasterIngredient={handleUpdateMasterIngredient}
          onResetMasterIngredients={handleResetMasterIngredients}
          onMergeMasterIngredients={handleMergeMasterIngredients}
        />;
      case Page.INPUT:
        return <InputPage
          ingredients={ingredients}
          setIngredients={setIngredients}
          onUpdateIngredient={handleUpdateIngredient}
          onAddIngredient={handleAddIngredient}
          onDeleteIngredient={handleDeleteIngredient}
          totalInclusion={analysisResult.totalInclusion}
          inclusionMode={inclusionMode}
          setInclusionMode={setInclusionMode}
          runActionWithNormalizationCheck={runActionWithNormalizationCheck}
        />;
      case Page.ANALYSIS:
        return <AnalysisPage
          results={analysisResult}
          growthPhase={growthPhase}
          setGrowthPhase={setGrowthPhase}
          recommendationOverrides={recommendationOverrides}
          onUpdateOverride={handleUpdateOverride}
          onResetAllOverrides={handleResetAllOverrides}
          nutrientVisibility={nutrientVisibility}
          onUpdateNutrientVisibility={handleUpdateNutrientVisibility}
          nutrientUnits={nutrientUnits}
          onUpdateNutrientUnit={handleUpdateNutrientUnit}
        />;
      case Page.VITAMIN_PREMIX:
        return <VitaminPremixPage />;
      case Page.MINERAL_PREMIX:
        return <MineralPremixPage />;
      case Page.PERFORMANCE_ANALYSIS:
        return <PerformanceAnalysisPage
                  analysisResult={analysisResult} 
                  report={performanceAnalysisReport}
                  setReport={setPerformanceAnalysisReport}
               />;
      case Page.HOW_ANALYSIS_WORKS:
        return <HowAnalysisWorksPage />;
      case Page.INTERPRET_RESULTS:
        return <InterpretResultsPage />;
      default:
        return <p>Page not found</p>;
    }
  };

  if (showSplash) {
    return <SplashScreen onStart={() => setShowSplash(false)} />;
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col font-sans">
      <Header 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
        onGoHome={handleGoHome}
      />
      <main className={`container mx-auto p-4 sm:p-6 lg:p-8 flex-grow transition-opacity duration-300 ${animationClass}`}>
        <ErrorBoundary onReset={handleResetError}>
          {renderPage()}
        </ErrorBoundary>
      </main>
      <Footer />
      <InclusionConfirmationModal
        isOpen={isNormalizationModalOpen}
        onClose={() => {
          setIsNormalizationModalOpen(false);
          setPendingAction(null);
        }}
        onNormalizeAndProceed={handleNormalizeAndProceed}
        onProceedAnyway={handleProceedAnyway}
        totalInclusion={analysisResult.totalInclusion}
      />
    </div>
  );
};

export default App;
