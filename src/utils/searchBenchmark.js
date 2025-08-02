/**
 * Search Performance Benchmark Utility
 * Compares Fuse.js vs Custom fuzzy search implementations
 */

export class SearchBenchmark {
  constructor() {
    this.results = [];
    this.isRunning = false;
  }

  /**
   * Run performance comparison between search implementations
   * @param {Array} testQueries - Array of search terms to test
   * @param {Function} fuseSearchFn - Fuse.js search function
   * @param {Function} customSearchFn - Custom search function  
   * @param {Object} options - Benchmark options
   */
  async runComparison(testQueries, fuseSearchFn, customSearchFn, options = {}) {
    const {
      iterations = 5,
      warmupRuns = 2,
      logResults = true
    } = options;

    if (this.isRunning) {
      console.warn('Benchmark already running');
      return this.results;
    }

    this.isRunning = true;
    this.results = [];

    console.log(`🏁 Starting search benchmark with ${testQueries.length} queries, ${iterations} iterations`);

    try {
      for (const query of testQueries) {
        const queryResults = {
          query,
          fuse: { times: [], avgTime: 0, results: [] },
          custom: { times: [], avgTime: 0, results: [] },
          winner: null,
          improvement: 0
        };

        // Warmup runs
        for (let i = 0; i < warmupRuns; i++) {
          await fuseSearchFn(query);
          await customSearchFn(query);
        }

        // Benchmark Fuse.js
        for (let i = 0; i < iterations; i++) {
          const startTime = performance.now();
          const results = await fuseSearchFn(query);
          const endTime = performance.now();
          
          queryResults.fuse.times.push(endTime - startTime);
          if (i === 0) queryResults.fuse.results = results;
        }

        // Benchmark Custom implementation
        for (let i = 0; i < iterations; i++) {
          const startTime = performance.now();
          const results = await customSearchFn(query);
          const endTime = performance.now();
          
          queryResults.custom.times.push(endTime - startTime);
          if (i === 0) queryResults.custom.results = results;
        }

        // Calculate averages
        queryResults.fuse.avgTime = this.calculateAverage(queryResults.fuse.times);
        queryResults.custom.avgTime = this.calculateAverage(queryResults.custom.times);

        // Determine winner and improvement
        if (queryResults.fuse.avgTime < queryResults.custom.avgTime) {
          queryResults.winner = 'fuse';
          queryResults.improvement = ((queryResults.custom.avgTime - queryResults.fuse.avgTime) / queryResults.custom.avgTime) * 100;
        } else {
          queryResults.winner = 'custom';
          queryResults.improvement = ((queryResults.fuse.avgTime - queryResults.custom.avgTime) / queryResults.fuse.avgTime) * 100;
        }

        this.results.push(queryResults);

        if (logResults) {
          console.log(`📊 "${query}": Fuse.js ${queryResults.fuse.avgTime.toFixed(2)}ms vs Custom ${queryResults.custom.avgTime.toFixed(2)}ms (${queryResults.winner} wins by ${queryResults.improvement.toFixed(1)}%)`);
        }
      }

      const summary = this.generateSummary();
      
      if (logResults) {
        console.log('📈 Benchmark Summary:', summary);
      }

      return {
        results: this.results,
        summary
      };

    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Generate benchmark summary statistics
   */
  generateSummary() {
    if (this.results.length === 0) return null;

    const fuseWins = this.results.filter(r => r.winner === 'fuse').length;
    const customWins = this.results.filter(r => r.winner === 'custom').length;
    
    const avgFuseTime = this.calculateAverage(this.results.map(r => r.fuse.avgTime));
    const avgCustomTime = this.calculateAverage(this.results.map(r => r.custom.avgTime));
    
    const avgImprovement = this.calculateAverage(this.results.map(r => r.improvement));
    
    const recommendation = this.getRecommendation(fuseWins, customWins, avgFuseTime, avgCustomTime);

    return {
      totalQueries: this.results.length,
      fuseWins,
      customWins,
      avgFuseTime: Math.round(avgFuseTime * 100) / 100,
      avgCustomTime: Math.round(avgCustomTime * 100) / 100,
      avgImprovement: Math.round(avgImprovement * 100) / 100,
      recommendation
    };
  }

  /**
   * Get performance recommendation based on results
   */
  getRecommendation(fuseWins, customWins, avgFuseTime, avgCustomTime) {
    const fuseAdvantage = fuseWins > customWins;
    const significantTimeDiff = Math.abs(avgFuseTime - avgCustomTime) > 5; // 5ms threshold
    
    if (fuseAdvantage && avgFuseTime < avgCustomTime && significantTimeDiff) {
      return {
        choice: 'fuse',
        reason: 'Fuse.js provides better performance and wins more queries',
        confidence: 'high'
      };
    } else if (!fuseAdvantage && avgCustomTime < avgFuseTime && significantTimeDiff) {
      return {
        choice: 'custom',
        reason: 'Custom implementation is faster and wins more queries',
        confidence: 'high'
      };
    } else if (fuseAdvantage) {
      return {
        choice: 'fuse',
        reason: 'Fuse.js wins more queries with similar performance',
        confidence: 'medium'
      };
    } else {
      return {
        choice: 'custom',
        reason: 'Performance is similar, custom implementation may be sufficient',
        confidence: 'low'
      };
    }
  }

  /**
   * Calculate average of an array of numbers
   */
  calculateAverage(numbers) {
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  }

  /**
   * Get typical Arabic and French student name test queries
   */
  static getTestQueries() {
    return [
      // Arabic names
      'محمد',
      'احمد',
      'فاطمة',
      'عائشة',
      'عبد الله',
      'خديجة',
      'يوسف',
      'مريم',
      
      // French names
      'Mohamed',
      'Ahmed',
      'Fatima',
      'Aicha',
      'Abdallah',
      'Khadija',
      'Youssef',
      'Mariem',
      
      // Partial matches
      'مح',
      'احم',
      'فات',
      'Mo',
      'Ah',
      'Fat',
      
      // Typos
      'محمض', // محمد with typo
      'احمض', // احمد with typo
      'Mohamad', // Mohamed with typo
      'Ahmid', // Ahmed with typo
      
      // Mixed case
      'MOHAMED',
      'ahmed',
      'FaTiMa'
    ];
  }

  /**
   * Export results to console in a formatted table
   */
  exportResults() {
    if (this.results.length === 0) {
      console.log('No benchmark results to export');
      return;
    }

    console.table(this.results.map(result => ({
      Query: result.query,
      'Fuse.js (ms)': result.fuse.avgTime.toFixed(2),
      'Custom (ms)': result.custom.avgTime.toFixed(2),
      Winner: result.winner,
      'Improvement (%)': result.improvement.toFixed(1)
    })));
  }
}

/**
 * Quick benchmark utility function
 */
export const runQuickBenchmark = async (fuseSearchFn, customSearchFn, options = {}) => {
  const benchmark = new SearchBenchmark();
  const testQueries = options.customQueries || SearchBenchmark.getTestQueries().slice(0, 10);
  
  return await benchmark.runComparison(testQueries, fuseSearchFn, customSearchFn, {
    iterations: 3,
    warmupRuns: 1,
    logResults: true,
    ...options
  });
};

export default SearchBenchmark;