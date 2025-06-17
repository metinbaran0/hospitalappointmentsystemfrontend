import React from "react";

interface LabelProps {
  text: string;
  htmlFor?: string;
  className?: string;
}

const Label: React.FC<LabelProps> = ({ text, htmlFor, className = "form-label" }) => {
  return <label htmlFor={htmlFor} className={className}>{text}</label>;
};

export default Label;