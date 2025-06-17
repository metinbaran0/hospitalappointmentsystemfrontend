import React from "react";

interface InputProps {
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  pattern?: string;
  required?: boolean;
  title?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  pattern,
  required,
  title,
  className = "form-control",
}) => {
  return (
    <input
      type={type}
      className={className}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      pattern={pattern}
      required={required}
      title={title}
    />
  );
};

export default Input;