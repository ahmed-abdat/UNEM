import { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  TrendingUp, 
  Clock, 
  Zap,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { SearchBenchmark, runQuickBenchmark } from '@/utils/searchBenchmark';
import useFuzzySearch from '@/hooks/useFuzzySearch';
import useSearchStudents from '@/hooks/useSearchStudents';

/**
 * Production-ready search performance testing component
 * Comprehensive comparison between Fuse.js and legacy search
 */
const SearchPerformanceTest = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState('');
  const [testConfig, setTestConfig] = useState({
    iterations: 5,
    warmupRuns: 2,
    includeStressTest: false,
    testDataSize: 'full' // 'sample' | 'full'
  });

  // Hooks for both search implementations
  const fuseSearch = useFuzzySearch();
  const legacySearch = useSearchStudents();
  
  const benchmarkRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Initialize benchmark
  useEffect(() => {
    benchmarkRef.current = new SearchBenchmark();
  }, []);

  // Production test queries - comprehensive coverage
  const getTestQueries = useCallback(() => {
    const baseQueries = [
      // Common Arabic names
      'محمد', 'أحمد', 'فاطمة', 'عائشة', 'عبد الله', 'خديجة', 'يوسف', 'مريم',
      'عبد الرحمن', 'زينب', 'عمر', 'سارة', 'علي', 'هدى', 'حسن', 'نور',
      
      // Common French names
      'Mohamed', 'Ahmed', 'Fatima', 'Aicha', 'Abdallah', 'Khadija', 'Youssef', 'Mariem',
      'Abderrahmane', 'Zineb', 'Omar', 'Sarah', 'Ali', 'Houda', 'Hassan', 'Nour',
      
      // Partial searches (2-3 chars)
      'مح', 'أح', 'فا', 'عا', 'Mo', 'Ah', 'Fa', 'Ab',
      
      // Edge cases
      'ا', 'A', // Single characters
      'محمد احمد', 'Mohamed Ahmed', // Multiple words
      'محمض', 'فاضمة', 'Mohamad', 'Ahmid', // Typos
      'MOHAMED', 'ahmed', 'FaTiMa', // Case variations
      
      // Empty and special characters
      '', '   ', '123', '!@#', // Invalid inputs
      
      // Long names
      'عبد الرحمن محمد احمد', 'Mohammed Abderrahmane Ahmed'
    ];

    if (testConfig.includeStressTest) {
      // Add stress test queries
      const stressQueries = [];
      for (let i = 0; i < 50; i++) {
        stressQueries.push(`test${i}`);
      }
      return [...baseQueries, ...stressQueries];
    }

    return testConfig.testDataSize === 'sample' ? baseQueries.slice(0, 15) : baseQueries;
  }, [testConfig]);

  // Wrapper functions for consistent testing
  const fuseSearchWrapper = useCallback(async (query) => {
    try {
      // Use the optimized Fuse.js search
      const results = await fuseSearch.performSearch(query, { 
        limit: 8, 
        scoreThreshold: 0.4 
      });
      return results || [];
    } catch (error) {
      console.error('Fuse search error:', error);
      return [];
    }
  }, [fuseSearch.performSearch]);

  const legacySearchWrapper = useCallback(async (query) => {
    try {
      // Use the legacy search implementation
      const results = await legacySearch.performAdvancedSearch(query);
      return results || [];
    } catch (error) {
      console.error('Legacy search error:', error);
      return [];
    }
  }, [legacySearch.performAdvancedSearch]);

  // Run comprehensive benchmark
  const runBenchmark = useCallback(async () => {
    if (isRunning) return;

    setIsRunning(true);
    setProgress(0);
    setResults(null);
    setCurrentTest('Initializing...');

    abortControllerRef.current = new AbortController();

    try {
      const queries = getTestQueries();
      const totalSteps = queries.length;

      // Enhanced benchmark with progress tracking
      const enhancedBenchmark = new SearchBenchmark();
      const results = [];

      for (let i = 0; i < queries.length; i++) {
        if (abortControllerRef.current.signal.aborted) {
          throw new Error('Benchmark cancelled');
        }

        const query = queries[i];
        setCurrentTest(`Testing: "${query}" (${i + 1}/${totalSteps})`);
        
        // Run single query benchmark
        const queryResult = await enhancedBenchmark.runComparison(
          [query], 
          fuseSearchWrapper, 
          legacySearchWrapper,
          {
            iterations: testConfig.iterations,
            warmupRuns: testConfig.warmupRuns,
            logResults: false
          }
        );

        results.push(...queryResult.results);
        setProgress((i + 1) / totalSteps * 100);

        // Small delay to prevent UI blocking
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      // Generate comprehensive summary
      const summary = enhancedBenchmark.generateSummary();
      const productionAnalysis = generateProductionAnalysis(results, summary);

      setResults({
        results,
        summary,
        productionAnalysis,
        testConfig,
        timestamp: new Date().toISOString()
      });

      setCurrentTest('Benchmark completed!');

    } catch (error) {
      console.error('Benchmark error:', error);
      setCurrentTest(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
      abortControllerRef.current = null;
    }
  }, [
    isRunning, 
    getTestQueries, 
    fuseSearchWrapper, 
    legacySearchWrapper, 
    testConfig
  ]);

  // Generate production readiness analysis
  const generateProductionAnalysis = useCallback((results, summary) => {
    const analysis = {
      performance: {
        recommendation: summary.recommendation,
        avgResponseTime: summary.avgFuseTime < summary.avgCustomTime ? summary.avgFuseTime : summary.avgCustomTime,
        worstCaseTime: Math.max(...results.map(r => Math.max(r.fuse.avgTime, r.custom.avgTime))),
        consistency: calculateConsistency(results),
      },
      reliability: {
        errorRate: calculateErrorRate(results),
        edgeCaseHandling: analyzeEdgeCases(results),
        memoryUsage: 'Estimated based on implementation'
      },
      scalability: {
        datasetSize: testConfig.testDataSize,
        recommendedCaching: true,
        loadCapacity: estimateLoadCapacity(summary)
      },
      production: {
        readiness: getProductionReadiness(summary, results),
        recommendations: getProductionRecommendations(summary, results)
      }
    };

    return analysis;
  }, [testConfig.testDataSize]);

  // Utility functions for analysis
  const calculateConsistency = (results) => {
    const fuseTimes = results.map(r => r.fuse.avgTime);
    const customTimes = results.map(r => r.custom.avgTime);
    
    const fuseStdDev = calculateStandardDeviation(fuseTimes);
    const customStdDev = calculateStandardDeviation(customTimes);
    
    return {
      fuse: fuseStdDev,
      custom: customStdDev,
      winner: fuseStdDev < customStdDev ? 'fuse' : 'custom'
    };
  };

  const calculateStandardDeviation = (values) => {
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squareDiffs = values.map(val => Math.pow(val - avg, 2));
    return Math.sqrt(squareDiffs.reduce((sum, val) => sum + val, 0) / values.length);
  };

  const calculateErrorRate = (results) => {
    const totalTests = results.length;
    const errors = results.filter(r => 
      !r.fuse.results || !r.custom.results || 
      r.fuse.results.length === 0 || r.custom.results.length === 0
    ).length;
    return (errors / totalTests) * 100;
  };

  const analyzeEdgeCases = (results) => {
    const edgeCases = results.filter(r => 
      r.query === '' || r.query.length === 1 || /[!@#$%^&*()]/g.test(r.query)
    );
    return {
      total: edgeCases.length,
      handled: edgeCases.filter(r => r.fuse.results && r.custom.results).length
    };
  };

  const estimateLoadCapacity = (summary) => {
    const avgTime = Math.min(summary.avgFuseTime, summary.avgCustomTime);
    return {
      requestsPerSecond: Math.floor(1000 / avgTime),
      concurrentUsers: Math.floor(1000 / avgTime / 2), // Conservative estimate
      recommendation: avgTime < 10 ? 'Excellent' : avgTime < 50 ? 'Good' : 'Needs optimization'
    };
  };

  const getProductionReadiness = (summary, results) => {
    const avgTime = Math.min(summary.avgFuseTime, summary.avgCustomTime);
    const maxTime = Math.max(...results.map(r => Math.max(r.fuse.avgTime, r.custom.avgTime)));
    
    if (avgTime < 10 && maxTime < 50) {
      return { status: 'READY', confidence: 'HIGH' };
    } else if (avgTime < 25 && maxTime < 100) {
      return { status: 'READY', confidence: 'MEDIUM' };
    } else if (avgTime < 50) {
      return { status: 'NEEDS_OPTIMIZATION', confidence: 'LOW' };
    } else {
      return { status: 'NOT_READY', confidence: 'LOW' };
    }
  };

  const getProductionRecommendations = (summary, results) => {
    const recommendations = [];
    
    if (summary.recommendation.choice === 'fuse') {
      recommendations.push('✅ Use Fuse.js implementation for production');
      recommendations.push('🔧 Enable result caching for better performance');
      recommendations.push('📊 Monitor search performance with analytics');
    } else {
      recommendations.push('⚠️ Consider optimizing current implementation');
      recommendations.push('🔍 Investigate Fuse.js integration benefits');
    }

    const avgTime = Math.min(summary.avgFuseTime, summary.avgCustomTime);
    if (avgTime > 25) {
      recommendations.push('🚀 Implement pre-indexing for faster searches');
      recommendations.push('⚡ Consider debouncing search inputs');
    }

    if (results.some(r => r.improvement > 50)) {
      recommendations.push('💡 Significant performance gains possible');
    }

    return recommendations;
  };

  // Export results
  const exportResults = useCallback(() => {
    if (!results) return;

    const exportData = {
      ...results,
      metadata: {
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        testDuration: 'N/A'
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `search-performance-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [results]);

  // Stop benchmark
  const stopBenchmark = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Search Performance Analysis</h1>
        <p className="text-muted-foreground">
          Production-ready performance testing for BAC 2025 search implementations
        </p>
      </div>

      {/* Test Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Test Configuration
          </CardTitle>
          <CardDescription>
            Configure benchmark parameters for comprehensive testing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Iterations</label>
              <input
                type="number"
                value={testConfig.iterations}
                onChange={(e) => setTestConfig(prev => ({ 
                  ...prev, 
                  iterations: parseInt(e.target.value) || 5 
                }))}
                className="w-full mt-1 px-3 py-2 border rounded-md"
                min="1"
                max="20"
                disabled={isRunning}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Warmup Runs</label>
              <input
                type="number"
                value={testConfig.warmupRuns}
                onChange={(e) => setTestConfig(prev => ({ 
                  ...prev, 
                  warmupRuns: parseInt(e.target.value) || 2 
                }))}
                className="w-full mt-1 px-3 py-2 border rounded-md"
                min="0"
                max="10"
                disabled={isRunning}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Dataset Size</label>
              <select
                value={testConfig.testDataSize}
                onChange={(e) => setTestConfig(prev => ({ 
                  ...prev, 
                  testDataSize: e.target.value 
                }))}
                className="w-full mt-1 px-3 py-2 border rounded-md"
                disabled={isRunning}
              >
                <option value="sample">Sample (15 queries)</option>
                <option value="full">Full (30+ queries)</option>
              </select>
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                id="stressTest"
                checked={testConfig.includeStressTest}
                onChange={(e) => setTestConfig(prev => ({ 
                  ...prev, 
                  includeStressTest: e.target.checked 
                }))}
                disabled={isRunning}
              />
              <label htmlFor="stressTest" className="text-sm font-medium">
                Include Stress Test
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex gap-4">
        <Button
          onClick={runBenchmark}
          disabled={isRunning}
          className="flex items-center gap-2"
        >
          <Play className="h-4 w-4" />
          Run Benchmark
        </Button>
        
        {isRunning && (
          <Button
            onClick={stopBenchmark}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Pause className="h-4 w-4" />
            Stop Test
          </Button>
        )}
        
        <Button
          onClick={() => {
            setResults(null);
            setProgress(0);
            setCurrentTest('');
          }}
          variant="outline"
          className="flex items-center gap-2"
          disabled={isRunning}
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>

        {results && (
          <Button
            onClick={exportResults}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Results
          </Button>
        )}
      </div>

      {/* Progress */}
      {isRunning && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{currentTest}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {results && (
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Results</TabsTrigger>
            <TabsTrigger value="production">Production Analysis</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-green-600">
                    {results.summary.recommendation.choice === 'fuse' ? 'Fuse.js' : 'Custom'}
                  </div>
                  <p className="text-sm text-muted-foreground">Recommended</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {Math.min(results.summary.avgFuseTime, results.summary.avgCustomTime).toFixed(1)}ms
                  </div>
                  <p className="text-sm text-muted-foreground">Avg Response Time</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-blue-600">
                    {results.summary.avgImprovement.toFixed(1)}%
                  </div>
                  <p className="text-sm text-muted-foreground">Avg Improvement</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {results.summary.totalQueries}
                  </div>
                  <p className="text-sm text-muted-foreground">Queries Tested</p>
                </CardContent>
              </Card>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Recommendation:</strong> {results.summary.recommendation.reason}
                {' '}(Confidence: {results.summary.recommendation.confidence})
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Query-by-Query Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {results.results.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <span className="font-mono text-sm">"{result.query}"</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span>Fuse: {result.fuse.avgTime.toFixed(2)}ms</span>
                        <span>Custom: {result.custom.avgTime.toFixed(2)}ms</span>
                        <Badge variant={result.winner === 'fuse' ? 'default' : 'secondary'}>
                          {result.winner} +{result.improvement.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="production" className="space-y-4">
            {results.productionAnalysis && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Production Readiness
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <Badge variant={
                          results.productionAnalysis.production.readiness.status === 'READY' 
                            ? 'default' 
                            : 'destructive'
                        }>
                          {results.productionAnalysis.production.readiness.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Confidence:</span>
                        <span className="font-medium">
                          {results.productionAnalysis.production.readiness.confidence}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Response:</span>
                        <span className="font-medium">
                          {results.productionAnalysis.performance.avgResponseTime.toFixed(1)}ms
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Est. Capacity:</span>
                        <span className="font-medium">
                          {results.productionAnalysis.scalability.loadCapacity.requestsPerSecond} req/s
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Worst Case:</span>
                        <span className="font-medium">
                          {results.productionAnalysis.performance.worstCaseTime.toFixed(1)}ms
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Consistency:</span>
                        <span className="font-medium">
                          {results.productionAnalysis.performance.consistency.winner} wins
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Error Rate:</span>
                        <span className="font-medium">
                          {results.productionAnalysis.reliability.errorRate.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Load Rating:</span>
                        <span className="font-medium">
                          {results.productionAnalysis.scalability.loadCapacity.recommendation}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            {results.productionAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    Production Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.productionAnalysis.production.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                        <span className="text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default SearchPerformanceTest;