import HeaderImg from "../../components/HeaderImg";
import PageElements from "../../components/PageElements";
import Footer from "../../components/Footer";

export default function Resulta() {
  // options
  const options = [
    {
      content: "كلية العلوم و التقنيات",
      url: "/shedule-fst",
    },
    {
      content: "كلية العلوم القانونية و الإقتصادية",
      url: "/shedule-fsje",
    },
    {
        content : 'كلية العلوم القانونية و الإقتصادية (الملحق 2)' ,
        url : '/shedule-fsje2'
    },
    {
      content: "كلية الآداب و العلوم الإنسانية",
      url: "/shedule-fslh",
    },
    {
      content: "المعهد العالي للمحاسبة و إدارة المؤسسات",
      url: "/shedule-iscae",
    },
    {
      content: "المعهد العالي للدراسات و البحوث الإسلامية",
      url: "/shedule-iseri",
    },
    {
      content: "المعهد الجامعي المهني",
      url: "/shedule-iup",
    },
    {
      content: "كلية الطب و الصيدلة",
      url: "/shedule-fm",
    },
    {
      content: "جامعة العلوم الإسلامية يالعيون",
      url: "/shedule-usi",
    },
    {
      content: "المعهد العالي للتعليم التكنلوجي بروصو",
      url: "/shedule-roso",
    },
    {
      content: "المعهد العالي المهني للغات و الترجمة و الترجمة الفورية",
      url: "/shedule-translate",
    },
    {
      content: "المدرسة الوطنية العليا لعلوم الصحة",
      url: "/shedule-enss",
    },
  ];

  return (
    <>
      <HeaderImg picture={"/06.png"} />
      <section className="resula">
        <PageElements options={options} />
      </section>
      <Footer />
    </>
  );
}
