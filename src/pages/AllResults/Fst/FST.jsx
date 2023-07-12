import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import "./Fst.css";

export default function FST() {
  const specialiter = [{ name: "BG" }, { name: "PC" }, { name: "MPI" } , { name: "BG" }, { name: "PC" }, { name: "MPI" } , { name: "BG" }, { name: "PC" }, { name: "MPI" }];
  return (
    <>
      <Header picture={"/03.png"} />
      <section className="speciality">
        {specialiter.map((item) => (
          <div className="speciality-item" key={item.name}>
            <h3>{item.name}</h3>
          </div>
        ))}
      </section>
      <section className="fst">
        <iframe src="https://drive.google.com/embeddedfolderview?id=17IdOq6c-90NuSqUJh3enxARpqAaSAbfh&resourcekey=RESOURCE-KEY"></iframe>
      </section>
      <Footer />
    </>
  );
}
