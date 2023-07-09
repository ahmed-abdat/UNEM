import Select  from 'react-select'

export default function CalculationSelect({ handelChange, value }) {
  // option select
  const options = [
    { value: "SN", label: "SN" },
    { value: "M", label: "M" },
    { value: "LO", label: "LO" },
    { value: "LM", label: "LM" },
  ];

  return <Select options={options} onChange={handelChange} value={value} isSearchable={false} />;
}
