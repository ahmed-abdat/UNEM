import "./styles/Header.css";
import Share from './Share'
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate } from "react-router-dom";

export default function Header() {

  const navigate  = useNavigate();


  const goToHome = () => {
    console.log("go to home");
    navigate("/");
  }

  return (
    <header className="poste-header">
      <div className="left-side">
        <LazyLoadImage
          className="logo"
          src="/unem.png"
          alt="unem logo"
          onClick={goToHome}
        />
      </div>
      <div className="right-side">
        <Share />
      </div>
    </header>
  );
}
