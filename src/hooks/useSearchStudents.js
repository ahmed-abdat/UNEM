import { useState, useCallback, useMemo, useRef } from 'react';
import useStudentData from './useStudentData';

/**
 * Custom hook for searching students by ID or name with autocomplete
 * Provides fuzzy search and autocomplete functionality
 */
export const useSearchStudents = () => {
  const { findStudentByBacNumber } = useStudentData();
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  
  // Cache for search results to avoid repeated calculations
  const searchCacheRef = useRef(new Map());
  const lastSearchTermRef = useRef('');
  const debounceTimeoutRef = useRef(null);

  // Normalize Arabic text for better matching
  const normalizeArabicText = useCallback((text) => {
    if (!text) return '';
    return text
      .replace(/[أإآ]/g, 'ا')
      .replace(/[ة]/g, 'ه')
      .replace(/[ى]/g, 'ي')
      .replace(/[ؤ]/g, 'و')
      .replace(/[ئ]/g, 'ي')
      .toLowerCase()
      .trim();
  }, []);

  // Simple fuzzy search function
  const fuzzyMatch = useCallback((searchTerm, targetText) => {
    const normalizedSearch = normalizeArabicText(searchTerm);
    const normalizedTarget = normalizeArabicText(targetText);
    
    if (!normalizedSearch || !normalizedTarget) return false;
    
    // Exact match gets highest score
    if (normalizedTarget.includes(normalizedSearch)) return true;
    
    // Check if all characters of search term exist in order
    let searchIndex = 0;
    for (let i = 0; i < normalizedTarget.length && searchIndex < normalizedSearch.length; i++) {
      if (normalizedTarget[i] === normalizedSearch[searchIndex]) {
        searchIndex++;
      }
    }
    
    return searchIndex === normalizedSearch.length;
  }, [normalizeArabicText]);

  // Optimized search with caching and scoring
  const performSearch = useCallback(async (searchTerm) => {
    const normalizedTerm = normalizeArabicText(searchTerm);
    
    if (import.meta.env.DEV) {
      console.log('🔍 Searching for:', { searchTerm, normalizedTerm });
    }
    
    // Check cache first
    if (searchCacheRef.current.has(normalizedTerm)) {
      const cached = searchCacheRef.current.get(normalizedTerm);
      if (import.meta.env.DEV) {
        console.log('📱 Using cached results:', cached.length, 'matches');
      }
      return cached;
    }

    const { bac2025Data, sessionData } = await useStudentData().loadData();
    const allStudents = [...(bac2025Data || []), ...(sessionData || [])];
    
    if (import.meta.env.DEV) {
      console.log('📊 Total students to search:', allStudents.length);
      console.log('📄 Sample student data:', allStudents[0]);
    }
    
    const matches = allStudents
      .map((student, index) => {
        const nameAr = student.NOM_AR || student.NOMPA || '';
        const nameFr = student.NOM_FR || student.NOM || '';
        
        let score = 0;
        let matchType = '';
        
        // Debug first few students
        if (import.meta.env.DEV && index < 3) {
          console.log(`Student ${index}:`, { nameAr, nameFr, searchTerm, normalizedTerm });
        }
        
        // Exact match gets highest score
        const normalizedNameAr = normalizeArabicText(nameAr);
        const normalizedNameFr = normalizeArabicText(nameFr);
        
        if (normalizedNameAr.includes(normalizedTerm)) {
          score = normalizedTerm.length / normalizedNameAr.length;
          matchType = 'exact-ar';
          if (import.meta.env.DEV && score > 0) {
            console.log('✅ Arabic exact match:', { nameAr, score });
          }
        } else if (normalizedNameFr.includes(normalizedTerm)) {
          score = normalizedTerm.length / normalizedNameFr.length;
          matchType = 'exact-fr';
          if (import.meta.env.DEV && score > 0) {
            console.log('✅ French exact match:', { nameFr, score });
          }
        } else if (fuzzyMatch(searchTerm, nameAr)) {
          score = 0.6;
          matchType = 'fuzzy-ar';
          if (import.meta.env.DEV) {
            console.log('🔍 Arabic fuzzy match:', { nameAr, score });
          }
        } else if (fuzzyMatch(searchTerm, nameFr)) {
          score = 0.5;
          matchType = 'fuzzy-fr';
          if (import.meta.env.DEV) {
            console.log('🔍 French fuzzy match:', { nameFr, score });
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
        // Sort by score desc, then by match type (exact > fuzzy)
        if (b.score !== a.score) return b.score - a.score;
        if (a.matchType === 'exact' && b.matchType === 'fuzzy') return -1;
        if (a.matchType === 'fuzzy' && b.matchType === 'exact') return 1;
        return 0;
      })
      .slice(0, 8); // Limit to 8 for better performance

    if (import.meta.env.DEV) {
      console.log('🎯 Search results:', matches.length, 'matches found');
      console.log('📋 Results:', matches.map(m => ({ name: m.nameAr, score: m.score, type: m.matchType })));
    }

    // Cache the result
    searchCacheRef.current.set(normalizedTerm, matches);
    
    // Limit cache size to prevent memory issues
    if (searchCacheRef.current.size > 100) {
      const firstKey = searchCacheRef.current.keys().next().value;
      searchCacheRef.current.delete(firstKey);
    }
    
    return matches;
  }, [normalizeArabicText, fuzzyMatch]);

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
        console.error('Error searching names:', error);
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
      const { bac2025Data, sessionData } = await useStudentData().loadData();
      const allStudents = [...(bac2025Data || []), ...(sessionData || [])];
      
      // First try exact match
      let student = allStudents.find(student => {
        const nameAr = student.NOM_AR || student.NOMPA || '';
        const nameFr = student.NOM_FR || student.NOM || '';
        
        return normalizeArabicText(nameAr) === normalizeArabicText(studentName) ||
               normalizeArabicText(nameFr) === normalizeArabicText(studentName);
      });

      // If no exact match, try fuzzy match
      if (!student) {
        student = allStudents.find(student => {
          const nameAr = student.NOM_AR || student.NOMPA || '';
          const nameFr = student.NOM_FR || student.NOM || '';
          
          return fuzzyMatch(studentName, nameAr) || 
                 fuzzyMatch(studentName, nameFr);
        });
      }

      return student;
    } catch (error) {
      console.error('Error finding student by name:', error);
      return null;
    }
  }, [normalizeArabicText, fuzzyMatch]);

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

  return {
    searchStudent,
    searchNameSuggestions,
    searchSuggestions,
    isLoadingSuggestions,
    clearSuggestions: () => setSearchSuggestions([]),
    cleanup
  };
};

export default useSearchStudents;