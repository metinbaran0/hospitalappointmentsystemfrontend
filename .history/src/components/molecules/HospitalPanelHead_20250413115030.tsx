import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import swal from "sweetalert";
import hospitalLogo from '../png/hospital-appointment.png';


const HospitalPanelHead: React.FC<{ setIsRegister: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setIsRegister }) => {
  return (
    <div className="top">
      {/* Üst Kısımdaki Butonlar */}
      <div className="row justify-content-center top-button-box">
        <button onClick={() => setIsRegister(false)} className="toggle-btn">
          Hasta
        </button>
        <button onClick={() => setIsRegister(true)} className="toggle-btn">
          Doktor
        </button>
        <button onClick={() => setIsRegister(true)} className="toggle-btn">
          Yönetici
        </button>
      </div>
    </div>
  );
};

export default HospitalPanelHead;