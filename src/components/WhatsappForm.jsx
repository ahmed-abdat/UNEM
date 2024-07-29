import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ToastContainer, toast } from "react-toastify";
import { FaWhatsapp } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "tailwindcss/tailwind.css";
import Confetti from "./Confetti"; // Ensure the import path is correct
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import Bac2024 from "@/data/Bac2024.json";

console.log(Bac2024);

// Validation schema using Zod
const BacNumber = z.object({
  bacNumber: z
    .string()
    .min(1, { message: "رقم الباكلوريا يجب أن يكون رقما واحدا على الأقل" })
    .max(7, { message: "رقم الباكلوريا يجب أن يكون 7 أرقام على الأكثر" }),
});

// WhatsApp group links
const whatsAppGroups = {
  SN: "https://chat.whatsapp.com/JkioU681VEwLVkGPM9JJr9",
  M: "https://chat.whatsapp.com/GP0UOtpuaGTGhCS4eE7rGO",
  LO: "https://chat.whatsapp.com/F8HZQowYICx7ysWSJxq1bX",
  LM: "https://chat.whatsapp.com/GQ30pScmnTOLJkgl2YoUAi",
  TM: "https://chat.whatsapp.com/DbSUMgDMjbD2YOyOCrzZxN",
};

export default function WhatsappForm() {
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const confettiRef = useRef(null);
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
      const student = Bac2024.find(
        (student) => student.NODOSS === data.bacNumber
      );
      console.log(student);
      if (student) {
        setStudentData(student);
        const isAdmin = student.Decision === 'Ajourné' || student.MOYBAC >= 9;
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
        {studentData ? (
          <div className="mt-6">
            <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-2">
              {studentData.NOMPA}
            </h1>
            <div className="flex items-baseline justify-center text-sm text-gray-600 dark:text-gray-400 mb-4">
              <h3 className="text-gray-700 dark:text-gray-300 font-mono">
                {studentData.NODOSS}
              </h3>
              <span className="mx-1">|</span>
              <a href="#" className="text-blue-700 dark:text-blue-300">
                مسابقة الباكلوريا 2024
              </a>
            </div>
            <div
              id="decision-bar"
              className="h-1 rounded w-2/3 mx-auto bg-green-500 mb-4"
            ></div>
            <div className="flex flex-col items-center mb-6">
              <span className="text-gray-600 dark:text-gray-400 mb-2 text-sm">
                القرار
              </span>
              <div className="flex items-center text-2xl font-bold text-gray-800 dark:text-gray-200 animate__animated animate__fadeIn">
                {studentData.Decision === 'Ajourné' ? (
                  <>
                    <span className="ml-2">🎉</span>
                    <span>ناجح</span>
                    <span className="mr-2">🎉</span>
                  </>
                ) : studentData.Decision === 'Sessionnaire' ?  (
                  <span> الدورة التكميلية </span>
                ) : (
                  
                  <span>غير ناجح</span>
                )}
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 leading-normal text-sm">
              <div className="flex items-centet flex-wrap w-full border-b border-gray-200 dark:border-gray-800 mb-4">
                <div className="w-full pr-2 mb-4">
                  <div className="text-gray-600 dark:text-gray-400 mb-1">
                    المعدل
                  </div>
                  <div className="font-bold text-gray-700 dark:text-gray-300">
                    {studentData?.MOYBAC?.toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="flex items-start flex-wrap w-full">
                <div className="w-1/2 pr-2 mb-4">
                  <div className="text-gray-600 dark:text-gray-400 mb-1">
                    المدرسة
                  </div>
                  <a
                    href="#"
                    className="font-bold text-blue-700 dark:text-blue-300"
                  >
                    {studentData.LibnoetsAR}
                  </a>
                </div>
                <div className="w-1/2 pr-2 mb-4">
                  <div className="text-gray-600 dark:text-gray-400 mb-1">
                    المقاطعة
                  </div>
                  <a
                    href="#"
                    className="font-bold text-blue-700 dark:text-blue-300"
                  >
                    {studentData.LIEUNA}
                  </a>
                </div>
                <div className="w-1/2 pr-2 mb-4">
                  <div className="text-gray-600 dark:text-gray-400 mb-1">
                    الولاية
                  </div>
                  <a
                    href="#"
                    className="font-bold text-blue-700 dark:text-blue-300"
                  >
                    {studentData.WILAYA_AR}
                  </a>
                </div>
                <div className="w-1/2 pr-2 mb-4">
                  <div className="text-gray-600 dark:text-gray-400 mb-1">
                    المركز
                  </div>
                  <a
                    href="#"
                    className="font-bold text-blue-700 dark:text-blue-300"
                  >
                    {studentData.LibnoetsAR}
                  </a>
                </div>
              </div>
              {studentData.MOYBAC >= 10 && (
                <div className="flex justify-center mt-4">
                  <a
                    href={whatsAppGroups[studentData.SERIE]}
                    target="_blank"
                    className="px-4  justify-center cursor-pointer w-[90%] md:text-lg text-base py-2 flex items-center text-white bg-green-500 rounded-lg hover:bg-green-600"
                  >
                    إنضم لمجموعة الواتساب الخاصة بشعبتك
                    <FaWhatsapp className="mr-2" size={25} />
                  </a>
                </div>
              )}
              {/* unem wich you good luck */}
              {studentData.Decision === "Ajourné" || studentData.MOYBAC >= 9 ? (
                <p className="mt-4 text-base text-center">
                  مبروك النجاح و نتمنى لك النجاح في المرحلة القادمة
                </p>
              ) : (
                <p className="mt-4 text-base text-center">
                  {" "}
                  نتمنى لك التوفيق في المرحلة القادمة
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-6 flex justify-center items-center min-h-[40dvh]">
            <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
              لم يتم العثور على الطالب
            </h1>
          </div>
        )}
      </div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        limit={3}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}
