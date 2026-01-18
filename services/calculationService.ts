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

  const nutrientKeys = Object.keys(ingredients[0] || {}).filter(
    key => !['id', 'Name', 'Inclusion_pct', 'Price_USD_per_ton', 'category', 'description', 'standard_dosage_g_per_ton', 'matrix'].includes(key)
  );

  const results: Record<string, number> = {};
  const enzymeContributionsForDisplay: FeedAnalysisResult['enzymeContributions'] = {};

  // Create a temporary list of "effective" ingredients where enzyme matrix values,
  // scaled by dosage, are treated as the enzyme's intrinsic nutrient values.
  const effectiveIngredients = ingredients.map(ing => {
    if (ing.category === 'Enzymes' && ing.matrix && ing.standard_dosage_g_per_ton && ing.Inclusion_pct > 0) {
      const actual_dosage_g_per_ton = ing.Inclusion_pct * 10000;
      const dosage_ratio = Math.min(1, actual_dosage_g_per_ton / ing.standard_dosage_g_per_ton);
      
      const effectiveNutrients: Partial<Ingredient> = {};
      const contributions: Record<string, number> = {};

      for (const key in ing.matrix) {
        const nutrientKey = key as keyof typeof ing.matrix;
        const releaseValue = ing.matrix[nutrientKey] || 0;
        
        // This effective value is used in the weighted average calculation,
        // treating the enzyme like any other ingredient.
        const effectiveValue = releaseValue * dosage_ratio;
        (effectiveNutrients as any)[nutrientKey] = effectiveValue;

        // For display, calculate the final contribution this enzyme makes to the total mix value.
        const finalContribution = (ing.Inclusion_pct * effectiveValue) / totalInclusion;
        if (finalContribution > 1e-6) {
          contributions[nutrientKey] = finalContribution;
        }
      }
      if (Object.keys(contributions).length > 0) {
        enzymeContributionsForDisplay[ing.id] = { name: ing.Name, contributions };
      }
      return { ...ing, ...effectiveNutrients };
    }
    return ing;
  });

  // Perform a single weighted average calculation over all "effective" ingredients.
  nutrientKeys.forEach(key => {
    const values = effectiveIngredients.map(ing => ((ing as any)[key] as number) || 0);
    const inclusions = effectiveIngredients.map(ing => ing.Inclusion_pct);
    const totalNutrient = sumProduct(inclusions, values);
    results[key] = totalNutrient / totalInclusion;
  });

  // Calculate derived nutrients from the final averaged results.
  results.MECP_Ratio = results.CP_pct > 0 ? results.ME_kcal_per_kg / results.CP_pct : 0;
  results.CaAvP_Ratio = results.avP_pct > 0 ? results.Ca_pct / results.avP_pct : 0;
  results.K_Cl_Na_Ratio = results.Na_pct > 0 ? (results.K_pct + results.Cl_pct) / results.Na_pct : 0;
  results.dEB = 434.78 * results.Na_pct + 256.4 * results.K_pct - 281.69 * results.Cl_pct;
  
  // Calculate final cost, ensuring it's accurate for any total inclusion level.
  const totalCostValue = ingredients.reduce((acc, ing) => acc + (ing.Inclusion_pct * (ing.Price_USD_per_ton || 0)), 0);
  const totalCostPerTon = totalCostValue / totalInclusion;

  return {
    totalInclusion,
    totalCostPerTon,
    totalCostPer100kg: totalCostPerTon / 10,
    nutrients: results,
    ingredients: ingredients,
    enzymeContributions: enzymeContributionsForDisplay,
  };
};