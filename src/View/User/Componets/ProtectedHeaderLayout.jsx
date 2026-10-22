import React from "react";
import Header from "./Header";
import { isLoggedIn } from "../../../utils/auth";
import { startChatNotifications, stopChatNotifications } from "../../../utils/chatNotifications";
// Permission popup: requestChatNotificationPermission() in src/utils/chatNotifications.js
// Enable later: set ENABLE_CHAT_NOTIFICATION_PROMPT = true in that file.

export default function ProtectedHeaderLayout() {
  React.useEffect(() => {
    if (!isLoggedIn()) return undefined;
    startChatNotifications();
    return () => stopChatNotifications();
  }, []);

  return <Header />;
}
