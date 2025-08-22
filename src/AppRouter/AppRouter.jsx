import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Loader } from "../ui/Loader";
import { SignIn } from "../Auth/SignIn";
import { SignUp } from "../Auth/SignUp";
import { MainLayout } from "./MainLayout";
import { CollectionsPage } from "../pages/CollectionsPage";
import { CreateCollection } from "../ui/CreateCollection";
import { CollectionDetails } from "../ui/CollectionDetails";
import { LibraryPage } from "../pages/LibraryPage";
import { MemoryGame } from "../pages/MemoryGame";

export const AppRouter = () => {
  const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
      return <Loader />;
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
          <Route path="/home" element={<div>No main page yet</div>} />
          <Route path="/collections/:id" element={<CollectionDetails />} />
          <Route path="/create-collection" element={<CreateCollection />} />
          <Route path="/user/collections" element={<LibraryPage />} />
          <Route path="/:id/memory-game" element={<MemoryGame />} />
        </Route>
      </Route>

      {/* Перенаправления по умолчанию */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};
