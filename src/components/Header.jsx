

import './styles/Header.css'

export default function NextPage({ picture   }) {
    return (
      <main className="next-page">
          <header className="nex-page--header">
              <img src={picture} alt='header' />
          </header>
  
         
      </main>
    )
  }