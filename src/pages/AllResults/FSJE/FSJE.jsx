import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import "../Fst.css";
import { useState } from "react";

export default function FST() {

  const specialiter = [
    { name: "Droit", id: "1Lb7YDMylIugnKeWTyyfZnz_58fhiF1L3" },
    { name: "Economie", id: "1OO6y47-bmxcyTJQjDecm9pFFNPF2l7o9" },
    { name : 'GRH' , id : "15fYV9qKNnLY52Sa9lS_2kSX-kJ5XLSoQ"},
    { name : 'FC' , id : "1hupwo_zxW5PmctDPhaaTcvJ6_GSTAvlK"} ,
    { name : "BA" , id : "1u1t73iSXtoBdRHWsKi4U8zo9xfsoT7s8"} ,
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
