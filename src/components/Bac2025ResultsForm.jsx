import { useState, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import Confetti from "./Confetti";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import useStudentData from "../hooks/useStudentData";
import useSearchStudents from "../hooks/useSearchStudents";
import StudentAutocomplete from "./StudentAutocomplete";
import { Loader2, Search, User, X } from "lucide-react";
import ShowStudentResult from "./ShowStudentResult";
import DataLoadingSkeleton from "./DataLoadingSkeleton";

// Validation schema using Zod
const SearchSchema = z.object({
  searchTerm: z
    .string()
    .min(1, { message: "يرجى إدخال رقم الطالب أو الاسم للبحث" })
    .max(50, { message: "النص المدخل طويل جداً" }),
});

export default function Bac2025ResultsForm() {
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [searchType, setSearchType] = useState('id'); // 'id' or 'name'
  const [searchValue, setSearchValue] = useState('');
  const confettiRef = useRef(null);
  const debounceTimeoutRef = useRef(null);
  
  const { 
    findStudentByBacNumber, 
    loading: dataLoading, 
    loadingProgress, 
    dataMetrics, 
    isDataLoaded,
    loadData 
  } = useStudentData();
  const { searchStudent, searchNameSuggestions, searchSuggestions, isLoadingSuggestions, clearSuggestions } = useSearchStudents();
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SearchSchema),
  });

  // Initial data loading with progress tracking
  useEffect(() => {
    if (!isDataLoaded) {
      loadData({
        progressCallback: (progress, message) => {
          // Progress is handled by the hook's internal state
          if (import.meta.env.DEV) {
            console.log(`Loading progress: ${progress}% - ${message}`);
          }
        }
      }).catch(error => {
        console.error('Failed to load initial data:', error);
      });
    }
  }, [isDataLoaded, loadData]);

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
    setStudentData(suggestion.student);
    clearSuggestions();
  }, [setValue, clearSuggestions]);

  // Clear search input handler
  const handleClearSearch = useCallback(() => {
    setSearchValue('');
    setValue('searchTerm', '');
    setStudentData(null);
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
    setStudentData(null);
    clearSuggestions();
  }, [setValue, clearSuggestions]);

  const handleClick = () => {
    if (confettiRef.current) {
      confettiRef.current.fire();
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Use the search function that handles both ID and name
      const student = await searchStudent(data.searchTerm, searchType);

      if (student) {
        setStudentData(student);
        const isAdmin = student.Decision?.startsWith("Admis");
        if (isAdmin) {
          toast.success("مبروك النجاح  🎉🎊🎈 !!!", {
            style: { fontSize: "0.85rem", textAlign: "center" },
          });
          handleClick();
        } else {
          toast.info("نتمنى لك التوفيق في المرحلة القادمة", {
            style: { fontSize: "0.85rem" },
          });
        }
      } else {
        setStudentData(null);
        toast.error(
          "عذراً، لم يتم العثور على الطالب. يرجى التأكد من البيانات والمحاولة مرة أخرى.",
          {
            style: { fontSize: "0.85rem" },
          }
        );
      }
    } catch (error) {
      toast.error(
        "حدث خطأ أثناء محاولة البحث. حاول مرة أخرى لاحقاً.",
        {
          style: { fontSize: "0.85rem" },
        }
      );
      setStudentData(null);
    } finally {
      setLoading(false);
    }
  };

  // Show loading skeleton when data is initially loading
  if (dataLoading && !isDataLoaded) {
    return (
      <div className="w-full min-h-full mb-8 dark:bg-gray-900 text-gray-900 bg-[#f8f8f8] flex flex-col items-center">
        <div className="w-full max-w-xl mt-2 p-4">
          <DataLoadingSkeleton 
            progress={loadingProgress}
            message="جاري تحميل بيانات الباكلوريا 2025..."
            showMetrics={true}
            metrics={dataMetrics}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full mb-8 dark:bg-gray-900 text-gray-900 bg-[#f8f8f8] flex flex-col items-center">
      <Confetti ref={confettiRef} className="absolute inset-0 -z-20" />
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
              نتائج مسابقة الباكلوريا 2025
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
                  placeholder="أدخل رقم الطالب للحصول على النتيجة"
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
            ابحث
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          </Button>
        </form>
        
        {/* Show student results */}
        {studentData && studentData.Num_Bac ? (
          <ShowStudentResult
            Decision={studentData.Decision}
            Etablissement={studentData.Etablissement_AR}
            Lieu={studentData.Lieun_AR}
            Wilaya={studentData.Wilaya_AR}
            Num_Bac={studentData.Num_Bac}
            Moyenne={studentData.Moy_Bac}
            Name={studentData.NOM_AR}
            Serie={studentData.Serie_AR}
            SERIE={studentData.SERIE}
          />
        ) : studentData && studentData.NODOSS ? (
          <ShowStudentResult
            Decision={studentData.Decision}
            Etablissement={
              studentData.Etablissement_AR || studentData.Centre_AR
            }
            Lieu={studentData.LIEUNN_AR || studentData.LIEUNA}
            Wilaya={studentData.Wilaya_AR || studentData.LregA}
            Num_Bac={studentData.NODOSS}
            Moyenne={studentData["Moy Bac"] || studentData.Moybac}
            Name={studentData.NOM_AR || studentData.NOMPA}
            Serie={studentData.SERIE}
            SERIE={studentData.SERIE}
            year="2025"
          />
        ) : (
          <div className="mt-6 flex flex-col justify-center items-center min-h-[40dvh] text-center px-4">
            <div className="max-w-md">
              <div className="text-primary-color mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                ابحث عن نتيجتك
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
                💡 يمكنك التبديل بين طرق البحث باستخدام الأزرار أعلاه
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}