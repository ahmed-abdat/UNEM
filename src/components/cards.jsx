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
import { useEffect, useState, useCallback, useMemo } from "react";
import CardSkelton from "./CardSkelton";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useInView } from "react-intersection-observer";
import { showTime } from "../utils/showTime";

function CardsConatainer() {
  const [isLoading, setIsLoading] = useState(true);
  const [lastPost, setLastPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { ref: divRef, inView } = useInView({
    delay: 100,
    threshold: 0.1,
  });

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchPosts = useCallback(async () => {
    try {
      setError(null);
      const q = query(
        collection(db, "postes"),
        orderBy("createdAt", "desc"),
        limit(10)
      );
      const snapshot = await getDocs(q);
      
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      if (postsData.length === 0) {
        setIsLoading(false);
        return;
      }

      const lastVisible = snapshot.docs[snapshot.docs.length - 1];
      setLastPost(lastVisible);
      setPosts(postsData);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to load posts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    localStorage.removeItem("poste");
    fetchPosts();
  }, [fetchPosts]);

  // Optimized fetch more function with better error handling
  const fetchMorePosts = useCallback(async () => {
    if (!lastPost || posts.length < 10 || isFetchingMore) return;
    
    setIsFetchingMore(true);
    try {
      const q = query(
        collection(db, "postes"),
        orderBy("createdAt", "desc"),
        startAfter(lastPost),
        limit(4)
      );
      
      const querySnapshot = await getDocs(q);
      const newPosts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      if (newPosts.length > 0) {
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
        
        if (querySnapshot.size < 4) {
          setLastPost(null); // No more posts to fetch
        } else {
          const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
          setLastPost(lastVisible);
        }
      } else {
        setLastPost(null); // No more posts
      }
    } catch (error) {
      console.error("Error fetching more posts:", error);
      setError("Failed to load more posts.");
    } finally {
      setIsFetchingMore(false);
    }
  }, [lastPost, posts.length, isFetchingMore]);

  // Optimized infinite scroll trigger
  useEffect(() => {
    if (inView && lastPost && !isFetchingMore) {
      fetchMorePosts();
    }
  }, [inView, lastPost, isFetchingMore, fetchMorePosts]);

  // Memoized post cards to prevent unnecessary re-renders
  const postCards = useMemo(() => {
    return posts.map((card, index) => (
      <div
        className="card"
        key={card.id} // Use only ID for better performance
        onClick={() => navigate(`poste/${card.id}`)}
      >
        <LazyLoadImage
          src={card.images?.[0]?.url}
          alt={card.title || 'Post image'}
          effect="blur"
          className="card-img"
          placeholderSrc="/image_loaders.gif"
          width="100%"
          height={220}
          style={{ borderRadius: "9px", overflow: "hidden" }}
          loading="lazy"
          onError={(e) => {
            e.target.src = '/image_loaders.gif';
          }}
        />
        <div className="card_discription">
          <div className="card-head">
            <LazyLoadImage
              width={40}
              height={40}
              effect="blur"
              src="/unem.png"
              placeholderSrc="/image_loaders.gif"
              alt="UNEM logo"
              loading="lazy"
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
                (card.title?.length || 0) < 55 ? "mb-2" : ""
              }`}
            >
              {card.title}
            </h3>
          </div>
        </div>
      </div>
    ));
  }, [posts, navigate]);

  // Error display component
  if (error && !posts.length) {
    return (
      <section className="d-f cards">
        <div className="error-message" style={{ padding: '2rem', textAlign: 'center', color: '#e74c3c' }}>
          <p>{error}</p>
          <button 
            onClick={fetchPosts}
            style={{ 
              marginTop: '1rem', 
              padding: '0.5rem 1rem', 
              backgroundColor: '#3498db', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="d-f cards">
      {isLoading ? (
        <CardSkelton count={8} />
      ) : (
        <>
          {postCards}
          {isFetchingMore && <CardSkelton count={2} />}
          {/* Infinite scroll trigger */}
          <div ref={divRef} style={{ height: "10px" }} aria-hidden="true" />
        </>
      )}
    </section>
  );
}
export default CardsConatainer;
