import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './ui/button';

/**
 * Error Boundary component to catch JavaScript errors anywhere in the child component tree
 * Features:
 * - Graceful error handling with user-friendly UI
 * - Error logging for development
 * - Recovery options (retry, go home)
 * - Responsive design with Arabic support
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log to console in development
    if (import.meta.env.DEV) {
      console.group('🚨 Error Boundary Caught Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }

    // In production, you could send this to an error reporting service
    // Example: Sentry, LogRocket, or custom analytics
    if (import.meta.env.PROD) {
      // logErrorToService({
      //   error: error.toString(),
      //   errorInfo: errorInfo.componentStack,
      //   timestamp: new Date().toISOString(),
      //   userAgent: navigator.userAgent,
      //   url: window.location.href
      // });
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            {/* Error Icon */}
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 dark:bg-red-900/20 rounded-full p-3">
                <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              عذراً، حدث خطأ غير متوقع
            </h1>

            {/* Error Description */}
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
              حدثت مشكلة تقنية أثناء تحميل هذه الصفحة. نعتذر عن الإزعاج ونعمل على حل المشكلة.
            </p>

            {/* Development Error Details */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700 mb-2">
                  تفاصيل الخطأ (للمطورين)
                </summary>
                <div className="bg-gray-100 dark:bg-gray-700 rounded p-3 text-xs font-mono text-red-600 dark:text-red-400 max-h-32 overflow-y-auto">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.toString()}
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="whitespace-pre-wrap mt-1">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Retry Count Info */}
            {this.state.retryCount > 0 && (
              <div className="mb-4 text-xs text-gray-500">
                عدد المحاولات: {this.state.retryCount}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={this.handleRetry}
                className="flex-1 bg-primary-color hover:bg-primary-color/90 text-white"
                disabled={this.state.retryCount >= 3}
              >
                <RefreshCw className="h-4 w-4 ml-2" />
                {this.state.retryCount >= 3 ? 'تم تجاوز عدد المحاولات' : 'إعادة المحاولة'}
              </Button>
              
              <Button
                onClick={this.handleGoHome}
                variant="outline"
                className="flex-1"
              >
                <Home className="h-4 w-4 ml-2" />
                الصفحة الرئيسية
              </Button>
            </div>

            {/* Help Text */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              إذا استمرت المشكلة، يرجى تحديث الصفحة أو المحاولة لاحقاً
            </p>
          </div>
        </div>
      );
    }

    // Render children normally if no error
    return this.props.children;
  }
}

ErrorBoundary.displayName = 'ErrorBoundary';

export default ErrorBoundary;