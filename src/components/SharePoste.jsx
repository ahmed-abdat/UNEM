import { FacebookIcon, FacebookShareButton, WhatsappIcon, WhatsappShareButton } from "react-share";
import { FaLink } from "react-icons/fa6";

function SharePoste({ id}) {
  const url = `https://unem.vercel.app/news/poste/${id}`
  const handelCopy = () => {
    navigator.clipboard.writeText(url);
    t

  }
  return <section className="share">
    <FacebookShareButton url={url} hashtag="#unem">
        <FacebookIcon size={30} round={true} />
    </FacebookShareButton>
    <WhatsappShareButton url={url}>
        <WhatsappIcon size={30} round={true} />
    </WhatsappShareButton>
    <div className="copy-poste d-f" onClick={handelCopy}>
    <FaLink size={25}/>
    </div>
  </section>;
}
export default SharePoste;
