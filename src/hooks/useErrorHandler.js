import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

/**
 * Custom hook for error handling in functional components
 * Provides error logging, user notifications, and recovery utilities
 */
export const useErrorHandler = () => {
  const [error, setError] = useState(null);
  const [isRecovering, setIsRecovering] = useState(false);

  // Error handler function
  const handleError = useCallback((error, context = {}) => {
    // Log error details
    if (import.meta.env.DEV) {
      console.group('🚨 Error Handler');
      console.error('Error:', error);
      console.error('Context:', context);
      console.error('Stack:', error.stack);
      console.groupEnd();
    }

    // Set error state
    setError({
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    });

    // Classify error and show appropriate toast
    const errorType = classifyError(error);
    showErrorToast(errorType, error.message);

    // In production, send to error reporting service
    if (import.meta.env.PROD) {
      reportError(error, context);
    }
  }, []);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
    setIsRecovering(false);
  }, []);

  // Retry with recovery
  const retry = useCallback(async (retryFn, options = {}) => {
    const { maxRetries = 3, delay = 1000, onRetry } = options;
    
    setIsRecovering(true);
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        if (onRetry) {
          onRetry(attempt, maxRetries);
        }
        
        const result = await retryFn();
        clearError();
        return result;
      } catch (retryError) {
        if (attempt === maxRetries) {
          handleError(retryError, { 
            ...retryError.context, 
            retryAttempt: attempt,
            finalAttempt: true 
          });
          break;
        }
        
        // Wait before next retry with exponential backoff
        await new Promise(resolve => 
          setTimeout(resolve, delay * Math.pow(2, attempt - 1))
        );
      }
    }
    
    setIsRecovering(false);
  }, [handleError, clearError]);

  // Async operation wrapper with error handling
  const withErrorHandling = useCallback((asyncFn, context = {}) => {
    return async (...args) => {
      try {
        return await asyncFn(...args);
      } catch (error) {
        handleError(error, { ...context, args });
        throw error; // Re-throw so calling code can handle it too
      }
    };
  }, [handleError]);

  return {
    error,
    isRecovering,
    handleError,
    clearError,
    retry,
    withErrorHandling
  };
};

// Helper function to classify errors
function classifyError(error) {
  const message = error.message.toLowerCase();
  
  if (message.includes('fetch') || message.includes('network') || message.includes('connection')) {
    return 'network';
  }
  
  if (message.includes('json') || message.includes('parse') || message.includes('syntax')) {
    return 'data';
  }
  
  if (message.includes('chunk') || message.includes('import') || message.includes('load')) {
    return 'loading';
  }
  
  if (message.includes('permission') || message.includes('unauthorized')) {
    return 'auth';
  }
  
  return 'unknown';
}

// Show appropriate toast based on error type
function showErrorToast(errorType, message) {
  const toastOptions = {
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    style: { fontSize: '0.85rem', textAlign: 'right' }
  };

  switch (errorType) {
    case 'network':
      toast.error('مشكلة في الاتصال بالإنترنت. يرجى التحقق من اتصالك والمحاولة مرة أخرى.', toastOptions);
      break;
      
    case 'data':
      toast.error('حدث خطأ في معالجة البيانات. يرجى إعادة المحاولة.', toastOptions);
      break;
      
    case 'loading':
      toast.error('فشل في تحميل المحتوى. يرجى إعادة تحميل الصفحة.', toastOptions);
      break;
      
    case 'auth':
      toast.error('مشكلة في الصلاحيات. يرجى تسجيل الدخول مرة أخرى.', toastOptions);
      break;
      
    default:
      toast.error('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.', toastOptions);
  }
}

// Report error to external service (placeholder)
function reportError(error, context) {
  // In a real application, this would send to Sentry, LogRocket, etc.
  const errorReport = {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    userId: context.userId || 'anonymous'
  };
  
  // Example: send to error reporting service
  // fetch('/api/errors', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(errorReport)
  // }).catch(reportingError => {
  //   console.warn('Failed to report error:', reportingError);
  // });
  
  console.warn('Error report (not sent in dev):', errorReport);
}

export default useErrorHandler;