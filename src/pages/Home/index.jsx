import HomeOption from "../../components/HomeOption";
import Img from "../../assets/texture.png";
import { BsFacebook, BsWhatsapp } from "react-icons/bs";
import Intro from "../../components/Intro";
import "./home.css";
import { useEffect, useState } from "react";

export default function home() {

  const [isLoading , setIsLoading] = useState(true)


  useEffect(() => { 
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 2000);

  }, [])


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
      content : ' نتائج الباكولوريا 2023',
      url : '/bac2023'
    },
    {
      content: "حساب المعدل التوجيهي",
      url: "/calculation",
    },
    {
      content: "الإستمارة و التوجيه",
      url: "/form",
    },
    {
      content: " المجموعات الواتسابية (باكلوريا) ",
      url: "/whatsapp",
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
    ,
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
    <main className="home">
      {
        isLoading ? (
          <Intro />
        ) : (
          <section className="main">
        <header>
          <div className="img">
            <img src={Img} alt="" />
          </div>
          <div className="logo">
            <img src="/unem.png" alt="logo" />
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
        )
      }
    </main>
  );
}
