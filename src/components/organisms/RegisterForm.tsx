import React, { useEffect, useState, useCallback } from "react";
import Button from "../atoms/Button";
import swal from "sweetalert";
import { registerUser } from "../../store/feature/UserSlice";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import '../styles/register.css';

// TC Kimlik No validasyonu
const validateTCKN = (tckn: string): string | null => {
  if (tckn.length !== 11 || !/^[0-9]+$/.test(tckn)) {
    return "TC Kimlik No 11 haneli ve sadece rakamlardan oluşmalıdır.";
  }
  if (tckn[0] === '0') {
    return "TC Kimlik No 0 ile başlayamaz.";
  }

  let sumOdd = 0;
  let sumEven = 0;

  for (let i = 0; i < 9; i++) {
    const digit = parseInt(tckn[i], 10);
    if ((i + 1) % 2 === 1) {
      sumOdd += digit;
    } else {
      sumEven += digit;
    }
  }

  const digit10 = ((sumOdd * 7) - sumEven) % 10;
  if (digit10 !== parseInt(tckn[9], 10)) {
    return "TC Kimlik No 10. hanesi hatalı.";
  }

  let totalSum = 0;
  for (let i = 0; i < 10; i++) {
    totalSum += parseInt(tckn[i], 10);
  }
  const digit11 = totalSum % 10;
  if (digit11 !== parseInt(tckn[10], 10)) {
    return "TC Kimlik No 11. hanesi hatalı.";
  }
  return null;
};

interface FormData {
  tcIdNumber: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  email: string;
}

const RegisterForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    tcIdNumber: "",
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    email: ""
  });
  const [warning, setWarning] = useState(false);
  const [isEquals, setIsEqual] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key in keyof FormData]?: string | null }>({}); //validation

  const genderList = ["MALE", "FEMALE"];
  //const { errorMessage } = useSelector((state: RootState) => state.user); // errorMessage kullanılmadığı için kaldırıldı

  useEffect(() => {
    setIsEqual(formData.password === formData.confirmPassword);
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prevErrors => ({ ...prevErrors, [name]: null })); // Clear error on change
  };

  // useCallback ile fonksiyonun her render'da yeniden oluşturulmasını önleyin
  const register = useCallback(async () => {
    // Validasyon kontrolleri
    const tcknError = validateTCKN(formData.tcIdNumber);
    const errors: { [key in keyof FormData]?: string | null } = {};

    if (tcknError) {
      errors.tcIdNumber = tcknError;
    }
    if (!formData.firstName) errors.firstName = "Ad gereklidir";
    if (!formData.lastName) errors.lastName = "Soyad gereklidir";
    if (!formData.gender) errors.gender = "Cinsiyet seçimi gereklidir";
    if (!formData.dateOfBirth) errors.dateOfBirth = "Doğum tarihi gereklidir";
    if (!formData.password) errors.password = "Şifre gereklidir";
    if (!formData.confirmPassword) errors.confirmPassword = "Şifre doğrulama gereklidir";
    if (!formData.phoneNumber) errors.phoneNumber = "Telefon numarası gereklidir";
    if (!formData.email) errors.email = "Email gereklidir";

    if (!isEquals) {
      errors.confirmPassword = "Şifreler uyuşmuyor";
    }

    setFormErrors(errors); //set hataları

    if (Object.keys(errors).length > 0) { // Hata varsa fonk return et
      return;
    }

    setLoading(true);
    try {
      const result = await dispatch(registerUser(formData)).unwrap();

      if (result.token) {
        swal("Başarılı", "Kayıt işlemi başarılı. Giriş sayfasına yönlendiriliyorsunuz.", "success")
          .then(() => {
            navigate("/login");
          });
      }
    } catch (error: unknown) {
        let errorMessage = "Kayıt işleminde bir hata oluştu";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
      swal("Hata", errorMessage , "error");
    } finally {
      setLoading(false);
    }
  }, [formData, isEquals, dispatch, navigate]);

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
        <input
          className={`form-control ${formErrors.tcIdNumber ? 'is-invalid' : ''}`}
          type="text"
          name="tcIdNumber"
          value={formData.tcIdNumber}
          onChange={handleChange}
          placeholder="T.C ID Number"
          required
        />
        {formErrors.tcIdNumber && <div className="invalid-feedback">{formErrors.tcIdNumber}</div>}

        <input
          className={`form-control ${formErrors.firstName ? 'is-invalid' : ''}`}
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
          required
        />
        {formErrors.firstName && <div className="invalid-feedback">{formErrors.firstName}</div>}

        <input
          className={`form-control ${formErrors.lastName ? 'is-invalid' : ''}`}
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          required
        />
        {formErrors.lastName && <div className="invalid-feedback">{formErrors.lastName}</div>}

        <input
          className={`form-control ${formErrors.phoneNumber ? 'is-invalid' : ''}`}
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
          required
        />
        {formErrors.phoneNumber && <div className="invalid-feedback">{formErrors.phoneNumber}</div>}

        <input
          className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}

        <select
          className={`form-control ${formErrors.gender ? 'is-invalid' : ''}`}
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          {genderList.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {formErrors.gender && <div className="invalid-feedback">{formErrors.gender}</div>}

        <input
          className={`form-control ${formErrors.dateOfBirth ? 'is-invalid' : ''}`}
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
        />
        {formErrors.dateOfBirth && <div className="invalid-feedback">{formErrors.dateOfBirth}</div>}

        <div className={`input-group ${formErrors.password ? 'is-invalid' : ''}`}>
          <input
            className="form-control"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <button className="btn" type="button" onClick={() => setShowPassword(!showPassword)}>
            <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
          </button>
        </div>
        {formErrors.password && <div className="invalid-feedback">{formErrors.password}</div>}

        <div className={`input-group ${formErrors.confirmPassword ? 'is-invalid' : ''}`}>
          <input
            className="form-control"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
          />
          <button className="btn" type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            <i className={showConfirmPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
          </button>
        </div>
        {formErrors.confirmPassword && <div className="invalid-feedback">{formErrors.confirmPassword}</div>}
        {!isEquals && <label className="text-danger">Passwords do not match!</label>}

        <Button
          type="submit"
          label={loading ? "Loading..." : "Register"}
          onClick={register}
          disabled={loading}
          className="custom-button"
        />
      </div>

      <div className="col-4">
        <div className="social-section">
          <div className="col-12">
            <div className="social-container">
              <a href="#" className="social" style={{ backgroundColor: "#1870F2", padding: "10px", borderRadius: "50%" }}>
                <i className="bi bi-facebook fs-1 text-white"></i>
              </a>
              <a href="#" className="social" style={{ backgroundColor: "#1877F2", padding: "10px", borderRadius: "50%" }}>
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
