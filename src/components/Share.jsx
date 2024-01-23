import { FacebookIcon, FacebookShareButton, WhatsappIcon, WhatsappShareButton } from "react-share";

function SharePoste() {
  const url = `https://unem.vercel.app/news`
  return (
    <>
    <FacebookShareButton url={url}>
        <FacebookIcon size={28} round={true} />
    </FacebookShareButton>
    <WhatsappShareButton url={url}>
        <WhatsappIcon size={28} round={true} />
    </WhatsappShareButton>
    </>
  );
}
export default SharePoste;
