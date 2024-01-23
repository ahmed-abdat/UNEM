import { FacebookIcon, FacebookShareButton, WhatsappIcon, WhatsappShareButton } from "react-share";

function SharePoste({ id}) {
  const url = `https://unem.vercel.app/news/poste/${id}`
  return <section className="share">
    <FacebookShareButton url={url}>
        <FacebookIcon size={28} round={true} />
    </FacebookShareButton>
    <WhatsappShareButton url={url}>
        <WhatsappIcon size={28} round={true} />
    </WhatsappShareButton>
  </section>;
}
export default SharePoste;
