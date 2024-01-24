import { doc, getDoc } from "firebase/firestore/lite";
import { getFirestore } from "firebase/firestore/lite";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { app } from "../config/firebase";
import Header from "./Header";
import "./styles/poste.css";

import { showTime} from '../utils/showTime'
import { LazyLoadImage } from "react-lazy-load-image-component";
import SharePoste from "./SharePoste";
import PosteSkelton from "./PosteSkelton";
function poste() {
  const { id } = useParams();
  const [poste, setPoste] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const firestore = getFirestore(app);
  const getPoste = async (id) => {
    const docRef = doc(firestore, "postes", id);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPoste(docSnap.data());
        localStorage.setItem("poste", JSON.stringify(docSnap.data()));
      } else {
        console.log("No such document!");
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getPoste(id);
  }, [id]);

  // check if the is mobile or not
  const isMobile = window.innerWidth <= 768;



  return (
    <>
      <Header />
      {/* <PosteSkelton /> */}
      {
        isLoading ? <PosteSkelton /> : <section className="poste">
        <div className="poste-title">
          <h1>{poste?.title}</h1>
        </div>
        <div className="poste-thumbnail">
          <LazyLoadImage
            src={poste?.images[0].url}
            alt={poste?.title}
            height={isMobile ? 300 : 420}
            effect="blur"
            placeholderSrc="/image_loaders.gif"
            width={`100%`}
          />
        </div>
        <div className="poste-info">
          <div className="poste-times">
            <span className="create-time">
            {showTime(poste?.createdAt)} 
            </span>
            <span className="bar">|</span>
            <span className="update-time">
            آخر تحديث: 24/1/2024
            </span>
          </div>
          <div className="poste-share">
            <SharePoste id={id}/>
          </div>
        </div>
        <div className="poste-content">
          <p>{poste?.description}</p>
        </div>
      </section>
      }
    </>
  );
}
export default poste;
