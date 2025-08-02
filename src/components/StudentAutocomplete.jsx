import { useState, useRef, useEffect, memo, useMemo, useCallback } from 'react';
import { Input } from './ui/input';
import { cn } from '../lib/utils';
import { Search, User, GraduationCap, Loader2 } from 'lucide-react';

const StudentAutocomplete = memo(function StudentAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder,
  suggestions = [],
  isLoading = false,
  className,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Memoize utility functions for better performance
  const getDecisionColor = useCallback((decision) => {
    if (decision?.startsWith('Admis')) return 'text-green-600';
    if (decision?.startsWith('Ajourné')) return 'text-red-600';
    if (decision === 'Sessionnaire') return 'text-yellow-600';
    return 'text-gray-600';
  }, []);

  const getDecisionIcon = useCallback((decision) => {
    if (decision?.startsWith('Admis')) return '🎉';
    if (decision?.startsWith('Ajourné')) return '❌';
    if (decision === 'Sessionnaire') return '📝';
    return '👤';
  }, []);

  const handleSelect = useCallback((suggestion) => {
    onSelect(suggestion);
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, [onSelect]);

  const handleInputChange = useCallback((e) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsOpen(true);
    setHighlightedIndex(-1);
  }, [onChange]);

  // Memoize computed values
  const shouldShowSuggestions = useMemo(() => {
    return isOpen && suggestions.length > 0;
  }, [isOpen, suggestions.length]);

  const shouldShowNoResults = useMemo(() => {
    return isOpen && !isLoading && suggestions.length === 0 && value.length > 1;
  }, [isOpen, isLoading, suggestions.length, value.length]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
            handleSelect(suggestions[highlightedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setHighlightedIndex(-1);
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, highlightedIndex, suggestions]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target) &&
          listRef.current && !listRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full">
      <div className="relative">
        <Input
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={cn(
            "pr-10 font-rubik font-medium text-[1.4rem] placeholder:text-[1.1rem] placeholder:font-rb py-5",
            className
          )}
          {...props}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          ) : (
            <Search className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>

      {shouldShowSuggestions && (
        <div 
          ref={listRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              onClick={() => handleSelect(suggestion)}
              className={cn(
                "px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50",
                {
                  "bg-blue-50": index === highlightedIndex
                }
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">{getDecisionIcon(suggestion.decision)}</span>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {suggestion.nameAr}
                    </p>
                  </div>
                  {suggestion.nameFr && (
                    <p className="text-xs text-gray-500 truncate mb-1">
                      {suggestion.nameFr}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-mono">{suggestion.id}</span>
                    <span>•</span>
                    <span>{suggestion.serie}</span>
                    <span>•</span>
                    <span className={getDecisionColor(suggestion.decision)}>
                      {suggestion.decision}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-2">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {shouldShowNoResults && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <div className="text-center text-gray-500">
            <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">لم يتم العثور على طلاب بهذا الاسم</p>
            <p className="text-xs text-gray-400 mt-1">جرب البحث باستخدام رقم الطالب</p>
          </div>
        </div>
      )}
    </div>
  );
});

StudentAutocomplete.displayName = 'StudentAutocomplete';

export default StudentAutocomplete;