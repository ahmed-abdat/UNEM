import { useState, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import useStudentData from "../hooks/useStudentData";
import useSearchStudents from "../hooks/useSearchStudents";
import StudentAutocomplete from "./StudentAutocomplete";
import { Loader2, Search, User, X, ExternalLink } from "lucide-react";
import { whatsAppGroups } from "../constants/whatsapp-links";

// Validation schema using Zod
const SearchSchema = z.object({
  searchTerm: z
    .string()
    .min(1, { message: "يرجى إدخال رقم الطالب أو الاسم للبحث" })
    .max(50, { message: "النص المدخل طويل جداً" }),
});

export default function WhatsappRedirectForm() {
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState('id'); // 'id' or 'name'
  const [searchValue, setSearchValue] = useState('');
  const debounceTimeoutRef = useRef(null);
  
  const { findStudentByBacNumber } = useStudentData();
  const { searchStudent, searchNameSuggestions, searchSuggestions, isLoadingSuggestions, clearSuggestions } = useSearchStudents();
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SearchSchema),
  });

  // Manual search trigger - optimized for performance
  const triggerSearch = useCallback(async (searchTerm) => {
    if (!searchTerm || searchTerm.length < 1) return;
    
    if (searchType === 'name' && searchTerm.length >= 2) {
      await searchNameSuggestions(searchTerm);
    }
  }, [searchType, searchNameSuggestions]);

  // Clear suggestions when switching search types
  useEffect(() => {
    clearSuggestions();
  }, [searchType, clearSuggestions]);

  // Cleanup debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Optimized handlers
  const handleSearchValueChange = useCallback((value) => {
    setSearchValue(value);
    setValue('searchTerm', value);
    
    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Trigger search for name type with debouncing
    if (searchType === 'name' && value.length >= 2) {
      debounceTimeoutRef.current = setTimeout(() => {
        triggerSearch(value);
      }, 300);
    } else {
      clearSuggestions();
    }
  }, [setValue, searchType, triggerSearch, clearSuggestions]);

  const handleSuggestionSelect = useCallback((suggestion) => {
    setSearchValue(suggestion.nameAr);
    setValue('searchTerm', suggestion.nameAr);
    clearSuggestions();
    
    // Automatically check and redirect for selected student
    checkStudentAndRedirect(suggestion.student);
  }, [setValue, clearSuggestions]);

  // Clear search input handler
  const handleClearSearch = useCallback(() => {
    setSearchValue('');
    setValue('searchTerm', '');
    clearSuggestions();
  }, [setValue, clearSuggestions]);

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setSearchValue(value);
    register("searchTerm").onChange(e);
  }, [register]);

  // Handle search type toggle
  const toggleSearchType = useCallback(() => {
    setSearchType(prev => prev === 'id' ? 'name' : 'id');
    setSearchValue('');
    setValue('searchTerm', '');
    clearSuggestions();
  }, [setValue, clearSuggestions]);

  // Check student admission and redirect to WhatsApp
  const checkStudentAndRedirect = useCallback(async (student) => {
    if (!student) {
      toast.error("لم يتم العثور على الطالب. يرجى التأكد من البيانات والمحاولة مرة أخرى.");
      return;
    }

    // Check if student is admitted
    if (student.Decision?.startsWith("Admis")) {
      // Get the serie for WhatsApp group
      const serie = student.SERIE || student.Serie || student.Serie_AR;
      
      if (serie && whatsAppGroups[serie]) {
        toast.success("مبروك النجاح! سيتم توجيهك إلى مجموعة الواتساب الخاصة بشعبتك 🎉", {
          style: { fontSize: "0.85rem", textAlign: "center" },
        });
        
        // Small delay to show the success message before redirect
        setTimeout(() => {
          window.open(whatsAppGroups[serie], '_blank');
        }, 1000);
      } else {
        toast.info("مبروك النجاح! لكن مجموعة الواتساب غير متوفرة لهذه الشعبة حالياً.");
      }
    } else {
      toast.info("للأسف، الانضمام لمجموعات الواتساب متاح فقط للطلاب الناجحين. نتمنى لك التوفيق في المرحلة القادمة 🤲", {
        style: { fontSize: "0.85rem" },
      });
    }
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Search for the student
      const student = await searchStudent(data.searchTerm, searchType);
      
      // Check and redirect
      await checkStudentAndRedirect(student);
      
    } catch (error) {
      toast.error("حدث خطأ أثناء البحث. حاول مرة أخرى لاحقاً.", {
        style: { fontSize: "0.85rem" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-full mb-8 dark:bg-gray-900 text-gray-900 bg-[#f8f8f8] flex flex-col items-center">
      <div className="w-full max-w-xl mt-2 p-4 bg-[#f8f8f8] dark:bg-gray-800 rounded-lg shadow-sm md:shadow-md">
        {/* Search Type Toggle */}
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={toggleSearchType}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                searchType === 'id' 
                  ? "bg-white text-gray-900 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <Search className="h-4 w-4" />
              رقم الطالب
            </button>
            <button
              type="button"
              onClick={toggleSearchType}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                searchType === 'name' 
                  ? "bg-white text-gray-900 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <User className="h-4 w-4" />
              الاسم
            </button>
          </div>
        </div>

        <form
          className="w-full flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="w-full flex flex-col gap-2">
            <Label
              htmlFor="search"
              className="text-[1.3rem] font-medium font-tajawal text-gray-600"
            >
              للانضمام إلى مجموعة الواتساب الخاصة بشعبتك
            </Label>
            
            <div className="relative">
              {searchType === 'name' ? (
                <StudentAutocomplete
                  value={searchValue}
                  onChange={handleSearchValueChange}
                  onSelect={handleSuggestionSelect}
                  suggestions={searchSuggestions}
                  isLoading={isLoadingSuggestions}
                  placeholder="أدخل اسمك باللغة العربية للبحث"
                  className={cn(
                    { "focus-visible:ring-red-500": errors.searchTerm },
                    "bg-white pr-12"
                  )}
                />
              ) : (
                <Input
                  id="search"
                  type={searchType === 'id' ? 'number' : 'text'}
                  placeholder="أدخل رقم الطالب للانضمام للمجموعة"
                  {...register("searchTerm")}
                  onChange={handleInputChange}
                  className={cn(
                    { "focus-visible:ring-red-500": errors.searchTerm },
                    "bg-white font-rubik font-medium text-[1.4rem] placeholder:text-[1.1rem] placeholder:font-rb py-5 placeholder-gray-400 pr-12"
                  )}
                />
              )}
              
              {/* Clear button */}
              {searchValue && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                  aria-label="مسح البحث"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {errors.searchTerm?.message && (
              <p className="text-red-500 text-base font-medium font-rb">
                {errors.searchTerm.message}
              </p>
            )}
          </div>
          <Button
            disabled={loading}
            type="submit"
            className="font-tajawal font-medium shadow-btne cursor-pointer text-white text-lg bg-btn hover:bg-btn px-[15px] py-[1.65rem] rounded-lg disabled:opacity-[0.7] disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-disabeld-btn active:shadow-none active:transform active:translate-x-0 active:translate-y-1 transition-all"
          >
            <ExternalLink className="ml-2 h-4 w-4" />
            انضم للمجموعة
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          </Button>
        </form>
        
        {/* Empty state with guidance */}
        <div className="mt-6 flex flex-col justify-center items-center min-h-[30dvh] text-center px-4">
          <div className="max-w-md">
            <div className="text-primary-color mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
              ابحث عن نتيجتك للانضمام
            </h2>
            <div className="text-gray-600 dark:text-gray-400 space-y-3 text-sm">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span className="bg-primary-color/10 px-2 py-1 rounded text-primary-color font-medium text-xs">رقم الطالب</span>
                <span>أدخل رقم الباكلوريا (مثال: 12345)</span>
              </div>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span className="bg-green-1/10 px-2 py-1 rounded text-green-1 font-medium text-xs">الاسم</span>
                <span>أدخل اسمك باللغة العربية للبحث السريع</span>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              💡 فقط الطلاب الناجحون يمكنهم الانضمام لمجموعات الواتساب
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}