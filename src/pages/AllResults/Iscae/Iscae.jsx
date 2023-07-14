import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import "../Fst.css";
import { useState } from "react";

export default function FST() {

  const specialiter = [
    { name: "GRH", id: "1o02xWde7CMPV2ghUczAecha-Flq79pQo" },
    { name: "IG", id: "1GIcbp2gXSgw2mQN5WzWzz6gZ8GFM-c5F" },
    { name: "TCM", id: "1Oa2RwhnL9ngdCQFgs2UPp9Xaww7mv_x5" },
    { name: "SAE", id: "1_boN__SeP5325VJRKhzU9HzFxKgYYJ1y" },
    { name: "RIT", id: "1WC9xF4crqhVdOlqXfTVa13FbIYQh_PtZ" },
    { name: "FC", id: "1ieNZP8e4z_H9Lx6oLF3d9TN9jnrW5T1j" },
    { name: "DI", id: "1L8FeIA7iwdNlX_tI4RcBEVf8B77sQwkI" },
    { name: "BA", id: "1ad5V0wcrGeCqKz4ZJwsa_yRiHIu5CHED" },
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
      <Header picture={"/fac/03.png"} />
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
