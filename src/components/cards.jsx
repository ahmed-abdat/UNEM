import "./styles/cards.css";
import {
  query,
  collection,
  orderBy,
  limit,
  getDocs,
  startAfter,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CardSkelton from "./CardSkelton";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useInView } from "react-intersection-observer";
import { showTime } from "../utils/showTime";
import SharePoste from "./SharePoste";
import { LiaLessThanSolid } from "react-icons/lia";

function CardsConatainer() {
  const [isLoading, setIsLoading] = useState(true);
  const [lastePoste, setLastePoste] = useState(null);
  const [postes, setPostes] = useState([]);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const navigate = useNavigate();

  const { ref: divRef, inView } = useInView({
    delay: 100,
  });

  useEffect(() => {
    localStorage.removeItem("poste");
    fetchPostes();
  }, []);

  const fetchPostes = async () => {
    try {
      const q = query(
        collection(db, "postes"),
        orderBy("createdAt", "desc"),
        limit(10)
      );
      const snapshot = await getDocs(q);
      let postes = [];
      snapshot.forEach((doc) => {
        postes.push({ id: doc.id, ...doc.data() });
      });

      if (postes.length === 0) return;

      const lastVisible = snapshot.docs[snapshot.docs.length - 1];
      setLastePoste(lastVisible);
      setPostes(postes);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching postes:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (inView && lastePoste && !isFetchingMore) {
      fetchMorePostes();
    }
  }, [inView]);

  const fetchMorePostes = async () => {
    if (!lastePoste || postes.length < 10) return;
    console.log("fetchMorePostes");
    setIsFetchingMore(true);
    const q = query(
      collection(db, "postes"),
      orderBy("createdAt", "desc"),
      startAfter(lastePoste),
      limit(4)
    );
    try {
      const querySnapshot = await getDocs(q);
      let otherposte = [];
      querySnapshot.forEach((doc) => {
        otherposte.push({ id: doc.id, ...doc.data() });
      });
      const newPostes = postes.concat(otherposte);
      setPostes(newPostes);
      let laste = querySnapshot.docs[querySnapshot.docs.length - 1];
      if (querySnapshot.size < 4) {
        laste = null;
      }
      setLastePoste(laste);
      setIsFetchingMore(false);
    } catch (error) {
      console.error("Error fetching more postes:", error);
      setIsFetchingMore(false);
    }
  };

  return (
    <section className={`d-f cards`}>
      {/* <CardSkelton count={2} /> */}
      {isLoading ? (
        <CardSkelton count={8} />
      ) : (
        postes.map((card, index) => {
          return (
            <div
              className="card"
              key={`${card.id}-${index}`}
              onClick={() => navigate(`poste/${card.id}`)}
            >
              <LazyLoadImage
                src={card.images[0]?.url}
                alt={card.title}
                effect="blur"
                className="card-img"
                placeholderSrc="/image_loaders.gif"
                width={`100%`}
                height={220}
                style={{ borderRadius: "9px", overflow: "hidden" }}
              />
              <div className={`card_discription`}>
                <div className="card-head">
                  <LazyLoadImage
                    width={40}
                    height={40}
                    effect="blur"
                    src="/unem.png"
                    placeholderSrc={"/image_loaders.gif"}
                    alt="logo"
                  />
                  <div className="card_logo_title">
                    <p>الاتحاد الوطني لطلبة موريتانيا</p>

                    <span className="card_time">
                      {showTime(card.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="card_header">
                  <h3
                    className={`card_title ${
                      card.title?.length < 55 ? "mb-2" : ""
                    }`}
                  >
                    {card.title}
                  </h3>
                </div>
                {/* <div className="card_footer">
                    <SharePoste id={card.id} />
                    <button className="read_more" onClick={() => navigate(`poste/${card.id}`)}>
                      إقرأ المزيد
                      <div className="icon d-f">
                        <LiaLessThanSolid />
                      </div>
                    </button>
                  </div> */}
              </div>
            </div>
          );
        })
      )}
      {isFetchingMore && <CardSkelton count={2} />}
      <div ref={divRef} style={{ height: "10px" }}></div>
    </section>
  );
}
export default CardsConatainer;
