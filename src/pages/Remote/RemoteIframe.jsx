import Header from '../../components/Header'
import Footer from '../../components/Footer';
import './RemoteIframe.css'

export default function FST() {
  return (
    <>
      <Header picture={'/07.png'} />
      <section className="fst">
      <iframe src="https://unem.vercel.app/" ></iframe>
      </section>
      <Footer />
    </>
  );
}