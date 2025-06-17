import React from "react";

interface ButtonProps {
    label: string;
    onClick: () => void;
    disabled?: boolean; // Disabled prop'unu ekle
    className: string;
    type?: "button" | "submit";
  }
  
  const Button: React.FC<ButtonProps> = ({ label, onClick, disabled,type, className }) => {
    return (
      <button
        className={className}
        onClick={onClick}
        type={type}
        disabled={disabled} // Butona disabled özelliğini ekle
      >
        {label}
      </button>
    );
  };

export default Button;