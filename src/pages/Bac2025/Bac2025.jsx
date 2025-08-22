import HeaderImg from "@/components/HeaderImg";
import Footer from "@/components/Footer";
import Bac2025ComplementaryForm from "@/components/Bac2025ComplementaryForm";
import "./bac2025.css";

export default function Bac2025() {
  return (
    <>
      <HeaderImg picture={"/bac2025.png"} bgColor={"transparent"} />
      <div className="bac2025-container">
        <div className="bac2025-content">
          <h1>نتائج الباكلوريا 2025</h1>
          <Bac2025ComplementaryForm />
        </div>
      </div>
      <Footer />
    </>
  );
}
