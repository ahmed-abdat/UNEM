import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook for lazy loading student data
 * Provides efficient access to BAC 2024, Session 2024, and BAC 2025 data
 * Reduces initial bundle size by loading data only when needed
 */
export const useStudentData = () => {
  const [bacData, setBacData] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [bac2025Data, setBac2025Data] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Cache the data once loaded to avoid re-loading
  const bacDataRef = useRef(null);
  const sessionDataRef = useRef(null);
  const bac2025DataRef = useRef(null);
  const loadingRef = useRef(false);

  const loadData = useCallback(async () => {
    // Return cached data if already loaded
    if (bacDataRef.current && sessionDataRef.current && bac2025DataRef.current) {
      setBacData(bacDataRef.current);
      setSessionData(sessionDataRef.current);
      setBac2025Data(bac2025DataRef.current);
      return {
        bacData: bacDataRef.current,
        sessionData: sessionDataRef.current,
        bac2025Data: bac2025DataRef.current
      };
    }

    // Prevent multiple simultaneous loads
    if (loadingRef.current) {
      return new Promise((resolve) => {
        const checkLoaded = () => {
          if (bacDataRef.current && sessionDataRef.current && bac2025DataRef.current) {
            resolve({
              bacData: bacDataRef.current,
              sessionData: sessionDataRef.current,
              bac2025Data: bac2025DataRef.current
            });
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
      });
    }

    setLoading(true);
    setError(null);
    loadingRef.current = true;

    try {
      if (import.meta.env.DEV) {
        console.log('Loading student data...');
      }

      // Load all datasets in parallel for better performance
      const [sessionModule, bac2025Module] = await Promise.all([
        import('../data/Session2024.json'),
        import('../data/bac2025.json')
      ]);

      const sessionDataLoaded = sessionModule.default;
      const bac2025DataLoaded = bac2025Module.default;

      // Cache the data
      sessionDataRef.current = sessionDataLoaded;
      bac2025DataRef.current = bac2025DataLoaded;

      // Update state
      setSessionData(sessionDataLoaded);
      setBac2025Data(bac2025DataLoaded);

      if (import.meta.env.DEV) {
        console.log('Student data loaded successfully:', {
          sessionStudents: sessionDataLoaded?.length || 0,
          bac2025Students: bac2025DataLoaded?.length || 0
        });
      }

      return {
        sessionData: sessionDataLoaded,
        bac2025Data: bac2025DataLoaded
      };

    } catch (err) {
      const errorMessage = 'Failed to load student data';
      setError(errorMessage);
      
      if (import.meta.env.DEV) {
        console.error('Error loading student data:', err);
      }
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, []);

  const findStudentByBacNumber = useCallback(async (bacNumber) => {
    const { sessionData: sessionStudents, bac2025Data: bac2025Students } = await loadData();
    
    if (!sessionStudents || !bac2025Students) {
      throw new Error('Student data not available');
    }

    // First, search in BAC 2025 data
    const bac2025Student = bac2025Students.find(student => 
      student.NODOSS == bacNumber || student.NODOSS == +bacNumber
    );

    // If found, return BAC 2025 student
    if (bac2025Student) {
      return bac2025Student;
    }

    // Otherwise, search in Session 2024 data as fallback
    const sessionStudent = sessionStudents.find(student => 
      student.NODOSS == bacNumber || student.NODOSS == +bacNumber
    );

    return sessionStudent;
  }, [loadData]);

  const findStudentByNodess = useCallback(async (nodess) => {
    const { sessionData: sessionStudents } = await loadData();
    
    if (!sessionStudents) {
      throw new Error('Session data not available');
    }

    return sessionStudents.find(student => 
      student.NODOSS == nodess || student.NODOSS == +nodess
    );
  }, [loadData]);

  // Cleanup function to clear cache if needed
  const clearCache = useCallback(() => {
    bacDataRef.current = null;
    sessionDataRef.current = null;
    setBacData(null);
    setSessionData(null);
    setError(null);
  }, []);

  return {
    // Data access
    bacData,
    sessionData,
    
    // State
    loading,
    error,
    
    // Methods
    loadData,
    findStudentByBacNumber,
    findStudentByNodess,
    clearCache,
    
    // Computed properties
    isDataLoaded: !!(bacData && sessionData),
    dataSize: {
      bac: bacData?.length || 0,
      session: sessionData?.length || 0,
      total: (bacData?.length || 0) + (sessionData?.length || 0)
    }
  };
};

export default useStudentData;