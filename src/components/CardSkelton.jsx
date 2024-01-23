import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./styles/cardSkelton.css";
export default function CardSkeleton({ count = 1 }) {
  return Array(count)
    .fill(0)
    .map((_, index) => (
      <div className="card-skelton" key={index}>
        <div className="skelton-img">
          <Skeleton height={220} borderRadius={9} />
        </div>
        <div className="card-head">
          <Skeleton circle={true} height={40} width={40} />
          <div className="card-title">
            <Skeleton height={20} width={`50%`} />
              <Skeleton height={20} width={`50%`} />
          </div>
        </div>
        <div className="skelton-discription">
          <Skeleton height={40} />
          {/* <Skeleton width={'50%'} height={20}/> */}
        </div>
        <div className="skelton_footer">
          <div className="share">
            <Skeleton count={2} circle={true} height={30} width={30} />
          </div>
          <div className="card-btns">
            <Skeleton height={30} width={90} />
          </div>
        </div>
      </div>
    ));
}
