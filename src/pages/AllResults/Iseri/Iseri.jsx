import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import "../Fst.css";
import { useState } from "react";

export default function FST() {

  const specialiter = [
    { name: "العربية", id: "1S7z_isXoTWgTczw9r9C4Up1d6qL_qot2" },
    { name: "الشريعة", id: "1E8qe26WXZ3cDy4k6govjPlFZYMZW-qvL" },
  ];


  const [choosenSpeciality, setChoosenSpeciality] = useState(specialiter[0].id);

  // const [currentSpeciality , SetCurrentSpeciality] = useState(specialiter[0].id)

  const handelChoosenSpeciality = (speciality) => {
    setChoosenSpeciality((prev) => {
      return speciality;
    });
  };

  const style = {
    direction: "rtl",
    // gridAutoColumns : "58%",
  }

 
  return (
    <>
      <Header picture={"/fac/04.png"} />
      <section className="speciality" style={style}>
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
