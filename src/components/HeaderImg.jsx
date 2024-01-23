

import { LazyLoadImage } from 'react-lazy-load-image-component'
import './styles/HeaderImg.css'

export default function NextPage({ picture   }) {
    return (
      <main className="next-page">
          <header className="nex-page--header">
              <LazyLoadImage src={picture} alt='header' placeholderSrc={picture} width={`100%`} />
          </header>
  
         
      </main>
    )
  }