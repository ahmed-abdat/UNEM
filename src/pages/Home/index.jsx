import Header from "../../components/Header";
import Hero from "../../components/Hero";
import About from "../../components/About";


export default function home() {
  return (
    <main>
        <Header shouldShow={false} />
        <Hero />
        <About />
    </main>
  )
}