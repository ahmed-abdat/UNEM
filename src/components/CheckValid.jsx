import "./styles/CheckValid.css";
// import data from "../data/bac.json";
import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../config/firebase";

export default function CheckValid() {
  const [backNumber, setBackNumber] = useState("");
  const [seri, setSeri] = useState("");
  const [message, setMessage] = useState(null);
  const [data , setData ] = useState(null)

  // handel check
  const handelCheck = () => {
    const valide = data.find((student) => student.NumBac === +backNumber);
    if (valide) {
      setSeri(valide.Série);
      setMessage(null);
    } else {
      setMessage("person not valider");
      setSeri(null);
    }
  };

  const handeChange = (e) => {
    const { value } = e.target;
    if (value.length <= 0) {
      setMessage(null);
      setSeri(null);
    }

    setBackNumber(value);
  };

  useEffect(() => {
    const starCountRef = ref(db, "/");
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      setData(data)
    });
  }, []);

  return (
    <section className="checkValid">
      <h2>أدخل رقمك في الباكلوريا </h2>
      <input
        type="number"
        placeholder="أدخل رقمك في باك هنا"
        onChange={handeChange}
      />
      <button onClick={handelCheck}>طلب الدخول</button>
      {seri && <p>رقمك في السيري هو : {seri}</p>}
      {message && backNumber.length > 0 && <p>{message}</p>}
    </section>
  );
}
