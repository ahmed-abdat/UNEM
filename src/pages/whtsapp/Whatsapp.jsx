import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Whatsapp.css";
import data from "../../data/bac.json";
import { useState } from "react";

export default function Whatsapp() {
  const [isValid, setIsValid] = useState(false);
  const [numBac, setNumBac] = useState("");
  const [yearBorn, setYearBorn] = useState("");
  const [seri, setSeri] = useState("");
  const [validYear , setValidYear ] = useState(2000)

  

  const handelValideStudent = (e) => {
    e.preventDefault();
    const isValid = data.find((student) => student.NumBac === +numBac);
    if (isValid) {
      setIsValid(true);
      setSeri(isValid.Série);
      toast.success("تم التأكد");
      setNumBac('')
      return
    }

    toast.info("للأسف يشترط في دخول المجموعة أن تكون ناجحا !");
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
    e.preventDefault()

    if(validYear === +yearBorn) {
      toast.success('تم دخول الرابط')
      console.log(seri);
      // link here
      return 
    }
    toast.error('يبدو بأن سنة الميلاد غير صحيحة')
  }

  const handelDisabelBtn = () => {
    if(yearBorn.length !== 4) return true
    if(numBac.length !== 5 ) return true

  } 

  return (
    <>
      <Header picture={"/05.png"} />
      <section className="whatsapp">
        <form className="form">
          <p>أدخل رقم الباكلوريا للإنضمام إلى المجموعة الخاصة بشعبتك</p>
          <div className="inputs">
            {!isValid && (
              <div className="input">
                <label htmlFor="#numBac"> رقم الباكلوريا</label>
                <input
                  type="number"
                  value={numBac}
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
                  onChange={handelYearBorn}
                  placeholder="أدخل سنة الميلاد"
                />
              </div>
            )}
          </div>
          <div className="btn">
            <button disabled={handelDisabelBtn()} onClick={isValid ? handelValideYearnBorn : handelValideStudent}>
              {isValid ? "إنضمام" : "تأكد"}
            </button>
          </div>
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
