import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import "../Fst.css";
import { useState } from "react";

export default function FST() {
  const [choosenSpeciality, setChoosenSpeciality] = useState("17IdOq6c-90NuSqUJh3enxARpqAaSAbfh");

  const handelChoosenSpeciality = (speciality) => {
    setChoosenSpeciality((prev) => {
      return speciality;
    });
  };

  const specialiter = [
    { name: "BG", id: "17IdOq6c-90NuSqUJh3enxARpqAaSAbfh" },
    { name: "PC", id: "17LQAoxbF3cGJgmTLP_uAcnLZAXeCdjz-" },
    { name: "MPI", id: "17QchjyP0r9NMklrkZp1HRoaVrgpRiwuo" },
  ];
  return (
    <>
      <Header picture={"/fac/07.png"} />
      <section className="speciality">
        {specialiter.map((item) => (
          <div className="speciality-item" key={item.id}>
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
