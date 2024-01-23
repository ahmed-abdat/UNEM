import HeaderImg from "../../components/HeaderImg";
import PageElements from "../../components/PageElements";
import Footer from "../../components/Footer";

export default function Institutions() {
  // options
  const options = [
    {
      content: "كلية العلوم و التقنيات",
      url: "/institutions/fst",
    },
    {
      content: "كلية العلوم القانونية و الاقتصادية",
      url: "/institutions/fsje",
    },
    {
      content: "كلية الآداب و العلوم الإنسانية",
      url: "/institutions/fslh",
    },
    {
      content: "المعهد العالي للمحاسبة و إدارة المؤسسات",
      url: "/institutions/iscae",
    },
    {
      content: "المعهد العالي للدراسات و البحوث الإسلامية",
      url: "/institutions/iseri",
    },
    {
      content: "المعهد العالي للرقمنة",
      url: "/institutions/supnum",
    },
    {
      content: "المعهد العالي للغة لإنجليزية",
      url: "/institutions/anglais",
    },
    {
      content: "المعهد الجامعي المهني",
      url: "/institutions/uip",
    },
    {
      content: "كلية الطب و الصيدلة و طب الأسنان",
      url: "/institutions/fm",
    },
    {
      content: "كلية أصول الدين بجامعة العلوم الإسلامية",
      url: "/institutions/usi_1",
    },
    {
      content: "كلية الشريعة بجامعة العلوم الإسلامية",
      url: "/institutions/usi_2",
    },
    {
      content: "كلية اللغة العربية والعلوم الإنسانية بلعيون  ",
      url: "/institutions/usi_3",
    },
    {
      content: "المعهد العالي للتعليم التكنلوجي بروصو",
      url: "/institutions/roso",
    },
    {
      content: "المعهد العالي المهني للغات و الترجمة و الترجمة الفورية",
      url: "/institutions/translate",
    },
    {
      content: "المدرسة الوطنية العليا لعلوم الصحة",
      url: "/institutions/enss",
    },
  ];

  return (
    <>
      <HeaderImg picture={"/05.png"} />
      <section className="resula">
        <PageElements options={options} />
      </section>
      <Footer />
    </>
  );
}
