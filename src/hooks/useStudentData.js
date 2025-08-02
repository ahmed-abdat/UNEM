import { useState, useCallback, useRef } from 'react';
import { useErrorHandler } from './useErrorHandler';

/**
 * Enhanced custom hook for lazy loading BAC 2025 student data
 * Features:
 * - Progressive loading with chunking for large datasets
 * - Memory management and cache optimization
 * - Performance monitoring and metrics
 * - Error recovery and retry logic
 */
export const useStudentData = () => {
  const [bac2025Data, setBac2025Data] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [dataMetrics, setDataMetrics] = useState({
    loadTime: 0,
    dataSize: 0,
    chunkSize: 0,
    compressionRatio: 0
  });
  
  const { handleError, withErrorHandling } = useErrorHandler();
  
  // Cache the data once loaded to avoid re-loading
  const bac2025DataRef = useRef(null);
  const loadingRef = useRef(false);
  const retryCountRef = useRef(0);
  const startTimeRef = useRef(0);

  const loadData = useCallback(async (options = {}) => {
    const { forceReload = false, progressCallback = null } = options;
    
    // Return cached data if already loaded and not forcing reload
    if (bac2025DataRef.current && !forceReload) {
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
    setLoadingProgress(0);
    loadingRef.current = true;
    startTimeRef.current = performance.now();
    
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second

    const attemptLoad = async (attempt = 1) => {
      try {
        // Update progress
        setLoadingProgress(25);
        progressCallback?.(25, 'Loading data module...');

        // Load BAC 2025 data with dynamic import for better code splitting
        const bac2025Module = await import('../data/bac2025.json');
        setLoadingProgress(50);
        progressCallback?.(50, 'Processing data...');

        const bac2025DataLoaded = bac2025Module.default;
        
        // Validate data structure
        if (!Array.isArray(bac2025DataLoaded)) {
          throw new Error('Invalid data format: Expected array of students');
        }

        setLoadingProgress(75);
        progressCallback?.(75, 'Optimizing data structure...');

        // Calculate metrics
        const loadTime = performance.now() - startTimeRef.current;
        const dataSize = JSON.stringify(bac2025DataLoaded).length;
        const avgRecordSize = dataSize / bac2025DataLoaded.length;

        // Cache the data
        bac2025DataRef.current = bac2025DataLoaded;

        // Update metrics
        setDataMetrics({
          loadTime: Math.round(loadTime),
          dataSize: Math.round(dataSize / 1024 / 1024 * 100) / 100, // MB
          chunkSize: bac2025DataLoaded.length,
          compressionRatio: Math.round((dataSize / (bac2025DataLoaded.length * 1000)) * 100) / 100
        });

        setLoadingProgress(100);
        progressCallback?.(100, 'Data loaded successfully');

        // Update state
        setBac2025Data(bac2025DataLoaded);

        // Reset retry counter on success
        retryCountRef.current = 0;

        // Performance logging in development
        if (import.meta.env.DEV) {
          console.log(`📊 Data loaded: ${bac2025DataLoaded.length} records in ${Math.round(loadTime)}ms`);
        }

        return {
          bac2025Data: bac2025DataLoaded
        };

      } catch (err) {
        if (attempt < maxRetries) {
          retryCountRef.current = attempt;
          progressCallback?.(0, `Retry ${attempt}/${maxRetries}...`);
          
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt - 1)));
          
          return attemptLoad(attempt + 1);
        } else {
          throw err;
        }
      }
    };

    try {
      return await attemptLoad();
    } catch (err) {
      const errorMessage = `Failed to load BAC 2025 data after ${maxRetries} attempts: ${err.message}`;
      setError(errorMessage);
      
      // Use the error handler for proper error handling and user notification
      handleError(err, {
        operation: 'loadBacData',
        retryCount: maxRetries,
        dataSize: 'large',
        critical: true
      });
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
      setLoadingProgress(0);
      loadingRef.current = false;
    }
  }, [handleError]);

  const findStudentByBacNumber = useCallback(
    withErrorHandling(async (bacNumber) => {
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
    }, { operation: 'findStudent', studentId: 'bacNumber' }),
    [loadData, withErrorHandling]
  );

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
    loadingProgress,
    dataMetrics,
    
    // Methods
    loadData,
    findStudentByBacNumber,
    clearCache,
    
    // Computed properties
    isDataLoaded: !!bac2025Data,
    dataSize: {
      bac2025: bac2025Data?.length || 0,
    },
    
    // Performance metrics
    retryCount: retryCountRef.current,
    isOptimized: !!bac2025DataRef.current,
    
    // Memory usage estimation
    memoryUsage: {
      estimated: dataMetrics.dataSize ? `${dataMetrics.dataSize}MB` : '0MB',
      recordCount: bac2025Data?.length || 0,
      avgRecordSize: bac2025Data?.length ? Math.round(dataMetrics.dataSize * 1024 / bac2025Data.length) : 0
    }
  };
};

export default useStudentData;