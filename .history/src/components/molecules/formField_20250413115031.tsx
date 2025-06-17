import React from "react";
import Label from "../atoms/Label";
import Input from "../atoms/Input";

interface FormFieldProps {
  label: string;
  type: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  pattern?: string;
  required?: boolean;
  title?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  type,
  value,
  placeholder,
  onChange,
  pattern,
  required,
  title,
}) => {
  return (
    <div className="mb-2">
      <Label text={label} />
      <Input type={type} value={value} placeholder={placeholder} onChange={onChange} pattern={pattern} required={required} title={title} />
    </div>
  );
};

export default FormField;