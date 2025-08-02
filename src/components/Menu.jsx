import Chevron from "../assets/icon/Chevron";
import { Link } from "react-router-dom";
import "./styles/Menu.css";

export default function Menu({ links }) {
  return (
    <section className="menu">
      <div className="link">
        <p className="content"> <Link to='/' >الرئيسية</Link></p>
      </div>
      {links?.map((link) => {
        return (
          <div className="link" key={link.content}>
            <div className="grather d-f">
              <Chevron />
            </div>
            <p className="content"><Link to={link.url} >{link.content}</Link></p>
          </div>
        );
      })}
    </section>
  );
}
