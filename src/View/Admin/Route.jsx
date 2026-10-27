import React from "react";
import { Navigate } from "react-router-dom";
import AdminLogin from "./Pages/AdminLogin";
import AdminHeaderLayout from "./Componets/AdminHeaderLayout";
import { isAdminLoggedIn } from "../../utils/adminAuth";
import AdminUserControl from "./Pages/AdminUserControl";

function AdminGuard({ children }) {
  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

function AdminGuardLogin() {
  if (isAdminLoggedIn()) {
    return <Navigate to="/admin/stop-roi" replace />;
  }
  return <AdminLogin />;
}

const Routes = [
  {
    path: "/admin/login",
    element: <AdminGuardLogin />
  },
  {
    path: "/admin",
    element: (
      <AdminGuard>
        <AdminHeaderLayout />
      </AdminGuard>
    ),
    children: [
      { index: true, element: <Navigate to="stop-roi" replace /> },
      { path: "stop-roi", element: <AdminUserControl mode="roi" /> },
      { path: "stop-withdraw", element: <AdminUserControl mode="withdraw" /> },
    ]
  }
];

export default Routes;
