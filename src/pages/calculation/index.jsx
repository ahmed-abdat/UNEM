import { useState } from "react";
import Header from "../../components/Header";
import CalculationSelect from "../../components/CalculationSelect";
import CalculationLogo from "../../assets/4.svg";
import Inputes from "../../components/Inputes";
import "./calculation.css";

export default function Calculation() {
  // state
  const [Fparam, setFparam] = useState("");
  const [Sparam, setSparam] = useState("");
  const [Tparam, setTparam] = useState("");
  const [MG, setMG] = useState("");
  const [option, setOption] = useState({ value: "SN", label: "SN" });

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

  const BtnText =
    option.value === "SN" || option.value === "M"
      ? "Calculer votre moyen"
      : "حساب معدلك";

  const SelectTitle =
    option.value === "SN" || option.value === "M"
      ? "Choisissez votre spécialité :"
      : "إختر شعبتك";

  const dir = option.value === "SN" || option.value === "M" ? "dir-fr" : "";

  // handel select change
  const handelSelectChange = (selectedOption) => {
    setOption(selectedOption);
  };

  console.log(option);

  return (
    <>
      <Header />
      <section className="calculation">
        <div className={`calculation--form`}>
          <div className="container">
            <div className={`select ${dir}`}>
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
              dir={dir}
            />
            <button class={`calculate-btn ${dir}`}> {BtnText} </button>

          </div>
        </div>
        <div className="calculation--img d-f">
          <img src={CalculationLogo} alt="calculation img" />
        </div>
      </section>
    </>
  );
}
