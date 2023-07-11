import { Link } from "react-router-dom"

export default function PageElements({ options }) {
    console.log(options.map(el => el.content));
  return (
    <section className="options">
        <h1>hello word </h1>
      {
        options?.map(option => {
            <div className="option--container" key={option.url}>
                <div className="circle"></div>
                {/* <Link to={option.url} ><h3>{option.content}</h3></Link> */}
                <h4>hello</h4>
            </div>
        })
      }
    </section>
  )
}