import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import "./Whatsapp.css";
import data from "../../data/bac.json";
import { useEffect, useState } from "react";
import { query } from "firebase/database";

export default function Whatsapp() {
  const [isValid, setIsValid] = useState(false);
  const [numBac, setNumBac] = useState("");
  const [yearBorn, setYearBorn] = useState("");
  const [student, setStudent] = useState("");
  const [validYear, setValidYear] = useState(2000);
  const [allExistingStd , setAllExistingStd] = useState(null)

  const handelValideStudent = (e) => {
    e.preventDefault();
    const isValid = data.find((student) => student.NumBac === +numBac);
    if (isValid) {
      setIsValid(true);
      setStudent(isValid);
      console.log(isValid.DateNaissance);
      toast.success("تم التأكد");
      setNumBac("");
      return;
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
    e.preventDefault();
    const validYear = student.DateNaissance.slice(-4)


   

    if (validYear === yearBorn) {
      console.log(student);
         // handel whatsapp redirect

      window.open(
        "https://chat.whatsapp.com/FLUaAmyD1TwLl0VS4LPjzn"
      );
    
      return;
    }
    toast.error("يبدو بأن سنة الميلاد غير صحيحة");
  };

  // // get all docs from firebase
  // const getAllDocs = async () => {
  //   try {
  //     // const q = query(collection(db, "students"));
  //     const docsRef = collection(db, "students");
  //     const querySnapshot = await getDocs(docsRef);
  //     let allStds = []
  //     querySnapshot.forEach((doc) => {
  //       allStds.push({...doc.data() , id : doc.id})
  //       // doc.data() is never undefined for query doc snapshots
  //     });
  //     setAllExistingStd(allStds)
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   getAllDocs();
  // }, []);

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
