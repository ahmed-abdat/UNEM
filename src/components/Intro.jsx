import './styles/Intro.css'

export default function Intro() {
  return (
    <section className="intro">
      <div className="d-f">
        <img src="/unem.png" alt="logo" />
      </div>
      <div className="intro-text">
        <h1>الاتحاد الوطني لطلبة موريتانيا</h1>
        <h3>L'union Nationale des Etudiants Mauritaniens</h3>
      </div>
      <div className="info">
        <p> أكبر نقابة طلابية موريتانية تأسست 13 مايو 2000 م </p>
      </div>
    </section>
  );
}
