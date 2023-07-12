import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import './Fst.css'

export default function FST() {
  return (
    <>
      <Header picture={'/03.png'} />
      <section className="fst">
        <iframe src='http://resultats.una.mr/' width="100%" height="100%" allowFullScreen={true} />
      </section>
      <Footer />
    </>
  );
}
