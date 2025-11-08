/**
 * Advanced search utility with fuzzy matching and multi-field search
 */

interface SearchOptions {
  fields: string[];
  fuzzy?: boolean;
  caseSensitive?: boolean;
  threshold?: number; // For fuzzy matching (0-1, lower = more strict)
}

/**
 * Calculate Levenshtein distance for fuzzy matching
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Calculate similarity score (0-1)
 */
function similarityScore(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

/**
 * Extract nested field value from object
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Check if a value matches the search term
 */
function matchesSearch(
  value: any,
  searchTerm: string,
  options: SearchOptions
): boolean {
  if (value === null || value === undefined) return false;

  const valueStr = String(value);
  let term = searchTerm;
  let val = valueStr;

  if (!options.caseSensitive) {
    term = term.toLowerCase();
    val = val.toLowerCase();
  }

  if (options.fuzzy) {
    const threshold = options.threshold || 0.7;
    const score = similarityScore(val, term);
    return score >= threshold;
  }

  return val.includes(term);
}

/**
 * Advanced search function
 */
export function advancedSearch<T extends Record<string, any>>(
  items: T[],
  searchTerm: string,
  options: SearchOptions
): T[] {
  if (!searchTerm || searchTerm.trim() === '') {
    return items;
  }

  const term = searchTerm.trim();

  return items.filter((item) => {
    // Check if any of the specified fields match
    return options.fields.some((field) => {
      const value = getNestedValue(item, field);

      // Handle arrays
      if (Array.isArray(value)) {
        return value.some((v) => matchesSearch(v, term, options));
      }

      return matchesSearch(value, term, options);
    });
  });
}

/**
 * Multi-term search (supports AND/OR logic)
 */
export function multiTermSearch<T extends Record<string, any>>(
  items: T[],
  searchTerms: string[],
  options: SearchOptions,
  logic: 'AND' | 'OR' = 'OR'
): T[] {
  if (searchTerms.length === 0) return items;

  return items.filter((item) => {
    const matches = searchTerms.map((term) => {
      return options.fields.some((field) => {
        const value = getNestedValue(item, field);
        return matchesSearch(value, term, options);
      });
    });

    return logic === 'AND' ? matches.every(Boolean) : matches.some(Boolean);
  });
}

/**
 * Ranked search (returns results with relevance score)
 */
interface RankedResult<T> {
  item: T;
  score: number;
  matchedFields: string[];
}

export function rankedSearch<T extends Record<string, any>>(
  items: T[],
  searchTerm: string,
  options: SearchOptions
): RankedResult<T>[] {
  if (!searchTerm || searchTerm.trim() === '') {
    return items.map((item) => ({ item, score: 0, matchedFields: [] }));
  }

  const term = options.caseSensitive ? searchTerm : searchTerm.toLowerCase();

  const results = items
    .map((item) => {
      let totalScore = 0;
      const matchedFields: string[] = [];

      options.fields.forEach((field) => {
        const value = getNestedValue(item, field);
        if (value === null || value === undefined) return;

        const valueStr = options.caseSensitive
          ? String(value)
          : String(value).toLowerCase();

        // Exact match = highest score
        if (valueStr === term) {
          totalScore += 10;
          matchedFields.push(field);
        }
        // Starts with = high score
        else if (valueStr.startsWith(term)) {
          totalScore += 7;
          matchedFields.push(field);
        }
        // Contains = medium score
        else if (valueStr.includes(term)) {
          totalScore += 5;
          matchedFields.push(field);
        }
        // Fuzzy match = low score
        else if (options.fuzzy) {
          const score = similarityScore(valueStr, term);
          const threshold = options.threshold || 0.7;
          if (score >= threshold) {
            totalScore += score * 3;
            matchedFields.push(field);
          }
        }
      });

      return {
        item,
        score: totalScore,
        matchedFields,
      };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score);

  return results;
}

/**
 * Highlight matches in text
 */
export function highlightMatches(
  text: string,
  searchTerm: string,
  caseSensitive: boolean = false
): string {
  if (!searchTerm) return text;

  const flags = caseSensitive ? 'g' : 'gi';
  const regex = new RegExp(`(${searchTerm})`, flags);

  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Search with filters
 */
interface FilterCondition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains';
  value: any;
}

export function searchWithFilters<T extends Record<string, any>>(
  items: T[],
  searchTerm: string,
  searchOptions: SearchOptions,
  filters: FilterCondition[]
): T[] {
  // First apply search
  let results = advancedSearch(items, searchTerm, searchOptions);

  // Then apply filters
  filters.forEach((filter) => {
    results = results.filter((item) => {
      const value = getNestedValue(item, filter.field);

      switch (filter.operator) {
        case 'eq':
          return value === filter.value;
        case 'ne':
          return value !== filter.value;
        case 'gt':
          return value > filter.value;
        case 'gte':
          return value >= filter.value;
        case 'lt':
          return value < filter.value;
        case 'lte':
          return value <= filter.value;
        case 'in':
          return Array.isArray(filter.value) && filter.value.includes(value);
        case 'contains':
          return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
        default:
          return true;
      }
    });
  });

  return results;
}