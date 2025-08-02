import { useState, useCallback, useRef } from 'react';
import useStudentData from './useStudentData';

/**
 * Custom hook for searching students by ID or name with autocomplete
 * Provides fuzzy search and autocomplete functionality
 */
export const useSearchStudents = () => {
  const { findStudentByBacNumber, loadData, bac2025Data } = useStudentData();
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  
  // Cache for search results to avoid repeated calculations
  const searchCacheRef = useRef(new Map());
  const lastSearchTermRef = useRef('');
  const debounceTimeoutRef = useRef(null);

  // Enhanced text normalization with character detection
  const normalizeText = useCallback((text, textType = null) => {
    if (!text) return '';
    
    // Auto-detect if type not provided
    if (!textType) {
      const firstChar = text.codePointAt(0);
      // Check if Arabic (Unicode ranges)
      const isArabic = (firstChar >= 0x0600 && firstChar <= 0x06FF) ||
                      (firstChar >= 0x0750 && firstChar <= 0x077F) ||
                      (firstChar >= 0x08A0 && firstChar <= 0x08FF) ||
                      (firstChar >= 0xFB50 && firstChar <= 0xFDFF);
      textType = isArabic ? 'arabic' : 'latin';
    }
    
    if (textType === 'arabic') {
      return text
        // Remove diacritics
        .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
        // Normalize Alef variations
        .replace(/[أإآا]/g, 'ا')
        // Normalize Ya variations
        .replace(/[ىي]/g, 'ي')
        // Normalize Heh variations
        .replace(/[هة]/g, 'ه')
        // Normalize Teh variations
        .replace(/[تط]/g, 'ت')
        // Normalize Waw with Hamza
        .replace(/[ؤ]/g, 'و')
        // Normalize Ya with Hamza
        .replace(/[ئ]/g, 'ي')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
    } else {
      return text
        .toLowerCase()
        // Remove accents
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    }
  }, []);

  // Enhanced fuzzy search with character-type optimization
  const fuzzyMatch = useCallback((searchTerm, targetText) => {
    // Detect character types for optimized normalization
    const searchFirstChar = searchTerm.codePointAt(0);
    const targetFirstChar = targetText.codePointAt(0);
    
    const searchIsArabic = (searchFirstChar >= 0x0600 && searchFirstChar <= 0x06FF) ||
                          (searchFirstChar >= 0x0750 && searchFirstChar <= 0x077F) ||
                          (searchFirstChar >= 0x08A0 && searchFirstChar <= 0x08FF);
    const targetIsArabic = (targetFirstChar >= 0x0600 && targetFirstChar <= 0x06FF) ||
                          (targetFirstChar >= 0x0750 && targetFirstChar <= 0x077F) ||
                          (targetFirstChar >= 0x08A0 && targetFirstChar <= 0x08FF);
    
    // Early exit if character types don't match and no mixed content
    if (searchIsArabic !== targetIsArabic && 
        !searchTerm.match(/[a-zA-Z]/) && !searchTerm.match(/[\u0600-\u06FF]/) &&
        !targetText.match(/[a-zA-Z]/) && !targetText.match(/[\u0600-\u06FF]/)) {
      return { match: false, score: 0 };
    }
    
    const normalizedSearch = normalizeText(searchTerm, searchIsArabic ? 'arabic' : 'latin');
    const normalizedTarget = normalizeText(targetText, targetIsArabic ? 'arabic' : 'latin');
    
    if (!normalizedSearch || !normalizedTarget) return { match: false, score: 0 };
    
    // 1. Exact substring match (highest score)
    if (normalizedTarget.includes(normalizedSearch)) {
      return { match: true, score: 0.9 };
    }
    
    // 2. Word boundary match (high score)
    const targetWords = normalizedTarget.split(/\s+/);
    for (const word of targetWords) {
      if (word.startsWith(normalizedSearch)) {
        return { match: true, score: 0.85 };
      }
      if (word.includes(normalizedSearch)) {
        return { match: true, score: 0.8 };
      }
    }
    
    // 3. Sequential character match (medium score)
    let searchIndex = 0;
    let matches = 0;
    for (let i = 0; i < normalizedTarget.length && searchIndex < normalizedSearch.length; i++) {
      if (normalizedTarget[i] === normalizedSearch[searchIndex]) {
        searchIndex++;
        matches++;
      }
    }
    
    if (searchIndex === normalizedSearch.length) {
      const sequentialScore = matches / normalizedTarget.length;
      return { match: true, score: Math.max(0.4, sequentialScore * 0.7) };
    }
    
    // 4. Levenshtein distance for close matches (lower score)
    if (normalizedSearch.length >= 3 && normalizedTarget.length >= 3) {
      const distance = levenshteinDistance(normalizedSearch, normalizedTarget);
      const maxLen = Math.max(normalizedSearch.length, normalizedTarget.length);
      const similarity = 1 - (distance / maxLen);
      
      if (similarity > 0.6) {
        return { match: true, score: similarity * 0.5 };
      }
    }
    
    // 5. Partial word match (lowest score but still valid)
    const searchWords = normalizedSearch.split(/\s+/);
    let wordMatches = 0;
    for (const searchWord of searchWords) {
      if (searchWord.length >= 2) {
        for (const targetWord of targetWords) {
          if (targetWord.includes(searchWord) || searchWord.includes(targetWord)) {
            wordMatches++;
            break;
          }
        }
      }
    }
    
    if (wordMatches > 0) {
      const wordScore = wordMatches / searchWords.length;
      return { match: true, score: wordScore * 0.3 };
    }
    
    return { match: false, score: 0 };
  }, [normalizeText]);

  // Levenshtein distance calculation
  const levenshteinDistance = useCallback((str1, str2) => {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,     // deletion
          matrix[j - 1][i] + 1,     // insertion
          matrix[j - 1][i - 1] + indicator  // substitution
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }, []);

  // Optimized search with character-based routing and caching
  const performSearch = useCallback(async (searchTerm) => {
    const startTime = performance.now();
    
    // Detect search character type for optimization
    const firstChar = searchTerm.codePointAt(0);
    const searchIsArabic = (firstChar >= 0x0600 && firstChar <= 0x06FF) ||
                          (firstChar >= 0x0750 && firstChar <= 0x077F) ||
                          (firstChar >= 0x08A0 && firstChar <= 0x08FF);
    
    const searchType = searchIsArabic ? 'arabic' : 'latin';
    const normalizedTerm = normalizeText(searchTerm, searchType);
    
    // Enhanced cache key with character type
    const cacheKey = `${searchType}:${normalizedTerm}`;
    
    // Check cache first
    if (searchCacheRef.current.has(cacheKey)) {
      return searchCacheRef.current.get(cacheKey);
    }

    // Use cached data if available, otherwise load
    let allStudentsData;
    if (bac2025Data) {
      allStudentsData = { bac2025Data };
    } else {
      allStudentsData = await loadData();
    }
    
    const allStudents = allStudentsData.bac2025Data || [];
    
    const matches = allStudents
      .map((student) => {
        const nameAr = student.NOM_AR || student.NOMPA || '';
        const nameFr = student.NOM_FR || student.NOM || '';
        
        let score = 0;
        let matchType = '';
        
        // Enhanced matching with character-type optimization
        const normalizedNameAr = normalizeText(nameAr, 'arabic');
        const normalizedNameFr = normalizeText(nameFr, 'latin');
        
        // Optimize search based on query character type
        if (searchType === 'arabic') {
          // Prioritize Arabic name for Arabic queries
          if (normalizedNameAr.includes(normalizedTerm)) {
            score = (normalizedTerm.length / normalizedNameAr.length) * 1.0;
            matchType = 'exact-ar';
          } else if (normalizedNameFr.includes(normalizedTerm)) {
            score = (normalizedTerm.length / normalizedNameFr.length) * 0.9;
            matchType = 'exact-fr';
          } else {
            // Try fuzzy matching, prioritize Arabic
            const fuzzyAr = fuzzyMatch(searchTerm, nameAr);
            if (fuzzyAr.match) {
              score = fuzzyAr.score * 0.95;
              matchType = 'fuzzy-ar';
            } else {
              const fuzzyFr = fuzzyMatch(searchTerm, nameFr);
              if (fuzzyFr.match) {
                score = fuzzyFr.score * 0.8;
                matchType = 'fuzzy-fr';
              }
            }
          }
        } else {
          // Prioritize Latin name for Latin queries
          if (normalizedNameFr.includes(normalizedTerm)) {
            score = (normalizedTerm.length / normalizedNameFr.length) * 1.0;
            matchType = 'exact-fr';
          } else if (normalizedNameAr.includes(normalizedTerm)) {
            score = (normalizedTerm.length / normalizedNameAr.length) * 0.9;
            matchType = 'exact-ar';
          } else {
            // Try fuzzy matching, prioritize Latin
            const fuzzyFr = fuzzyMatch(searchTerm, nameFr);
            if (fuzzyFr.match) {
              score = fuzzyFr.score * 0.95;
              matchType = 'fuzzy-fr';
            } else {
              const fuzzyAr = fuzzyMatch(searchTerm, nameAr);
              if (fuzzyAr.match) {
                score = fuzzyAr.score * 0.8;
                matchType = 'fuzzy-ar';
              }
            }
          }
        }
        
        if (score === 0) return null;
        
        return {
          id: student.NODOSS || student.Num_Bac,
          nameAr: student.NOM_AR || student.NOMPA,
          nameFr: student.NOM_FR || student.NOM,
          decision: student.Decision,
          serie: student.SERIE || student.Serie,
          student: student,
          score,
          matchType
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        // 1. Sort by score (descending)
        if (b.score !== a.score) return b.score - a.score;
        
        // 2. Prioritize exact matches over fuzzy
        const aIsExact = a.matchType.startsWith('exact');
        const bIsExact = b.matchType.startsWith('exact');
        if (aIsExact && !bIsExact) return -1;
        if (!aIsExact && bIsExact) return 1;
        
        // 3. Within same match type, prioritize Arabic over French
        const aIsArabic = a.matchType.endsWith('-ar');
        const bIsArabic = b.matchType.endsWith('-ar');
        if (aIsArabic && !bIsArabic) return -1;
        if (!aIsArabic && bIsArabic) return 1;
        
        // 4. As final tie-breaker, sort alphabetically by Arabic name
        return (a.nameAr || '').localeCompare(b.nameAr || '', 'ar');
      })
      .slice(0, 8); // Limit to 8 for better performance


    // Cache the result with enhanced key
    searchCacheRef.current.set(cacheKey, matches);
    
    // Limit cache size to prevent memory issues
    if (searchCacheRef.current.size > 150) { // Increased for character-type caching
      const firstKey = searchCacheRef.current.keys().next().value;
      searchCacheRef.current.delete(firstKey);
    }
    
    // Performance logging in development
    if (import.meta.env.DEV) {
      const searchTime = performance.now() - startTime;
      if (searchTime > 10) { // Log slow searches
        console.log(`🔍 Search performance: ${searchTime.toFixed(2)}ms for "${searchTerm}" (${searchType})`);
      }
    }
    
    return matches;
  }, [normalizeText, fuzzyMatch, loadData, bac2025Data]);

  // Debounced search for name suggestions
  const searchNameSuggestions = useCallback((searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) {
      setSearchSuggestions([]);
      setIsLoadingSuggestions(false);
      return;
    }

    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    setIsLoadingSuggestions(true);
    lastSearchTermRef.current = searchTerm;

    debounceTimeoutRef.current = setTimeout(async () => {
      // Check if this is still the latest search
      if (lastSearchTermRef.current !== searchTerm) {
        return;
      }

      try {
        const matches = await performSearch(searchTerm);
        
        // Double check we're still on the same search
        if (lastSearchTermRef.current === searchTerm) {
          setSearchSuggestions(matches);
        }
      } catch (error) {
        if (lastSearchTermRef.current === searchTerm) {
          setSearchSuggestions([]);
        }
      } finally {
        if (lastSearchTermRef.current === searchTerm) {
          setIsLoadingSuggestions(false);
        }
      }
    }, 250); // 250ms debounce for better responsiveness
  }, [performSearch]);

  // Search by exact name match
  const findStudentByName = useCallback(async (studentName) => {
    try {
      // Use cached data if available, otherwise load
      let allStudentsData;
      if (bac2025Data) {
        allStudentsData = { bac2025Data };
      } else {
        allStudentsData = await loadData();
      }
      
      const allStudents = allStudentsData.bac2025Data || [];
      
      // Detect student name character type
      const nameFirstChar = studentName.codePointAt(0);
      const nameIsArabic = (nameFirstChar >= 0x0600 && nameFirstChar <= 0x06FF) ||
                          (nameFirstChar >= 0x0750 && nameFirstChar <= 0x077F) ||
                          (nameFirstChar >= 0x08A0 && nameFirstChar <= 0x08FF);
      const nameType = nameIsArabic ? 'arabic' : 'latin';
      const normalizedStudentName = normalizeText(studentName, nameType);
      
      // First try exact match
      let student = allStudents.find(student => {
        const nameAr = student.NOM_AR || student.NOMPA || '';
        const nameFr = student.NOM_FR || student.NOM || '';
        
        const normalizedNameAr = normalizeText(nameAr, 'arabic');
        const normalizedNameFr = normalizeText(nameFr, 'latin');
        
        return normalizedNameAr === normalizedStudentName ||
               normalizedNameFr === normalizedStudentName;
      });

      // If no exact match, try fuzzy match with scoring
      if (!student) {
        let bestMatch = null;
        let bestScore = 0;
        
        for (const candidateStudent of allStudents) {
          const nameAr = candidateStudent.NOM_AR || candidateStudent.NOMPA || '';
          const nameFr = candidateStudent.NOM_FR || candidateStudent.NOM || '';
          
          const fuzzyAr = fuzzyMatch(studentName, nameAr);
          const fuzzyFr = fuzzyMatch(studentName, nameFr);
          
          let currentScore = 0;
          if (fuzzyAr.match && fuzzyFr.match) {
            currentScore = Math.max(fuzzyAr.score * 0.9, fuzzyFr.score * 0.85);
          } else if (fuzzyAr.match) {
            currentScore = fuzzyAr.score * 0.9;
          } else if (fuzzyFr.match) {
            currentScore = fuzzyFr.score * 0.85;
          }
          
          if (currentScore > bestScore && currentScore > 0.3) { // Minimum threshold
            bestScore = currentScore;
            bestMatch = candidateStudent;
          }
        }
        
        student = bestMatch;
      }

      return student;
    } catch (error) {
      return null;
    }
  }, [loadData, normalizeText, fuzzyMatch, bac2025Data]);

  // Combined search function
  const searchStudent = useCallback(async (searchTerm, searchType = 'id') => {
    if (!searchTerm) return null;

    if (searchType === 'id') {
      return await findStudentByBacNumber(searchTerm);
    } else {
      return await findStudentByName(searchTerm);
    }
  }, [findStudentByBacNumber, findStudentByName]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    searchCacheRef.current.clear();
    setSearchSuggestions([]);
    setIsLoadingSuggestions(false);
  }, []);

  // Stable clearSuggestions function
  const clearSuggestions = useCallback(() => {
    setSearchSuggestions([]);
    setIsLoadingSuggestions(false);
  }, []);

  return {
    searchStudent,
    searchNameSuggestions,
    searchSuggestions,
    isLoadingSuggestions,
    clearSuggestions,
    cleanup
  };
};

export default useSearchStudents;