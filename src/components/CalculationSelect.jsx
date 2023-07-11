import Select  from 'react-select'

export default function CalculationSelect({ handelChange, value }) {
  // option select
  const options = [
    { value: "العلوم الطبيعية", label: "العلوم الطبيعية" },
    { value: "الرياضيات", label: "الرياضيات" },
    { value: "الإداب الأصلية", label: "الإداب الأصلية" },
    { value: "الآداب العصرية", label: "الآداب العصرية" },
  ];

  return <Select options={options} onChange={handelChange} value={value} isSearchable={false} />;
}
