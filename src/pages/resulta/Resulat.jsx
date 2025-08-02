import HeaderImg from '../../components/HeaderImg'
import Footer from '../../components/Footer';
import PageResulta from '../../components/PageResulta';

export default function Resulta() {

// options
const options = [
  {
    content : 'كلية العلوم و التقنيات' ,
    url : 'http://resultats.una.mr/FST/',
  },
  {
    content : 'كلية العلوم القانونية و الاقتصادية' ,
    url : 'http://resultats.una.mr/FSJE'
  }, {
    content : 'كلية الآداب و العلوم الإنسانية',
    url : 'http://resultats.una.mr/FLSH'
  },
  {
    content : 'المعهد العالي للمحاسبة و إدارة المؤسسات' , 
    url : 'http://www.iscae.mr/resultats'
  },
  {
    content : 'المعهد العالي للدراسات و البحوث الإسلامية' ,
    url : 'https://www.iseri.mr/'
  }, 
  {
    content : 'المعهد الجامعي المهني',
    url : 'http://resultats.una.mr/IUP/'
  }
]

  return (
    <>
    <HeaderImg picture={'/02.png'} />
      <section className="resula">
        <PageResulta options={options} />
      </section>
      <Footer />
    </>
  );
}
