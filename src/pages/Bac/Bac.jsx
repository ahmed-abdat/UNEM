import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Bac.css";
import data from "../../data/bac.json";
import ReactGA from 'react-ga';


import { useRef, useState } from "react";


export default function Whatsapp() {
  const trackingId = "G-HT85B06T97"
  ReactGA.initialize(trackingId);
  ReactGA.pageview(window.location.pathname);
  
  const [numBac, setNumBac] = useState("");
  const [student , setStudent] = useState(null)
  
  const numBacRef = useRef(null)
  

  const handelValideStudent = (e) => {
    e.preventDefault();
  
    const isValid = data.find((student) => student.NODOSS == +numBac);
    setStudent(isValid)


    if(isValid?.MOYBAC >= 8){
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



 
  return (
    <>
      <Header picture={"/08.jpeg"} />
      <section className="whatsapp">
        <section className="bac">نتائج الباكلوريا</section>
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
        {
          student && (
            <>
          <section className="info">
          <h1> الاسم : {student?.NOMPL} </h1>
            <h2> المعدل : {student.MOYBAC.toFixed(2)}</h2>
          <h3> الشعبة : {student.SERIE}</h3>
            <h3> القرار : {student.Decision}</h3>
          </section>
            </>
          )
        }
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
