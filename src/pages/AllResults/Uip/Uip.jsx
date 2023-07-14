import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import "../Fst.css";
import { useState } from "react";

export default function FST() {

  const specialiter = [
    { name: "Reseaux", id: "1l71nabcsQCsYzFcdCM0gd6ae_WdDj-Vj" },
    { name: "Management", id: "1gJNnhNDxD_Kz1LosvWNqcpH415h_UZb0" },
    { name: "MAEF", id: "1fJerDd_OGoW9d3GoGCtBu6SDlMU8ibWl" },
    { name: "LGTR", id: "1RJiLWE6Sw_3DRxrbkFT2Are9hCQlqhVe" },
  ];


  const [choosenSpeciality, setChoosenSpeciality] = useState(specialiter[0].id);

  // const [currentSpeciality , SetCurrentSpeciality] = useState(specialiter[0].id)

  const handelChoosenSpeciality = (speciality) => {
    setChoosenSpeciality((prev) => {
      return speciality;
    });
  };

 
  return (
    <>
      <Header picture={"/fac/05.jpg"} />
      <section className="speciality">
        {specialiter.map((item) => (
          <div className={`speciality-item ${choosenSpeciality === item.id ? 'active' : ''}`} key={item.id}>
            <h3 onClick={() => handelChoosenSpeciality(item.id)}>
              {item.name}
            </h3>
          </div>
        ))}
      </section>
      <section className="fst">
        <iframe
          src={`https://drive.google.com/embeddedfolderview?id=${choosenSpeciality}&resourcekey=RESOURCE-KEY`}
        ></iframe>
      </section>
      <Footer />
    </>
  );
}
