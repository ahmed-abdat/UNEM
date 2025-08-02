import { useState, useCallback, useRef } from 'react';
import useStudentData from './useStudentData';
import useFuzzySearch from './useFuzzySearch';

/**
 * Custom hook for searching students by ID or name with autocomplete
 * Provides fuzzy search and autocomplete functionality
 */
export const useSearchStudents = () => {
  const { findStudentByBacNumber } = useStudentData();
  const {
    searchWithDebounce,
    performSearch,
    findStudentExact,
    searchResults,
    isSearching,
    isReady,
    searchMetrics,
    clearSearch
  } = useFuzzySearch();
  
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  
  // Fallback cache for legacy search methods
  const searchCacheRef = useRef(new Map());
  const lastSearchTermRef = useRef('');
  const debounceTimeoutRef = useRef(null);

  // Note: All search functions are now imported from useFuzzySearch hook

  // Enhanced debounced search using Fuse.js
  const searchNameSuggestions = useCallback((searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) {
      setSearchSuggestions([]);
      setIsLoadingSuggestions(false);
      clearSearch();
      return;
    }

    setIsLoadingSuggestions(true);
    lastSearchTermRef.current = searchTerm;

    // Use the optimized Fuse.js search with debouncing
    searchWithDebounce(searchTerm, {
      limit: 8,
      scoreThreshold: 0.6
    });
    
    // Update suggestions when search results change
    setSearchSuggestions(searchResults);
    setIsLoadingSuggestions(isSearching);
  }, [searchWithDebounce, searchResults, isSearching, clearSearch]);

  // Enhanced search by name using Fuse.js
  const findStudentByName = useCallback(async (studentName) => {
    try {
      // Use the optimized Fuse.js search for exact matches
      return await findStudentExact(studentName);
    } catch (error) {
      console.error('Error finding student by name:', error);
      return null;
    }
  }, [findStudentExact]);

  // Combined search function
  const searchStudent = useCallback(async (searchTerm, searchType = 'id') => {
    if (!searchTerm) return null;

    if (searchType === 'id') {
      return await findStudentByBacNumber(searchTerm);
    } else {
      return await findStudentByName(searchTerm);
    }
  }, [findStudentByBacNumber, findStudentByName]);

  // Enhanced cleanup function
  const cleanup = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    searchCacheRef.current.clear();
    setSearchSuggestions([]);
    setIsLoadingSuggestions(false);
    clearSearch();
  }, [clearSearch]);

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
    cleanup,
    
    // Enhanced Fuse.js features
    performAdvancedSearch: performSearch,
    findStudentExact,
    isSearchReady: isReady,
    searchMetrics,
    
    // Performance insights (dev only)
    ...(import.meta.env.DEV && {
      _searchMetrics: searchMetrics,
      _fuseReady: isReady
    })
  };
};

export default useSearchStudents;