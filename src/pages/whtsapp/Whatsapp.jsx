import HeaderImg from "../../components/HeaderImg";
import Footer from "../../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Whatsapp.css";
import data from "../../data/BAC2023VALID.json";
import { useRef, useState } from "react";

export default function Whatsapp() {
  const [numBac, setNumBac] = useState("");
  const numBacRef = useRef(null)

  const handelValideStudent = (e) => {
    e.preventDefault();
    const isValid = data.find((student) => student.NODOSS === Number(numBac)); ;

    console.log(isValid);
    
    if (isValid) {
      const whtspUrl = {
        SN: "https://chat.whatsapp.com/JkioU681VEwLVkGPM9JJr9",
        M: "https://chat.whatsapp.com/GP0UOtpuaGTGhCS4eE7rGO",
        LO: "https://chat.whatsapp.com/F8HZQowYICx7ysWSJxq1bX",
        LM: "https://chat.whatsapp.com/GQ30pScmnTOLJkgl2YoUAi",
        TM: "https://chat.whatsapp.com/DbSUMgDMjbD2YOyOCrzZxN",
      };

      window.open(whtspUrl[isValid.SERIE])
      return;
    }

    numBacRef.current.blur()
    toast.info("للأسف لايمكنكم الدخول, نتمنى لكم حظا أوفر في القادم");
  };

  const handleNumBacChange = (e) => {
    const inputValue = e.target.value;
    const numBacValue = inputValue.slice(0, 6); // Restrict to 5 digits
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
                onKeyDown={(e) => (e.key === 'Enter' && numBac) && handelValideStudent(e)}
                onChange={handleNumBacChange}
                placeholder="أدخل رقم الباكلوريا"
              />
            </div>
          </div>
          <div className="btn" disabled={!numBac}>
            <button onClick={handelValideStudent} disabled={!numBac}>إنضمام</button>
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
