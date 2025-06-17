import React, { useState } from "react";
import HospitalLoginHead from "../components/molecules/HospitalPanelHead";
import HospitalLoginBody from "../components/organisms/HospitalPanelBody";

const HospitalPanel: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  return (
    
    <div>

      <div className="body-container">
        <HospitalLoginBody isRegister={isRegister} setIsRegister={setIsRegister} />
      </div>
    </div>
);
};
export default HospitalPanel;