import React, { useEffect } from "react";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import hospitalLogo from '../png/hospital-appointment.png';
import '../styles/hospitalPanel.css';

interface HospitalPanelBodyProps {
  isRegister: boolean;
  setIsRegister: React.Dispatch<React.SetStateAction<boolean>>;
}

const HospitalPanelBody: React.FC<HospitalPanelBodyProps> = ({ isRegister, setIsRegister }) => {
  useEffect(() => {
    console.log('isRegister:', isRegister);
  }, [isRegister]);

  return (
    <div className={`container ${isRegister ? "right-panel-active" : ""}`}>
      <div className="bottom">
        <div className="form-container">
          {!isRegister && <LoginForm />}
          {isRegister && <RegisterForm />}
        </div>

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