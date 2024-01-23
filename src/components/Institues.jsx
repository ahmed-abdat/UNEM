// get the dynamic route parameter
import { useParams } from "react-router-dom";

import "./styles/instuties.css";

function Institues() {
  // get the dynamic route parameter
  const { id } = useParams();
  return (
    <section className="institutions-img">
      <img src={`/fac2/${id}.jpg`} alt="fst" />
    </section>
  );
}
export default Institues;
