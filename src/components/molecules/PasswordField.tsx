import React from "react";

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const PasswordField: React.FC<PasswordFieldProps> = ({ label, value, onChange, required }) => {
  return (
    <div className="mb-2">
      <label className="form-label">{label}</label>
      <input
        type="password"
        className="form-control"
        value={value}
        onChange={onChange}
        required={required}
        title="Password must be 8-20 characters long and contain at least one special character (!#_+:,./~-)."
      />
    </div>
  );
};

export default PasswordField;