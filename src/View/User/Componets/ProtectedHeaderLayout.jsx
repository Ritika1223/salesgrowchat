import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import Header from "./Header";
import { isLoggedIn, isGuest } from "../../../utils/auth";
import { startChatNotifications, stopChatNotifications } from "../../../utils/chatNotifications";
// Permission popup: requestChatNotificationPermission() in src/utils/chatNotifications.js
// Enable later: set ENABLE_CHAT_NOTIFICATION_PROMPT = true in that file.

export default function ProtectedHeaderLayout() {
  const location = useLocation();

  React.useEffect(() => {
    if (!isLoggedIn()) return undefined;
    startChatNotifications();
    return () => stopChatNotifications();
  }, []);

  if (!isLoggedIn()) {
    if (isGuest()) {
      return <Header />;
    }
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Header />;
}
