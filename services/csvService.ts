import type { Ingredient } from '../types';
import { COLUMN_HEADERS } from '../constants';

const HEADER_MAPPING: Record<string, keyof Ingredient> = {
  'name': 'Name',
  'inclusion %': 'Inclusion_pct',
  'price ($/ton)': 'Price_USD_per_ton',
  'crude protein %': 'CP_pct',
  'me (kcal/kg)': 'ME_kcal_per_kg',
  'calcium %': 'Ca_pct',
  'av. phosphorus %': 'avP_pct',
  'phytate p %': 'phytateP_pct',
  'sodium %': 'Na_pct',
  'potassium %': 'K_pct',
  'chlorine %': 'Cl_pct',
  'lysine %': 'Lys_pct',
  'met+cys %': 'TSAA_pct',
  'threonine %': 'Thr_pct',
  'valine %': 'Val_pct',
  'isoleucine %': 'Ile_pct',
  'leucine %': 'Leu_pct',
  'arginine %': 'Arg_pct',
  'tryptophan %': 'Try_pct',
  'starch %': 'Starch_pct',
  'crude fiber %': 'CF_pct',
  'ndf %': 'NDF_pct',
  'adf %': 'ADF_pct',
  'ash %': 'Ash_pct',
  'choline (mg/kg)': 'Choline_mg_per_kg',
  'category': 'category',
  'description': 'description',
};

export const parseCSV = (csvText: string): Ingredient[] => {
  const lines = csvText.trim().split(/\r\n|\n/);
  if (lines.length < 2) {
    alert('Invalid CSV data. Must contain a header row and at least one data row.');
    return [];
  }
  
  const headerLine = lines[0].trim();
  // Handle CSVs with semicolons as well
  const delimiter = headerLine.includes(';') ? ';' : ',';
  const headers = headerLine.split(delimiter).map(h => h.trim().toLowerCase().replace(/"/g, ''));
  
  const mappedHeaders = headers.map(h => {
    const matchingKey = Object.keys(HEADER_MAPPING).find(key => key.toLowerCase() === h);
    return matchingKey ? HEADER_MAPPING[matchingKey as keyof typeof HEADER_MAPPING] : null;
  });
  
  if (mappedHeaders.filter(h => h === 'Name').length === 0) {
    alert('Could not find "Name" column in CSV file. This column is required.');
    return [];
  }

  const dataLines = lines.slice(1);
  
  const ingredients: Ingredient[] = dataLines.map((line, index) => {
    if (!line.trim()) return null; // Skip empty lines
    const values = line.split(delimiter);
    const ingredient: Partial<Ingredient> = { id: Date.now() + index, category: 'Other' }; // Default category
    
    mappedHeaders.forEach((key, i) => {
      const value = values[i] ? values[i].trim().replace(/"/g, '') : '';
      if (key) {
        if (key === 'Name' || key === 'description' || key === 'category') {
          (ingredient[key] as string) = value;
        } else {
          (ingredient[key] as number) = parseFloat(value) || 0;
        }
      }
    });

    return ingredient as Ingredient;
  }).filter((ing): ing is Ingredient => ing !== null);

  return ingredients;
};

const escapeCSVValue = (value: any): string => {
    if (value === null || value === undefined) {
        return '';
    }
    const stringValue = String(value);
    if (/[",\n\r]/.test(stringValue)) {
        return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
};

export const exportIngredientsToCSV = (ingredients: Ingredient[], fileName: string = 'ingredients.csv') => {
    if (!ingredients.length) {
        alert('No ingredients to export.');
        return;
    }

    const columnOrder: (keyof Omit<Ingredient, 'id'>)[] = [
        'Name', 'Inclusion_pct', 'Price_USD_per_ton', 'CP_pct', 'ME_kcal_per_kg',
        'Ca_pct', 'avP_pct', 'phytateP_pct', 'Na_pct', 'K_pct', 'Cl_pct', 'Lys_pct', 'TSAA_pct',
        'Thr_pct', 'Val_pct', 'Ile_pct', 'Leu_pct', 'Arg_pct', 'Try_pct',
        'Starch_pct', 'CF_pct', 'NDF_pct', 'ADF_pct', 'Ash_pct', 'Choline_mg_per_kg',
        'category', 'description'
    ];

    const headers = columnOrder.map(key => COLUMN_HEADERS[key] || key);
    
    const csvRows = ingredients.map(ingredient => {
        return columnOrder.map(key => {
            const value = ingredient[key as keyof Ingredient];
            return escapeCSVValue(value);
        }).join(',');
    });

    const csvString = [headers.join(','), ...csvRows].join('\n');
    
    // Add BOM for UTF-8 to support Excel correctly
    const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
};