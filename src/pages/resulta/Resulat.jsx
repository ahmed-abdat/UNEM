import Header from '../../components/Header'
import PageElements from '../../components/PageElements';
import Footer from '../../components/Footer';

export default function Resulta() {

// options
const options = [
  {
    content : 'كلية العلوم و التقنيات' ,
    url : '/fst',
  },
  {
    content : 'كلية العلوم القانون و الإقتصادية' ,
    url : '/fsje'
  }, {
    content : 'كلية الآداب و العلوم الإنسانية',
    url : '/fslh'
  },
  {
    content : 'المعهد العالي للمحاسبة و إدارة المؤسسات' , 
    url : '/iscae'
  },
  {
    content : 'المعهد العالي للدراسات و البحوث الإسلامية' ,
    url : '/iseri'
  }, 
  {
    content : 'المعهد الجامعي المهني',
    url : '/iup'
  }
]

  return (
    <>
    <Header picture={'/02.png'} />
      <section className="resula">
        <PageElements options={options} />
      </section>
      {/* <Footer /> */}
    </>
  );
}
