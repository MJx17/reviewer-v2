import Navbar from "../navbar";
import { Outlet } from "react-router-dom";

const ProtectedLayout = () => {
  return (
    <div className="app-container">
      <Navbar />
      <main className="content-container">
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedLayout;
