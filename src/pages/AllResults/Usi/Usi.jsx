import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import "../Fst.css";
import { useState } from "react";

export default function FST() {

  const specialiter = [
    { name: "كلية للغة العربية", id: "1ujyhGNKOpYKs3oUvANjYFIFMrCRU_Mx6" },
    { name: "كلية الشريعة", id: "1BTlz5hJbV3muT6vmzbdbO-cPHpBykBID" },
    { name: "كلية أصول الدين", id: "1LXvtvHoAqt5MW6QUx2-fTP_suW8UD7hR" },
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
      <Header picture={"/fac/07.png"} />
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
