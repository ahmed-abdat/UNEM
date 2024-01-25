import { useState } from "react";
import ReactPlayer from "react-player";
import Skeleton from "react-loading-skeleton";

function Video({ url }) {
  const [isReady, setIsReady] = useState(false);

  return (
    <section className="video">
      <ReactPlayer
        url={url}
        controls
        onReady={() => setIsReady(true)}
        width={"100%"}
        height={"100%"}
        onError={(e) => {
          console.log(e);
          setIsReady(true);
        }}
      />
      {!isReady && (
        <div className="poste-thumbnail">
          <Skeleton height={350} width={`100%`} />
        </div>
      )}
    </section>
  );
}
export default Video;
