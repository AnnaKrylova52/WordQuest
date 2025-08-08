import { Outlet } from "react-router-dom";
import { Header } from "../Header";
import { Words } from "../Word";

export const MainLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Words />
    </>
  );
};
