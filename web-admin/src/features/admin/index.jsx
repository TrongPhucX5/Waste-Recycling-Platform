// Container ghép hook và view
import React from "react";
import AdminDashboard from "./components/AdminDashboard";
import { useAdmin } from "./hooks/useAdmin";

const Admin = () => {
  // const admin = useAdmin();
  return <AdminDashboard />;
};

export default Admin;
