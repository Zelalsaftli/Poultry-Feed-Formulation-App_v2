import type { Ingredient, RecommendationProfile, GrowthPhase, IngredientCategory, Vitamin, Mineral } from './types';

export const CATEGORY_NAMES: Record<IngredientCategory, string> = {
  Energy: 'Energy Sources',
  Protein: 'Protein Sources',
  AminoAcids: 'Amino Acids',
  MineralSupplements: 'Mineral Supplements',
  Medicated: 'Medicated Additives',
  Enzymes: 'Enzymes',
  Other: 'Other Additives',
};

export const CATEGORY_COLORS: Record<IngredientCategory, string> = {
  Energy: 'bg-amber-400',
  Protein: 'bg-sky-500',
  AminoAcids: 'bg-lime-500',
  MineralSupplements: 'bg-slate-400',
  Medicated: 'bg-rose-500',
  Enzymes: 'bg-cyan-500',
  Other: 'bg-violet-500',
};

// This must match the Ingredient type in types.ts
// FIX: Exclude new enzyme-related properties from COLUMN_HEADERS type to resolve type error.
export const COLUMN_HEADERS: Record<keyof Omit<Ingredient, 'id' | 'standard_dosage_g_per_ton' | 'matrix'>, string> = {
  Name: 'Name',
  description: 'Description',
  category: 'Category',
  Inclusion_pct: 'Inclusion %',
  CP_pct: 'Crude Protein %',
  ME_kcal_per_kg: 'ME (kcal/kg)',
  Ca_pct: 'Calcium %',
  avP_pct: 'Av. Phosphorus %',
  phytateP_pct: 'Phytate P %',
  Na_pct: 'Sodium %',
  K_pct: 'Potassium %',
  Cl_pct: 'Chlorine %',
  Lys_pct: 'Lysine %',
  TSAA_pct: 'Met+Cys %',
  Thr_pct: 'Threonine %',
  Val_pct: 'Valine %',
  Ile_pct: 'Isoleucine %',
  Leu_pct: 'Leucine %',
  Arg_pct: 'Arginine %',
  Try_pct: 'Tryptophan %',
  Starch_pct: 'Starch %',
  CF_pct: 'Crude Fiber %',
  NDF_pct: 'NDF %',
  ADF_pct: 'ADF %',
  Ash_pct: 'Ash %',
  Choline_mg_per_kg: 'Choline (mg/kg)',
  Price_USD_per_ton: 'Price ($/ton)',
};

export const ANALYSIS_RESULTS: Record<string, string> = {
  totalCostPerTon: 'Total Cost per Ton ($/ton)',
  totalCostPer100kg: 'Total Cost per 100kg ($/100kg)',
  'nutrients.CP_pct': 'Crude Protein %',
  'nutrients.ME_kcal_per_kg': 'ME (kcal/kg)',
  'nutrients.MECP_Ratio': 'ME/CP Ratio',
  'nutrients.Ca_pct': 'Calcium %',
  'nutrients.avP_pct': 'Av. Phosphorus %',
  'nutrients.phytateP_pct': 'Phytate P %',
  'nutrients.CaAvP_Ratio': 'Ca/Av.P Ratio',
  'nutrients.Na_pct': 'Sodium %',
  'nutrients.K_pct': 'Potassium %',
  'nutrients.Cl_pct': 'Chlorine %',
  'nutrients.K_Cl_Na_Ratio': '(K+Cl)/Na Ratio',
  'nutrients.dEB': 'dEB (mEq/kg)',
  'nutrients.Ash_pct': 'Ash %',
  'nutrients.Choline_mg_per_kg': 'Choline (mg/kg)',
  'nutrients.Lys_pct': 'Lysine %',
  'nutrients.TSAA_pct': 'Met+Cys %',
  'nutrients.Thr_pct': 'Threonine %',
  'nutrients.Val_pct': 'Valine %',
  'nutrients.Ile_pct': 'Isoleucine %',
  'nutrients.Leu_pct': 'Leucine %',
  'nutrients.Arg_pct': 'Arginine %',
  'nutrients.Try_pct': 'Tryptophan %',
  'nutrients.Starch_pct': 'Starch %',
  'nutrients.CF_pct': 'Crude Fiber %',
};

export const NUTRIENT_UNITS: Record<string, { baseUnit: string; units: Record<string, number> }> = {
  'totalCostPerTon': { baseUnit: '$/ton', units: { '$/ton': 1, '$/kg': 0.001 } },
  'totalCostPer100kg': { baseUnit: '$/100kg', units: { '$/100kg': 1, '$/kg': 0.01 } },
  'nutrients.CP_pct': { baseUnit: '%', units: { '%': 1, 'g/kg': 10 } },
  'nutrients.ME_kcal_per_kg': { baseUnit: 'kcal/kg', units: { 'kcal/kg': 1, 'MJ/kg': 1 / 239.006 } },
  'nutrients.MECP_Ratio': { baseUnit: '', units: { '': 1 } },
  'nutrients.Ca_pct': { baseUnit: '%', units: { '%': 1, 'g/kg': 10 } },
  'nutrients.avP_pct': { baseUnit: '%', units: { '%': 1, 'g/kg': 10 } },
  'nutrients.phytateP_pct': { baseUnit: '%', units: { '%': 1, 'g/kg': 10 } },
  'nutrients.CaAvP_Ratio': { baseUnit: '', units: { '': 1 } },
  'nutrients.Na_pct': { baseUnit: '%', units: { '%': 1, 'g/kg': 10, 'ppm': 10000 } },
  'nutrients.K_pct': { baseUnit: '%', units: { '%': 1, 'g/kg': 10, 'ppm': 10000 } },
  'nutrients.Cl_pct': { baseUnit: '%', units: { '%': 1, 'g/kg': 10, 'ppm': 10000 } },
  'nutrients.K_Cl_Na_Ratio': { baseUnit: '', units: { '': 1 } },
  'nutrients.dEB': { baseUnit: 'mEq/kg', units: { 'mEq/kg': 1 } },
  'nutrients.Ash_pct': { baseUnit: '%', units: { '%': 1, 'g/kg': 10 } },
  'nutrients.Choline_mg_per_kg': { baseUnit: 'mg/kg', units: { 'mg/kg': 1, 'g/kg': 0.001, '%': 0.0001, 'ppm': 1 } },
  'nutrients.Lys_pct': { baseUnit: '%', units: { '%': 1, 'g/kg': 10 } },
  'nutrients.TSAA_pct': { baseUnit: '%', units: { '%': 1, 'g/kg': 10 } },
  'nutrients.Thr_pct': { baseUnit: '%', units: { '%': 1, 'g/kg': 10 } },
  'nutrients.Val_pct': { baseUnit: '%', units: { '%': 1, 'g/kg': 10 } },
  'nutrients.Ile_pct': { baseUnit: '%', units: { '%': 1, 'g/kg': 10 } },
  'nutrients.Leu_pct': { baseUnit: '%', units: { '%': 1, 'g/kg': 10 } },
  'nutrients.Arg_pct': { baseUnit: '%', units: { '%': 1, 'g/kg': 10 } },
  'nutrients.Try_pct': { baseUnit: '%', units: { '%': 1, 'g/kg': 10 } },
  'nutrients.Starch_pct': { baseUnit: '%', units: { '%': 1, 'g/kg': 10 } },
  'nutrients.CF_pct': { baseUnit: '%', units: { '%': 1, 'g/kg': 10 } },
};

export const convertValue = (
    baseValue: number, 
    nutrientKey: string, 
    targetUnit: string
): { value: number; unit: string } => {
    const definition = NUTRIENT_UNITS[nutrientKey];
    if (!definition) {
        return { value: baseValue, unit: '' }; // No definition, return as is
    }

    const factor = definition.units[targetUnit];
    if (factor === undefined) {
        // Fallback to base unit if target is invalid
        return { value: baseValue, unit: definition.baseUnit };
    }

    const convertedValue = baseValue * factor;
    return { value: convertedValue, unit: targetUnit };
};

export const ROSS_308_RECOMMENDATIONS: Record<GrowthPhase, RecommendationProfile> = {
  'Starter': { // 0-10 days
    'nutrients.ME_kcal_per_kg': { min: 2925, max: 3025, unit: 'kcal/kg' },
    'nutrients.CP_pct': { min: 22.5, max: 23.5, unit: '%' },
    'nutrients.Lys_pct': { min: 1.32, max: 1.34, unit: '%' },
    'nutrients.TSAA_pct': { min: 1.00, max: 1.02, unit: '%' },
    'nutrients.Arg_pct': { min: 1.40, max: 1.42, unit: '%' },
    'nutrients.Thr_pct': { min: 0.88, max: 0.90, unit: '%' },
    'nutrients.Val_pct': { min: 1.00, max: 1.02, unit: '%' },
    'nutrients.Ile_pct': { min: 0.88, max: 0.90, unit: '%' },
    'nutrients.Ca_pct': { min: 0.93, max: 0.97, unit: '%' },
    'nutrients.avP_pct': { min: 0.48, max: 0.52, unit: '%' },
    'nutrients.Na_pct': { min: 0.18, max: 0.23, unit: '%' },
    'nutrients.Ash_pct': { min: 5.0, max: 6.5, unit: '%' },
    'nutrients.Choline_mg_per_kg': { min: 1700, max: Infinity, unit: 'mg/kg' },
    'nutrients.CaAvP_Ratio': { min: 1.8, max: 2.0, unit: '' },
  },
  'Grower': { // 11-24 days
    'nutrients.ME_kcal_per_kg': { min: 3000, max: 3100, unit: 'kcal/kg' },
    'nutrients.CP_pct': { min: 21.0, max: 22.0, unit: '%' },
    'nutrients.Lys_pct': { min: 1.18, max: 1.20, unit: '%' },
    'nutrients.TSAA_pct': { min: 0.92, max: 0.94, unit: '%' },
    'nutrients.Arg_pct': { min: 1.27, max: 1.29, unit: '%' },
    'nutrients.Thr_pct': { min: 0.79, max: 0.81, unit: '%' },
    'nutrients.Val_pct': { min: 0.91, max: 0.93, unit: '%' },
    'nutrients.Ile_pct': { min: 0.80, max: 0.82, unit: '%' },
    'nutrients.Ca_pct': { min: 0.83, max: 0.87, unit: '%' },
    'nutrients.avP_pct': { min: 0.43, max: 0.47, unit: '%' },
    'nutrients.Na_pct': { min: 0.17, max: 0.22, unit: '%' },
    'nutrients.Ash_pct': { min: 4.8, max: 6.0, unit: '%' },
    'nutrients.Choline_mg_per_kg': { min: 1500, max: Infinity, unit: 'mg/kg' },
    'nutrients.CaAvP_Ratio': { min: 1.8, max: 2.0, unit: '' },
  },
  'Finisher 1': { // 25-39 days
    'nutrients.ME_kcal_per_kg': { min: 3050, max: 3150, unit: 'kcal/kg' },
    'nutrients.CP_pct': { min: 19.5, max: 20.5, unit: '%' },
    'nutrients.Lys_pct': { min: 1.08, max: 1.10, unit: '%' },
    'nutrients.TSAA_pct': { min: 0.84, max: 0.86, unit: '%' },
    'nutrients.Arg_pct': { min: 1.16, max: 1.18, unit: '%' },
    'nutrients.Thr_pct': { min: 0.72, max: 0.74, unit: '%' },
    'nutrients.Val_pct': { min: 0.84, max: 0.86, unit: '%' },
    'nutrients.Ile_pct': { min: 0.74, max: 0.76, unit: '%' },
    'nutrients.Ca_pct': { min: 0.78, max: 0.82, unit: '%' },
    'nutrients.avP_pct': { min: 0.40, max: 0.44, unit: '%' },
    'nutrients.Na_pct': { min: 0.16, max: 0.21, unit: '%' },
    'nutrients.Ash_pct': { min: 4.5, max: 5.5, unit: '%' },
    'nutrients.Choline_mg_per_kg': { min: 1300, max: Infinity, unit: 'mg/kg' },
    'nutrients.CaAvP_Ratio': { min: 1.8, max: 2.0, unit: '' },
  },
  'Finisher 2': { // 40+ days
    'nutrients.ME_kcal_per_kg': { min: 3100, max: 3200, unit: 'kcal/kg' },
    'nutrients.CP_pct': { min: 18.5, max: 19.5, unit: '%' },
    'nutrients.Lys_pct': { min: 0.98, max: 1.00, unit: '%' },
    'nutrients.TSAA_pct': { min: 0.76, max: 0.78, unit: '%' },
    'nutrients.Arg_pct': { min: 1.06, max: 1.08, unit: '%' },
    'nutrients.Thr_pct': { min: 0.65, max: 0.67, unit: '%' },
    'nutrients.Val_pct': { min: 0.77, max: 0.79, unit: '%' },
    'nutrients.Ile_pct': { min: 0.68, max: 0.70, unit: '%' },
    'nutrients.Ca_pct': { min: 0.73, max: 0.77, unit: '%' },
    'nutrients.avP_pct': { min: 0.38, max: 0.42, unit: '%' },
    'nutrients.Na_pct': { min: 0.15, max: 0.20, unit: '%' },
    'nutrients.Ash_pct': { min: 4.2, max: 5.2, unit: '%' },
    'nutrients.Choline_mg_per_kg': { min: 1200, max: Infinity, unit: 'mg/kg' },
    'nutrients.CaAvP_Ratio': { min: 1.8, max: 2.0, unit: '' },
  },
};

export const initialIngredients: Ingredient[] = [
    // Energy Sources
    { id: 1, Name: 'Corn', category: 'Energy', Inclusion_pct: 0, CP_pct: 8.5, ME_kcal_per_kg: 3350, Ca_pct: 0.02, avP_pct: 0.05, phytateP_pct: 0.19, Na_pct: 0.02, K_pct: 0.29, Cl_pct: 0.05, Lys_pct: 0.24, TSAA_pct: 0.34, Thr_pct: 0.29, Val_pct: 0.40, Ile_pct: 0.30, Leu_pct: 1.00, Arg_pct: 0.40, Try_pct: 0.07, Starch_pct: 62, CF_pct: 2.2, NDF_pct: 9.5, ADF_pct: 2.8, Ash_pct: 1.3, Choline_mg_per_kg: 550, Price_USD_per_ton: 250 },
    { id: 2, Name: 'Wheat', category: 'Energy', Inclusion_pct: 0, CP_pct: 11.5, ME_kcal_per_kg: 3150, Ca_pct: 0.05, avP_pct: 0.08, phytateP_pct: 0.24, Na_pct: 0.02, K_pct: 0.45, Cl_pct: 0.07, Lys_pct: 0.32, TSAA_pct: 0.40, Thr_pct: 0.33, Val_pct: 0.48, Ile_pct: 0.38, Leu_pct: 0.75, Arg_pct: 0.55, Try_pct: 0.13, Starch_pct: 60, CF_pct: 2.8, NDF_pct: 11.5, ADF_pct: 3.5, Ash_pct: 1.8, Choline_mg_per_kg: 900, Price_USD_per_ton: 280 },
    { id: 3, Name: 'Barley', category: 'Energy', Inclusion_pct: 0, CP_pct: 10.5, ME_kcal_per_kg: 2950, Ca_pct: 0.06, avP_pct: 0.12, phytateP_pct: 0.23, Na_pct: 0.02, K_pct: 0.50, Cl_pct: 0.15, Lys_pct: 0.35, TSAA_pct: 0.38, Thr_pct: 0.34, Val_pct: 0.50, Ile_pct: 0.37, Leu_pct: 0.70, Arg_pct: 0.52, Try_pct: 0.13, Starch_pct: 55, CF_pct: 5.5, NDF_pct: 20, ADF_pct: 6, Ash_pct: 2.5, Choline_mg_per_kg: 1000, Price_USD_per_ton: 240 },
    { id: 4, Name: 'Soybean Oil', category: 'Energy', Inclusion_pct: 0, CP_pct: 0, ME_kcal_per_kg: 8800, Ca_pct: 0, avP_pct: 0, phytateP_pct: 0, Na_pct: 0, K_pct: 0, Cl_pct: 0, Lys_pct: 0, TSAA_pct: 0, Thr_pct: 0, Val_pct: 0, Ile_pct: 0, Leu_pct: 0, Arg_pct: 0, Try_pct: 0, Starch_pct: 0, CF_pct: 0, NDF_pct: 0, ADF_pct: 0, Ash_pct: 0, Choline_mg_per_kg: 0, Price_USD_per_ton: 1200 },
    // Protein Sources
    { id: 5, Name: 'Soybean Meal 48%', category: 'Protein', Inclusion_pct: 0, CP_pct: 48.0, ME_kcal_per_kg: 2450, Ca_pct: 0.35, avP_pct: 0.30, phytateP_pct: 0.42, Na_pct: 0.03, K_pct: 2.00, Cl_pct: 0.05, Lys_pct: 2.95, TSAA_pct: 1.40, Thr_pct: 1.90, Val_pct: 2.30, Ile_pct: 2.20, Leu_pct: 3.80, Arg_pct: 3.50, Try_pct: 0.65, Starch_pct: 2.5, CF_pct: 3.5, NDF_pct: 7.0, ADF_pct: 5.0, Ash_pct: 6.5, Choline_mg_per_kg: 2800, Price_USD_per_ton: 450 },
    { id: 6, Name: 'Soybean Meal 44%', category: 'Protein', Inclusion_pct: 0, CP_pct: 44.0, ME_kcal_per_kg: 2240, Ca_pct: 0.30, avP_pct: 0.25, phytateP_pct: 0.39, Na_pct: 0.03, K_pct: 1.90, Cl_pct: 0.05, Lys_pct: 2.70, TSAA_pct: 1.30, Thr_pct: 1.75, Val_pct: 2.10, Ile_pct: 2.00, Leu_pct: 3.50, Arg_pct: 3.20, Try_pct: 0.60, Starch_pct: 3.0, CF_pct: 6.5, NDF_pct: 12.0, ADF_pct: 8.0, Ash_pct: 6.0, Choline_mg_per_kg: 2700, Price_USD_per_ton: 420 },
    { id: 7, Name: 'Canola Meal', category: 'Protein', Inclusion_pct: 0, CP_pct: 36.0, ME_kcal_per_kg: 2100, Ca_pct: 0.60, avP_pct: 0.28, phytateP_pct: 0.50, Na_pct: 0.05, K_pct: 1.20, Cl_pct: 0.10, Lys_pct: 1.90, TSAA_pct: 1.45, Thr_pct: 1.50, Val_pct: 1.80, Ile_pct: 1.50, Leu_pct: 2.70, Arg_pct: 2.20, Try_pct: 0.45, Starch_pct: 1.0, CF_pct: 12.0, NDF_pct: 22.0, ADF_pct: 16.0, Ash_pct: 7.0, Choline_mg_per_kg: 6000, Price_USD_per_ton: 350 },
    { id: 8, Name: 'Wheat Bran', category: 'Protein', Inclusion_pct: 0, CP_pct: 15.0, ME_kcal_per_kg: 1300, Ca_pct: 0.12, avP_pct: 0.15, phytateP_pct: 0.85, Na_pct: 0.03, K_pct: 1.20, Cl_pct: 0.10, Lys_pct: 0.60, TSAA_pct: 0.45, Thr_pct: 0.48, Val_pct: 0.75, Ile_pct: 0.55, Leu_pct: 1.00, Arg_pct: 0.90, Try_pct: 0.20, Starch_pct: 20, CF_pct: 10.0, NDF_pct: 40, ADF_pct: 12, Ash_pct: 6.0, Choline_mg_per_kg: 1200, Price_USD_per_ton: 180 },
    // Amino Acids
    { id: 9, Name: 'L-Lysine HCl', category: 'AminoAcids', Inclusion_pct: 0, CP_pct: 94.4, ME_kcal_per_kg: 3970, Ca_pct: 0, avP_pct: 0, phytateP_pct: 0, Na_pct: 0, K_pct: 0, Cl_pct: 19.3, Lys_pct: 76, TSAA_pct: 0, Thr_pct: 0, Val_pct: 0, Ile_pct: 0, Leu_pct: 0, Arg_pct: 0, Try_pct: 0, Starch_pct: 0, CF_pct: 0, NDF_pct: 0, ADF_pct: 0, Ash_pct: 0.5, Choline_mg_per_kg: 0, Price_USD_per_ton: 2000 },
    { id: 10, Name: 'DL-Methionine', category: 'AminoAcids', Inclusion_pct: 0, CP_pct: 58.1, ME_kcal_per_kg: 5960, Ca_pct: 0, avP_pct: 0, phytateP_pct: 0, Na_pct: 0, K_pct: 0, Cl_pct: 0, Lys_pct: 0, TSAA_pct: 96, Thr_pct: 0, Val_pct: 0, Ile_pct: 0, Leu_pct: 0, Arg_pct: 0, Try_pct: 0, Starch_pct: 0, CF_pct: 0, NDF_pct: 0, ADF_pct: 0, Ash_pct: 0.2, Choline_mg_per_kg: 0, Price_USD_per_ton: 3000 },
    { id: 11, Name: 'L-Threonine', category: 'AminoAcids', Inclusion_pct: 0, CP_pct: 74.0, ME_kcal_per_kg: 3500, Ca_pct: 0, avP_pct: 0, phytateP_pct: 0, Na_pct: 0, K_pct: 0, Cl_pct: 0, Lys_pct: 0, TSAA_pct: 0, Thr_pct: 96, Val_pct: 0, Ile_pct: 0, Leu_pct: 0, Arg_pct: 0, Try_pct: 0, Starch_pct: 0, CF_pct: 0, NDF_pct: 0, ADF_pct: 0, Ash_pct: 0.2, Choline_mg_per_kg: 0, Price_USD_per_ton: 2500 },
    { id: 12, Name: 'L-Valine', category: 'AminoAcids', Inclusion_pct: 0, CP_pct: 80.0, ME_kcal_per_kg: 4000, Ca_pct: 0, avP_pct: 0, phytateP_pct: 0, Na_pct: 0, K_pct: 0, Cl_pct: 0, Lys_pct: 0, TSAA_pct: 0, Thr_pct: 0, Val_pct: 96, Ile_pct: 0, Leu_pct: 0, Arg_pct: 0, Try_pct: 0, Starch_pct: 0, CF_pct: 0, NDF_pct: 0, ADF_pct: 0, Ash_pct: 0.2, Choline_mg_per_kg: 0, Price_USD_per_ton: 4500 },
    { id: 13, Name: 'L-Isoleucine', category: 'AminoAcids', Inclusion_pct: 0, CP_pct: 75.0, ME_kcal_per_kg: 4200, Ca_pct: 0, avP_pct: 0, phytateP_pct: 0, Na_pct: 0, K_pct: 0, Cl_pct: 0, Lys_pct: 0, TSAA_pct: 0, Thr_pct: 0, Val_pct: 0, Ile_pct: 96, Leu_pct: 0, Arg_pct: 0, Try_pct: 0, Starch_pct: 0, CF_pct: 0, NDF_pct: 0, ADF_pct: 0, Ash_pct: 0.2, Choline_mg_per_kg: 0, Price_USD_per_ton: 5500 },
    { id: 14, Name: 'L-Tryptophan', category: 'AminoAcids', Inclusion_pct: 0, CP_pct: 85.0, ME_kcal_per_kg: 5200, Ca_pct: 0, avP_pct: 0, phytateP_pct: 0, Na_pct: 0, K_pct: 0, Cl_pct: 0, Lys_pct: 0, TSAA_pct: 0, Thr_pct: 0, Val_pct: 0, Ile_pct: 0, Leu_pct: 0, Arg_pct: 0, Try_pct: 99.0, Starch_pct: 0, CF_pct: 0, NDF_pct: 0, ADF_pct: 0, Ash_pct: 0.2, Choline_mg_per_kg: 0, Price_USD_per_ton: 8000 },
    { id: 15, Name: 'L-Arginine', category: 'AminoAcids', Inclusion_pct: 0, CP_pct: 82.0, ME_kcal_per_kg: 4700, Ca_pct: 0, avP_pct: 0, phytateP_pct: 0, Na_pct: 0, K_pct: 0, Cl_pct: 0, Lys_pct: 0, TSAA_pct: 0, Thr_pct: 0, Val_pct: 0, Ile_pct: 0, Leu_pct: 0, Arg_pct: 96, Try_pct: 0, Starch_pct: 0, CF_pct: 0, NDF_pct: 0, ADF_pct: 0, Ash_pct: 0.2, Choline_mg_per_kg: 0, Price_USD_per_ton: 6000 },
    // Mineral Supplements
    { id: 16, Name: 'Limestone', category: 'MineralSupplements', Inclusion_pct: 0, CP_pct: 0, ME_kcal_per_kg: 0, Ca_pct: 36.0, avP_pct: 0, phytateP_pct: 0, Na_pct: 0, K_pct: 0, Cl_pct: 0, Lys_pct: 0, TSAA_pct: 0, Thr_pct: 0, Val_pct: 0, Ile_pct: 0, Leu_pct: 0, Arg_pct: 0, Try_pct: 0, Starch_pct: 0, CF_pct: 0, NDF_pct: 0, ADF_pct: 0, Ash_pct: 98.0, Choline_mg_per_kg: 0, Price_USD_per_ton: 50 },
    { id: 17, Name: 'Dicalcium Phosphate', category: 'MineralSupplements', Inclusion_pct: 0, CP_pct: 0, ME_kcal_per_kg: 0, Ca_pct: 22.0, avP_pct: 16.5, phytateP_pct: 0, Na_pct: 0, K_pct: 0, Cl_pct: 0, Lys_pct: 0, TSAA_pct: 0, Thr_pct: 0, Val_pct: 0, Ile_pct: 0, Leu_pct: 0, Arg_pct: 0, Try_pct: 0, Starch_pct: 0, CF_pct: 0, NDF_pct: 0, ADF_pct: 0, Ash_pct: 90.0, Choline_mg_per_kg: 0, Price_USD_per_ton: 700 },
    { id: 18, Name: 'Salt (NaCl)', category: 'MineralSupplements', Inclusion_pct: 0, CP_pct: 0, ME_kcal_per_kg: 0, Ca_pct: 0, avP_pct: 0, phytateP_pct: 0, Na_pct: 39.0, K_pct: 0, Cl_pct: 60.0, Lys_pct: 0, TSAA_pct: 0, Thr_pct: 0, Val_pct: 0, Ile_pct: 0, Leu_pct: 0, Arg_pct: 0, Try_pct: 0, Starch_pct: 0, CF_pct: 0, NDF_pct: 0, ADF_pct: 0, Ash_pct: 99.5, Choline_mg_per_kg: 0, Price_USD_per_ton: 80 },
    { id: 19, Name: 'Sodium Bicarbonate', category: 'MineralSupplements', Inclusion_pct: 0, CP_pct: 0, ME_kcal_per_kg: 0, Ca_pct: 0, avP_pct: 0, phytateP_pct: 0, Na_pct: 27.0, K_pct: 0, Cl_pct: 0, Lys_pct: 0, TSAA_pct: 0, Thr_pct: 0, Val_pct: 0, Ile_pct: 0, Leu_pct: 0, Arg_pct: 0, Try_pct: 0, Starch_pct: 0, CF_pct: 0, NDF_pct: 0, ADF_pct: 0, Ash_pct: 63.0, Choline_mg_per_kg: 0, Price_USD_per_ton: 300 },
    // Other Additives
    { id: 20, Name: 'Choline Chloride 60%', category: 'Other', Inclusion_pct: 0, CP_pct: 0, ME_kcal_per_kg: 0, Ca_pct: 0, avP_pct: 0, phytateP_pct: 0, Na_pct: 0, K_pct: 0, Cl_pct: 0, Lys_pct: 0, TSAA_pct: 0, Thr_pct: 0, Val_pct: 0, Ile_pct: 0, Leu_pct: 0, Arg_pct: 0, Try_pct: 0, Starch_pct: 0, CF_pct: 0, NDF_pct: 0, ADF_pct: 0, Ash_pct: 0, Choline_mg_per_kg: 447000, Price_USD_per_ton: 1500 },
    { id: 21, Name: 'Toxin Binder', category: 'Other', description: 'Bentonite-based mycotoxin binder', Inclusion_pct: 0, CP_pct: 0, ME_kcal_per_kg: 0, Ca_pct: 0, avP_pct: 0, phytateP_pct: 0, Na_pct: 0, K_pct: 0, Cl_pct: 0, Lys_pct: 0, TSAA_pct: 0, Thr_pct: 0, Val_pct: 0, Ile_pct: 0, Leu_pct: 0, Arg_pct: 0, Try_pct: 0, Starch_pct: 0, CF_pct: 0, NDF_pct: 0, ADF_pct: 0, Ash_pct: 0, Choline_mg_per_kg: 0, Price_USD_per_ton: 2000 },
    { id: 22, Name: 'Mold Inhibitor', category: 'Other', description: 'Propionic acid-based mold inhibitor', Inclusion_pct: 0, CP_pct: 0, ME_kcal_per_kg: 0, Ca_pct: 0, avP_pct: 0, phytateP_pct: 0, Na_pct: 0, K_pct: 0, Cl_pct: 0, Lys_pct: 0, TSAA_pct: 0, Thr_pct: 0, Val_pct: 0, Ile_pct: 0, Leu_pct: 0, Arg_pct: 0, Try_pct: 0, Starch_pct: 0, CF_pct: 0, NDF_pct: 0, ADF_pct: 0, Ash_pct: 0, Choline_mg_per_kg: 0, Price_USD_per_ton: 1800 },
    { id: 23, Name: 'Pomegranate Peel', category: 'Other', description: 'Source of fiber and antioxidants', Inclusion_pct: 0, CP_pct: 4.0, ME_kcal_per_kg: 1500, Ca_pct: 0.5, avP_pct: 0.05, phytateP_pct: 0, Na_pct: 0.01, K_pct: 1.0, Cl_pct: 0.05, Lys_pct: 0.1, TSAA_pct: 0.05, Thr_pct: 0.1, Val_pct: 0.15, Ile_pct: 0.1, Leu_pct: 0.2, Arg_pct: 0.15, Try_pct: 0.02, Starch_pct: 5, CF_pct: 20.0, NDF_pct: 45, ADF_pct: 35, Ash_pct: 5.0, Choline_mg_per_kg: 200, Price_USD_per_ton: 150 },
    { id: 24, Name: 'Brewer\'s Yeast', category: 'Protein', description: 'Source of protein and B-vitamins', Inclusion_pct: 0, CP_pct: 45.0, ME_kcal_per_kg: 2600, Ca_pct: 0.1, avP_pct: 1.0, phytateP_pct: 0.1, Na_pct: 0.1, K_pct: 2.0, Cl_pct: 0.1, Lys_pct: 3.5, TSAA_pct: 1.2, Thr_pct: 2.5, Val_pct: 2.8, Ile_pct: 2.2, Leu_pct: 3.5, Arg_pct: 2.4, Try_pct: 0.6, Starch_pct: 0, CF_pct: 2.0, NDF_pct: 5, ADF_pct: 3, Ash_pct: 8.0, Choline_mg_per_kg: 4000, Price_USD_per_ton: 900 },
    { id: 25, Name: 'Sodium Sulfate', category: 'MineralSupplements', Inclusion_pct: 0, CP_pct: 0, ME_kcal_per_kg: 0, Ca_pct: 0, avP_pct: 0, phytateP_pct: 0, Na_pct: 32.4, K_pct: 0, Cl_pct: 0, Lys_pct: 0, TSAA_pct: 0, Thr_pct: 0, Val_pct: 0, Ile_pct: 0, Leu_pct: 0, Arg_pct: 0, Try_pct: 0, Starch_pct: 0, CF_pct: 0, NDF_pct: 0, ADF_pct: 0, Ash_pct: 56.6, Choline_mg_per_kg: 0, Price_USD_per_ton: 200 },
    { id: 26, Name: 'Anticoccidial', category: 'Medicated', description: 'Medicated feed additive to control coccidiosis', Inclusion_pct: 0, CP_pct: 0, ME_kcal_per_kg: 0, Ca_pct: 0, avP_pct: 0, phytateP_pct: 0, Na_pct: 0, K_pct: 0, Cl_pct: 0, Lys_pct: 0, TSAA_pct: 0, Thr_pct: 0, Val_pct: 0, Ile_pct: 0, Leu_pct: 0, Arg_pct: 0, Try_pct: 0, Starch_pct: 0, CF_pct: 0, NDF_pct: 0, ADF_pct: 0, Ash_pct: 0, Choline_mg_per_kg: 0, Price_USD_per_ton: 10000 },
    { id: 27, Name: 'Anti-inflammatory Additive', category: 'Other', description: 'Functional feed additive with anti-inflammatory properties', Inclusion_pct: 0, CP_pct: 0, ME_kcal_per_kg: 0, Ca_pct: 0, avP_pct: 0, phytateP_pct: 0, Na_pct: 0, K_pct: 0, Cl_pct: 0, Lys_pct: 0, TSAA_pct: 0, Thr_pct: 0, Val_pct: 0, Ile_pct: 0, Leu_pct: 0, Arg_pct: 0, Try_pct: 0, Starch_pct: 0, CF_pct: 0, NDF_pct: 0, ADF_pct: 0, Ash_pct: 0, Choline_mg_per_kg: 0, Price_USD_per_ton: 5000 },
    { id: 28, Name: 'Monocalcium Phosphate', category: 'MineralSupplements', Inclusion_pct: 0, CP_pct: 0, ME_kcal_per_kg: 0, Ca_pct: 16.0, avP_pct: 21.0, phytateP_pct: 0, Na_pct: 0, K_pct: 0, Cl_pct: 0, Lys_pct: 0, TSAA_pct: 0, Thr_pct: 0, Val_pct: 0, Ile_pct: 0, Leu_pct: 0, Arg_pct: 0, Try_pct: 0, Starch_pct: 0, CF_pct: 0, NDF_pct: 0, ADF_pct: 0, Ash_pct: 85.0, Choline_mg_per_kg: 0, Price_USD_per_ton: 800 },
    { id: 29, Name: 'Pellet Binder', category: 'Other', description: 'Lignosulfonate-based binder', Inclusion_pct: 0, CP_pct: 0, ME_kcal_per_kg: 0, Ca_pct: 0, avP_pct: 0, phytateP_pct: 0, Na_pct: 0, K_pct: 0, Cl_pct: 0, Lys_pct: 0, TSAA_pct: 0, Thr_pct: 0, Val_pct: 0, Ile_pct: 0, Leu_pct: 0, Arg_pct: 0, Try_pct: 0, Starch_pct: 0, CF_pct: 0, NDF_pct: 0, ADF_pct: 0, Ash_pct: 0, Choline_mg_per_kg: 0, Price_USD_per_ton: 400 },
    // Enzymes with matrix-based calculation
    { 
      id: 30, 
      Name: 'Phytase', 
      category: 'Enzymes', 
      description: 'Releases phosphorus, calcium, energy, and amino acids from phytate.',
      Inclusion_pct: 0, 
      Price_USD_per_ton: 15000,
      standard_dosage_g_per_ton: 150,
      matrix: { avP_pct: 0.09, Ca_pct: 0.11, ME_kcal_per_kg: 75, CP_pct: 0.311, Lys_pct: 0.0128, TSAA_pct: 0.008, Thr_pct: 0.008 },
      CP_pct: 0, ME_kcal_per_kg: 0, Ca_pct: 0, avP_pct: 0, phytateP_pct: 0, Na_pct: 0, K_pct: 0, Cl_pct: 0, Lys_pct: 0, TSAA_pct: 0, Thr_pct: 0, Val_pct: 0, Ile_pct: 0, Leu_pct: 0, Arg_pct: 0, Try_pct: 0, Starch_pct: 0, CF_pct: 0, NDF_pct: 0, ADF_pct: 0, Ash_pct: 0, Choline_mg_per_kg: 0
    },
    { 
      id: 31, 
      Name: 'Fiber Enzyme', 
      category: 'Enzymes', 
      description: 'Improves digestibility of fiber-rich ingredients, releasing energy and nutrients.',
      Inclusion_pct: 0, 
      Price_USD_per_ton: 18000,
      standard_dosage_g_per_ton: 150,
      matrix: { ME_kcal_per_kg: 120, CP_pct: 0.1, Ca_pct: 0.005, avP_pct: 0.0025, Lys_pct: 0.006, TSAA_pct: 0.002, Thr_pct: 0.002 },
      CP_pct: 0, ME_kcal_per_kg: 0, Ca_pct: 0, avP_pct: 0, phytateP_pct: 0, Na_pct: 0, K_pct: 0, Cl_pct: 0, Lys_pct: 0, TSAA_pct: 0, Thr_pct: 0, Val_pct: 0, Ile_pct: 0, Leu_pct: 0, Arg_pct: 0, Try_pct: 0, Starch_pct: 0, CF_pct: 0, NDF_pct: 0, ADF_pct: 0, Ash_pct: 0, Choline_mg_per_kg: 0
    },
    { 
      id: 32, 
      Name: 'Protease', 
      category: 'Enzymes', 
      description: 'Enhances protein digestion, increasing the availability of amino acids.',
      Inclusion_pct: 0, 
      Price_USD_per_ton: 12000,
      standard_dosage_g_per_ton: 200,
      matrix: { CP_pct: 0.8, Lys_pct: 0.049, TSAA_pct: 0.023, Thr_pct: 0.032, Val_pct: 0.038, Ile_pct: 0.036, Arg_pct: 0.058, Try_pct: 0.01 },
      CP_pct: 0, ME_kcal_per_kg: 0, Ca_pct: 0, avP_pct: 0, phytateP_pct: 0, Na_pct: 0, K_pct: 0, Cl_pct: 0, Lys_pct: 0, TSAA_pct: 0, Thr_pct: 0, Val_pct: 0, Ile_pct: 0, Leu_pct: 0, Arg_pct: 0, Try_pct: 0, Starch_pct: 0, CF_pct: 0, NDF_pct: 0, ADF_pct: 0, Ash_pct: 0, Choline_mg_per_kg: 0
    },
];

export const initialVitaminsData: Vitamin[] = [
    { id: 'vit_a', name: 'Vitamin A', unit: 'IU', purity: 500000, pricePerKg: 30, requiredInFeed: 10000, processingLossPct: 10, storageLossPct: 5 },
    { id: 'vit_d3', name: 'Vitamin D3', unit: 'IU', purity: 500000, pricePerKg: 35, requiredInFeed: 3000, processingLossPct: 10, storageLossPct: 5 },
    { id: 'vit_e', name: 'Vitamin E', unit: 'IU', purity: 500, pricePerKg: 25, requiredInFeed: 50, processingLossPct: 10, storageLossPct: 5 },
    { id: 'vit_k3', name: 'Vitamin K3 (MSB)', unit: 'mg', purity: 510, pricePerKg: 20, requiredInFeed: 3, processingLossPct: 5, storageLossPct: 5 },
    { id: 'vit_b1', name: 'Vitamin B1 (Thiamine)', unit: 'mg', purity: 980, pricePerKg: 40, requiredInFeed: 2.5, processingLossPct: 5, storageLossPct: 5 },
    { id: 'vit_b2', name: 'Vitamin B2 (Riboflavin)', unit: 'mg', purity: 800, pricePerKg: 45, requiredInFeed: 7, processingLossPct: 5, storageLossPct: 5 },
    { id: 'vit_b6', name: 'Vitamin B6 (Pyridoxine)', unit: 'mg', purity: 980, pricePerKg: 50, requiredInFeed: 4, processingLossPct: 5, storageLossPct: 5 },
    { id: 'vit_b12', name: 'Vitamin B12 (Cobalamin)', unit: 'mg', purity: 10, pricePerKg: 60, requiredInFeed: 0.02, processingLossPct: 5, storageLossPct: 5 },
    { id: 'niacin', name: 'Niacin (B3)', unit: 'mg', purity: 990, pricePerKg: 15, requiredInFeed: 50, processingLossPct: 5, storageLossPct: 5 },
    { id: 'pant_acid', name: 'Pantothenic Acid (B5)', unit: 'mg', purity: 900, pricePerKg: 22, requiredInFeed: 15, processingLossPct: 5, storageLossPct: 5 },
    { id: 'folic_acid', name: 'Folic Acid (B9)', unit: 'mg', purity: 960, pricePerKg: 70, requiredInFeed: 1.5, processingLossPct: 5, storageLossPct: 5 },
    { id: 'biotin', name: 'Biotin (B7)', unit: 'mg', purity: 20, pricePerKg: 80, requiredInFeed: 0.2, processingLossPct: 5, storageLossPct: 5 },
];

export const initialMineralsData: Mineral[] = [
    { id: 'mn', name: 'Manganese (Mn)', requiredInFeed_mg_per_kg: 100, selectedSourceIndex: 0, sources: [{ name: 'Manganese Sulfate', productConcentration_pct: 32, pricePerKg: 2.5 }, { name: 'Manganese Oxide', productConcentration_pct: 60, pricePerKg: 2.0 }] },
    { id: 'zn', name: 'Zinc (Zn)', requiredInFeed_mg_per_kg: 100, selectedSourceIndex: 0, sources: [{ name: 'Zinc Sulfate', productConcentration_pct: 35, pricePerKg: 3.0 }, { name: 'Zinc Oxide', productConcentration_pct: 72, pricePerKg: 2.8 }] },
    { id: 'fe', name: 'Iron (Fe)', requiredInFeed_mg_per_kg: 80, selectedSourceIndex: 0, sources: [{ name: 'Ferrous Sulfate', productConcentration_pct: 20, pricePerKg: 1.5 }] },
    { id: 'cu', name: 'Copper (Cu)', requiredInFeed_mg_per_kg: 15, selectedSourceIndex: 0, sources: [{ name: 'Copper Sulfate', productConcentration_pct: 25, pricePerKg: 4.0 }] },
    { id: 'i', name: 'Iodine (I)', requiredInFeed_mg_per_kg: 1.2, selectedSourceIndex: 0, sources: [{ name: 'Calcium Iodate', productConcentration_pct: 62, pricePerKg: 40 }] },
    { id: 'se', name: 'Selenium (Se)', requiredInFeed_mg_per_kg: 0.3, selectedSourceIndex: 0, sources: [{ name: 'Sodium Selenite', productConcentration_pct: 45, pricePerKg: 120 }] },
];
