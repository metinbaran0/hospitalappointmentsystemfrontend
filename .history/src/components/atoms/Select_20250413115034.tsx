import React from "react";

interface SelectProps {
  options: string[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}

const Select: React.FC<SelectProps> = ({ options, value, onChange, className = "form-select" }) => {
  return (
    <select className={className} value={value} onChange={onChange}>
      <option disabled value="">
        Select Gender
      </option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default Select;