import { useState, useRef } from "react";
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
import { Loader2, Search } from "lucide-react";
import { whatsAppGroups } from "../constants/whatsapp-links";

// Validation schema using Zod
const SearchSchema = z.object({
  studentId: z
    .string()
    .min(1, { message: "يرجى إدخال رقم الطالب" })
    .max(10, { message: "رقم الطالب طويل جداً" }),
});

export default function WhatsappForm() {
  const [loading, setLoading] = useState(false);
  const confettiRef = useRef(null);
  
  const { findStudentByBacNumber } = useStudentData();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SearchSchema),
  });

  const handleClick = () => {
    if (confettiRef.current) {
      confettiRef.current.fire();
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Find student by ID
      const student = await findStudentByBacNumber(data.studentId);

      if (student) {
        const isAdmin = student.Decision?.startsWith("Admis");
        if (isAdmin) {
          // Get the serie for WhatsApp group based on student's SERIE
          const serie = student.SERIE || student.Serie || student.Serie_AR;
          
          if (serie && whatsAppGroups[serie]) {
            toast.success("مبروك النجاح! سيتم توجيهك إلى مجموعة الواتساب الخاصة بشعبتك 🎉", {
              style: { fontSize: "0.85rem", textAlign: "center" },
            });
            handleClick();
            
            // Small delay to show the success message before redirect
            setTimeout(() => {
              window.open(whatsAppGroups[serie], '_blank');
            }, 1500);
          } else {
            toast.info("مبروك النجاح! لكن مجموعة الواتساب غير متوفرة لهذه الشعبة حالياً.");
          }
        } else {
          toast.info(
            "للأسف، الانضمام لمجموعات الواتساب متاح فقط للطلاب الناجحين. نتمنى لك التوفيق في المرحلة القادمة 🤲",
            {
              style: { fontSize: "0.85rem" },
            }
          );
        }
      } else {
        toast.error(
          "عذراً، لم يتم العثور على الطالب. يرجى التأكد من رقم الطالب والمحاولة مرة أخرى.",
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
              htmlFor="studentId"
              className="text-[1.3rem] font-medium font-tajawal text-gray-600"
            >
              للانضمام إلى مجموعة الواتساب الخاصة بشعبتك
            </Label>
            
            <div className="relative">
              <Input
                id="studentId"
                type="number"
                placeholder="أدخل رقم الطالب للانضمام للمجموعة"
                {...register("studentId")}
                className={cn(
                  { "focus-visible:ring-red-500": errors.studentId },
                  "bg-white font-rubik font-medium text-[1.4rem] placeholder:text-[1.1rem] placeholder:font-rb py-5 placeholder-gray-400"
                )}
              />
            </div>
            
            {errors.studentId?.message && (
              <p className="text-red-500 text-base font-medium font-rb">
                {errors.studentId.message}
              </p>
            )}
          </div>
          <Button
            disabled={loading}
            type="submit"
            className="font-tajawal font-medium shadow-btne cursor-pointer text-white text-lg bg-btn hover:bg-btn px-[15px] py-[1.65rem] rounded-lg disabled:opacity-[0.7] disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-disabeld-btn active:shadow-none active:transform active:translate-x-0 active:translate-y-1 transition-all"
          >
            انضم للمجموعة
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          </Button>
        </form>
        
        {/* Simple guidance */}
        <div className="mt-6 flex flex-col justify-center items-center min-h-[30dvh] text-center px-4">
          <div className="max-w-md">
            <div className="text-primary-color mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
              للانضمام لمجموعة الواتساب
            </h2>
            <div className="text-gray-600 dark:text-gray-400 space-y-3 text-sm">
              <p>أدخل رقم الطالب أعلاه وسيتم توجيهك تلقائياً إلى مجموعة الواتساب الخاصة بشعبتك</p>
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
