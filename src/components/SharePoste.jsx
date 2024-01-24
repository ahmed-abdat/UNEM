import { FacebookIcon, FacebookShareButton, WhatsappIcon, WhatsappShareButton } from "react-share";
import { FaLink } from "react-icons/fa6";

function SharePoste({handelCopy , url}) { 
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
