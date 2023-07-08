import { Link } from "react-router-dom";
import "./styles/Header.css";
import { BsFacebook, BsWhatsapp } from "react-icons/bs";

export default function Header() {
  // handel whatsapp redirect
  const handelWhatsapp = () => {
    window.open(
      "https://wa.me/47145117?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85"
    );
  };
  // handel facebook redirect
  const handelFacebook = () => {
    window.open("https://www.facebook.com/unem.mr/");
  };

  return (
    <header>
      <div className="header--container">
        <div className="header--logo">
          <Link to="/"><img src="/unem.png" alt="logo" /></Link>
          <h4> الاتحاد الوطني لطلبة موريتانيا </h4>
        </div>
        <div className="header--icons">
          <div className="icon" onClick={handelFacebook}>
            <BsFacebook />
          </div>
          <div className="icon" onClick={handelWhatsapp}>
            <BsWhatsapp />
          </div>
        </div>
      </div>
    </header>
  );
}
