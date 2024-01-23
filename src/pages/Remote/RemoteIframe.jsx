import HeaderImg from '../../components/HeaderImg'
import Footer from '../../components/Footer';
import './RemoteIframe.css'

export default function FST() {
  return (
    <>
      <HeaderImg picture={'/fac/06.png'} />
      <section className="fst">
      <iframe src="https://inscription.fmpos.una.mr/" ></iframe>
      </section>
      <Footer />
    </>
  );
}