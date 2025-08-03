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

// Export ErrorBoundary for route-level error handling
export function ErrorBoundary() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">خطأ في تحميل الصفحة</h1>
        <p className="text-gray-600 mb-6">حدث خطأ أثناء تحميل صفحة مجموعات الواتساب. يرجى إعادة تحديث الصفحة.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-brand-primary text-white px-6 py-3 rounded-lg hover:bg-primary-600"
        >
          إعادة تحديث الصفحة
        </button>
      </div>
    </div>
  );
}
