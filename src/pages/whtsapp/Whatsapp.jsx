import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Whatsapp.css";
import data from "../../data/bac.json";
import { useRef, useState } from "react";


export default function Whatsapp() {
  const [isValid, setIsValid] = useState(false);
  const [numBac, setNumBac] = useState("");
  const [yearBorn, setYearBorn] = useState("");
  const [student, setStudent] = useState("");

  const numBacRef = useRef(null)
  const yearBornRef = useRef(null)

  const handelValideStudent = (e) => {
    e.preventDefault();
    const isValid = data.find((student) => student.NumBac === +numBac);
    if (isValid) {
      setIsValid(true);
      setStudent(isValid);
      console.log(isValid.DateNaissance);
      toast.success("هنيئا لكم النجاح ");
      setNumBac("");
      return;
    }
    numBacRef.current.blur()
    toast.info("للأسف لايمكنكم الدخول, نتمنى لكم حظا أوفر في القادم");
  };

  const handleNumBacChange = (e) => {
    const inputValue = e.target.value;
    const numBacValue = inputValue.slice(0, 5); // Restrict to 5 digits
    setNumBac(numBacValue);
  };

  const handelYearBorn = (e) => {
    const { value } = e.target;
    let yearBornValue = value.slice(0, 4); // Restrict to 4 digits
    // yearBornValue = yearBornValue.replace(/[^1-2]/g, '');
    setYearBorn(yearBornValue);
  };

  const handelValideYearnBorn = (e) => {
    e.preventDefault();
    const validYear = student.DateNaissance.slice(-4);

    if (validYear === yearBorn) {
      const whtspUrl = {
        SN: "https://chat.whatsapp.com/LvTH7hxFAfF4nmVDozWCVp",
        M: "https://chat.whatsapp.com/KFwkj9xNM5mLlkIisqlMra",
        LO: "https://chat.whatsapp.com/E66wEjpS8gm3ZXDfqPTQUr",
        LM: "https://chat.whatsapp.com/CVlHmIUkkNvFC6eJExfLHl",
        T: "https://chat.whatsapp.com/IC9MwzhTKiU8psKhMz1tpP",
      };

      window.open(whtspUrl[student.Série]);

      return;
    }
    yearBornRef.current.blur()
    toast.error(" عذرا يرجى التأكد من سنة الميلاد");
  };


  return (
    <>
      <Header picture={"/04.jpeg"} />
      <section className="whatsapp">
        <form className="form">
        {
          isValid ? (
            <p> أهلا  بكم لتأكيد الدخول أضيفو سنة الميلاد  </p>
          ) : (
            <p> للانضمام إلى المجموعة الخاصة بشعبتكم يرجى إدخال رقم الباكلوريا</p>
          )
        }
          <div className="inputs">
            {!isValid && (
              <div className="input">
                <label htmlFor="#numBac"> رقم الباكلوريا</label>
                <input
                  type="number"
                  value={numBac}
                  ref={numBacRef}
                  onKeyDown={(e) => e.key === 'Enter' && handelValideStudent(e)}
                  onChange={handleNumBacChange}
                  placeholder="أدخل رقم الباكلوريا"
                />
              </div>
            )}
            {isValid && (
              <div className="input">
                <label htmlFor="#numBac"> سنة الميلاد </label>
                <input
                  type="number"
                  value={yearBorn}
                  ref={yearBornRef}
                  onKeyDown={(e) => e.key === 'Enter' && handelValideYearnBorn(e)}
                  onChange={handelYearBorn}
                  placeholder="أدخل سنة الميلاد"
                />
              </div>
            )}
          </div>
          {!isValid ? (
            <div className="btn">
              <button
                disabled={numBac.length !== 5}
                onClick={handelValideStudent}
              >
                تأكيد
              </button>
            </div>
          ) : (
            <div className="btn">
              <button
                disabled={yearBorn.length !== 4}
                onClick={handelValideYearnBorn}
              >
                إنضمام
              </button>
            </div>
          )}
        </form>
      </section>
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
      <Footer />
    </>
  );
}
