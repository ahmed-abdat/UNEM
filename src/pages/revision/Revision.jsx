import HeaderImg from "../../components/HeaderImg";
import PageElements from "../../components/PageElements";
import Footer from "../../components/Footer";

export default function Resulta() {
  // options
  const options = [
    {
      content: "كلية العلوم و التقنيات",
      url: "/Fst",
    },
    {
      content: "كلية العلوم القانونية و الاقتصادية",
      url: "/Fsje",
    },
    {
      content: "كلية الآداب و العلوم الإنسانية",
      url: "/Fslh",
    },
    {
      content: "المعهد العالي للمحاسبة و إدارة المؤسسات",
      url: "/Iscae",
    },
    {
      content: "المعهد العالي للدراسات و البحوث الإسلامية",
      url: "/Iseri",
    },
    {
      content: "المعهد العالي للرقمنة",
      url: "/Supnum",
    },
    {
      content: "المعهد الجامعي المهني",
      url: "/Iup",
    },
    {
      content: "المعهد العالي للغة لإنجليزية",
      url: "/Anglais",
    },
    {
      content: "كلية الطب و الصيدلة و طب الأسنان",
      url: "/Fm",
    },
    {
      content: "جامعة العلوم الإسلامية بلعيون",
      url: "/Usi",
    },
    {
      content: "المعهد العالي للتعليم التكنلوجي بروصو",
      url: "/Roso",
    },
    {
      content: "المعهد العالي المهني للغات و الترجمة و الترجمة الفورية",
      url: "/Translate",
    },
    {
      content: "المدرسة الوطنية العليا لعلوم الصحة",
      url: "/Enss",
    },
  ];

  return (
    <>
      <HeaderImg picture={"/03.png"} />
      <section className="resula">
        <PageElements options={options}  />
      </section>
      <Footer />
    </>
  );
}
