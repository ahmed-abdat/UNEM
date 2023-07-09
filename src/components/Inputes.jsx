export default function Inputes({
  option,
  setFparam,
  setSparam,
  setTparam,
  setMG,
  dir,
}) {
  // place Horlders
  const placeHolders = {
    SN: [
      {
        placeholder: "Votre note de Science ici",
        id: "Fparam",
        label: "note de Science",
        function: setFparam,
      },
      {
        placeholder: "Votre note de Physique ici",
        id: "Sparam",
        label: "note de Physique",
        function: setSparam,
      },
      {
        placeholder: "Votre note de Math ici",
        id: "Tparam",
        label: "note de Math",
        function: setTparam,
      },
      {
        placeholder: "Votre moyen genral ici",
        id: "MG",
        label: "moyen genral",
        function: setMG,
      },
    ],
    M: [
      {
        placeholder: "Votre note de Math ici",
        id: "Fparam",
        label: "note de Math",
        function: setFparam,
      },
      {
        placeholder: "Votre note de Physique ici",
        id: "Sparam",
        label: "note de Physique",
        function: setSparam,
      },
      {
        placeholder: "Votre note de Science ici",
        id: "Tparam",
        label: "note de Science",
        function: setTparam,
      },
      {
        placeholder: "Votre moyen genral ici",
        id: "MG",
        label: "moyen genral",
        function: setMG,
      },
    ],
    LO: [
      {
        placeholder: "نتيجة التشريع هنا",
        id: "Fparam",
        label: "نتيجة التشريع",
        function: setFparam,
      },
      {
        placeholder: "نتيجة اللغة العربية هنا",
        id: "Sparam",
        label: "نتيجة اللغة العربية",
        function: setSparam,
      },
      {
        placeholder: "نتيجة الفكر الإسلامي هنا",
        id: "Tparam",
        label: "نتيجة الفكر الإسلامي",
        function: setTparam,
      },
      {
        placeholder: "نتيجة المعدل العام هنا",
        id: "MG",
        label: "نتيجة المعدل العام",
        function: setMG,
      },
    ],
    LM: [
      {
        placeholder: "نتيجة اللغة العربية هنا",
        id: "Fparam",
        label: "نتيجة اللغة العربية",
        function: setFparam,
      },
      {
        placeholder: "نتيجة الفلسفة هنا",
        id: "Sparam",
        label: "نتيجة الفلسفة",
        function: setSparam,
      },
      {
        placeholder: "نتيجة اللغة الفرنسية هنا",
        id: "Tparam",
        label: "نتيجة اللغة الفرنسية",
        function: setTparam,
      },
      {
        placeholder: "نتيجة المعدل العام هنا",
        id: "MG",
        label: "نتيجة المعدل العام",
        function: setMG,
      },
    ],
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
            onChange={(e) => input.function(e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}
