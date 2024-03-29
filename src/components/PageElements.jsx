import { Link } from "react-router-dom"
import './styles/PageElements.css'
export default function PageElements({ options }) {



  return (
    <section className="options">
        {options.map(el => <div className="option" key={el.url} >
            <div className="cercle" ></div>
            <div className="option--content"  >
                <Link to={`/revision${el.url}`} ><h3>{el.content}</h3></Link>
            </div>
        </div>)}
    </section>
  )
}