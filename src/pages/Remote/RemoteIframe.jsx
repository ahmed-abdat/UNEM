import Header from '../../components/Header'
import Footer from '../../components/Footer';
import './RemoteIframe.css'

export default function FST() {
  return (
    <>
      <Header picture={'/fac/06.png'} />
      <section className="fst">
      <iframe src="https://inscription.fmpos.una.mr/" ></iframe>
      </section>
      <Footer />
    </>
  );
}