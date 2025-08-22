import { useState, useCallback, useRef, useMemo } from 'react';

/**
 * Multi-session student data hook with support for regular and complementary sessions
 * Extends the optimized chunked loading system to handle multiple BAC sessions
 */
export const useMultiSessionStudentData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchProgress, setSearchProgress] = useState(0);
  const [currentSession, setCurrentSession] = useState('complementary'); // 'complementary' is default (most important now)
  
  // Cache for loaded chunks and indexes per session
  const indexCacheRef = useRef(new Map()); // session -> index
  const chunkCacheRef = useRef(new Map()); // session_chunkFile -> data
  const loadingRef = useRef(false);

  // Session configurations
  const sessionConfigs = useMemo(() => ({
    regular: {
      indexPath: '/data/chunks/index.json',
      chunksPath: '/data/chunks/',
      displayName: 'Session Principale',
      year: '2025'
    },
    complementary: {
      indexPath: '/data/chunks-complementary/index.json',
      chunksPath: '/data/chunks-complementary/',
      displayName: 'Session Complémentaire',
      year: '2025'
    }
  }), []);

  // Retry mechanism for network requests
  const fetchWithRetry = useCallback(async (url, options = {}, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (response.ok) {
          return response;
        }
        throw new Error(`HTTP ${response.status}`);
      } catch (error) {
        if (i === retries - 1) {
          throw error;
        }
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }, []);

  // Load the chunk index for a specific session
  const loadIndex = useCallback(async (session = currentSession) => {
    const cacheKey = session;
    if (indexCacheRef.current.has(cacheKey)) {
      return indexCacheRef.current.get(cacheKey);
    }

    const config = sessionConfigs[session];
    if (!config) {
      throw new Error(`Session configuration not found: ${session}`);
    }

    try {
      const response = await fetchWithRetry(config.indexPath, {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'max-age=3600'
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`بيانات ${config.displayName} غير متوفرة حالياً. حاول لاحقاً.`);
        } else if (response.status >= 500) {
          throw new Error('خطأ في الخادم. حاول مرة أخرى لاحقاً.');
        } else {
          throw new Error(`HTTP ${response.status}: فشل في تحميل فهرس البيانات`);
        }
      }
      
      const index = await response.json();
      
      // Validate index structure
      if (!index || typeof index !== 'object') {
        throw new Error('Invalid response format');
      }
      
      if (!index.chunks || !Array.isArray(index.chunks) || index.chunks.length === 0) {
        throw new Error('Invalid chunk index format or empty chunks');
      }
      
      // Validate chunk structure
      const validChunk = index.chunks.every(chunk => 
        chunk.file && chunk.nodeRange && chunk.nodeRange.min && chunk.nodeRange.max
      );
      
      if (!validChunk) {
        throw new Error('Invalid chunk structure in index');
      }
      
      indexCacheRef.current.set(cacheKey, index);
      return index;
    } catch (err) {
      indexCacheRef.current.delete(cacheKey);
      
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        throw new Error('مشكلة في الاتصال بالإنترنت. تحقق من الاتصال وحاول مرة أخرى.');
      } else if (err.name === 'SyntaxError') {
        throw new Error('خطأ في تنسيق البيانات. حاول مرة أخرى لاحقاً.');
      }
      
      throw err;
    }
  }, [currentSession, sessionConfigs, fetchWithRetry]);

  // Find which chunk contains a specific student ID
  const findChunkForStudentId = useCallback((studentId, chunks) => {
    const numericId = parseInt(studentId, 10);
    if (isNaN(numericId)) return null;
    
    return chunks.find(chunk => {
      const minId = parseInt(chunk.nodeRange.min, 10);
      const maxId = parseInt(chunk.nodeRange.max, 10);
      return numericId >= minId && numericId <= maxId;
    });
  }, []);

  // Load a specific chunk from a session
  const loadChunk = useCallback(async (chunkFile, session = currentSession) => {
    const cacheKey = `${session}_${chunkFile}`;
    if (chunkCacheRef.current.has(cacheKey)) {
      return chunkCacheRef.current.get(cacheKey);
    }

    const config = sessionConfigs[session];
    if (!config) {
      throw new Error(`Session configuration not found: ${session}`);
    }

    try {
      const chunkUrl = `${config.chunksPath}${chunkFile}`;
      const response = await fetchWithRetry(chunkUrl, {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'max-age=3600'
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Chunk not found');
        }
        throw new Error(`HTTP ${response.status}`);
      }
      
      const chunkData = await response.json();
      
      // Validate chunk data
      if (!chunkData || !chunkData.students || !Array.isArray(chunkData.students)) {
        throw new Error('Invalid chunk format');
      }
      
      // Cache management: Keep only recent chunks to save memory
      if (chunkCacheRef.current.size > 10) {
        const firstKey = chunkCacheRef.current.keys().next().value;
        chunkCacheRef.current.delete(firstKey);
      }
      
      chunkCacheRef.current.set(cacheKey, chunkData);
      return chunkData;
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        throw new Error('مشكلة في الاتصال. تحقق من الإنترنت وحاول مرة أخرى.');
      }
      throw err;
    }
  }, [currentSession, sessionConfigs, fetchWithRetry]);

  // Enhanced student search with session support
  const findStudentByBacNumber = useCallback(async (bacNumber, searchSession = currentSession) => {
    if (loadingRef.current) {
      throw new Error('بحث آخر قيد التنفيذ. يرجى الانتظار...');
    }

    setLoading(true);
    setError(null);
    setSearchProgress(0);
    loadingRef.current = true;

    try {
      // Step 1: Load index (10% progress)
      setSearchProgress(10);
      const index = await loadIndex(searchSession);
      
      // Step 2: Validate student ID format
      const numericId = parseInt(bacNumber, 10);
      if (isNaN(numericId) || numericId < 1) {
        setSearchProgress(100);
        return null;
      }
      
      // Step 3: Find appropriate chunk (30% progress)
      setSearchProgress(30);
      const targetChunk = findChunkForStudentId(bacNumber, index.chunks);
      
      if (!targetChunk) {
        setSearchProgress(100);
        return null;
      }
      
      // Step 4: Load specific chunk (70% progress)
      setSearchProgress(70);
      const chunkData = await loadChunk(targetChunk.file, searchSession);
      
      // Step 5: Search within chunk (90% progress)
      setSearchProgress(90);
      const student = chunkData.students.find(student => 
        student.NODOSS == bacNumber || student.NODOSS == +bacNumber
      );
      
      // Step 6: Complete (100% progress)
      setSearchProgress(100);
      
      // Log performance metrics in development
      if (import.meta.env.DEV) {
        console.log(`🔍 Student search: ID ${bacNumber}, Session: ${searchSession}, Chunk: ${targetChunk.file}, Found: ${!!student}`);
      }
      
      // Add session information to student result
      if (student) {
        student._sessionInfo = {
          session: searchSession,
          sessionName: sessionConfigs[searchSession].displayName,
          year: sessionConfigs[searchSession].year
        };
      }
      
      return student || null;
      
    } catch (err) {
      let userMessage = 'حدث خطأ أثناء البحث. حاول مرة أخرى لاحقاً.';
      
      if (err.message.includes('الاتصال') || err.message.includes('إنترنت')) {
        userMessage = 'مشكلة في الاتصال بالإنترنت. تحقق من الاتصال وحاول مرة أخرى.';
      } else if (err.message.includes('غير متوفرة')) {
        userMessage = err.message;
      }
      
      console.error('Student search error:', err);
      setError(userMessage);
      throw new Error(userMessage);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [currentSession, loadIndex, findChunkForStudentId, loadChunk, sessionConfigs]);

  // Search in both sessions
  const findStudentInAllSessions = useCallback(async (bacNumber) => {
    const sessions = ['regular', 'complementary'];
    const results = [];

    for (const session of sessions) {
      try {
        const student = await findStudentByBacNumber(bacNumber, session);
        if (student) {
          results.push(student);
        }
      } catch (error) {
        console.warn(`Search failed in ${session} session:`, error.message);
      }
    }

    return results;
  }, [findStudentByBacNumber]);

  // Clear cache for a specific session or all sessions
  const clearCache = useCallback((session = null) => {
    if (session) {
      indexCacheRef.current.delete(session);
      // Clear chunks for this session
      const keysToDelete = [];
      for (const [key] of chunkCacheRef.current) {
        if (key.startsWith(`${session}_`)) {
          keysToDelete.push(key);
        }
      }
      keysToDelete.forEach(key => chunkCacheRef.current.delete(key));
    } else {
      indexCacheRef.current.clear();
      chunkCacheRef.current.clear();
    }
  }, []);

  // Preload index for faster initial searches
  const preloadIndex = useCallback(async (session = currentSession) => {
    try {
      await loadIndex(session);
      return true;
    } catch (err) {
      console.warn(`Index preload failed for ${session}:`, err.message);
      return false;
    }
  }, [loadIndex, currentSession]);

  // Switch between sessions
  const switchSession = useCallback((newSession) => {
    if (sessionConfigs[newSession]) {
      setCurrentSession(newSession);
      setError(null);
      setSearchProgress(0);
    } else {
      throw new Error(`Invalid session: ${newSession}`);
    }
  }, [sessionConfigs]);

  // Get available sessions
  const getAvailableSessions = useCallback(() => {
    return Object.keys(sessionConfigs).map(key => ({
      key,
      name: sessionConfigs[key].displayName,
      year: sessionConfigs[key].year
    }));
  }, [sessionConfigs]);

  return {
    // State
    loading,
    error,
    searchProgress,
    currentSession,
    
    // Core methods
    findStudentByBacNumber,
    findStudentInAllSessions,
    clearCache,
    
    // Session management
    switchSession,
    getAvailableSessions,
    
    // Preloading utilities
    preloadIndex,
    
    // Status
    isOptimized: true,
    supportsMultipleSessions: true,
    availableSessions: Object.keys(sessionConfigs),
    currentSessionConfig: sessionConfigs[currentSession],
    
    // Legacy compatibility
    isDataLoaded: true,
    memoryUsage: () => ({
      indexCache: indexCacheRef.current.size,
      chunkCache: chunkCacheRef.current.size,
      sessions: Object.keys(sessionConfigs)
    })
  };
};

export default useMultiSessionStudentData;
