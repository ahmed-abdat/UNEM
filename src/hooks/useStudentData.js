import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook for lazy loading BAC 2025 student data
 * Provides efficient access to BAC 2025 data only
 * Optimized for production with reduced bundle size
 */
export const useStudentData = () => {
  const [bac2025Data, setBac2025Data] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Cache the data once loaded to avoid re-loading
  const bac2025DataRef = useRef(null);
  const loadingRef = useRef(false);

  const loadData = useCallback(async () => {
    // Return cached data if already loaded
    if (bac2025DataRef.current) {
      setBac2025Data(bac2025DataRef.current);
      return {
        bac2025Data: bac2025DataRef.current
      };
    }

    // Prevent multiple simultaneous loads
    if (loadingRef.current) {
      // Wait for existing load to complete
      while (loadingRef.current) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return {
        bac2025Data: bac2025DataRef.current
      };
    }

    setLoading(true);
    setError(null);
    loadingRef.current = true;

    try {
      // Load BAC 2025 data
      const bac2025Module = await import('../data/bac2025.json');
      const bac2025DataLoaded = bac2025Module.default;

      // Cache the data
      bac2025DataRef.current = bac2025DataLoaded;

      // Update state
      setBac2025Data(bac2025DataLoaded);

      if (import.meta.env.DEV) {
        console.log('BAC 2025 data loaded successfully:', {
          bac2025Students: bac2025DataLoaded?.length || 0
        });
      }

      return {
        bac2025Data: bac2025DataLoaded
      };

    } catch (err) {
      const errorMessage = 'Failed to load BAC 2025 student data';
      setError(errorMessage);
      
      if (import.meta.env.DEV) {
        console.error('Error loading BAC 2025 data:', err);
      }
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, []);

  const findStudentByBacNumber = useCallback(async (bacNumber) => {
    // Use cached data if available, otherwise load
    let bac2025Students = bac2025DataRef.current;
    
    if (!bac2025Students) {
      const { bac2025Data } = await loadData();
      bac2025Students = bac2025Data;
    }
    
    if (!bac2025Students) {
      throw new Error('BAC 2025 student data not available');
    }

    // Search in BAC 2025 data
    const bac2025Student = bac2025Students.find(student => 
      student.NODOSS == bacNumber || student.NODOSS == +bacNumber
    );

    return bac2025Student || null;
  }, [loadData]);

  // Cleanup function to clear cache if needed
  const clearCache = useCallback(() => {
    bac2025DataRef.current = null;
    setBac2025Data(null);
    setError(null);
  }, []);

  return {
    // Data access
    bac2025Data,
    
    // State
    loading,
    error,
    
    // Methods
    loadData,
    findStudentByBacNumber,
    clearCache,
    
    // Computed properties
    isDataLoaded: !!bac2025Data,
    dataSize: {
      bac2025: bac2025Data?.length || 0,
    }
  };
};

export default useStudentData;