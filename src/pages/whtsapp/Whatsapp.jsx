import HeaderImg from "../../components/HeaderImg";
import Footer from "../../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Whatsapp.css";
import data from "../../data/BAC2023VALID.json";
import Sesion from '../../data/SessionBac.json'
import { useRef, useState } from "react";

export default function Whatsapp() {
  const [numBac, setNumBac] = useState("");
  const numBacRef = useRef(null)

  const handelValideStudent = (e) => {
    e.preventDefault();
    const isValid = data.find((student) => student.NODOSS === numBac) || Sesion.find(student => student.NODOSS === numBac);
    
    if (isValid) {
      const whtspUrl = {
        SN: "https://chat.whatsapp.com/ItJtE08IIwg8lSTrqOjf8e",
        M: "https://chat.whatsapp.com/KFwkj9xNM5mLlkIisqlMra",
        LO: "https://chat.whatsapp.com/E66wEjpS8gm3ZXDfqPTQUr",
        LM: "https://chat.whatsapp.com/CVlHmIUkkNvFC6eJExfLHl",
        TM: "https://chat.whatsapp.com/IC9MwzhTKiU8psKhMz1tpP",
      };

      window.open(whtspUrl[isValid.SERIE])
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

  return (
    <>
      <HeaderImg picture={"/04.jpeg"} />
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
                onKeyDown={(e) => e.key === 'Enter' && handelValideStudent(e)}
                onChange={handleNumBacChange}
                placeholder="أدخل رقم الباكلوريا"
              />
            </div>
          </div>
          <div className="btn">
            <button onClick={handelValideStudent}>إنضمام</button>
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
