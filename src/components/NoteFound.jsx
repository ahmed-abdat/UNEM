import Header from './Header'
import Footer from './Footer'

import './styles/NoteFound.css'



export default function NoteFound() {
  return (
   <>
   <Header picture={"/06.png"} />
   <section className="not-found">
    <h2>سيتم نشر جداول الحصص موازاة مع إنطلاق العام الدراسي </h2>
   </section>
    <Footer />
   </>
  )
}