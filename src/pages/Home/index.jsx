import Header from "../../components/Header";
import Hero from "../../components/Hero";
import About from "../../components/About";


export default function home() {
    console.log("home");
  return (
    <main>
        <Header />
        <Hero />
        <About />
    </main>
  )
}