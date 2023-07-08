import HeroImg from '../assets/8.png'

import './styles/Hero.css'

export default function Hero() {
  return (
    <section className="hero">
        <div className="hero--container">
            <div className="hero--content">
                <h1>تعرف على مؤسسات تعليم العالي وإحسب معدلك التوجيهي</h1>
                <p>الخدمة مقدمة من طرف الخلية الإعلامية بالاتحاد الوطني للطلبة الموريتانين UNEM لتعرف على مؤسسات التعليم العالي والبحث العلمي وحساب معدلك التوجيهي</p>
                <div className="hero--btns"> 
                    <button className="btn btn--primary btn--outline">تعرف على المؤسسات</button>
                    <button className="btn btn--secondary">حساب المعدل</button>
                </div>
            </div>
            <div className="hero--img">
                <img src={HeroImg} alt="hero"/>
            </div>
        </div>
    
    </section>
  )
}