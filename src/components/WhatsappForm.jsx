import { useState, useRef } from "react";
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
import { Loader2 } from "lucide-react";
import ShowStudentResult from "./ShowStudentResult";

// Validation schema using Zod
const BacNumber = z.object({
  bacNumber: z
    .string()
    .min(1, { message: "رقم الباكلوريا يجب أن يكون رقما واحدا على الأقل" })
    .max(7, { message: "رقم الباكلوريا يجب أن يكون 7 أرقام على الأكثر" }),
});


export default function WhatsappForm() {
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const confettiRef = useRef(null);
  const { findStudentByBacNumber } = useStudentData();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(BacNumber),
  });

  const handleClick = () => {
    if (confettiRef.current) {
      confettiRef.current.fire();
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Use lazy loading hook to find student
      const student = await findStudentByBacNumber(data.bacNumber);

      // blur the input
      if (import.meta.env.DEV) {
        console.log('Student validation result:', {
          found: !!student,
          hasDecision: !!student?.Decision
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
        <form
          className="w-full flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="w-full flex flex-col gap-2">
            <Label
              htmlFor="bac"
              className="text-[1.3rem] font-medium font-tajawal text-gray-600"
            >
              نتائج مسابقة الباكلوريا 2024
            </Label>
            <Input
              id="bac"
              type="number"
              placeholder="أدخل رقم الطالب أو الطالبة للحصول على النتيجة"
              {...register("bacNumber")}
              className={cn(
                { "focus-visible:ring-red-500": errors.bacNumber },
                "bg-white font-rubik font-medium text-[1.4rem] placeholder:text-[1.1rem] placeholder:font-rb py-5 placeholder-gray-400"
              )}
            />
            {errors.bacNumber?.message && (
              <p className="text-red-500 text-base font-medium font-rb">
                {errors.bacNumber.message}
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
            Etablissement={studentData.Etablissement_AR || studentData.Centre_AR}
            Lieu={studentData.LIEUNN_AR || studentData.LIEUNA}
            Wilaya={studentData.Wilaya_AR || studentData.LregA}
            Num_Bac={studentData.NODOSS}
            Moyenne={studentData["Moy Bac"] || studentData.Moybac}
            Name={studentData.NOM_AR || studentData.NOMPA}
            Serie={studentData.SERIE}
            SERIE={studentData.SERIE}
          />
        ) : <div className="mt-6 flex justify-center items-center min-h-[40dvh]">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
          لم يتم العثور على الطالب
        </h1>
      </div>}
      </div>
    </div>
  );
}
