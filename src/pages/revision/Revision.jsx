import Header from "../../components/Header";
import PageElements from "../../components/PageElements";
import Footer from "../../components/Footer";

export default function Resulta() {
  // options
  const options = [
    {
      content: "كلية العلوم و التقنيات",
      url: "/revision-fst",
    },
    {
      content: "كلية العلوم القانونية و الإقتصادية",
      url: "/revision-fsje",
    },
    {
      content: "كلية الآداب و العلوم الإنسانية",
      url: "/revision-fslh",
    },
    {
      content: "المعهد العالي للمحاسبة و إدارة المؤسسات",
      url: "/revision-iscae",
    },
    {
      content: "المعهد العالي للدراسات و البحوث الإسلامية",
      url: "/revision-iseri",
    },
    {
      content: "المعهد العالي للرقمنة",
      url: "supnum",
    },
    {
      content: "المعهد الجامعي المهني",
      url: "/revision-iup",
    },
    {
      content: "كلية الطب و الصيدلة",
      url: "/fm",
    },
    {
      content: "جامعة العلوم الإسلامية بالعيون",
      url: "/usi",
    },
    {
      content: "المعهد العالي للتعليم التكنلوجي بروصو",
      url: "/roso",
    },
    {
      content: "المعهد العالي المهني للغات و الترجمة و الترجمة الفورية",
      url: "/translate",
    },
    {
      content: "المدرسة الوطنية العليا لعلوم الصحة",
      url: "/enss",
    },
  ];

  return (
    <>
      <Header picture={"/03.png"} />
      <section className="resula">
        <PageElements options={options} />
      </section>
      <Footer />
    </>
  );
}
