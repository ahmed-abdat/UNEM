import { toast } from "react-toastify";

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


  // place Horlders
  const placeHolders = {
    'العلوم الطبيعية' : [
      {
        placeholder: "أدخل نتيجة العلوم ",
        id: "Fparam",
        label: "نتيجة العلوم",
        function: setFparam,
        value: Fparam,
      },
      {
        placeholder: "أدخل نتيجة الفيزياء ",
        id: "Sparam",
        label: "نتيجة الفيزياء",
        function: setSparam,
        value: Sparam,
      },
      {
        placeholder: "أدخل نتيجة الرياضيات ",
        id: "Tparam",
        label: "نتيجة الرياضيات",
        function: setTparam,
        value: Tparam,
      },
      {
        placeholder: "أدخل المعدل العام ",
        id: "MG",
        label: "المعدل العام",
        function: setMG,
        value: MG,
      },
    ],
    "الرياضيات": [
      {
        placeholder: "أدخل نتيجة الرياضيات ",
        id: "Fparam",
        label: "نتيجة الرياضيات",
        function: setFparam,
        value: Fparam,
      },
      {
        placeholder: "أدخل نتيجة الفيزياء ",
        id: "Sparam",
        label: "نتيجة الفيزياء",
        function: setSparam,
        value: Sparam,
      },
      {
        placeholder: "أدخل نتيجة العلوم ",
        id: "Tparam",
        label: "نتيجة العلوم",
        function: setTparam,
        value: Tparam,
      },
      {
        placeholder: "أدخل المعدل العام",
        id: "MG",
        label: "المعدل العام",
        function: setMG,
        value: MG,
      },
    ],
    "الآداب الأصلية": [
      {
        placeholder: "نتيجة التشريع",
        id: "Fparam",
        label: "نتيجة التشريع",
        function: setFparam,
        value: Fparam,
      },
      {
        placeholder: "نتيجة اللغة العربية",
        id: "Sparam",
        label: "نتيجة اللغة العربية",
        function: setSparam,
        value: Sparam,
      },
      {
        placeholder: "نتيجة الفكر الإسلامي",
        id: "Tparam",
        label: "نتيجة الفكر الإسلامي",
        function: setTparam,
        value: Tparam,
      },
      {
        placeholder: "نتيجة المعدل العام",
        id: "MG",
        label: "نتيجة المعدل العام",
        function: setMG,
        value: MG,
      },
    ],
    "الآداب العصرية": [
      {
        placeholder: "نتيجة اللغة العربية",
        id: "Fparam",
        label: "نتيجة اللغة العربية",
        function: setFparam,
        value: Fparam,
      },
      {
        placeholder: "نتيجة الفلسفة",
        id: "Sparam",
        label: "نتيجة الفلسفة",
        function: setSparam,
        value: Sparam,
      },
      {
        placeholder: "نتيجة اللغة الفرنسية",
        id: "Tparam",
        label: "نتيجة اللغة الفرنسية",
        function: setTparam,
        value: Tparam,
      },
      {
        placeholder: "نتيجة المعدل العام",
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

    if (!isNaN(value) && value >= 0 && value <= 20) {
        // Valid input
        if (value.includes(".") && value.split(".")[1].length > 2) {
          e.target.blur();
        } 
        input.function(value)
    } else {
      e.target.blur(); 
      toast.info("من فضلك أدخل رقمًا مؤلفًا من رقمين بين 0 و 20 ");
    }
  };

  return (
    <div className="inputs">
      {placeHolders[option.value]?.map((input) => (
        <div className={`input ${dir}`} key={input.id}>
          <label htmlFor={input.id}>{input.label}</label>
          <input
            itemType="number"
            type="number"
            id={input.id}
            placeholder={input.placeholder}
            onChange={(e) => handelInput(e, input)}
            value={input.value}
          />
        </div>
      ))}
    </div>
  );
}
