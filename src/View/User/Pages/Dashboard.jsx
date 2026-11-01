import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_AUTH, API_CHAT } from "../../../config/api";
import { authJsonHeaders, resolveAuthUserId } from "../../../utils/auth";
import { PlanCrownBadge } from "../Componets/PlanCrown";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [coins, setCoins] = useState(0);
  const [coinsPerRupee, setCoinsPerRupee] = useState(10);
  const [hostCoins, setHostCoins] = useState(0);
  const [liveCount, setLiveCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const userId = resolveAuthUserId();

    async function load() {
      setLoading(true);
      const headers = authJsonHeaders();
      const [me, wallet, live] = await Promise.allSettled([
        userId ? axios.get(`${API_AUTH}/user/me`, { headers }) : Promise.resolve(null),
        userId ? axios.get(`${API_CHAT}/wallet`, { headers }) : Promise.resolve(null),
        axios.get(`${API_CHAT}/live/active`),
      ]);

      if (cancelled) return;
      if (me.status === "fulfilled" && me.value?.data?.user) {
        setProfile(me.value.data.user);
      }
      if (wallet.status === "fulfilled" && wallet.value?.data) {
        setCoins(Number(wallet.value.data.walletBalance) || 0);
        setHostCoins(Number(wallet.value.data.hostCoins) || 0);
        setCoinsPerRupee(Number(wallet.value.data.coinsPerRupee) || 10);
      }
      if (live.status === "fulfilled") {
        const sessions = live.value.data?.sessions || [];
        setLiveCount(sessions.length);
      }
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const name = profile?.name || "there";
  const isHost = profile?.profileMode === "host";

  return (
    <div className="container-fluid cp-chat-dash">
      <div className="prox-live-navbar">
        <div className="prox-live-navbar-left">
          <div className="prox-live-logo">
            <i className="bi bi-chat-heart-fill"></i>
          </div>
          <div>
            <h2 className="prox-live-navbar-title cp-dash-hello">
              Hi, {name}
              <PlanCrownBadge planAmount={profile?.planAmount} />
              <span className="cp-host-badge">{isHost ? "Host" : "Member"}</span>
            </h2>
            <p className="prox-live-navbar-subtitle">
              Chat, go live, and use coins with the same account.
            </p>
          </div>
        </div>
      </div>

      <div className="row g-2 cp-dash-cards">
        <div className="col-lg-4 col-md-6">
          <div className="wallet-mini-card">
            <div className="wallet-mini-icon purple">
              <i className="bi bi-coin"></i>
            </div>
            <span>Chat coins</span>
            <h3>
              <img src="/images/icon2.png" className="w-30" alt="" />
              {loading ? "…" : coins.toLocaleString("en-IN")}
            </h3>
          </div>
        </div>
        <div className="col-lg-4 col-md-6">
          <div className="wallet-mini-card">
            <div className="wallet-mini-icon green">
              <i className="bi bi-broadcast"></i>
            </div>
            <span>Host coins earned</span>
            <h3>
              <img src="/images/icon2.png" className="w-30" alt="" />
              {loading ? "…" : hostCoins.toLocaleString("en-IN")}
            </h3>
          </div>
        </div>
        <div className="col-lg-4 col-md-6">
          <div className="wallet-mini-card">
            <div className="wallet-mini-icon yellow">
              <i className="bi bi-camera-video-fill"></i>
            </div>
            <span>Live now</span>
            <h3>{loading ? "…" : liveCount}</h3>
          </div>
        </div>
      </div>

      <div className="row g-2 cp-dash-cards">
        <div className="col-md-3 col-6">
          <Link to="/chat" className="wallet-mini-card" style={{ display: "block", textDecoration: "none" }}>
            <div className="wallet-mini-icon purple"><i className="bi bi-chat-dots-fill"></i></div>
            <span>Open chat</span>
          </Link>
        </div>
        <div className="col-md-3 col-6">
          <Link to="/live" className="wallet-mini-card" style={{ display: "block", textDecoration: "none" }}>
            <div className="wallet-mini-icon red"><i className="bi bi-broadcast-pin"></i></div>
            <span>Watch live</span>
          </Link>
        </div>
        <div className="col-md-3 col-6">
          <Link to="/wallet" className="wallet-mini-card" style={{ display: "block", textDecoration: "none" }}>
            <div className="wallet-mini-icon green"><i className="bi bi-wallet2"></i></div>
            <span>Buy coins</span>
          </Link>
        </div>
        <div className="col-md-3 col-6">
          <Link to="/profile" className="wallet-mini-card" style={{ display: "block", textDecoration: "none" }}>
            <div className="wallet-mini-icon yellow"><i className="bi bi-person-badge"></i></div>
            <span>{isHost ? "Host profile" : "Become a host"}</span>
          </Link>
        </div>
      </div>

      <div className="wallet-main-card">
        <div className="wallet-card-glow one"></div>
        <div className="wallet-card-glow two"></div>
        <div className="row align-items-center">
          <div className="col-lg-8">
            <div className="wallet-balance-wrap">
              <div className="wallet-balance-icon">
                <img src="/images/icon2.png" className="w-100" alt="" />
              </div>
              <div>
                <span className="wallet-balance-label">Available Balance</span>
                <h1 className="wallet-balance-amount">
                  {loading ? "Loading..." : Number(coins || 0).toLocaleString("en-IN")}
                  <span className="wallet-balance-subname text-small"> Coins</span>
                </h1>
                <div className="wallet-balance-footer">
                  <span className="wallet-badge">
                    <i className="bi bi-check-circle-fill"></i>
                    Active Wallet
                  </span>
                  <span className="wallet-balance-sub">Coins Balance</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="wallet-rate-card">
              <div className="wallet-rate-icon">
                <img src="/images/icon2.png" className="w-100" alt="" />
              </div>
              <span>Conversion Rate</span>
              <h2>
                ₹1 =
                <strong>{coinsPerRupee}</strong>
                Coins
              </h2>
              <p>Fast & secure wallet conversion</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
