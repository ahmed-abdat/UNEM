import { doc, getDoc } from "firebase/firestore/lite";
import { getFirestore } from "firebase/firestore/lite";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { app } from "../config/firebase";
import Header from "./Header";
import Video from "./Video";
import "./styles/poste.css";
import { toast } from "react-toastify";
import { showTime, showTimeDate } from "../utils/showTime";
import { LazyLoadImage } from "react-lazy-load-image-component";
import SharePoste from "./SharePoste";
import PosteSkelton from "./PosteSkelton";
import ViewFullImage from "./ViewImage";
import TipTap from "./TipTap";
import { isValidJSON } from "../utils/valide-json";
function Poste() {
  const { id } = useParams();
  const [poste, setPoste] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [image, setImage] = useState(null);
  const firestore = getFirestore(app);
  const getPoste = async (id) => {
    const docRef = doc(firestore, "postes", id);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPoste(docSnap.data());
        localStorage.setItem("poste", JSON.stringify(docSnap.data()));
      } else {
        if (import.meta.env.DEV) {
          console.log('Document not found for ID:', id);
        }
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (import.meta.env.DEV) {
        console.error('Error fetching post:', error.message);
      }
    }
  };

  useEffect(() => {
    getPoste(id);
  }, [id]);

  // check if the is mobile or not
  const isMobile = window.innerWidth <= 768;

  const url = `https://unem.vercel.app/news/poste/${id}`;
  const handelCopy = () => {
    navigator.clipboard.writeText(url);
    toast.success("تم نسخ الرابط بنجاح");
  };


  // handel selected image
  const selectedImage = (media) => {
    if (media) {
      setImage(media);
      setIsImageSelected(true);
    }
  };

  return (
    <>
      {isImageSelected ? (
        <ViewFullImage
          selectedImage={image}
          setIsImageSelected={setIsImageSelected}
          images={poste.images}
        />
      ) : (
        <>
          <Header />
          {isLoading ? (
            <PosteSkelton />
          ) : (
            <section className="poste">
              <div className="poste-title">
                <h1>{poste?.title}</h1>
              </div>
              {poste?.videoUrl ? (
                <Video url={poste.videoUrl} />
              ) : (
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
              )}
              <div className="poste-info">
                <div className="poste-times">
                  <span className="create-time">
                    {showTime(poste?.createdAt)}
                  </span>
                  <span className="bar">|</span>
                  <span className="update-time">
                    آخر تحديث : {showTimeDate(poste?.lasteUpdate)}
                  </span>
                </div>
                <div className="poste-share">
                  <SharePoste handelCopy={handelCopy} url={url} />
                </div>
              </div>
              <div className="poste-content">
              {
                isValidJSON(poste?.discribtion) ? <TipTap description={JSON.parse(poste?.discribtion || '')} /> : <p>{poste?.discribtion || poste?.summary}</p>
              }
              </div>
              <div className="poste-images">
                {poste?.images.map((image) => (
                  <LazyLoadImage
                    key={image.url}
                    src={image.url}
                    alt={poste?.title}
                    effect="blur"
                    placeholderSrc="/image_loaders.gif"
                    width={`100%`}
                    height={isMobile ? 200 : 300}
                    onClick={() => selectedImage(image)}
                    // height={isMobile ? 300 : 420}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}
export default Poste;
