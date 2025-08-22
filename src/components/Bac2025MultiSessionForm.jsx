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
import { useMultiSessionStudentData } from "../hooks/useMultiSessionStudentData";
import { Loader2, Search, X } from "lucide-react";
import ShowStudentResult from "./ShowStudentResult";
import DataLoadingSkeleton from "./DataLoadingSkeleton";
import SessionSelector from "./SessionSelector";

// Validation schema using Zod
const SearchSchema = z.object({
  searchTerm: z
    .string()
    .min(1, { message: "يرجى إدخال رقم الطالب للبحث" })
    .max(50, { message: "النص المدخل طويل جداً" }),
});

export default function Bac2025MultiSessionForm() {
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [allSessionResults, setAllSessionResults] = useState([]);
  const [searchMode, setSearchMode] = useState('current'); // 'current' or 'all'
  const confettiRef = useRef(null);
  const debounceTimeoutRef = useRef(null);
  
  const { 
    loading: dataLoading, 
    searchProgress: loadingProgress,
    currentSession,
    switchSession,
    getAvailableSessions,
    findStudentByBacNumber,
    findStudentInAllSessions,
    preloadIndex
  } = useMultiSessionStudentData();
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SearchSchema),
  });

  // Get available sessions for the selector
  const availableSessions = getAvailableSessions();

  // Initial data loading with progress tracking
  useEffect(() => {
    // Preload both sessions for better UX
    const preloadBothSessions = async () => {
      try {
        await preloadIndex('regular');
        await preloadIndex('complementary');
      } catch (error) {
        console.error('Failed to preload session data:', error);
      }
    };
    
    preloadBothSessions();
  }, [preloadIndex]);

  // Cleanup debounce timeout on unmount
  useEffect(() => {
    const debounceRef = debounceTimeoutRef;
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Clear search input handler
  const handleClearSearch = useCallback(() => {
    setSearchValue('');
    setValue('searchTerm', '');
    setStudentData(null);
    setAllSessionResults([]);
  }, [setValue]);

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setSearchValue(value);
    register("searchTerm").onChange(e);
  }, [register]);

  const handleClick = () => {
    if (confettiRef.current) {
      confettiRef.current.fire();
    }
  };

  // Handle session change
  const handleSessionChange = useCallback((newSession) => {
    switchSession(newSession);
    // Clear current results when switching sessions
    setStudentData(null);
    setAllSessionResults([]);
  }, [switchSession]);

  const onSubmit = async (data) => {
    setLoading(true);
    setStudentData(null);
    setAllSessionResults([]);
    
    try {
      let results = [];
      
      if (searchMode === 'all') {
        // Search in all sessions
        results = await findStudentInAllSessions(data.searchTerm);
        setAllSessionResults(results);
        
        if (results.length > 0) {
          // Show the first result as primary
          setStudentData(results[0]);
          
          // Check if any result shows admission
          const hasAdmission = results.some(student => 
            student.Decision?.startsWith("Admis")
          );
          
          if (hasAdmission) {
            toast.success("مبروك النجاح! تم العثور على نتائج في عدة دورات 🎉🎊🎈", {
              style: { fontSize: "0.85rem", textAlign: "center" },
            });
            handleClick();
          } else {
            toast.info(`تم العثور على ${results.length} نتيجة. نتمنى لك التوفيق في المرحلة القادمة`, {
              style: { fontSize: "0.85rem" },
            });
          }
        } else {
          toast.error(
            "عذراً، لم يتم العثور على الطالب في أي من الدورات. يرجى التأكد من البيانات والمحاولة مرة أخرى.",
            { style: { fontSize: "0.85rem" } }
          );
        }
      } else {
        // Search in current session only
        const student = await findStudentByBacNumber(data.searchTerm, currentSession);
        
        if (student) {
          setStudentData(student);
          const isAdmin = student.Decision?.startsWith("Admis");
          
          if (isAdmin) {
            toast.success("مبروك النجاح 🎉🎊🎈", {
              style: { fontSize: "0.85rem", textAlign: "center" },
            });
            handleClick();
          } else {
            toast.info("نتمنى لك التوفيق في المرحلة القادمة", {
              style: { fontSize: "0.85rem" },
            });
          }
        } else {
          toast.error(
            "عذراً، لم يتم العثور على الطالب في هذه الدورة. جرب البحث في جميع الدورات.",
            { style: { fontSize: "0.85rem" } }
          );
        }
      }
    } catch (error) {
      toast.error(
        error.message || "حدث خطأ أثناء محاولة البحث. حاول مرة أخرى لاحقاً.",
        { style: { fontSize: "0.85rem" } }
      );
      setStudentData(null);
      setAllSessionResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Show loading skeleton when data is initially loading
  if (dataLoading) {
    return (
      <div className="w-full min-h-full mb-8 dark:bg-gray-900 text-gray-900 bg-[#f8f8f8] flex flex-col items-center">
        <div className="w-full max-w-xl mt-2 p-4">
          <DataLoadingSkeleton 
            progress={loadingProgress}
            message="جاري تحميل بيانات الباكلوريا 2025..."
            showMetrics={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full mb-8 dark:bg-gray-900 text-gray-900 bg-[#f8f8f8] flex flex-col items-center">
      <Confetti ref={confettiRef} className="absolute inset-0 -z-20" />
      <div className="w-full max-w-2xl mt-2 p-4 bg-[#f8f8f8] dark:bg-gray-800 rounded-lg shadow-sm md:shadow-md">

        {/* Session Selector */}
        <div className="mb-6">
          <SessionSelector
            currentSession={currentSession}
            onSessionChange={handleSessionChange}
            availableSessions={availableSessions}
            variant="cards"
          />
        </div>

        {/* Search Mode Toggle */}
        <div className="mb-4">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            طريقة البحث
          </Label>
          <div className="flex gap-2">
            <Button
              variant={searchMode === 'current' ? 'default' : 'outline'}
              onClick={() => setSearchMode('current')}
              size="sm"
              className="flex-1"
            >
              البحث في الدورة الحالية
            </Button>
            <Button
              variant={searchMode === 'all' ? 'default' : 'outline'}
              onClick={() => setSearchMode('all')}
              size="sm"
              className="flex-1"
            >
              البحث في جميع الدورات
            </Button>
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
              <Input
                id="search"
                type="number"
                placeholder="أدخل رقم الطالب للحصول على النتيجة"
                {...register("searchTerm")}
                onChange={handleInputChange}
                className={cn(
                  { "focus-visible:ring-red-500": errors.searchTerm },
                  "bg-white font-rubik font-medium text-[1.4rem] placeholder:text-[1.1rem] placeholder:font-rb py-5 placeholder-gray-400 pr-12"
                )}
              />
              
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
            className="font-tajawal font-medium shadow-btne cursor-pointer text-white text-lg bg-brand-success hover:bg-brand-success px-[15px] py-[1.65rem] rounded-lg disabled:opacity-[0.7] disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-brand-success-disabled active:shadow-none active:transform active:translate-x-0 active:translate-y-1 transition-all"
          >
            ابحث {searchMode === 'all' ? 'في جميع الدورات' : `في ${availableSessions.find(s => s.key === currentSession)?.name || 'الدورة الحالية'}`}
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          </Button>
        </form>
        
        {/* Show student results */}
        {allSessionResults.length > 0 ? (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-center">
              تم العثور على {allSessionResults.length} نتيجة
            </h3>
            {allSessionResults.map((student, index) => (
              <div key={index} className="border rounded-lg p-4 bg-white">
                <div className="mb-2">
                  <span className="text-sm font-medium text-blue-600">
                    {student._sessionInfo?.sessionName} ({student._sessionInfo?.year})
                  </span>
                </div>
                <ShowStudentResult
                  Decision={student.Decision}
                  Etablissement={student.Etablissement_AR || student.Centre_AR}
                  Lieu={student.LIEUNN_AR || student.LIEUNA}
                  Wilaya={student.Wilaya_AR || student.LregA}
                  Num_Bac={student.NODOSS}
                  Moyenne={student["Moy Bac"] || student.Moybac}
                  Name={student.NOM_AR || student.NOMPA}
                  Serie={student.SERIE}
                  SERIE={student.SERIE}
                  year={student._sessionInfo?.year || "2025"}
                />
              </div>
            ))}
          </div>
        ) : studentData ? (
          <div className="mt-6">
            {studentData._sessionInfo && (
              <div className="mb-2 text-center">
                <span className="text-sm font-medium text-blue-600">
                  {studentData._sessionInfo.sessionName} ({studentData._sessionInfo.year})
                </span>
              </div>
            )}
            <ShowStudentResult
              Decision={studentData.Decision}
              Etablissement={studentData.Etablissement_AR || studentData.Centre_AR}
              Lieu={studentData.LIEUNN_AR || studentData.LIEUNA}
              Wilaya={studentData.Wilaya_AR || studentData.LregA}
              Num_Bac={studentData.NODOSS}
              Moyenne={studentData["Moy Bac"] || studentData.Moybac}
              Name={studentData.NOM_AR || studentData.NOMPA}
              Serie={studentData.SERIE}
              SERIE={studentData.SERIE}
              year={studentData._sessionInfo?.year || "2025"}
            />
          </div>
        ) : (
          <div className="mt-6 flex flex-col justify-center items-center min-h-[40dvh] text-center px-4">
            <div className="max-w-md">
              <div className="text-brand-primary mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                ابحث عن نتيجتك
              </h2>
              <div className="text-gray-600 dark:text-gray-400 space-y-3 text-sm">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <span className="bg-brand-primary/10 px-2 py-1 rounded text-brand-primary font-medium text-xs">رقم الطالب</span>
                  <span>أدخل رقم الباكلوريا (مثال: 12345)</span>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs">
                    💡 يمكنك البحث في دورة واحدة أو في جميع الدورات للحصول على أفضل النتائج
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
