import React, { useEffect, useState } from 'react'
import { useSearchParams } from "react-router-dom";
import { API_AUTH } from "../../../config/api";
import { Link, useNavigate } from "react-router-dom";
import "../../css/kakowa-home.css";

export default function Signup() {
  const registerUrl = `${API_AUTH}/register`;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    name: '',
    nickname: '',
    phone: '',
    email: '',
    password: '',
    conpassword: '',
    referralCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const refCodeFromUrl = (searchParams.get("ref") || "").trim();
    if (refCodeFromUrl) {
      setForm((prev) => ({ ...prev, referralCode: refCodeFromUrl.toUpperCase() }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (form.password !== form.conpassword) {
      setError('Passwords do not match!');
      setLoading(false);
      return;
    }

    try {
      console.log('Making POST request to:', registerUrl);
      console.log('Payload:', {
        name: form.name,
        nickname: form.nickName,
        phone: form.phone,
        email: form.email,
        password: form.password,
        referralCode: form.referralCode,
      });

      const res = await fetch(registerUrl, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          nickname: form.nickName,
          phone: form.phone,
          email: form.email,
          password: form.password,
          referralCode: form.referralCode,
        })
      });

      const phoneRegex = /^[6-9]\d{9}$/;

      if (!phoneRegex.test(form.phone)) {
        setError("Please enter a valid Indian mobile number");
        setLoading(false);
        return;
      }

      let data = {};
      try {
        data = await res.json();
      } catch (parseError) {
        const text = await res.text();
        console.error('Failed to parse JSON. Raw response:', text);
        setError('Unexpected response from server.');
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError(data.message || 'Registration failed!');
        console.error('API error:', data);
      } else {

        setSuccess('Registration successful!');

        setTimeout(() => {

          navigate("/success", {
            state: {
              name: form.name,
              nickname: form.nickName,
              email: form.email,
              phone: form.phone,
              referralCode: form.referralCode
            }
          });

        }, 1500);

      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Cannot connect to API. Is it running? Network error: ' + err.message);
    }
    setLoading(false);
  };

  return (

    <div className="kk-screen" style={{ backgroundImage: "url(/images/home.jpeg)" }}>

      <div className="sg-auth sg-auth-signup">
        <main className="sg-auth-main">
        <div className="sg-auth-card">
          <h2>Create Account</h2>
          <p className="sg-lead">Join MLM Project with the same login you use everywhere.</p>

          <form onSubmit={handleSubmit} className="app-register-form">

            {/* REFERRAL */}
            <div className="app-form-group">
              <label>Referral Code</label>

              <div className="app-input-box">
                <div className="input-icon">
                  <i className="bi bi-gift"></i>
                </div>

                <input
                  type="text"
                  name="referralCode"
                  placeholder="Optional referral code"
                  value={form.referralCode}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* NAME */}
            <div className="app-form-group">
              <label>Full Name</label>

              <div className="app-input-box">
                <div className="input-icon">
                  <i className="bi bi-person"></i>
                </div>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* NAME */}
            <div className="app-form-group">
              <label>Nick Name</label>

              <div className="app-input-box">
                <div className="input-icon">
                  <i className="bi bi-person"></i>
                </div>

                <input
                  type="text"
                  name="nickName"
                  placeholder="Enter your nick name"
                  value={form.nickName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* PHONE */}
            <div className="app-form-group">
              <label>Phone Number</label>

              <div className="app-input-box">
                <div className="input-icon">
                  <i className="bi bi-phone"></i>
                </div>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={form.phone}
                  onChange={handleChange}
                  pattern="[6-9]{1}[0-9]{9}"
                  maxLength="10"
                  required
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="app-form-group">
              <label>Email Address</label>

              <div className="app-input-box">
                <div className="input-icon">
                  <i className="bi bi-envelope"></i>
                </div>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="app-form-group">

              <label>
                Password
              </label>

              <div className="app-input-box">

                <div className="input-icon">
                  <i className="bi bi-lock"></i>
                </div>

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />

                {/* EYE */}
                <button
                  type="button"
                  className="app-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {
                    showPassword ? (
                      <i className="bi bi-eye-slash-fill"></i>
                    ) : (
                      <i className="bi bi-eye-fill"></i>
                    )
                  }
                </button>

              </div>

            </div>

            {/* CONFIRM PASSWORD */}
            <div className="app-form-group">

              <label>
                Confirm Password
              </label>

              <div className="app-input-box">

                <div className="input-icon">
                  <i className="bi bi-shield-lock"></i>
                </div>

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="conpassword"
                  placeholder="Confirm password"
                  value={form.conpassword}
                  onChange={handleChange}
                  required
                />

                {/* EYE */}
                <button
                  type="button"
                  className="app-password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {
                    showConfirmPassword ? (
                      <i className="bi bi-eye-slash-fill"></i>
                    ) : (
                      <i className="bi bi-eye-fill"></i>
                    )
                  }
                </button>

              </div>

            </div>

            {/* ALERTS */}
            {error && (
              <div className="app-alert error-alert">
                {error}
              </div>
            )}

            {success && (
              <div className="app-alert success-alert">
                {success}
              </div>
            )}

            {/* TERMS */}
            <div className="terms-check">
              <input type="checkbox" required />

              <span>
                I agree to the
                <a href="/"> Terms & Conditions</a>
              </span>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="app-register-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm"></span>
                  Registering...
                </>
              ) : (
                <>
                  Create Account
                  <i className="bi bi-arrow-right"></i>
                </>
              )}
            </button>

          </form>

          <button type="button" className="kk-guest" onClick={() => navigate("/guest")}>
            <i className="bi bi-person-fill"></i>
            Start as a Guest
          </button>

          <div className="signup-text">
            Already registered?
            <Link to="/login"> Sign in</Link>
          </div>
        </div>
        </main>
      </div>

    </div>
  )
}
