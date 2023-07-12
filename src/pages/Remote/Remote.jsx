import Header from "../../components/Header";
import PageElements from "../../components/PageElements";
import Footer from "../../components/Footer";

export default function Resulta() {
  // options
  const options = [
    {
      content: "كلية الطب و الصيدلة",
      url: "/remote-fm",
    },
  ];

  return (
    <>
      <Header picture={"/07.png"} />
      <section className="resula">
        <PageElements options={options} />
      </section>
      <Footer />
    </>
  );
}
