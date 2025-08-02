import HeaderImg from '@/components/HeaderImg';
import Footer from '@/components/Footer';
import './bac2025.css';

export default function Bac2025() {
  return (
    <>
      <HeaderImg picture={'/bac2025.png'} bgColor={'transparent'} />
      <div className="bac2025-container">
        <div className="empty-state">
          <h1>نتائج الباكلوريا 2025</h1>
          <p>قريباً إن شاء الله</p>
        </div>
      </div>
      <Footer />
    </>
  );
}