import React from 'react';
import { Loader2, Database, TrendingUp } from 'lucide-react';

/**
 * Loading skeleton for large data operations
 * Shows progress, metrics, and provides engaging user feedback
 */
const DataLoadingSkeleton = ({ 
  progress = 0, 
  message = 'جاري تحميل البيانات...', 
  showMetrics = false,
  metrics = {}
}) => {
  const getProgressColor = () => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getProgressLabel = () => {
    if (progress < 25) return 'بدء التحميل...';
    if (progress < 50) return 'معالجة البيانات...';
    if (progress < 75) return 'تحسين الأداء...';
    if (progress < 100) return 'اللمسات الأخيرة...';
    return 'تم التحميل بنجاح!';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg">
      {/* Loading Icon */}
      <div className="relative mb-6">
        <div className="absolute inset-0 animate-ping rounded-full bg-brand-primary/20 w-16 h-16"></div>
        <div className="relative bg-white dark:bg-gray-800 rounded-full p-4 shadow-lg">
          <Database className="h-8 w-8 text-brand-primary animate-pulse" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {getProgressLabel()}
          </span>
          <span className="text-sm font-bold text-brand-primary">
            {Math.round(progress)}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ease-out ${getProgressColor()}`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          >
            <div className="h-full bg-white/30 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Status Message */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
          تحميل بيانات الباكلوريا 2025
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {message}
        </p>
      </div>

      {/* Metrics Display */}
      {showMetrics && metrics && (
        <div className="grid grid-cols-2 gap-4 w-full max-w-md text-center">
          {metrics.dataSize && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
              <TrendingUp className="h-4 w-4 text-blue-500 mx-auto mb-1" />
              <div className="text-xs text-gray-500 dark:text-gray-400">حجم البيانات</div>
              <div className="font-semibold text-gray-800 dark:text-gray-200">
                {metrics.dataSize}MB
              </div>
            </div>
          )}
          
          {metrics.loadTime && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
              <Loader2 className="h-4 w-4 text-green-500 mx-auto mb-1" />
              <div className="text-xs text-gray-500 dark:text-gray-400">وقت التحميل</div>
              <div className="font-semibold text-gray-800 dark:text-gray-200">
                {metrics.loadTime}ms
              </div>
            </div>
          )}
          
          {metrics.chunkSize && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm col-span-2">
              <Database className="h-4 w-4 text-purple-500 mx-auto mb-1" />
              <div className="text-xs text-gray-500 dark:text-gray-400">عدد السجلات</div>
              <div className="font-semibold text-gray-800 dark:text-gray-200">
                {metrics.chunkSize?.toLocaleString('ar-MA')} طالب
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading Dots Animation */}
      <div className="flex space-x-1 mt-4">
        <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};

export default DataLoadingSkeleton;