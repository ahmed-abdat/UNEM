import Header from "../../components/Header";
import PageElements from "../../components/PageElements";
import Footer from "../../components/Footer";

export default function Institutions() {
  // options
  const options = [
    {
      content: "كلية العلوم و التقنيات",
      url: "/institutions-fst",
    },
    {
      content: "كلية العلوم القانونية و الإقتصادية",
      url: "/institutions-fsje",
    },
    {
      content: "كلية الآداب و العلوم الإنسانية",
      url: "/institutions-fslh",
    },
    {
      content: "المعهد العالي للمحاسبة و إدارة المؤسسات",
      url: "/institutions-iscae",
    },
    {
      content: "المعهد العالي للدراسات و البحوث الإسلامية",
      url: "/institutions-iseri",
    },
    {
      content: "المعهد العالي للرقمنة",
      url: "/institutions-supnum",
    },
    {
      content: "المعهد الجامعي المهني",
      url: "/institutions-revision-iup",
    },
    {
      content: "كلية الطب و الصيدلة",
      url: "/institutions-fm",
    },
    {
      content: "جامعة العلوم الإسلامية يالعيون",
      url: "/institutions-usi",
    },
    {
      content: "المعهد العالي للتعليم التكنلوجي بروصو",
      url: "/institutions-roso",
    },
    {
      content: "المعهد العالي المهني للغات و الترجمة و الترجمة الفورية",
      url: "/institutions-translate",
    },
    {
      content: "المدرسة الوطنية العليا لعلوم الصحة",
      url: "/institutions-enss",
    },
  ];

  return (
    <>
      <Header picture={"/05.png"} />
      <section className="resula">
        <PageElements options={options} />
      </section>
      <Footer />
    </>
  );
}