import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Inputes({
  option,
  setFparam,
  setSparam,
  setTparam,
  setMG,
  Fparam,
  Sparam,
  Tparam,
  MG,
  dir,
}) {
  // is arabic
  const isArabic = option.value === "SN" || option.value === "M" ? false : true;
  // place Horlders
  const placeHolders = {
    SN: [
      {
        placeholder: "Votre note de Science ici",
        id: "Fparam",
        label: "note de Science",
        function: setFparam,
        value: Fparam,
      },
      {
        placeholder: "Votre note de Physique ici",
        id: "Sparam",
        label: "note de Physique",
        function: setSparam,
        value: Sparam,
      },
      {
        placeholder: "Votre note de Math ici",
        id: "Tparam",
        label: "note de Math",
        function: setTparam,
        value: Tparam,
      },
      {
        placeholder: "Votre moyen genral ici",
        id: "MG",
        label: "moyen genral",
        function: setMG,
        value: MG,
      },
    ],
    M: [
      {
        placeholder: "Votre note de Math ici",
        id: "Fparam",
        label: "note de Math",
        function: setFparam,
        value: Fparam,
      },
      {
        placeholder: "Votre note de Physique ici",
        id: "Sparam",
        label: "note de Physique",
        function: setSparam,
        value: Sparam,
      },
      {
        placeholder: "Votre note de Science ici",
        id: "Tparam",
        label: "note de Science",
        function: setTparam,
        value: Tparam,
      },
      {
        placeholder: "Votre moyen genral ici",
        id: "MG",
        label: "moyen genral",
        function: setMG,
        value: MG,
      },
    ],
    LO: [
      {
        placeholder: "نتيجة التشريع هنا",
        id: "Fparam",
        label: "نتيجة التشريع",
        function: setFparam,
        value: Fparam,
      },
      {
        placeholder: "نتيجة اللغة العربية هنا",
        id: "Sparam",
        label: "نتيجة اللغة العربية",
        function: setSparam,
        value: Sparam,
      },
      {
        placeholder: "نتيجة الفكر الإسلامي هنا",
        id: "Tparam",
        label: "نتيجة الفكر الإسلامي",
        function: setTparam,
        value: Tparam,
      },
      {
        placeholder: "نتيجة المعدل العام هنا",
        id: "MG",
        label: "نتيجة المعدل العام",
        function: setMG,
        value: MG,
      },
    ],
    LM: [
      {
        placeholder: "نتيجة اللغة العربية هنا",
        id: "Fparam",
        label: "نتيجة اللغة العربية",
        function: setFparam,
        value: Fparam,
      },
      {
        placeholder: "نتيجة الفلسفة هنا",
        id: "Sparam",
        label: "نتيجة الفلسفة",
        function: setSparam,
        value: Sparam,
      },
      {
        placeholder: "نتيجة اللغة الفرنسية هنا",
        id: "Tparam",
        label: "نتيجة اللغة الفرنسية",
        function: setTparam,
        value: Tparam,
      },
      {
        placeholder: "نتيجة المعدل العام هنا",
        id: "MG",
        label: "نتيجة المعدل العام",
        function: setMG,
        value: MG,
      },
    ],
  };

  //   handel input
  const handelInput = (e, input) => {
    const { value } = e.target;

    // Check if the input value is a number and within the desired range
    if (value <= 20) {
      // Valid input
      input.function(value);
      // Further process the value as needed
    } else {
      if (!isArabic) {
        toast.info(
          "Veuillez entrer un nombre à deux chiffres compris entre 0 et 20. 😊"
        );
        return;
      }
      // Invalid input
      toast.info("من فضلك أدخل رقمًا مؤلفًا من رقمين بين 0 و 20 😊");
    }
  };

  return (
    <div className="inputs">
      {placeHolders[option.value].map((input) => (
        <div className={`input ${dir}`} key={input.id}>
          <label htmlFor={input.id}>{input.label}</label>
          <input
            type="number"
            id={input.id}
            placeholder={input.placeholder}
            onChange={(e) => handelInput(e, input)}
            value={input.value}
          />
        </div>
      ))}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        limit={2}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={isArabic}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}
