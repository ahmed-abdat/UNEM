import HomeOption from "../../components/HomeOption";
import Img from "../../assets/texture.png";
import { BsFacebook, BsWhatsapp } from "react-icons/bs";
import Intro from "../../components/Intro";
import "./home.css";
import { useEffect, useState } from "react";

export default function home() {

  const [isLoading , setIsLoading] = useState(true)


  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 2000);
  }, [])


  // handel whatsapp redirect
  const handelWhatsapp = () => {
    window.open("https://wa.me/36199323?text=''");
  };
  // handel facebook redirect
  const handelFacebook = () => {
    window.open("https://www.facebook.com/unem.mr/");
  };

  const options = [
    {
      content: "حساب المعدل التوجيهي",
      url: "/calculation",
    },
    {
      content: "نتايج الإمتحانات",
      url: "/resulta",
    },
    {
      content: "مراجع و دروس",
      url: "/revision",
    },
    {
      content: " المجموعات الواتسابية (باكولوريا) ",
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
      </section>
        )
      }
    </main>
  );
}
