import Header from '../../components/Header'
import Footer from '../../components/Footer'


export default function Whatsapp() {
  return (
    <>
    <Header picture={'/05.png'} />
    <section className="whatsapp">
        <form className='form'>
            <p>أدخل رقم الباكلوريا للإنضمام إلى المجموعة الخاصة بشعبتك </p>
            <div className="inputs">
                <div className="input">
                <label htmlFor="#numBac">أدخل رقم الباكلوريا</label>
                <input type="text"  />
                </div>
                <div className="input">
                <label htmlFor="#numBac">أدخل  سنة الميلاد </label>
                <input type="text"  />
                </div>
            </div>
        </form>
    </section>
    <Footer />
    </>
  )
}