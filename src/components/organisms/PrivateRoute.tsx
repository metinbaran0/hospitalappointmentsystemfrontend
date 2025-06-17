import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom"; // Outlet ekledik
import { PropagateLoader } from "react-spinners";
import { Box, Typography } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

interface PrivateRouteProps {
  redirectPath?: string;
  customLoadingComponent?: React.ReactNode;
  customUnauthorizedComponent?: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  redirectPath = "/login",
  customLoadingComponent,
  customUnauthorizedComponent,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Yükleme durumu
  if (isLoading) {
    return customLoadingComponent || (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          gap: 2,
        }}
      >
        <PropagateLoader color="#36d7b7" size={15} />
        <Typography variant="body1" color="text.secondary">
          Yetkilendirme kontrol ediliyor...
        </Typography>
      </Box>
    );
  }

  // Giriş yapılmamışsa
  console.log('PrivateRoute - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);

  if (!isAuthenticated) {
    console.log('Yönlendiriliyor, current path:', location.pathname);
    // Kullanıcı yetkisizse customUnauthorizedComponent'ı göster
    return customUnauthorizedComponent ? (
      <>{customUnauthorizedComponent}</>
    ) : (
      <Navigate to={redirectPath} state={{ from: location }} replace />
    );
  }

  // Tüm kontrollerden geçerse Outlet render et
  return <Outlet />;
};

export default PrivateRoute;
