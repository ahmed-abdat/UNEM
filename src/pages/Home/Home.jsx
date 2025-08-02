import HomeOption from "../../components/HomeOption";
import SEO from "../../components/SEO";
import { BsFacebook, BsWhatsapp } from "react-icons/bs";
import "./home.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { getDefaultSEO } from "../../hooks/useSEO";
import { generateOrganizationSchema, generateWebsiteSchema, combineSchemas } from "../../utils/structuredData";

export default function home() {
  const seoData = getDefaultSEO();
  const structuredData = combineSchemas(
    generateOrganizationSchema(),
    generateWebsiteSchema()
  );
  // handel whatsapp redirect
  const handelWhatsapp = () => {
    window.open("https://wa.me/+22236199323?text=");
  };
  // handel facebook redirect
  const handelFacebook = () => {
    window.open("https://www.facebook.com/unem.mr/");
  };

  // handel whatsapp redirect
  const handelAhmedWhtspp = () => {
    window.open("https://wa.me/+22242049074?text=");
  };

  const options = [
    {
      content: "نتائج الباكلوريا 2025",
      url: "/bac2025",
    },
    {
      content: " المجموعات الواتسابية (باكلوريا) ",
      url: "/whatsapp",
    },
    {
      content: "الإستمارة و التوجيه",
      url: "/form",
    },
    {
      content: "مؤسسات التعليم العالي",
      url: "/institutions",
    },
    {
      content: "نتائج الامتحانات",
      url: "/resulta",
    },
    {
      content: "مراجع و دروس",
      url: "/revision",
    },
    // {
    //   content : 'الخدمات الجامعية',
    //   url : '/service'
    // }
    {
      content: "جداول الحصص",
      url: "/schedule",
    },
    {
      content: "الأقسام و الفروع",
      url: "/branches",
    },
    {
      content: "التسجيل عن بعد",
      url: "/remote",
    },
    {
      content: " عن الاتحاد",
      url: "/about",
    },
  ];

  return (
    <>
      <SEO 
        {...seoData}
        image="/og_image.png"
        structuredData={structuredData}
      />
      <main className="home">
      <section className="main">
        <header className="main-header">
          <div className="img">
            <LazyLoadImage src={"/texture.png"} alt="background" />
          </div>
          <div className="logo">
            <LazyLoadImage src="/unem.png" alt="logo" />
          </div>
        </header>
        <HomeOption options={options} />
        <div className="info">
          <h3>أكبر نقابة طلابية موريتانية تأسست 13 مايو 2000 م</h3>
        </div>
        <div className="contanct">
          <div className="layout"></div>
          <p className="content">للتواصل CONTACT</p>
          <div className="contact--icons">
            <div className="icon" onClick={handelFacebook}>
              <BsFacebook />
            </div>
            <div className="icon" onClick={handelWhatsapp}>
              <BsWhatsapp />
            </div>
          </div>
        </div>
        <div className="footer-name" onClick={handelAhmedWhtspp}>
          <p>Made by @Ahmed Abdat</p>
        </div>
      </section>
    </main>
    </>
  );
}
