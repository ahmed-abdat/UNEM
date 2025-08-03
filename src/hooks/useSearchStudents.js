import { useState, useCallback, useRef } from 'react';
import { useOptimizedStudentData } from './useOptimizedStudentData';

/**
 * Custom hook for searching students by ID or name with autocomplete
 * Uses the optimized chunked data system for mobile-friendly search
 */
export const useSearchStudents = () => {
  const { findStudentByBacNumber } = useOptimizedStudentData();
  
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  
  // Cache for search results
  const searchCacheRef = useRef(new Map());
  // const lastSearchTermRef = useRef('');
  const debounceTimeoutRef = useRef(null);

  // Main search function that handles both ID and name searches
  const searchStudent = useCallback(async (searchTerm, searchType = 'id') => {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return null;
    }

    const trimmedTerm = searchTerm.trim();

    // For ID search, use the optimized chunk-based search
    if (searchType === 'id') {
      try {
        const student = await findStudentByBacNumber(trimmedTerm);
        return student;
      } catch (error) {
        console.error('Student search error:', error);
        throw error;
      }
    }

    // For name search, show a message that it's not supported in the optimized version
    if (searchType === 'name') {
      throw new Error('البحث بالاسم غير متوفر حالياً. يرجى استخدام رقم الطالب للبحث.');
    }

    return null;
  }, [findStudentByBacNumber]);

  // Simplified name suggestions (returns empty for optimized version)
  const searchNameSuggestions = useCallback((searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) {
      setSearchSuggestions([]);
      setIsLoadingSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    
    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Show message that name search is not available in optimized mode
    debounceTimeoutRef.current = setTimeout(() => {
      setSearchSuggestions([]);
      setIsLoadingSuggestions(false);
      console.warn('Name search is not available in optimized mode. Use student ID instead.');
    }, 300);
  }, []);

  // Clear suggestions
  const clearSuggestions = useCallback(() => {
    setSearchSuggestions([]);
    setIsLoadingSuggestions(false);
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
  }, []);

  // Clear cache
  const clearCache = useCallback(() => {
    searchCacheRef.current.clear();
    clearSuggestions();
  }, [clearSuggestions]);

  return {
    // Core search methods
    searchStudent,
    findStudentByBacNumber,
    
    // Name search (simplified for optimized version)
    searchNameSuggestions,
    searchSuggestions,
    isLoadingSuggestions,
    clearSuggestions,
    
    // Cache management
    clearCache,
    
    // Status
    isOptimized: true,
    supportsNameSearch: false, // Disabled in optimized version
    searchMode: 'id-only',
    
    // Legacy compatibility (empty implementations)
    searchResults: [],
    isSearching: false,
    isReady: true,
    searchMetrics: {
      lastSearchTime: 0,
      totalSearches: 0,
      avgSearchTime: 0,
      cacheHitRate: 0
    }
  };
};

export default useSearchStudents;