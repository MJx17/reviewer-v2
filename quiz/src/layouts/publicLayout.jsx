import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <main className="content-container">
      <Outlet />
    </main>
  );
};

export default PublicLayout;
