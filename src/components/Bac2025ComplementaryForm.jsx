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
import { Loader2, Search, X, Clock, AlertCircle } from "lucide-react";
import ShowStudentResult from "./ShowStudentResult";
import DataLoadingSkeleton from "./DataLoadingSkeleton";

// Validation schema using Zod
const SearchSchema = z.object({
  searchTerm: z
    .string()
    .min(1, { message: "يرجى إدخال رقم الطالب للبحث" })
    .max(50, { message: "النص المدخل طويل جداً" }),
});

export default function Bac2025ComplementaryForm() {
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [searchedInRegular, setSearchedInRegular] = useState(false);
  const confettiRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  const {
    loading: dataLoading,
    searchProgress: loadingProgress,
    findStudentByBacNumber,
    preloadIndex,
  } = useMultiSessionStudentData();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SearchSchema),
  });

  // Initial data loading - focus on complementary session
  useEffect(() => {
    const preloadComplementaryData = async () => {
      try {
        await preloadIndex("complementary");
        // Also preload regular session in background for fallback
        setTimeout(() => preloadIndex("regular"), 1000);
      } catch (error) {
        console.error("Failed to preload complementary session data:", error);
      }
    };

    preloadComplementaryData();
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
    setSearchValue("");
    setValue("searchTerm", "");
    setStudentData(null);
    setSearchedInRegular(false);
  }, [setValue]);

  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchValue(value);
      register("searchTerm").onChange(e);
    },
    [register]
  );

  const handleClick = () => {
    if (confettiRef.current) {
      confettiRef.current.fire();
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setStudentData(null);
    setSearchedInRegular(false);

    try {
      // First, search in complementary session (most important now)
      const complementaryStudent = await findStudentByBacNumber(
        data.searchTerm,
        "complementary"
      );

      if (complementaryStudent) {
        setStudentData(complementaryStudent);
        const isAdmin = complementaryStudent.Decision?.startsWith("Admis");

        if (isAdmin) {
          toast.success("مبروك النجاح في الدورة التكميلية! 🎉🎊🎈", {
            style: { fontSize: "0.85rem", textAlign: "center" },
          });
          handleClick();
        } else {
          toast.info("نتمنى لك التوفيق في المرحلة القادمة", {
            style: { fontSize: "0.85rem" },
          });
        }
      } else {
        // If not found in complementary, search in regular session as fallback
        try {
          const regularStudent = await findStudentByBacNumber(
            data.searchTerm,
            "regular"
          );

          if (regularStudent) {
            setStudentData(regularStudent);
            setSearchedInRegular(true);

            const isAdmin = regularStudent.Decision?.startsWith("Admis");
            if (isAdmin) {
              toast.success("تم العثور على النتيجة في الدورة العادية 🎉", {
                style: { fontSize: "0.85rem", textAlign: "center" },
              });
              handleClick();
            } else {
              toast.info("تم العثور على النتيجة في الدورة العادية", {
                style: { fontSize: "0.85rem" },
              });
            }
          } else {
            toast.error(
              "عذراً، لم يتم العثور على الطالب في أي من الدورات. يرجى التأكد من البيانات والمحاولة مرة أخرى.",
              { style: { fontSize: "0.85rem" } }
            );
          }
        } catch (regularError) {
          console.warn("Regular session search failed:", regularError);
          toast.error(
            "لم يتم العثور على الطالب في الدورة التكميلية. قد تكون النتيجة متوفرة في الدورة العادية لاحقاً.",
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
            message="جاري تحميل بيانات الدورة التكميلية..."
            showMetrics={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full mb-8 dark:bg-gray-900 text-gray-900 bg-[#f8f8f8] flex flex-col items-center">
      <Confetti ref={confettiRef} className="absolute inset-0 -z-20" />
      <div className="w-full max-w-xl mt-2 p-4 bg-[#f8f8f8] dark:bg-gray-800 rounded-lg shadow-sm md:shadow-md">
        {/* Priority Notice for Complementary Session */}
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-brand-primary" />
            <div>
              <h3 className="font-semibold text-gray-800">
                الدورة التكميلية 2025
              </h3>
              <p className="text-sm text-gray-700">
                النتائج متوفرة الآن! سيتم البحث في الدورة التكميلية أولاً
              </p>
            </div>
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
              البحث عن نتائج الباكلوريا 2025
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
            <Clock className="ml-2 h-4 w-4" />
            ابحث في الدورة التكميلية
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          </Button>
        </form>

        {/* Show student results */}
        {studentData ? (
          <div className="mt-6">
            {/* Show which session the result is from */}
            <div className="mb-4 text-center">
              {searchedInRegular ? (
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium">
                  <AlertCircle className="h-4 w-4" />
                  نتيجة من الدورة العادية
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm font-medium">
                  <Clock className="h-4 w-4" />
                  نتيجة من الدورة التكميلية
                </div>
              )}
            </div>

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
                  <span className="bg-brand-primary/10 px-2 py-1 rounded text-brand-primary font-medium text-xs">
                    رقم الطالب
                  </span>
                  <span>أدخل رقم الباكلوريا (مثال: 12345)</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                  <div className="flex items-center gap-2 justify-center mb-2">
                    <Clock className="h-4 w-4 text-brand-primary" />
                    <span className="font-medium text-gray-800">
                      البحث الذكي
                    </span>
                  </div>
                  <p className="text-xs text-gray-700">
                    سيتم البحث في الدورة التكميلية أولاً، وفي حالة عدم وجود
                    النتيجة سيتم البحث في الدورة العادية تلقائياً
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
