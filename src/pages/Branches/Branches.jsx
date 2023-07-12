import Header from "../../components/Header";
import PageElements from "../../components/PageElements";
import Footer from "../../components/Footer";

export default function Resulta() {
  // options
  const options = [
    {
      content: "كلية العلوم و التقنيات",
      url: "https://wa.me/27245347?",
    },
    {
      content: "كلية العلوم القانونية و الإقتصادية",
      url: "https://wa.me/26031381?",
    },
    {
        content : 'كلية العلوم القانونية و الإقتصادية (الملحق 2)' ,
        url : "https://wa.me/49876770?"
    },
    {
      content: "كلية الآداب و العلوم الإنسانية",
      url: "https://wa.me/26490223?",
    },
    {
      content: "المعهد العالي للمحاسبة و إدارة المؤسسات",
      url: "https://wa.me/48572025?",
    },
    {
      content: "المعهد العالي للدراسات و البحوث الإسلامية",
      url: "https://wa.me/33300307?",
    },
    {
      content: "المعهد الجامعي المهني",
      url: "https://wa.me/49652477?",
    },
    {
      content: "كلية الطب و الصيدلة",
      url: "https://wa.me/47401121?",
    },
    {
      content: "جامعة العلوم الإسلامية يالعيون",
      url: "https://wa.me/49637971?",
    },
    {
      content: "المعهد العالي للتعليم التكنلوجي بروصو",
      url: "https://wa.me/36199323?",
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
      <Header picture={"/07.png"} />
      <section className="resula">
        <PageElements options={options} />
      </section>
      <Footer />
    </>
  );
}
