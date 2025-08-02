import HeaderImg from '@/components/HeaderImg';
import Footer from '@/components/Footer';
import WhatsappForm from '@/components/WhatsappForm';
import './Whatsapp.css';

export default function Whatsapp() {
  return (
    <>
      <HeaderImg picture={'/04.jpeg'} bgColor={'#f8f8f8'} />
      <div className="whatsapp-container">
        <div className="whatsapp-content">
          <h1>مجموعات الواتساب</h1>
          <WhatsappForm />
        </div>
      </div>
      <Footer />
    </>
  );
}
