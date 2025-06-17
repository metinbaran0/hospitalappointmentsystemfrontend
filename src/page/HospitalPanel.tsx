import React, { useState } from "react";
import HospitalPanelBody from "../components/organisms/HospitalPanelBody";

const HospitalPanel: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  
  return (
    <div>
      <div className="body-container">
        <HospitalPanelBody isRegister={isRegister} setIsRegister={setIsRegister} />
      </div>
    </div>
  );
};

export default HospitalPanel;