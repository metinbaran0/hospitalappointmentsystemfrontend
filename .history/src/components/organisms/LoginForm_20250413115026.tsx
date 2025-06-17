import React, { useEffect, useState } from "react";
import FormField from "../molecules/formField";
import PasswordField from "../molecules/PasswordField";
import Button from "../atoms/Button";
import swal from "sweetalert";
import {
  AsyncThunkAction,
  ThunkDispatch,
  UnknownAction,
} from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { loginUser } from "../../store/feature/UserSlice"; 
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../store/index"; 
import '../styles/login.css';

const LoginForm: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();
  const [tcIdNumber, setTcIdNumber] = useState("");
  const [password, setPassword] = useState("");
  const [warning, setWarning] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false); // Loading state

  const validateTcId = (tcId: string): string => {
    if (!tcId) {
      return "The T.C. ID number cannot be empty.";
    }
    if (!/^[0-9]{11}$/.test(tcId)) {
      return "The T.C. ID number must be 11 digits long and consist only of numbers.";
    }
    if (tcId.startsWith("0")) {
      return "The T.C. ID number cannot start with 0.";
    }
    return "Valid T.C. ID number.";
  };
  const validatePassword = (password: string): string => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%*^&+=]).{8,20}$/;
    if (!password) return "Password cannot be empty.";
    if (!passwordRegex.test(password))
      return "Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character.";
    return "Valid";
  };

  const doLoginPanel = () => {
    const tcIdMessage = validateTcId(tcIdNumber);
    const passwordMessage = validatePassword(password);

    if (tcIdMessage !== "Valid" || passwordMessage !== "Valid") {
      setWarning(true);
      swal("Error", tcIdMessage || passwordMessage, "error");
      return;
    }

    dispatch(loginUser({ tcIdNumber, password }))
      .then(() => {
        swal("Success", "Login successful", "success").then(() => {
          navigate("/profile");
        });
      })
      .catch((error) => {
        swal("Error", error.message, "error");
      });
  };

  useEffect(() => {
    if (warning) {
      const timer = setTimeout(() => setWarning(false), 2000);
      return () => clearTimeout(timer);
    }
    setIsRegister(false); // Sayfa yüklenince başlangıçta daralmayı önler
  }, [warning]);

  const login = () => {
    if (!tcIdNumber || !password) {
      setWarning(true);
      return;
    }
    swal("Login Success", "You have logged in successfully!", "success");
  };

  return (


    <div className="log-in shadow p-3 mb-3 bg-body rounded">
      <h1 className="h1">Sign In</h1>

      {warning && (
        <div className="alert alert-warning" role="alert">
          <h4 className="alert-heading">!!! Warning</h4>
          <p>Please do not leave your T.C. ID number and password empty.</p>
        </div>
      )}
     <div className="col-6">
      <input
    className="form-control"
        type="text"
        value={tcIdNumber}
        onChange={(e) => setTcIdNumber(e.target.value)}
        placeholder="T.C ID Number"
        pattern="^[1-9][0-9]{10}$"
        required
        title="The Turkish ID Number must consist of 11 digits and cannot start with 0."
      />
      
      <input
      className="form-control"
       type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />

      <a href="#">Forget your Password?</a>

      <Button
        label={loading ? "Loading..." : "Submit"}
        onClick={login}
        disabled={loading}
        className="custom-button"
      />
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

export default LoginForm;