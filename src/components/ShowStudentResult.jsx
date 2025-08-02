import React, { memo, useMemo } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { cn } from "@/lib/utils";
import { whatsAppGroups } from '../constants/whatsapp-links'; 

const ShowStudentResult = memo(({ Name, Num_Bac, Serie, SERIE, Decision, Moyenne, Etablissement, Lieu, Wilaya, year = "2025" }) => {
  // Memoize expensive calculations and derived values
  const decisionStatus = useMemo(() => {
    if (Decision?.startsWith("Admis")) return "admitted";
    if (Decision === "Sessionnaire") return "supplementary";
    if (Decision === "Abscent") return "absent";
    return "failed";
  }, [Decision]);

  const decisionBarColor = useMemo(() => {
    switch (decisionStatus) {
      case "admitted": return "bg-green-500";
      case "failed": return "bg-red-500";
      case "supplementary": return "bg-yellow-500";
      case "absent": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  }, [decisionStatus]);

  const decisionText = useMemo(() => {
    switch (decisionStatus) {
      case "admitted":
        return (
          <>
            <span className="ml-2">🎉</span>
            <span>ناجح</span>
            <span className="mr-2">🎉</span>
          </>
        );
      case "supplementary":
        return <span>الدورة التكميلية</span>;
      case "absent":
        return <span>👀 غائب 👀</span>;
      default:
        return <span>غير ناجح</span>;
    }
  }, [decisionStatus]);

  const formattedAverage = useMemo(() => {
    return Number(Moyenne).toFixed(2);
  }, [Moyenne]);

  const whatsappLink = useMemo(() => {
    return whatsAppGroups[SERIE];
  }, [SERIE]);

  const successMessage = useMemo(() => {
    return decisionStatus === "admitted" 
      ? "مبروك النجاح و نتمنى لك النجاح في المرحلة القادمة"
      : "نتمنى لك التوفيق في المرحلة القادمة";
  }, [decisionStatus]);

  return (
    <div className="mt-6">
    <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-2">
      {Name}
    </h1>
    <div className="flex items-baseline justify-center text-sm text-gray-600 dark:text-gray-400 mb-4">
      <h3 className="text-gray-700 dark:text-gray-300 font-mono">
        {Num_Bac}
      </h3>
      <span className="mx-1">|</span>
      <a href="#" className="text-blue-700 dark:text-blue-300">
        مسابقة الباكلوريا {year} {Serie}
      </a>
    </div>
    <div
      id="decision-bar"
      className={cn("h-1 rounded w-2/3 mx-auto mb-4", decisionBarColor)}
    ></div>
    <div className="flex flex-col items-center mb-6">
      <span className="text-gray-600 dark:text-gray-400 mb-2 text-sm">
        القرار
      </span>
      <div className="flex items-center text-2xl font-bold text-gray-800 dark:text-gray-200 animate__animated animate__fadeIn gap-x-2">
        {decisionText}
        |
        <div>
          <span className="text-gray-600 dark:text-gray-400 mb-2 text-sm">
            {Decision}
          </span>
        </div>
      </div>
    </div>
    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 leading-normal text-sm">
      <div className="flex items-start flex-wrap w-full border-b border-b-gray-200 dark:border-b-gray-800 mb-4 hide-no-gpa">
        <div
          className="flex flex-col mb-4 pr-2 w-full"
          data-blur-toggle=""
          role="button"
        >
          <div className="mb-1text-gray-600 dark:text-gray-400">
            المعدل
          </div>
          <div className="text-gray-700 dark:text-gray-300 font-bold text-xs">
            {formattedAverage}
          </div>
        </div>
        {/* Commented out until we have the correct link
        NOTE: When uncommenting, also change the "المعدل" div above from w-full back to w-1/2
        <div className="flex flex-col mb-4 pr-2 w-1/2" target="_blank">
          <div className="mb-1text-gray-600 dark:text-gray-400">
            النتائج التفصيلية
          </div>
          <a
            className="text-blue-700 dark:text-blue-300 font-bold text-xs cursor-pointer"
            href={`http://dec.education.gov.mr/bac-21/${Num_Bac}/info`}
            target="_blank"
          >
            🔗 عبر موقع الوزارة
          </a>
        </div>
        */}
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
            {Etablissement}
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
            {Lieu}
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
            {Wilaya}
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
            {Etablissement}
          </a>
        </div>
      </div>
      {decisionStatus === "admitted" && (
        <div className="flex justify-center mt-4">
          <a
            href={whatsappLink}
            target="_blank"
            className="px-4 justify-center cursor-pointer w-[90%] md:text-lg text-base py-2 flex items-center text-white bg-green-500 rounded-lg hover:bg-green-600"
          >
            إنضم لمجموعة الواتساب الخاصة بشعبتك
            <FaWhatsapp className="mr-2" size={25} />
          </a>
        </div>
      )}
      {/* unem wishes you good luck */}
      <p className="mt-4 text-base text-center">
        {successMessage}
      </p>
    </div>
  </div>
  )
});

ShowStudentResult.displayName = 'ShowStudentResult';

export default ShowStudentResult;
