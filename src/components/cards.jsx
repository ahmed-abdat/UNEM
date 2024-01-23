import "./styles/cards.css";
import moment from "moment";
import "moment/locale/ar-sa";
import {
  query,
  collection,
  orderBy,
  limit,
  onSnapshot,
  getDocs,
  startAfter,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CardSkelton from "./CardSkelton";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useInView } from "react-intersection-observer";
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
    const q = query(
      collection(db, "postes"),
      orderBy("createdAt", "desc"),
      limit(10)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let postes = [];
      snapshot.forEach((doc) => {
        postes.push({ id: doc.id, ...doc.data() });
      });
      const lastVisible = snapshot.docs[snapshot.docs.length - 1];
      setLastePoste(lastVisible);
      setPostes(postes);
      setIsLoading(false);
    });

    return () => unsubscribe();
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
      console.log(error);
    }
  };

  moment.locale("ar_SA");
  moment.updateLocale("ar_SA", {
    relativeTime: {
      future: "في %s",
      past: "منذ %s",
      s: "ثوان",
      ss: "%d ثانية",
      m: "دقيقة",
      mm: "%d دقائق",
      h: "ساعة",
      hh: "%d ساعات",
      d: "يوم",
      dd: "%d أيام",
      M: "شهر",
      MM: "%d أشهر",
      y: "سنة",
      yy: "%d سنوات",
    },
  });

  const showTime = (date) => {
    const now = moment();
    const time = date.seconds * 1000;
    const momentTime = moment(time);
    const houreAndMinitFormate = momentTime.format("hh:mm");
    const monthAndDayFormat = momentTime.format("MM/DD");
    const yearFormat = momentTime.format("YYYY");
    return currentDate(
      momentTime,
      houreAndMinitFormate,
      now,
      monthAndDayFormat,
      yearFormat
    );
  };

  const currentDate = (
    momentTime,
    houreAndMinitFormate,
    now,
    monthAndDayFormat,
    yearFormat
  ) => {
    const AmPm = `${momentTime.format("a") === "am" ? "ص" : "م"}`;
    if (momentTime.isSame(now, "day")) {
      return `اليوم الساعة ${houreAndMinitFormate} ${AmPm}`;
    } else if (momentTime.isSame(now.clone().subtract(1, "day"), "day")) {
      return `أمس الساعة ${houreAndMinitFormate} ${AmPm}`;
    } else if (
      momentTime.isSame(now, "month") &&
      momentTime.isSame(now, "year")
    ) {
      return `${monthName(
        monthAndDayFormat
      )} الساعة ${houreAndMinitFormate} ${AmPm}`;
    } else {
      return `${monthName(
        monthAndDayFormat
      )} ${yearFormat} الساعة ${houreAndMinitFormate} ${AmPm}`;
    }
  };

  const monthName = (months) => {
    const month = months.slice(0, 2);
    const day = months.slice(3, 5);
    switch (month) {
      case "01":
        return `${day} يناير`;
      case "02":
        return `${day} فبراير`;
      case "03":
        return `${day} مارس`;
      case "04":
        return `${day} أبريل`;
      case "05":
        return `${day} مايو`;
      case "06":
        return `${day} يونيو`;
      case "07":
        return `${day} يوليو`;
      case "08":
        return `${day} أغسطس`;
      case "09":
        return `${day} سبتمبر`;
      case "10":
        return `${day} أكتوبر`;
      case "11":
        return `${day} نوفمبر`;
      case "12":
        return `${day} ديسمبر`;
      default:
        return months;
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
              <div className="card" key={`${card.id}-${index}`}>
                <LazyLoadImage
                  src={card.images[0]?.url}
                  alt={card.title}
                  effect="blur"
                  className="card-img"
                  placeholderSrc="/image_loaders.gif"
                  width={`100%`}
                  height={220}
                  style={{ borderRadius: "9px" , overflow: "hidden"}}
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

                      <span className="card_time">{showTime(card.createdAt)}</span>
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
                    {/* <p className="card_date">{showTime(card.createdAt)}</p> */}
                  </div>
                  <div className="card_footer">
                    <SharePoste id={card.id} />
                    <button className="read_more" onClick={() => navigate(`poste/${card.id}`)}>
                      إقرأ المزيد
                      <div className="icon d-f">
                        <LiaLessThanSolid />
                      </div>
                    </button>
                  </div>
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
