import { Link } from 'react-router-dom'
import HeroImg from '../assets/8.png'

import './styles/Hero.css'

export default function Hero() {
  return (
    <section className="hero">
        <div className="hero--container">
            <div className="hero--content">
                <h1>تعرف على مؤسسات التعليم العالي وإحسب معدلك التوجيهي</h1>
                <p>الخدمة مقدمة من طرف الخلية الإعلامية بالاتحاد الوطني لطلبة موريتانيا UNEM لتتعرف على مؤسسات التعليم العالي والبحث العلمي ولحساب معدلك التوجيهي</p>
                <div className="hero--btns"> 
                    
                    
                    <button className="bg-brand-success btn--primary btn--outline">تعرف على المؤسسات</button>
                    <Link to='/calculation'><button className="bg-brand-success btn--secondary"> حساب المعدل التوجيهي </button></Link>
                </div>
            </div>
            <div className="hero--img">
                <img src={HeroImg} alt="hero"/>
            </div>
        </div>
    
    </section>
  )
}