
import React, { useState, useEffect } from "react";
import FormField from "../molecules/FormField";
import PasswordField from "../molecules/PasswordField";
import Select from "../atoms/Select";
import Button from "../atoms/Button";
import swal from "sweetalert";

import { registerUser } from "../../store/feature/UserSlice";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../store/index";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import '../styles/register.css';

const RegisterForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [tcIdNumber, setTcIdNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [warning, setWarning] = useState(false);
  const [isEquals, setIsEqual] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  

  const genderList = ["MALE", "FEMALE"];
  const { errorMessage, loading: reduxLoading } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    setIsEqual(password === confirmPassword);
  }, [password, confirmPassword]);

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };
  
  const register = () => {
    // Gerekli alanlar kontrol ediliyor
    if (!tcIdNumber || !firstName || !lastName || !gender || !dateOfBirth || !password || !confirmPassword || !phoneNumber || !email) {
      setWarning(true);
      return;
    }
  
    // Şifreler eşleşiyor mu diye kontrol
    if (!isEquals) {
      swal("Hata", "Şifreler uyuşmuyor", "error");
      return;
    }
  
    setLoading(true);
  
    const userRegister = { tcIdNumber, firstName, lastName, gender, dateOfBirth, password, confirmPassword, phoneNumber, email };
  
    // Kullanıcı kaydını Redux ile gönderme
    dispatch(registerUser(userRegister)).finally(() => setLoading(false));
  
    // Eğer kayıt başarılıysa
    if (!errorMessage) {
      swal("Başarılı", "Kayıt başarılı, doğrulama e-postası gönderildi.", "success").then(() => {
        // Form verilerini sıfırlama
        setTcIdNumber("");
        setFirstName("");
        setLastName("");
        setGender("");
        setDateOfBirth("");
        setPassword("");
        setConfirmPassword("");
        setPhoneNumber("");
        setEmail("");
        navigate("/login");  // Login sayfasına yönlendir
      });
    }
  };
  
  

  useEffect(() => {
    if (warning) {
      const timer = setTimeout(() => setWarning(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [warning]);

  return (
    <div className="register shadow p-3 mb-3 bg-body rounded">
     <h1 className="h1">Sign Up</h1>
      {warning && (
        <div className="alert alert-warning" role="alert">
          <h4 className="alert-heading">!!! Warning</h4>
          <p>Please fill in all the fields.</p>

        </div>
      )}
      <div className="col-6">
        <input className="form-control" type="text" value={tcIdNumber} onChange={(e) => setTcIdNumber(e.target.value)} placeholder="T.C ID Number" required />
        <input className="form-control" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" required />
        <input className="form-control" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" required />
        <input className="form-control" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number" required />
        <input className="form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Select Gender</option>
          {genderList.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <input className="form-control" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
        <div className="input-group">
  <input
    className="form-control"
    type={showPassword ? "text" : "password"}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Password"
    required
  />
  <button
    className="btn"
    type="button"
    onClick={() => setShowPassword(!showPassword)}
  >
    <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
  </button>
</div>

<div className="input-group" >
  <input
    className="form-control"
    type={showConfirmPassword ? "text" : "password"}
    value={confirmPassword}
    onChange={handleConfirmPasswordChange}
    placeholder="Confirm Password"
    required
  />
  <button
    className="btn"
    type="button"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
  >
    <i className={showConfirmPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
  </button>
</div>

        {!isEquals && <label className="text-danger">Passwords do not match!</label>}
        <Button type="submit" label={loading ? "Loading..." : "Register"} onClick={register} disabled={loading} className="custom-button" />
      </div>
      <div className="col-4">
     <div className="social-section">
                <div className="col-12">
                  <div className="social-container">
                    <a href="#" className="social" style={{ backgroundColor: "#1870F2", padding: "10px", borderRadius: "50%" }}>
                      <i className="bi bi-facebook fs-1 text-white "></i>
                    </a>
                    <a href="#" className="social" style={{ backgroundColor: "#1877F2", padding: "10px", borderRadius: "50%" }} >
                      <i className="bi bi-google fs-1 text-white"></i>
                    </a>
                    <a href="#" className="social" style={{ backgroundColor: "#0A66C2", padding: "10px", borderRadius: "50%" }}>
                      <i className="bi bi-linkedin fs-1 text-white"></i>
                    </a>
                  </div>
                </div>
             </div>
     </div>
    </div>
  );
};

export default RegisterForm;
