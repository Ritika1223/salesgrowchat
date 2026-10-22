import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { isGuest, isLoggedIn } from "../../../utils/auth";
import "../../css/kakowa-home.css";

const HIDDEN = new Set(["/", "/login", "/signup", "/guest"]);

export default function StartAsGuestButton() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const path = pathname.replace(/\/$/, "") || "/";

  if (HIDDEN.has(path) || isLoggedIn() || isGuest()) return null;

  return (
    <button
      type="button"
      className="kk-start-guest"
      onClick={() => navigate("/guest")}
    >
      <i className="bi bi-person-fill"></i>
      Start as a Guest
    </button>
  );
}
