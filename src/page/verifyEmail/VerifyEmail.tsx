import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container, CircularProgress, Alert } from "@mui/material";
import axios from "axios";
import swal from "sweetalert";
import { IUserProfile } from "../../model/IUserProfile";
import {IBaseResponse} from "../../model/IBaseResponse";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      axios
        .get<IBaseResponse<IUserProfile>>(`http://localhost:9090/v1/api/company/verify-email?token=${token}`)
        .then((response) => {
          if (response.data.success) {
            setStatus("success");

            // Kullanıcı rolüne göre yönlendirme
            const userRole = response.data.data.role;
            if (userRole === "ADMIN") {
              navigate("/admin");
            } else if (userRole === "HOSPITAL_MANAGER") {
              navigate("/hospital-manager");
            } else if (userRole === "DOCTOR") {
              navigate("/doctor");
            } else if (userRole === "EMPLOYEE") {
              navigate("/employee");
            } else if (userRole === "PATIENT") {
              navigate("/patient");
            } else {
              navigate("/"); // Belirsiz rol -> Ana sayfa
            }

            swal("Başarılı", "E-posta doğrulandı. Hesabınız aktif hale getirildi.", "success");
          } else {
            setStatus("error");
            swal("Hata!", response.data.message || "Geçersiz veya süresi dolmuş doğrulama linki.", "error");
          }
        })
        .catch(() => {
          setStatus("error");
          swal("Bir hata oluştu!", "Lütfen tekrar deneyin.", "error");
        });
    } else {
      setStatus("error");
      swal("Hata!", "Geçersiz doğrulama token'ı.", "error");
    }
  }, [searchParams, navigate]);

  return (
    <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "50px" }}>
      {status === "loading" && <CircularProgress />}
      {status === "success" && (
        <Alert severity="success">E-posta başarıyla doğrulandı! Şirketiniz incelenmek üzere sisteme kaydedildi.</Alert>
      )}
      {status === "error" && <Alert severity="error">Geçersiz veya süresi dolmuş doğrulama linki.</Alert>}
    </Container>
  );
};

export default VerifyEmail;