import ChatPage from "../Chat/ChatPage";
import ProtectedHeaderLayout from "./Componets/ProtectedHeaderLayout";
import Dashboard from "./Pages/Dashboard";
import Referral from "./Pages/Referral";
import Wallet from "./Pages/Wallet";
import LiveBrowse from "./Pages/LiveBrowse";
import LiveRoom from "./Pages/LiveRoom";
import React from "react";
import MyProfile from "./Pages/MyProfile";
import { Navigate, useLocation } from "react-router-dom";
import { appRoute, isGuest, isLoggedIn } from "../../utils/auth";

/** Old URLs `/user/:mongoId/...` → `/...` */
function LegacyUserMongoRedirect() {
  const { pathname } = useLocation();
  const m = pathname.match(/^\/user\/[^/]+\/?(.*)$/);
  const raw =
    m?.[1] != null && String(m[1]).trim() !== "" ? m[1] : "dashboard";
  const tail = String(raw).replace(/^\/+/, "").replace(/\/$/, "") || "dashboard";
  return <Navigate to={appRoute(tail)} replace />;
}

function LiveRoomGate() {
  const location = useLocation();
  if (isLoggedIn() || isGuest()) return <LiveRoom />;
  return <Navigate to="/" replace state={{ from: location.pathname }} />;
}

const Routes = [
  { path: "/user/:id", element: <Navigate to="/dashboard" replace /> },
  { path: "/user/:id/*", element: <LegacyUserMongoRedirect /> },
  {
    element: <ProtectedHeaderLayout />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/profile", element: <MyProfile /> },
      { path: "/chat", element: <ChatPage /> },
      { path: "/live", element: <LiveBrowse /> },
      { path: "/wallet", element: <Wallet /> },
      { path: "/referral", element: <Referral /> },
      { path: "/offers", element: <Navigate to="/wallet" replace /> },
      { path: "/plans", element: <Navigate to="/wallet" replace /> },
      { path: "/level", element: <Navigate to="/dashboard" replace /> },
      { path: "/pool/level", element: <Navigate to="/dashboard" replace /> },
      { path: "/leaderboard", element: <Navigate to="/dashboard" replace /> },
      { path: "/history", element: <Navigate to="/wallet" replace /> },
    ],
    
  },
  { path: "/live/:sessionId", element: <LiveRoomGate /> },

];

export default Routes;
