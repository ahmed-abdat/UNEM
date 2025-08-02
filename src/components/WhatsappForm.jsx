import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import Confetti from "./Confetti"; // Ensure the import path is correct
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import useStudentData from "../hooks/useStudentData";
import useSearchStudents from "../hooks/useSearchStudents";
import StudentAutocomplete from "./StudentAutocomplete";
import { Loader2, Search, User, ToggleLeft, ToggleRight } from "lucide-react";
import ShowStudentResult from "./ShowStudentResult";

// Validation schema using Zod
const SearchSchema = z.object({
  searchTerm: z
    .string()
    .min(1, { message: "يرجى إدخال رقم الطالب أو الاسم للبحث" })
    .max(50, { message: "النص المدخل طويل جداً" }),
});

export default function WhatsappForm() {
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [searchType, setSearchType] = useState('id'); // 'id' or 'name'
  const [searchValue, setSearchValue] = useState('');
  const confettiRef = useRef(null);
  
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

  // Handle search suggestions for name search
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('🔄 Search effect triggered:', { searchType, searchValue, length: searchValue.length });
    }
    
    if (searchType === 'name' && searchValue.length >= 2) {
      if (import.meta.env.DEV) {
        console.log('⏱️ Starting search for:', searchValue);
      }
      searchNameSuggestions(searchValue);
    } else {
      clearSuggestions();
    }
  }, [searchValue, searchType, searchNameSuggestions, clearSuggestions]);

  // Handle search type toggle
  const toggleSearchType = () => {
    setSearchType(prev => prev === 'id' ? 'name' : 'id');
    setSearchValue('');
    setValue('searchTerm', '');
    setStudentData(null);
    clearSuggestions();
  };

  const handleClick = () => {
    if (confettiRef.current) {
      confettiRef.current.fire();
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Use the new search function that handles both ID and name
      const student = await searchStudent(data.searchTerm, searchType);

      // blur the input
      if (import.meta.env.DEV) {
        console.log("Student validation result:", {
          found: !!student,
          hasDecision: !!student?.Decision,
        });
      }
      if (student) {
        setStudentData(student);
        const isAdmin = student.Decision.startsWith("Admis");
        if (isAdmin) {
          toast.success("مبروك النجاح  🎉🎊🎈 !!!", {
            style: { fontSize: "0.85rem", textAlign: "center" },
          });
          handleClick();
          return;
        } else {
          toast.info(
            "للأسف لايمكنكم الإنضمام يتمنى لكم الإتحاد الوظني حظا موفقا في القادم",
            {
              style: { fontSize: "0.85rem" },
            }
          );
        }
      } else {
        setStudentData(null);
        toast.error(
          "عذراً، لم يتم العثور على الطالب. يرجى التأكد من الرقم والمحاولة مرة أخرى.",
          {
            style: { fontSize: "0.85rem" },
          }
        );
      }
    } catch (error) {
      toast.error(
        "حدث خطأ أثناء محاولة التحقق من الرقم. حاول مرة أخرى لاحقاً.",
        {
          style: { fontSize: "0.85rem" },
        }
      );
      setStudentData(null);
    } finally {
      setLoading(false);
    }
  };

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
            
            {searchType === 'name' ? (
              <StudentAutocomplete
                value={searchValue}
                onChange={(value) => {
                  setSearchValue(value);
                  setValue('searchTerm', value);
                }}
                onSelect={(suggestion) => {
                  if (import.meta.env.DEV) {
                    console.log('🎯 Selected suggestion:', suggestion);
                  }
                  setSearchValue(suggestion.nameAr);
                  setValue('searchTerm', suggestion.nameAr);
                  setStudentData(suggestion.student);
                  clearSuggestions();
                }}
                suggestions={searchSuggestions}
                isLoading={isLoadingSuggestions}
                placeholder="أدخل اسم الطالب للبحث"
                className={cn(
                  { "focus-visible:ring-red-500": errors.searchTerm },
                  "bg-white"
                )}
              />
            ) : (
              <Input
                id="search"
                type={searchType === 'id' ? 'number' : 'text'}
                placeholder="أدخل رقم الطالب للحصول على النتيجة"
                {...register("searchTerm")}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  register("searchTerm").onChange(e);
                }}
                className={cn(
                  { "focus-visible:ring-red-500": errors.searchTerm },
                  "bg-white font-rubik font-medium text-[1.4rem] placeholder:text-[1.1rem] placeholder:font-rb py-5 placeholder-gray-400"
                )}
              />
            )}
            
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
          <div className="mt-6 flex justify-center items-center min-h-[40dvh]">
            <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
              لم يتم العثور على الطالب
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}
