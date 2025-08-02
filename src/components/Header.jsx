import "./styles/Header.css";
import Share from './Share'
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate } from "react-router-dom";

export default function Header() {

  const navigate  = useNavigate();


  const goBack = () => {
    if (import.meta.env.DEV) {
      console.log('Navigation: going back');
    }
    navigate(-1);
  }

  return (
    <header className="poste-header">
      <div className="left-side">
        <LazyLoadImage
          className="logo"
          src="/unem.png"
          alt="unem logo"
          onClick={goBack}
        />
      </div>
      <div className="right-side">
        <Share />
      </div>
    </header>
  );
}
