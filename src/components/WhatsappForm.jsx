import { useState, useRef, memo, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import Confetti from "./Confetti";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import useOptimizedStudentData from "../hooks/useOptimizedStudentData";
import { Loader2, Search } from "lucide-react";
import { whatsAppGroups } from "../constants/whatsapp-links";
import "./WhatsappToast.css";

// Validation schema using Zod - memoized to prevent recreation
const SearchSchema = z.object({
  studentId: z
    .string()
    .min(1, { message: "يرجى إدخال رقم الطالب" })
    .max(10, { message: "رقم الطالب طويل جداً" }),
});

const WhatsappForm = memo(() => {
  const [loading, setLoading] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const confettiRef = useRef(null);
  
  const { findStudentByBacNumber, loading: dataLoading, searchProgress } = useOptimizedStudentData();
  
  // Memoize form resolver to prevent recreation
  const formResolver = useMemo(() => zodResolver(SearchSchema), []);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: formResolver,
  });

  const handleClick = useCallback(() => {
    if (confettiRef.current) {
      confettiRef.current.fire();
    }
  }, []);

  // Enhanced toast messages with mobile-friendly error handling using CSS classes
  const toastMessages = useMemo(() => ({
    success: (whatsappLink) => (
      <div className="whatsapp-toast-success">
        <h3>مبروك النجاح! 🎉</h3>
        <p className="whatsapp-toast-subtitle">
          سيتم توجيهك إلى مجموعة الواتساب الخاصة بشعبتك
        </p>
        <p className="whatsapp-toast-link-container">
          إذا لم يتم التوجيه تلقائياً، 
          <a 
            href={whatsappLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="whatsapp-toast-link"
          >
            اضغط هنا
          </a>
        </p>
      </div>
    ),
    noGroup: "مبروك النجاح! لكن مجموعة الواتساب غير متوفرة لهذه الشعبة حالياً.",
    notAdmitted: "للأسف، الانضمام لمجموعات الواتساب متاح فقط للطلاب الناجحين. نتمنى لك التوفيق في المرحلة القادمة 🤲",
    notFound: "عذراً، لم يتم العثور على الطالب. يرجى التأكد من رقم الطالب والمحاولة مرة أخرى.",
    searching: (progress) => (
      <div className="whatsapp-search-progress">
        <h4>جاري البحث... {Math.round(progress)}%</h4>
        <div className="whatsapp-progress-bar">
          <div 
            className="whatsapp-progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    )
  }), []);

  const onSubmit = useCallback(async (data) => {
    setLoading(true);
    
    // Show progress toast for mobile users
    let progressToastId = null;
    
    try {
      // Show search progress for better mobile UX
      progressToastId = toast.loading(toastMessages.searching(0), {
        style: { fontSize: "0.85rem" },
      });
      
      // Update progress during search
      const progressInterval = setInterval(() => {
        if (searchProgress > 0) {
          toast.update(progressToastId, {
            render: toastMessages.searching(searchProgress),
            type: "loading"
          });
        }
      }, 100);
      
      // Find student by ID using optimized search
      const student = await findStudentByBacNumber(data.studentId);
      
      // Clear progress interval
      clearInterval(progressInterval);
      
      // Dismiss progress toast
      if (progressToastId) {
        toast.dismiss(progressToastId);
      }

      if (student) {
        const studentIsAdmin = student.Decision?.startsWith("Admis");
        setIsAdmin(studentIsAdmin);
        
        if (studentIsAdmin) {
          // Get the serie for WhatsApp group based on student's SERIE
          const serie = student.SERIE || student.Serie || student.Serie_AR;
          
          if (serie && whatsAppGroups[serie]) {
            const groupLink = whatsAppGroups[serie];
            setWhatsappLink(groupLink);
            
            // Show success message with the link as fallback
            toast.success(toastMessages.success(groupLink), {
              duration: 5000, // Show for 5 seconds
              style: { fontSize: "0.85rem" },
            });
            handleClick();
            
            // Use direct navigation after a delay
            // This works best for WhatsApp group links on all devices
            setTimeout(() => {
              window.location.href = groupLink;
            }, 2000);
          } else {
            toast.info(toastMessages.noGroup, {
              style: { fontSize: "0.85rem" },
            });
          }
        } else {
          setWhatsappLink(null);
          toast.info(toastMessages.notAdmitted, {
            style: { fontSize: "0.85rem" },
          });
        }
      } else {
        toast.error(toastMessages.notFound, {
          style: { fontSize: "0.85rem" },
        });
      }
    } catch (error) {
      // Dismiss progress toast on error
      if (progressToastId) {
        toast.dismiss(progressToastId);
      }
      
      // Show the specific error message from optimized hook
      toast.error(error.message, {
        style: { fontSize: "0.85rem" },
        duration: 4000,
      });
      
      // Log error for debugging
      console.error('WhatsApp form submission error:', error);
    } finally {
      setLoading(false);
    }
  }, [findStudentByBacNumber, toastMessages, handleClick, searchProgress]);

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
            disabled={loading || dataLoading}
            type="submit"
            className="font-tajawal font-medium shadow-btne cursor-pointer text-white text-lg bg-brand-success hover:bg-brand-success px-[15px] py-[1.65rem] rounded-lg disabled:opacity-[0.7] disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-disabeld-brand-success active:shadow-none active:transform active:translate-x-0 active:translate-y-1 transition-all"
          >
            {(loading || dataLoading) ? 'جاري البحث...' : 'انضم للمجموعة'}
            {(loading || dataLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          </Button>
        </form>
        
        {/* Manual redirection button for admins */}
        {isAdmin && whatsappLink && (
          <div className="mt-4 flex justify-center">
            <Button
              onClick={() => window.open(whatsappLink, '_blank')}
              className="font-tajawal font-medium text-white text-base bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              انضم للمجموعة يدوياً
            </Button>
          </div>
        )}

        {/* Simple guidance */}
        <div className="mt-6 flex flex-col justify-center items-center min-h-[30dvh] text-center px-4">
          <div className="max-w-md">
            <div className="text-brand-primary mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
              للانضمام لمجموعة الواتساب
            </h2>
            <div className="text-gray-600 dark:text-gray-400 space-y-3 text-sm">
              <p>أدخل رقم الطالب أعلاه وسيتم توجيهك تلقائياً إلى مجموعة الواتساب الخاصة بشعبتك</p>
            </div>
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              {isAdmin && whatsappLink ? (
                <>💡 فقط الطلاب الناجحون يمكنهم الانضمام لمجموعات الواتساب. إذا لم يتم التوجيه تلقائياً، استخدم الزر اليدوي أعلاه</>
              ) : (
                <>💡 فقط الطلاب الناجحون يمكنهم الانضمام لمجموعات الواتساب</>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

WhatsappForm.displayName = 'WhatsappForm';

export default WhatsappForm;
