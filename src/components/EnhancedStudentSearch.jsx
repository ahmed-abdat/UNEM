import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Search, Users, Clock, Zap, BarChart3 } from 'lucide-react';
import useSearchStudents from '../hooks/useSearchStudents';
import useFuzzySearch from '../hooks/useFuzzySearch';
import { runQuickBenchmark } from '../utils/searchBenchmark';

/**
 * Enhanced Student Search Component with Performance Comparison
 * Demonstrates both custom fuzzy search and Fuse.js implementations
 */
const EnhancedStudentSearch = ({ onStudentSelect, placeholder = "البحث بالاسم..." }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState('fuse'); // 'fuse' or 'custom'
  const [showBenchmark, setShowBenchmark] = useState(false);
  const [benchmarkResults, setBenchmarkResults] = useState(null);
  const [isRunningBenchmark, setIsRunningBenchmark] = useState(false);
  
  // Custom search implementation
  const {
    searchNameSuggestions: customSearch,
    searchSuggestions: customResults,
    isLoadingSuggestions: customLoading,
    clearSuggestions: clearCustom,
    searchMetrics: customMetrics
  } = useSearchStudents();
  
  // Fuse.js implementation  
  const {
    searchWithDebounce: fuseSearch,
    searchResults: fuseResults,
    isSearching: fuseLoading,
    clearSearch: clearFuse,
    searchMetrics: fuseMetrics,
    isReady: fuseReady
  } = useFuzzySearch();
  
  const searchInputRef = useRef(null);
  
  // Current results based on selected mode
  const currentResults = searchMode === 'fuse' ? fuseResults : customResults;
  const isCurrentLoading = searchMode === 'fuse' ? fuseLoading : customLoading;
  const currentMetrics = searchMode === 'fuse' ? fuseMetrics : customMetrics;

  // Handle search input changes
  const handleSearchChange = useCallback((e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length >= 2) {
      if (searchMode === 'fuse') {
        fuseSearch(query);
      } else {
        customSearch(query);
      }
    } else {
      clearFuse();
      clearCustom();
    }
  }, [searchMode, fuseSearch, customSearch, clearFuse, clearCustom]);

  // Handle search mode toggle
  const handleModeChange = useCallback((newMode) => {
    setSearchMode(newMode);
    
    // Trigger search with current query in new mode
    if (searchQuery.length >= 2) {
      if (newMode === 'fuse') {
        fuseSearch(searchQuery);
      } else {
        customSearch(searchQuery);
      }
    }
  }, [searchQuery, fuseSearch, customSearch]);

  // Handle student selection
  const handleStudentSelect = useCallback((student) => {
    setSearchQuery('');
    clearFuse();
    clearCustom();
    onStudentSelect?.(student);
  }, [onStudentSelect, clearFuse, clearCustom]);

  // Run performance benchmark
  const runBenchmark = useCallback(async () => {
    if (!fuseReady || isRunningBenchmark) return;
    
    setIsRunningBenchmark(true);
    
    try {
      // Create wrapped search functions for benchmarking
      const fuseSearchFn = async (query) => {
        return new Promise((resolve) => {
          fuseSearch(query);
          // Wait for results to be ready
          setTimeout(() => resolve(fuseResults), 50);
        });
      };
      
      const customSearchFn = async (query) => {
        return new Promise((resolve) => {
          customSearch(query);
          // Wait for results to be ready
          setTimeout(() => resolve(customResults), 50);
        });
      };
      
      const results = await runQuickBenchmark(fuseSearchFn, customSearchFn, {
        iterations: 3,
        customQueries: ['محمد', 'Ahmed', 'فاطمة', 'Mohamed', 'مح', 'Ah']
      });
      
      setBenchmarkResults(results);
      setShowBenchmark(true);
      
    } catch (error) {
      console.error('Benchmark failed:', error);
    } finally {
      setIsRunningBenchmark(false);
    }
  }, [fuseReady, fuseSearch, customSearch, fuseResults, customResults, isRunningBenchmark]);

  // Focus search input on mount
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Search Mode Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleModeChange('fuse')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              searchMode === 'fuse'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Zap className="w-4 h-4 inline mr-1" />
            Fuse.js
          </button>
          <button
            onClick={() => handleModeChange('custom')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              searchMode === 'custom'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Users className="w-4 h-4 inline mr-1" />
            Custom
          </button>
        </div>
        
        {/* Benchmark Button */}
        {import.meta.env.DEV && (
          <button
            onClick={runBenchmark}
            disabled={!fuseReady || isRunningBenchmark}
            className="px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <BarChart3 className="w-4 h-4 inline mr-1" />
            {isRunningBenchmark ? 'Running...' : 'Benchmark'}
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            dir="auto"
          />
          {isCurrentLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>

        {/* Performance Metrics */}
        {searchQuery.length >= 2 && currentMetrics && (
          <div className="flex items-center justify-between text-xs text-gray-500 mt-2 px-2">
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              Last: {currentMetrics.lastSearchTime}ms
            </span>
            <span>Avg: {currentMetrics.avgSearchTime}ms</span>
            <span>Cache: {currentMetrics.cacheHitRate}%</span>
            <span>Total: {currentMetrics.totalSearches}</span>
          </div>
        )}
      </div>

      {/* Search Results */}
      {currentResults.length > 0 && (
        <div className="mt-4 bg-white border border-gray-200 rounded-xl shadow-lg max-h-96 overflow-y-auto">
          {currentResults.map((student, index) => (
            <div
              key={student.id || index}
              onClick={() => handleStudentSelect(student)}
              className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {student.nameAr || student.displayName}
                  </div>
                  {student.nameFr && student.nameFr !== student.nameAr && (
                    <div className="text-sm text-gray-600 mt-1">
                      {student.nameFr || student.secondaryName}
                    </div>
                  )}
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    {student.serie && (
                      <span>السلسلة: {student.serie}</span>
                    )}
                    {student.decision && (
                      <span className={`px-2 py-1 rounded ${
                        student.decision.includes('ناجح') || student.decision.includes('Admis')
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {student.decision}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Search Score (Dev only) */}
                {import.meta.env.DEV && student.score !== undefined && (
                  <div className="text-xs text-gray-400 ml-4">
                    Score: {(student.score * 100).toFixed(1)}%
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {searchQuery.length >= 2 && !isCurrentLoading && currentResults.length === 0 && (
        <div className="mt-4 p-6 bg-gray-50 rounded-xl text-center text-gray-500">
          <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p>لا توجد نتائج للبحث "{searchQuery}"</p>
          <p className="text-sm mt-1">جرب مصطلح بحث مختلف</p>
        </div>
      )}

      {/* Benchmark Results Modal */}
      {showBenchmark && benchmarkResults && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Performance Benchmark Results</h3>
                <button
                  onClick={() => setShowBenchmark(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              {/* Summary */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900">Fuse.js</h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {benchmarkResults.summary.avgFuseTime}ms
                  </p>
                  <p className="text-sm text-blue-700">
                    {benchmarkResults.summary.fuseWins} wins
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900">Custom</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {benchmarkResults.summary.avgCustomTime}ms
                  </p>
                  <p className="text-sm text-green-700">
                    {benchmarkResults.summary.customWins} wins
                  </p>
                </div>
              </div>
              
              {/* Recommendation */}
              <div className={`p-4 rounded-lg mb-4 ${
                benchmarkResults.summary.recommendation.choice === 'fuse'
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-green-50 border border-green-200'
              }`}>
                <h4 className="font-medium mb-2">Recommendation</h4>
                <p className="text-sm">
                  <strong>{benchmarkResults.summary.recommendation.choice === 'fuse' ? 'Fuse.js' : 'Custom'}</strong>
                  {' - '}{benchmarkResults.summary.recommendation.reason}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Confidence: {benchmarkResults.summary.recommendation.confidence}
                </p>
              </div>
              
              {/* Detailed Results */}
              <div className="space-y-2">
                <h4 className="font-medium">Individual Query Results</h4>
                {benchmarkResults.results.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="font-mono text-sm">"{result.query}"</span>
                    <div className="flex items-center space-x-4 text-xs">
                      <span className={result.winner === 'fuse' ? 'text-blue-600 font-medium' : 'text-gray-600'}>
                        {result.fuse.avgTime.toFixed(1)}ms
                      </span>
                      <span className={result.winner === 'custom' ? 'text-green-600 font-medium' : 'text-gray-600'}>
                        {result.custom.avgTime.toFixed(1)}ms
                      </span>
                      <span className="text-purple-600">
                        {result.improvement.toFixed(1)}% faster
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedStudentSearch;