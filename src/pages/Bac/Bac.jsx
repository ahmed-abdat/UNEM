import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Bac.css";
import data from "../../data/bac.json";

import { useRef, useState } from "react";


export default function Whatsapp() {
  const [numBac, setNumBac] = useState("");
  const [student , setStudent] = useState(null)

  const numBacRef = useRef(null)


  const handelValideStudent = (e) => {
    e.preventDefault();
    console.log(data[0].NODOSS)
    const isValid = data.find((student) => student.NODOSS == +numBac);
    setStudent(isValid)
    console.log(isValid)

    if(isValid?.Moyenne >= 10){
        toast.success('تهانينا ')
        return;
    }


    numBacRef.current.blur()
    toast.info(" نتمنى لكم حظا أوفر في القادم");
  };

  const handleNumBacChange = (e) => {
    const inputValue = e.target.value;
    const numBacValue = inputValue.slice(0, 6); // Restrict to 5 digits
    setNumBac(numBacValue);
  };

  console.log(student)

 
  return (
    <>
      <Header picture={"/04.jpeg"} />
      <section className="whatsapp">
        <form className="form">
            <p>أدخل رقم الباكلوريا </p>
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
              <button
                onClick={handelValideStudent}
              >
                تأكيد 
              </button>
            </div>     
        </form>
{/* 
        {
          student && (
            // <h1> الإسم : {student?.NOMPL} </h1>

        // <h2> المعدل : {student?.MOYBAC} </h2>

        // <h3> القرار : {student?.Decision} </h3>
          )
        } */}
      </section>
      <ToastContainer
        position="top-center"
        autoClose={5000}
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
