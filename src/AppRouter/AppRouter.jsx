import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Loader } from "../ui/Loader";
import { SignIn } from "../Auth/SignIn";
import { SignUp } from "../Auth/SignUp";
import { MainLayout } from "./MainLayout";
import { CollectionsPage } from "../pages/CollectionsPage";
import { CreateCollection } from "../pages/CreateCollection";
import { CollectionDetails } from "../pages/CollectionDetails";
import { LibraryPage } from "../pages/LibraryPage";
import { MemoryGame } from "../pages/MemoryGame";
import { TimeGame } from "../pages/TimeGame";
import { Settings } from "../pages/Settings";
import { UserCollections } from "../pages/UsersCollections";
import { HomePage } from "../pages/HomePage";
import { LearningMode } from "../pages/LearningMode";
import { AdminPage } from "../pages/AdminPage";

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
          <Route path="/home" element={<HomePage />} />
          <Route path="/collections/:id" element={<CollectionDetails />} />
          <Route path="/create-collection" element={<CreateCollection />} />
          <Route path="/user/collections" element={<LibraryPage />} />
          <Route path="/:id/memory-game" element={<MemoryGame />} />
          <Route path="/:id/time-game" element={<TimeGame />} />
          <Route path="/:id/learning" element={<LearningMode />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/user/:userId" element={<UserCollections />} />
          <Route path="/users" element={<AdminPage />} />
        </Route>
      </Route>

      {/* Перенаправления по умолчанию */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};
