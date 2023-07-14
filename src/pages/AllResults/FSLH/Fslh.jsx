import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import "../Fst.css";
import { useState } from "react";

export default function FST() {

  const specialiter = [
    { name: "علم الاجتماع ", id: "1s5frk5wGBkgA4AVpA8AsBqZcl7Dosiuw" },
    { name: "اللغات الوطنية ", id: "1v8PKYRZZNxwlvYOx43zJuKFbk048bTnT" },
    { name: "الفلسفة ", id: "1N5liQSlrakNo2sFoRpgT3ZoOz7XSGRoC" },
    { name: "الفرنسية", id: "1jvdE_aoOlk5-71-SuSGMoC7vV6xjCINZ" },
    { name: "العمل الاجتماعي", id: "1aFEV2cT7m0fdOnYVubUPlT8FhTjRkvde" },
    { name: "العربية", id: "1-myZZer45eA9aaJCIkJ14TQWcLUJx8nb" },
    { name: "الصينية", id: "19WexUcB3vKqbZkBEE4nbpucxZEMfHR64" },
    { name: "الجغرافيا", id: "1CMDBm-lwqe7dVlTmcdpsQ-BfWm24Wy1i" },
    { name: "التنمية المحلية ", id: "1YKXWz1ppHH1OWVpcTBnvZuJDUWmOeNc-" },
    { name: "التاريخ ", id: "17hM1C2Je7USvFe_EHZivsPhgYlgqm7ae" },
    { name: "البيئة والتنمية المستدامة", id: "1hSfEdLl7oJ2bAZxLYgQrCH4AlB9WHwus" },
    { name: "الإنگليزية", id: "1Rt9cDnLDRalSFAWlGNO5LUtNykxRISpc" },
    { name: "الإسبانية", id: "1zIr-uzGNSIrUYs4ZbXUWtBvbaQbX1pR7" },
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
    gridAutoColumns : "58%",
  }

 
  return (
    <>
      <Header picture={"/fac/02.png"} />
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
