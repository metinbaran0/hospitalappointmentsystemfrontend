import React, { useState, useEffect, useCallback } from "react";
import Button from "../atoms/Button";
import swal from "sweetalert";
import { useDispatch } from "react-redux";
import { loginUser } from "../../store/feature/UserSlice";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../store/index";
import "../styles/login.css";

type SweetAlertOptions = {
  title: string;
  text: string;
  icon: "success" | "error" | "warning" | "info";
};

const LoginForm: React.FC = () => {
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [warning, setWarning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"tc" | "email" | "phone">("tc");
  const [identifierError, setIdentifierError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const validateInput = (identifier: string, method: string): string | null => {
    if (!identifier) return "Login identifier cannot be empty.";
    switch (method) {
      case "tc":
        return /^[1-9][0-9]{10}$/.test(identifier)
          ? null
          : "The T.C. ID number must be 11 digits long and cannot start with 0.";
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)
          ? null
          : "Please enter a valid email address.";
      case "phone":
        return /^[\d+]{10,20}$/.test(identifier)
          ? null
          : "Please enter a valid phone number.";
      default:
        return "Invalid login method";
    }
  };

  const validatePassword = (password: string): string | null => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%*^&+=]).{8,20}$/;
    return !password
      ? "Password cannot be empty."
      : !regex.test(password)
        ? "Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character."
        : null;
  };

  const detectLoginMethod = (identifier: string): "tc" | "email" | "phone" => {
    if (/^[1-9][0-9]{10}$/.test(identifier)) return "tc";
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) return "email";
    if (/^[\d+]{10,20}$/.test(identifier)) return "phone";
    return "tc";
  };

  const doLoginPanel = useCallback(async () => {
    const method = detectLoginMethod(loginIdentifier);
    setLoginMethod(method);

    const identifierMessage = validateInput(loginIdentifier, method);
    const passwordMessage = validatePassword(password);

    setIdentifierError(identifierMessage);
    setPasswordError(passwordMessage);

    if (identifierMessage || passwordMessage) {
      setWarning(true);
      const swalOptions: SweetAlertOptions = {
        title: "Error",
        text: identifierMessage || passwordMessage!,
        icon: "error",
      };
      swal(swalOptions);
      return;
    }

    setLoading(true);
    try {
      const result = await dispatch(loginUser({ loginIdentifier, password })).unwrap();
      if (result.token) {
        const swalOptions: SweetAlertOptions = {
          title: "Success",
          text: "Login successful",
          icon: "success",
        };
        swal(swalOptions).then(() => navigate("/profile"));
      }
    } catch (error: unknown) {
      let errorMessage = "Login failed";
      if (typeof error === "object" && error !== null && "message" in error) {
        const err = error as { message?: string };
        if (err.message?.includes("credentials")) {
          errorMessage = "Invalid username or password";
        } else if (err.message?.includes("rate limit")) {
          errorMessage = "Too many login attempts. Please try again later.";
        }
      }

      const swalOptions: SweetAlertOptions = {
        title: "Error",
        text: errorMessage,
        icon: "error",
      };
      swal(swalOptions);
    } finally {
      setLoading(false);
    }
  }, [loginIdentifier, password, dispatch, navigate]);

  useEffect(() => {
    if (warning) {
      const timer = setTimeout(() => setWarning(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [warning]);

  return (
    <div className="log-in shadow p-3 mb-3 bg-body rounded">
      <h1 className="h1">Sign In</h1>

      {warning && (
        <div className="alert alert-warning" role="alert">
          <h4 className="alert-heading">!!! Warning</h4>
          <p>Please check your login credentials.</p>
        </div>
      )}

      <div className="col-6">
        <div className="btn-group mb-3" role="group">
          {["tc", "email", "phone"].map((method) => (
            <button
              key={method}
              type="button"
              className={`btn ${loginMethod === method ? "btn-primary" : "btn-outline-primary"} method-button`} // Added method-button class
              onClick={() => setLoginMethod(method as "tc" | "email" | "phone")}
            >
              {method.toUpperCase()}
            </button>
          ))}
        </div>

        <input
          className={`form-control ${identifierError ? "is-invalid" : ""}`}
          type={loginMethod === "email" ? "email" : "text"}
          value={loginIdentifier}
          onChange={(e) => {
            setLoginIdentifier(e.target.value);
            setIdentifierError(null);
          }}
          placeholder={
            loginMethod === "tc"
              ? "T.C ID Number"
              : loginMethod === "email"
                ? "Email Address"
                : "Phone Number"
          }
          required
        />
        {identifierError && <div className="invalid-feedback">{identifierError}</div>}

        <input
          className={`form-control mt-3 ${passwordError ? "is-invalid" : ""}`}
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError(null);
          }}
          placeholder="Password"
          required
        />
        {passwordError && <div className="invalid-feedback">{passwordError}</div>}

        <a href="#">Forget your Password?</a>

        <Button
          label={loading ? "Loading..." : "Submit"}
          onClick={doLoginPanel}
          disabled={loading}
          className="custom-button mt-3"
        />
      </div>

      <div className="col-4">
        <div className="social-section">
          <div className="col-12">
            <div className="social-container">
              <a href="#" className="social" style={{ backgroundColor: "#1870F2", padding: "10px", borderRadius: "50%" }}>
                <i className="bi bi-facebook fs-1 text-white"></i>
              </a>
              <a href="#" className="social" style={{ backgroundColor: "#DB4437", padding: "10px", borderRadius: "50%" }}>
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