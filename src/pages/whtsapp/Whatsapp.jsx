import HeaderImg from "../../components/HeaderImg";
import Footer from "../../components/Footer";
import { toast } from "react-toastify";
import "./Whatsapp.css";
import useStudentData from "../../hooks/useStudentData";
import { useRef, useState } from "react";
import { whatsAppGroups } from "../../constants/whatsapp-links";

export default function Whatsapp() {
  const [numBac, setNumBac] = useState("");
  const [loading, setLoading] = useState(false);
  const numBacRef = useRef(null);
  const { findStudentByBacNumber, loading: dataLoading } = useStudentData();

  const handelValideStudent = async (e) => {
    e.preventDefault();
    
    if (!numBac.trim()) {
      toast.error("الرجاء إدخال رقم الباكلوريا");
      return;
    }

    setLoading(true);
    try {
      // Use lazy loading hook to find student
      const studente = await findStudentByBacNumber(numBac);

      if (import.meta.env.DEV) {
        console.log('Student search result:', {
          found: !!studente,
          inputLength: numBac?.length,
          hasDecision: !!studente?.Decision
        });
      }
      
      if (studente?.Decision) {
        window.open(whatsAppGroups[studente.SERIE]);
        toast.success("تم توجيهك إلى مجموعة الواتساب المناسبة");
      } else {
        toast.info("للأسف لايمكنكم الدخول, نتمنى لكم حظا أوفر في القادم");
      }

      numBacRef.current?.blur();
    } catch (error) {
      toast.error("حدث خطأ في البحث عن البيانات");
      if (import.meta.env.DEV) {
        console.error('Error finding student:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNumBacChange = (e) => {
    const inputValue = e.target.value;
    const numBacValue = inputValue.slice(0, 6); // Restrict to 5 digits
    setNumBac(numBacValue);
  };

  return (
    <>
      <HeaderImg picture={"/04.jpeg"} bgColor={'#f8f8f8'} />
      <section className="whatsapp">
        <form className="form">
          <p> للانضمام إلى المجموعة الخاصة بشعبتكم يرجى إدخال رقم الباكلوريا</p>
          <div className="inputs">
            <div className="input">
              <label htmlFor="#numBac"> رقم الباكلوريا</label>
              <input
                type="number"
                value={numBac}
                ref={numBacRef}
                onKeyDown={(e) => (e.key === 'Enter' && numBac) && handelValideStudent(e)}
                onChange={handleNumBacChange}
                placeholder="أدخل رقم الباكلوريا"
              />
            </div>
          </div>
          <div className="btn">
            <button 
              onClick={handelValideStudent} 
              disabled={!numBac || loading || dataLoading}
              style={{ opacity: loading || dataLoading ? 0.6 : 1 }}
            >
              {loading || dataLoading ? "جاري البحث..." : "إنضمام"}
            </button>
          </div>     
        </form>
      </section>
      <Footer />
    </>
  );
}
