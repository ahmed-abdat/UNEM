import HeaderImg from "../../components/HeaderImg";
import PageElements from "../../components/PageElements";
import Footer from "../../components/Footer";

export default function Resulta() {
  // options
  const options = [
    {
      content: "كلية الطب و الصيدلة وطب الأسنان",
      url: "/remote-fm",
    },
  ];

  return (
    <>
      <HeaderImg picture={"/fac/12.png"} />
      <section className="resula">
        <PageElements options={options} />
      </section>
      <Footer />
    </>
  );
}
