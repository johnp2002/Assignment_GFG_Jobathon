import { useEffect, useState } from 'react';

const MonthSelect = ({ onChange }) => {
  const [selectedMonth, setSelectedMonth] = useState(3);

  const handleChange = (event) => {
    const month = event.target.value;
    onChange(month);
    setSelectedMonth(month);
  };
  useEffect(()=>onChange(selectedMonth),[])
  
  return (
    <select
      className="select select-bordered w-full max-w-xs"
      value={selectedMonth}
      onChange={handleChange}
    >
      <option disabled value="">Select Month</option>
      <option value="1">January</option>
      <option value="2">February</option>
      <option value="3" defaultValue={true}>March</option>
      <option value="4">April</option>
      <option value="5">May</option>
      <option value="6">June</option>
      <option value="7">July</option>
      <option value="8">August</option>
      <option value="9">September</option>
      <option value="10">October</option>
      <option value="11">November</option>
      <option value="12">December</option>
    </select>
  );
};

export default MonthSelect;
