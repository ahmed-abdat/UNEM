import { Suspense } from 'react';
import SearchPerformanceTest from '@/components/SearchPerformanceTest';

/**
 * Test page for search performance analysis
 * Access via /test-search route
 */
const TestSearchPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading search test...</p>
            </div>
          </div>
        }>
          <SearchPerformanceTest />
        </Suspense>
      </div>
    </div>
  );
};

export default TestSearchPage;