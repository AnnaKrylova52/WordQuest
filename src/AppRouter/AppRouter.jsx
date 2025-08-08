import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Loader } from "../ui/Loader";
import { SignIn } from "../Auth/SignIn";
import { SignUp } from "../Auth/SignUp";
import { MainLayout } from "./MainLayout";
import { CollectionsPage } from "../pages/CollectionsPage"; // Добавьте этот компонент

export const AppRouter = () => {
  const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
      return <Loader width={8} height={8} />;
    }

    return user ? <Outlet /> : <Navigate to="/login" replace />;
  };

  return (
    <Routes>
      {/* Публичные маршруты */}
      <Route path="/login" element={<SignIn />} />
      <Route path="/register" element={<SignUp />} />

      {/* Защищенные маршруты */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/home" element={<div>Главная страница</div>} />
        </Route>
      </Route>

      {/* Перенаправления по умолчанию */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};
