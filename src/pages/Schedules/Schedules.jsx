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
      url: "/branche-fsje",
    },
    {
        content : 'كلية العلوم القانونية و الإقتصادية (الملحق 2)' ,
        url : '/branche-fsje2'
    },
    {
      content: "كلية الآداب و العلوم الإنسانية",
      url: "/branche-fslh",
    },
    {
      content: "المعهد العالي للمحاسبة و إدارة المؤسسات",
      url: "/branche-iscae",
    },
    {
      content: "المعهد العالي للدراسات و البحوث الإسلامية",
      url: "/branche-iseri",
    },
    {
      content: "المعهد الجامعي المهني",
      url: "/branche-iup",
    },
    {
      content: "كلية الطب و الصيدلة",
      url: "/branche-fm",
    },
    {
      content: "جامعة العلوم الإسلامية يالعيون",
      url: "/branche-usi",
    },
    {
      content: "المعهد العالي للتعليم التكنلوجي بروصو",
      url: "/branche-roso",
    },
    {
      content: "المعهد العالي المهني للغات و الترجمة و الترجمة الفورية",
      url: "/branche-translate",
    },
    {
      content: "المدرسة الوطنية العليا لعلوم الصحة",
      url: "/branche-enss",
    },
  ];

  return (
    <>
      <Header picture={"/06.png"} />
      <section className="resula">
        <PageElements options={options} />
      </section>
      <Footer />
    </>
  );
}
