import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import "../Fst.css";
import { useState } from "react";

export default function FST() {

  const specialiter = [
    { name: "Droit", id: "13TBDylnzMs78QlEV98YivkupPQE91_Ko" },
    { name: "Economie", id: "1OO6y47-bmxcyTJQjDecm9pFFNPF2l7o9" },
    { name: "Professionnelle", id: "1jgaqVTUHa6wMGU7eU9UTCdgQVMCsCqm4" },
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
      <Header picture={"/fac/11.jpg"} />
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
