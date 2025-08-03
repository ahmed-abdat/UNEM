import HeaderImg from "../../components/HeaderImg";
import Footer from "../../components/Footer";
import "./Fst.css";
import { useState } from "react";
import { archives } from "../../data/archives";
import { useParams } from "react-router-dom";

export default function FST() {
  const { id } = useParams();


  const selectedFaculiter = archives.find((el) => el.faculiter === id);

  const specialiter = selectedFaculiter.filieres;

  const [choosenSpeciality, setChoosenSpeciality] = useState(specialiter[0].id);

  return (
    <>
      <HeaderImg picture={selectedFaculiter.img} />
      <section className="speciality" style={selectedFaculiter.class}>
        {specialiter.map((item) => (
          <div
            className={`speciality-item ${
              choosenSpeciality === item.id ? "active" : ""
            }`}
            key={item.id}
          >
            <h3 onClick={() => setChoosenSpeciality(item.id)}>{item.name}</h3>
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
