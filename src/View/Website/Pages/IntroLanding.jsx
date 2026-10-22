import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { API_AUTH } from "../../../config/api";
import { clearGuest, isGuest, isLoggedIn } from "../../../utils/auth";
import "../../css/kakowa-home.css";

const REMEMBER_KEY = "kk_login_id";

export default function IntroLanding() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoggedIn() || isGuest()) {
      navigate("/live", { replace: true });
      return;
    }
    const saved = localStorage.getItem(REMEMBER_KEY);
    if (saved) {
      setLoginId(saved);
      setRemember(true);
    }
  }, [navigate]);

  const login = async (e) => {
    e.preventDefault();
    setError("");
    if (!loginId.trim() || !password) {
      setError("Enter your email or mobile number and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_AUTH}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: loginId.trim(), password }),
      });
      let data = {};
      try {
        data = await res.json();
      } catch {
        setError("Unexpected response from server.");
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError(data.message || "Login failed.");
        setLoading(false);
        return;
      }
      if (data.token) localStorage.setItem("token", data.token);
      const userFromApi =
        data.user ||
        data.data?.user ||
        data.profile ||
        (data._id || data.id ? { _id: data._id || data.id } : null);
      if (userFromApi) {
        try {
          localStorage.setItem("auth_user", JSON.stringify(userFromApi));
        } catch {
          /* ignore storage errors */
        }
      }
      clearGuest();
      if (remember) localStorage.setItem(REMEMBER_KEY, loginId.trim());
      else localStorage.removeItem(REMEMBER_KEY);
      const next = location.state?.from && location.state.from !== "/login"
        ? location.state.from
        : "/live";
      navigate(next, { replace: true });
    } catch (err) {
      setError("Cannot connect to the server. " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="kk-home" style={{ backgroundImage: "url(/images/home.jpeg)" }}>
      <div className="kk-wrap">
        <form className="kk-card" onSubmit={login}>
          <div className="kk-crown">♛</div>
          <h1>
            Welcome <span>Back</span>
          </h1>
          <p className="kk-lead">Login to continue your chat journey</p>

          <label className="kk-field">
            <i className="bi bi-envelope"></i>
            <input
              type="text"
              name="loginId"
              autoComplete="username"
              placeholder="Enter Email or Mobile Number"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
            />
          </label>

          <label className="kk-field">
            <i className="bi bi-lock"></i>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="kk-eye"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
            </button>
          </label>

          <div className="kk-row">
            <label className="kk-check">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>Remember Me</span>
            </label>
            <Link to="/contact">Forgot Password?</Link>
          </div>

          {error ? <div className="kk-alert">{error}</div> : null}

          <button type="submit" className="kk-login" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
            {!loading ? <span aria-hidden>→</span> : null}
          </button>

          <div className="kk-or">OR</div>

          <button type="button" className="kk-guest" onClick={() => navigate("/guest")}>
            <i className="bi bi-person-fill"></i>
            Start as a Guest
          </button>

          <p className="kk-new">Don&apos;t have an account?</p>
          <button type="button" className="kk-create" onClick={() => navigate("/signup")}>
            <i className="bi bi-person-plus"></i>
            Create New Account
          </button>

          <p className="kk-legal">
            By logging in, you agree to our
            <br />
            <Link to="/about">Terms &amp; Conditions</Link>
            {" | "}
            <Link to="/about">Privacy Policy</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
