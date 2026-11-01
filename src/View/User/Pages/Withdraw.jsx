import React, { useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { API_CHAT } from "../../../config/api";
import { authJsonHeaders, getToken } from "../../../utils/auth";

const MIN_COINS = 500;

function statusLabel(status) {
  if (status === "approved") return "Accepted";
  if (status === "rejected") return "Rejected";
  return "Pending";
}

export default function Withdraw() {
  const [amount, setAmount] = useState("");
  const [payoutAddress, setPayoutAddress] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [available, setAvailable] = useState(0);
  const [pending, setPending] = useState(0);
  const [withdrawStopped, setWithdrawStopped] = useState(false);
  const [requests, setRequests] = useState([]);
  const [notHost, setNotHost] = useState(false);

  const load = useCallback(async () => {
    if (!getToken()) {
      setPageLoading(false);
      setError("Please login first");
      return;
    }
    try {
      const res = await axios.get(`${API_CHAT}/coin-withdraw/mine`, {
        headers: authJsonHeaders(),
      });
      setBalance(Number(res.data?.balance) || 0);
      setAvailable(Number(res.data?.available) || 0);
      setPending(Number(res.data?.pending) || 0);
      setWithdrawStopped(Boolean(res.data?.withdrawStopped));
      setRequests(Array.isArray(res.data?.data) ? res.data.data : []);
      setError("");
    } catch (err) {
      if (err?.response?.status === 403) {
        setNotHost(true);
        return;
      }
      setError(err?.response?.data?.message || "Could not load withdrawal");
    } finally {
      setPageLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!getToken()) {
      setError("Please login first");
      return;
    }
    if (withdrawStopped) {
      setError("Withdrawal is stopped for your account. Please contact admin.");
      return;
    }
    const coins = Math.floor(Number(amount));
    if (!Number.isInteger(coins) || coins < MIN_COINS) {
      setError(`Minimum withdrawal is ${MIN_COINS} coins`);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${API_CHAT}/coin-withdraw`,
        { amount: coins, payoutAddress },
        { headers: authJsonHeaders() }
      );
      setMessage(res.data?.message || "Withdrawal request sent");
      setAmount("");
      setPayoutAddress("");
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || "Could not submit withdrawal");
    } finally {
      setLoading(false);
    }
  };

  if (notHost) return <Navigate to="/dashboard" replace />;

  return (
    <div className="wallet-page">
      <div className="container-fluid">
        <div className="prox-live-navbar">
          <div className="prox-live-navbar-left">
            <div className="prox-live-logo">
              <i className="bi bi-cash-stack"></i>
            </div>
            <div>
              <h2 className="prox-live-navbar-title">Withdraw Coins</h2>
              <p className="prox-live-navbar-subtitle">
                Minimum {MIN_COINS} coins. Admin accepts or rejects the request.
              </p>
            </div>
          </div>
        </div>

        <div className="wallet-history-card" style={{ marginBottom: 18 }}>
          <div className="wallet-history-head">
            <div>
              <h2>Coin balance</h2>
              <p>Pending requests stay reserved until admin decides.</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <h4>{balance.toLocaleString()} coins</h4>
              <p>Balance</p>
            </div>
            <div className="col-md-4">
              <h4>{pending.toLocaleString()} coins</h4>
              <p>Pending</p>
            </div>
            <div className="col-md-4">
              <h4>{available.toLocaleString()} coins</h4>
              <p>Available</p>
            </div>
          </div>
        </div>

        <div className="income-history-card fund-request-form">
          {withdrawStopped ? (
            <p className="wallet-error">
              Withdrawal is stopped for your account. Please contact admin.
            </p>
          ) : null}
          <form className="payment-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Coins</label>
              <input
                type="number"
                min={MIN_COINS}
                step="1"
                className="wallet-input"
                placeholder={`Minimum ${MIN_COINS}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>UPI / USDT address</label>
              <input
                type="text"
                className="wallet-input"
                placeholder="Where should we send the payout"
                value={payoutAddress}
                onChange={(e) => setPayoutAddress(e.target.value)}
                required
              />
            </div>
            {error && <div className="wallet-error">{error}</div>}
            {message && <p>{message}</p>}
            <div className="wallet-modal-actions">
              <button
                type="submit"
                className="wallet-submit-btn"
                disabled={loading || withdrawStopped || pageLoading}
              >
                {loading ? "Submitting..." : "Submit request"}
              </button>
            </div>
          </form>
        </div>

        <div className="wallet-history-card" style={{ marginTop: 18 }}>
          <div className="wallet-history-head">
            <div>
              <h2>My requests</h2>
              <p>Accepted requests deduct coins. Rejected requests do not.</p>
            </div>
          </div>
          {pageLoading ? (
            <div className="wallet-loading">Loading requests...</div>
          ) : requests.length === 0 ? (
            <div className="wallet-empty">
              <h4>No withdrawal requests yet</h4>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Coins</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((row) => (
                    <tr key={row._id}>
                      <td>{Number(row.amount || 0).toLocaleString()}</td>
                      <td>{row.payoutAddress}</td>
                      <td>{statusLabel(row.status)}</td>
                      <td>
                        {row.createdAt
                          ? new Date(row.createdAt).toLocaleString("en-IN")
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
