import React from 'react';
import { Database, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';

/**
 * Specialized Error Boundary for data loading operations
 * Features:
 * - Data-specific error handling
 * - Retry with exponential backoff
 * - Cache clearing options
 * - Network error detection
 */
class DataErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      retryCount: 0,
      isRetrying: false,
      errorType: 'unknown'
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Classify error type
    let errorType = 'unknown';
    if (error.message.includes('fetch') || error.message.includes('network')) {
      errorType = 'network';
    } else if (error.message.includes('JSON') || error.message.includes('parse')) {
      errorType = 'data';
    } else if (error.message.includes('chunk') || error.message.includes('import')) {
      errorType = 'loading';
    }

    this.setState({
      error,
      errorType
    });

    // Log error
    if (import.meta.env.DEV) {
      console.group('🗄️ Data Error Boundary');
      console.error('Data Error:', error);
      console.error('Error Type:', errorType);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }
  }

  handleRetry = async () => {
    this.setState({ isRetrying: true });
    
    // Clear any cached data if onClearCache is provided
    if (this.props.onClearCache) {
      try {
        await this.props.onClearCache();
      } catch (clearError) {
        console.warn('Failed to clear cache:', clearError);
      }
    }

    // Exponential backoff delay
    const delay = Math.min(1000 * Math.pow(2, this.state.retryCount), 5000);
    
    setTimeout(() => {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        retryCount: prevState.retryCount + 1,
        isRetrying: false
      }));
    }, delay);
  };

  getErrorMessage() {
    const { errorType } = this.state;
    
    switch (errorType) {
      case 'network':
        return {
          title: 'مشكلة في الاتصال بالإنترنت',
          description: 'تعذر تحميل البيانات. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.',
          suggestion: 'تحقق من اتصالك بالإنترنت'
        };
      case 'data':
        return {
          title: 'مشكلة في معالجة البيانات',
          description: 'حدث خطأ أثناء معالجة بيانات الطلاب. قد تكون البيانات تالفة أو غير مكتملة.',
          suggestion: 'سيتم إعادة تحميل البيانات تلقائياً'
        };
      case 'loading':
        return {
          title: 'مشكلة في تحميل النظام',
          description: 'فشل في تحميل أجزاء من النظام. قد يكون هناك مشكلة في الخادم.',
          suggestion: 'جاري إعادة المحاولة...'
        };
      default:
        return {
          title: 'خطأ غير معروف',
          description: 'حدث خطأ غير متوقع أثناء تحميل البيانات.',
          suggestion: 'يرجى إعادة المحاولة'
        };
    }
  }

  render() {
    if (this.state.hasError) {
      const errorMessage = this.getErrorMessage();
      const canRetry = this.state.retryCount < 3 && !this.state.isRetrying;

      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
          {/* Error Icon */}
          <div className="flex justify-center mb-4">
            <div className="bg-orange-100 dark:bg-orange-900/20 rounded-full p-3">
              {this.state.errorType === 'network' ? (
                <Database className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              ) : (
                <AlertTriangle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              )}
            </div>
          </div>

          {/* Error Title */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 text-center">
            {errorMessage.title}
          </h3>

          {/* Error Description */}
          <p className="text-gray-600 dark:text-gray-400 text-center mb-4 max-w-md text-sm leading-relaxed">
            {errorMessage.description}
          </p>

          {/* Suggestion */}
          <p className="text-primary-color text-sm mb-6 text-center">
            💡 {errorMessage.suggestion}
          </p>

          {/* Development Error Details */}
          {import.meta.env.DEV && this.state.error && (
            <details className="mb-4 w-full max-w-md">
              <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700 mb-2">
                تفاصيل الخطأ التقني
              </summary>
              <div className="bg-gray-100 dark:bg-gray-700 rounded p-3 text-xs font-mono text-red-600 dark:text-red-400 max-h-24 overflow-y-auto">
                {this.state.error.toString()}
              </div>
            </details>
          )}

          {/* Retry Information */}
          {this.state.retryCount > 0 && (
            <div className="text-xs text-gray-500 mb-4">
              المحاولة {this.state.retryCount} من 3
            </div>
          )}

          {/* Action Button */}
          {canRetry ? (
            <Button
              onClick={this.handleRetry}
              disabled={this.state.isRetrying}
              className="bg-primary-color hover:bg-primary-color/90 text-white"
            >
              {this.state.isRetrying ? (
                <>
                  <RefreshCw className="h-4 w-4 ml-2 animate-spin" />
                  جاري إعادة التحميل...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 ml-2" />
                  إعادة تحميل البيانات
                </>
              )}
            </Button>
          ) : (
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                تم تجاوز عدد المحاولات المسموح
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                إعادة تحميل الصفحة
              </Button>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

DataErrorBoundary.displayName = 'DataErrorBoundary';

export default DataErrorBoundary;