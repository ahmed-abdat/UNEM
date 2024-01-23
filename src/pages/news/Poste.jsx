import { doc, getDoc } from "firebase/firestore/lite";
import { getFirestore } from "firebase/firestore/lite";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { app } from "../../config/firebase";
import { LazyLoadImage } from "react-lazy-load-image-component";
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
        console.log(docSnap.data());
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

  return (
    <section>
      <div className="poste-title">
        <h1>{poste?.title}</h1>
      </div>
      <div className="poste-content">
        <p>{poste?.description}</p>
      </div>
      <div className="poste-images">
        {poste?.images.map((img, index) => (
          <LazyLoadImage key={img.name} src={img.url} alt={img.name} width={250} height={250} />
        ))}
      </div>
    </section>
  );
}
export default poste;
