import HeaderImg from '@/components/HeaderImg';
import Footer from '@/components/Footer';
import WhatsappForm from '@/components/WhatsappForm';
import './bac2025.css';

export default function Bac2025() {
  return (
    <>
      <HeaderImg picture={'/bac2025.png'} bgColor={'transparent'} />
      <div className="bac2025-container">
        <div className="bac2025-content">
          <h1>نتائج الباكلوريا 2025</h1>
          <WhatsappForm />
        </div>
      </div>
      <Footer />
    </>
  );
}