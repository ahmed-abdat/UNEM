import { LazyLoadImage } from "react-lazy-load-image-component";
import "./styles/HeaderImg.css";

export default function NextPage({ picture, bgColor }) {
  return (
    <main className="next-page">
      <header
        className="nex-page--header"
        style={{ backgroundColor: bgColor ? bgColor : "#fff" }}
      >
        <LazyLoadImage src={picture} alt="header" width={`100%`} />
      </header>
    </main>
  );
}
