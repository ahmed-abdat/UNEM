import HeaderImg from "../../components/HeaderImg";
import PageElements from "../../components/PageElements";
import Footer from "../../components/Footer";

export default function Resulta() {
  // options
  const options = [
    {
      content: "كلية العلوم القانونية و الاقتصادية",
      url: "https://wa.me/26031381",
    },
    {
      content: 'كلية العلوم القانونية و الإقتصادية (الملحق 2)',
      url: "https://wa.me/26682121"
    },
    {
      content: "كلية العلوم و التقنيات",
      url: "https://wa.me/49825261",
    },
    {
      content: "كلية الآداب و العلوم الإنسانية",
      url: "https://wa.me/48543433",
    },
    {
      content: "كلية الطب و الصيدلة",
      url: "https://wa.me/27204439",
    },
    {
      content: "المعهد الجامعي المهني",
      url: "https://wa.me/49652477",
    },
    {
      content: "المعهد العالي للمحاسبة و إدارة المؤسسات",
      url: "https://wa.me/38298747",
    },
    {
      content: "المدرسة الوطنية العليا لعلوم الصحة",
      url: "https://wa.me/27272554",
    },
    {
      content: "المدرسة الوطنية العليا",
      url: "https://wa.me/27098658",
    },
    {
      content: "معهد البكالوريا الوطنية",
      url: "https://wa.me/43233921",
    },
    {
      content: "الرقمنة SupNum",
      url: "https://wa.me/26449444",
    },
    {
      content: "المعهد العالي للدراسات و البحوث الإسلامية",
      url: "https://wa.me/42971616",
    },
    {
      content: "المعهد العالي للغات والترجمة بنواذيبو",
      url: "https://wa.me/41396434",
    },
    {
      content: "المعهد العالي للتعليم التكنلوجي بروصو",
      url: "https://wa.me/36235087",
    },
    {
      content: "جامعة العلوم الإسلامية بلعيون",
      url: "https://wa.me/41167967",
    },
    {
      content: "المحظرة الشنقيطية بأكجوجت",
      url: "https://wa.me/33811666",
    },
  ];

  return (
    <>
      <HeaderImg picture={"/07.png"}/>
      <section className="resula">
        <PageElements options={options} />
      </section>
      <Footer />
    </>
  );
}
