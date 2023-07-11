import { Link } from 'react-router-dom'

export default function HomeOption({ options  }) {

  return (
    <section className="home--option">
      {
        options?.map((option) => (
          <div key={option?.content} className="option-content">
          <Link to={option.url} ><h3>{option.content}</h3></Link>
      </div>
        ))
      }
    </section>
  )
}