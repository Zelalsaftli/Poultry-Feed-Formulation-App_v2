import type { Ingredient, FeedAnalysisResult } from '../types';

const sumProduct = (inclusions: number[], values: number[]): number => {
  return inclusions.reduce((acc, inclusion, i) => acc + (inclusion * (values[i] || 0)), 0);
};

export const calculateFeedAnalysis = (ingredients: Ingredient[]): FeedAnalysisResult => {
  const emptyResult: FeedAnalysisResult = { 
    totalInclusion: 0,
    totalCostPerTon: 0,
    totalCostPer100kg: 0,
    nutrients: {},
    ingredients: [],
    enzymeContributions: {},
  };

  if (!ingredients || ingredients.length === 0) {
    return emptyResult;
  }

  const totalInclusion = ingredients.reduce((sum, ing) => sum + ing.Inclusion_pct, 0);

  if (totalInclusion <= 0) {
    return { ...emptyResult, ingredients: ingredients };
  }
  
  const nonEnzymeIngredients = ingredients.filter(ing => ing.category !== 'Enzymes');
  const enzymeIngredients = ingredients.filter(ing => ing.category === 'Enzymes');
  
  const nonEnzymeTotalInclusion = nonEnzymeIngredients.reduce((sum, ing) => sum + ing.Inclusion_pct, 0);

  const nutrientKeys = Object.keys(ingredients[0] || {}).filter(
    key => !['id', 'Name', 'Inclusion_pct', 'Price_USD_per_ton', 'category', 'description', 'standard_dosage_g_per_ton', 'matrix'].includes(key)
  );

  // Step 1: Calculate base nutrient profile from non-enzyme ingredients only
  const baseResults: Record<string, number> = {};
  if (nonEnzymeTotalInclusion > 0) {
    nutrientKeys.forEach(key => {
      const values = nonEnzymeIngredients.map(ing => ((ing as any)[key] as number) || 0);
      const inclusions = nonEnzymeIngredients.map(ing => ing.Inclusion_pct);
      const totalNutrient = sumProduct(inclusions, values);
      baseResults[key] = totalNutrient / nonEnzymeTotalInclusion; // Weighted average of the base mix
    });
  } else {
    nutrientKeys.forEach(key => baseResults[key] = 0);
  }

  // Step 2: Calculate total nutrient uplift from all enzymes
  const enzymeUplifts: Record<string, number> = {};
  const enzymeContributionsForDisplay: FeedAnalysisResult['enzymeContributions'] = {};

  enzymeIngredients.forEach(ing => {
    if (ing.matrix && ing.standard_dosage_g_per_ton && ing.Inclusion_pct > 0) {
      // Inclusion_pct of 0.015% corresponds to 150 g/ton. 0.015 * 10000 = 150.
      const actual_dosage_g_per_ton = ing.Inclusion_pct * 10000;
      const dosage_ratio = Math.min(1, actual_dosage_g_per_ton / ing.standard_dosage_g_per_ton);
      
      const contributions: Record<string, number> = {};

      for (const key in ing.matrix) {
        const nutrientKey = key as keyof typeof ing.matrix;
        const releaseValue = ing.matrix[nutrientKey] || 0;
        const uplift = releaseValue * dosage_ratio;

        if (uplift !== 0) {
          enzymeUplifts[nutrientKey] = (enzymeUplifts[nutrientKey] || 0) + uplift;
          contributions[nutrientKey] = uplift;
        }
      }

      if (Object.keys(contributions).length > 0) {
        enzymeContributionsForDisplay[ing.id] = { name: ing.Name, contributions };
      }
    }
  });

  // Step 3: Combine base profile and enzyme uplifts
  const finalResults: Record<string, number> = {};
  const nonEnzymeRatio = nonEnzymeTotalInclusion / totalInclusion;

  nutrientKeys.forEach(key => {
    const baseValue = baseResults[key] || 0;
    const enzymeUplift = enzymeUplifts[key] || 0;
    // Scale the base mix nutrients by their proportion and add the direct enzyme uplift
    finalResults[key] = (baseValue * nonEnzymeRatio) + enzymeUplift;
  });

  // Calculate derived nutrients from the final results
  finalResults.MECP_Ratio = finalResults.CP_pct > 0 ? finalResults.ME_kcal_per_kg / finalResults.CP_pct : 0;
  finalResults.CaAvP_Ratio = finalResults.avP_pct > 0 ? finalResults.Ca_pct / finalResults.avP_pct : 0;
  finalResults.K_Cl_Na_Ratio = finalResults.Na_pct > 0 ? (finalResults.K_pct + finalResults.Cl_pct) / finalResults.Na_pct : 0;
  finalResults.dEB = 434.78 * finalResults.Na_pct + 256.4 * finalResults.K_pct - 281.69 * finalResults.Cl_pct;
  
  // Calculate final cost
  const totalCostValue = ingredients.reduce((acc, ing) => acc + (ing.Inclusion_pct * (ing.Price_USD_per_ton || 0)), 0);
  const totalCostPerTon = totalCostValue / totalInclusion;

  return {
    totalInclusion,
    totalCostPerTon,
    totalCostPer100kg: totalCostPerTon / 10,
    nutrients: finalResults,
    ingredients: ingredients,
    enzymeContributions: enzymeContributionsForDisplay,
  };
};