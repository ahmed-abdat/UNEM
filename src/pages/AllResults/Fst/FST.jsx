import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import './Fst.css'

export default function FST() {
  return (
    <>
      <Header picture={'/03.png'} />
      <section className="fst">
        <iframe src="https://resultats.una.mr/FST" width="100%" height="100%" />
      </section>
      <Footer />
    </>
  );
}
