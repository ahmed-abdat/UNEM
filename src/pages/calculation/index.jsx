import { useState } from "react";
import Header from "../../components/Header";
import CalculationSelect from "../../components/CalculationSelect";
import CalculationLogo from "../../assets/4.svg";
import Footer from "../../components/Footer";
import Inputes from "../../components/Inputes";
import "./calculation.css";

export default function Calculation() {
  // state
  const [Fparam, setFparam] = useState("");
  const [Sparam, setSparam] = useState("");
  const [Tparam, setTparam] = useState("");
  const [MG, setMG] = useState("");
  const [MOR, setMOR] = useState("");
  const [option, setOption] = useState({ value: "العلوم الطبيعية", label: "العلوم الطبيعية" });



  // calcul moyen oriantation
  const CalculMoyenOR_SN = (Fparam, Sparam, Tparam, MG) => {
    const MOR =
      (parseFloat(Fparam) * 3 +
        parseFloat(Sparam) * 2 +
        parseFloat(Tparam) * 1 +
        parseFloat(MG)) /
      7;
    return MOR.toFixed(2);
  };

  const isAnyInputEmpty = () => {
    // Check if any input field is empty
    const isEmpty = [Fparam, Sparam, Tparam, MG].some(
      (input) => input.trim() === ""
    );
    return isEmpty;
  };
  // handel calcul
  const handelCalcule = () => {
    if (Fparam === "" || Sparam === "" || Tparam === "" || MG === "") return;
    const MOR = CalculMoyenOR_SN(Fparam, Sparam, Tparam, MG);
    setMOR(MOR);
  };

  // validate text
  const validateText  = "معدلك التوجيهي :"



  const SelectTitle =
    option.value === "SN" || option.value === "M"
      ? "Choisissez votre spécialité :"
      : "إختر شعبتك";

  const dir = option.value === "SN" || option.value === "M" ? "dir-fr" : "";

  // handel select change
  const handelSelectChange = (selectedOption) => {
    setOption(selectedOption);
    // reset the input
    setFparam("");
    setSparam("");
    setTparam("");
    setMG("");
    setMOR('')
  };

  // links contents
  const linksContents = [
    { content : "حساب المعدل التوجيهي" , url : '/calculation'}
  ]

  return (
    <>
    <Header picture={'/01.png'} />
    
      <section className="calculation">
        <div className={`calculation--form`}>
          <div className="container">
            <div className={`select`}>
              <h3> {SelectTitle} </h3>
              <CalculationSelect
                handelChange={handelSelectChange}
                value={option}
              />
            </div>
            <Inputes
              option={option}
              setFparam={setFparam}
              setSparam={setSparam}
              setTparam={setTparam}
              setMG={setMG}
              Fparam={Fparam}
              Sparam={Sparam}
              Tparam={Tparam}
              MG={MG}
              dir={dir}
            />
            <button
              disabled={isAnyInputEmpty()}
              className={`calculate-btn`}
              onClick={handelCalcule}
            >
              حساب المعدل
            </button>
            {
              MOR && (<div className="result">
              <h3> {validateText} {MOR} </h3>
            </div>)
            }
          </div>
        </div>
        <div className="calculation--img d-f">
          <img src={CalculationLogo} alt="calculation img" />
        </div>
      </section>
      <Footer />
    </>
  );
}
