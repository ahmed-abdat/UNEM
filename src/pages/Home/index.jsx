
import HomeOption from "../../components/HomeOption";
import Img from '../../assets/texture.png'
import { BsFacebook, BsWhatsapp } from "react-icons/bs";
import "./home.css";

export default function home() {

    // handel whatsapp redirect
    const handelWhatsapp = () => {
      window.open(
        "https://wa.me/36199323?text=''"
      );
    };
    // handel facebook redirect
    const handelFacebook = () => {
      window.open("https://www.facebook.com/unem.mr/");
    };
  

  const options = [
    {
      content : 'حساب المعدل التوجيهي',
      url : '/calculation'
    },
    {
      content: "نتايج الإمتحانات",
      url: "/resulta"
    }, 
    {
      content: "مراجع و دروس",
      url: "/revision"
    },
    {
      content : ' المجموعات الواتسابية (باكولوريا) ',
      url : '/whatsapp'
    },
    // {
    //   content : 'الإنتساب',
    //   url : '/inscri'
    // },
    {
      content : 'مؤسسات التعليم العالي',
      url : '/institutions'
    },
    // {
    //   content : 'الخدمات الجامعية',
    //   url : '/service'
    // }
    ,{
      content : 'جداول الحصص',
      url : '/schedule'
    }
    , {
      content : 'الأقسام و الفروع',
      url : '/branches'
    }
    , {
      content : 'التسجيل عن بعد',
      url : '/remote'
    }

  ]


  return (
    <main className="home">
      <section className="main">
      <header>
        <div className="img">
          <img src={Img} alt="" />
        </div>
        <div className="logo">
          <img src="/unem.png" alt="logo"  />
        </div>
      </header>
      <HomeOption options={options}/>
      <div className="info">
      <h3>أكبر نقابة طلابية موريتانية تأسست 13 مايو سنة 2000 م</h3>
      </div>
      <div className="contanct">
      <p>للتواصل CONTACT</p>
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
      {/* <section className="main--footer">
        <div className="main--footer--content">


        </div>
        <footer>
          <span className="bar"></span>
          <div className="footer--content">
          </div>
          <div className="footer--icons">
     
          </div>
        </footer>
      </section> */}
    </main>
  )
}