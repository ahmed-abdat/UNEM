import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import "../Fst.css";
import { useState } from "react";

export default function FST() {

  const specialiter = [
    { name: "Reseaux", id: "1-R13GptNs1G4zMwLyFPZ23GZ1JrL3tax" },
    { name: "Management", id: "1-N13qeIyiobU_GXHOpTopHlk1JB_Y3dj" },
    { name: "MAEF", id: "1-SGXuTPAkyZiaeCAADBhfLSWKhrE5eJu" },
    { name: "LGTR", id: "10HgrslRRUYlN61hyuz6EhwyEyUyrKzHA" },
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
