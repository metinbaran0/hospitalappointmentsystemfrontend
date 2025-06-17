import React, { useState, useEffect } from "react";
import swal from "sweetalert";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import { useNavigate } from "react-router";
import hospitalLogo from '../png/hospital-appointment.png';
import '../styles/hospitalPanel.css';


const HospitalPanelBody: React.FC<{ isRegister: boolean, setIsRegister: React.Dispatch<React.SetStateAction<boolean>> }> = ({ isRegister, setIsRegister }) => {
  

  useEffect(() => {
    console.log('isRegister:', isRegister);
  }, [isRegister]); // isRegister durumu değiştiğinde çalışacak

  return (
    <div className={`container ${isRegister ? "right-panel-active" : ""}`}>
    <div className="bottom">
      {/* Form Alanları - Alt Kısım */}
      <div className="form-container">
        {/* Sol Kısım - Login Formu */}
             {!isRegister && <LoginForm />}
       
                {isRegister && <RegisterForm />}  
      </div>

      {/* Overlay */}
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-left">
            <h1>Hastane Randevu Sistemine Hoşgeldiniz</h1>
            <img src={hospitalLogo} alt="Hasta" />
            <p>
              Sağlığınız önemlidir. Randevularınızı kolayca yönetmek ve sağlık
              sağlayıcılarınızla bağlantı kurmak için giriş yapın.
            </p>
            <button className="ghost" onClick={() => setIsRegister(false)}>Giriş Yap</button>
          </div>
          <div className="overlay-right">
            <h1>BUGÜN BİZİMLE KATILIN</h1>
            <img className="imgs" src={hospitalLogo} alt="Bize Katıl" />
            <p>
              Sağlıklı bir yolculuğa bugün başlayın! Randevu almayı ve sağlık
              ilerlemenizi takip etmeyi kolaylaştırmak için kayıt olun.
            </p>
            <button className="ghost" onClick={() => setIsRegister(true)}>Kayıt Ol</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default HospitalPanelBody;