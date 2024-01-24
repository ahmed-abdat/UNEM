import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import './styles/posteSkelton.css'
import './styles/poste.css'

function PosteSkelton() {
  return <section className="poste skelton">
      <div className="poste-title">
        <Skeleton count={2} height={35} width={`100%`} />
        <Skeleton height={35} width={`50%`} />
      </div>
    <div className="poste-thumbnail">
      <Skeleton height={350} width={`100%`} />
    </div>
    <div className="poste-info">
      <div className="poste-times">
        <Skeleton height={20} width={`50%`} />
      </div>
      <div className="poste-share">
        <Skeleton width={30} height={30} circle count={3} />
      </div>
    </div>
    <div className="poste-content">
        <Skeleton count={10} height={25} width={`100%`} />
    </div>
  </section>;
}
export default PosteSkelton;
