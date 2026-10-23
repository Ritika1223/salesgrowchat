import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { clearGuest, isGuest, getGuestProfile } from "../../../utils/auth";
import GuestActionGuard from "./GuestActionGuard";


function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return isMobile;
}

function handleLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken"); // if you use refresh tokens
  localStorage.removeItem("auth_user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("chat_active_peer");
  sessionStorage.removeItem("chat_active_group");
  clearGuest();
  
  window.location.href = "/";
}

const NAV_LINKS = [
  {
  to: "dashboard",
  icon: <i className="bi bi-grid-1x2-fill"></i>,
  label: "Dashboard",
},

{
  to: "profile",
  icon: <i className="bi bi-person-circle"></i>,
  label: "My Profile",
},

{
  to: "chat",
  icon: <i className="bi bi-chat-dots-fill"></i>,
  label: "Chat",
},

{
  to: "live",
  icon: <i className="bi bi-broadcast-pin"></i>,
  label: "Live",
},

{
  to: "referral",
  icon: <i className="bi bi-people-fill"></i>,
  label: "Referrals",
},

{
  to: "wallet",
  icon: <i className="bi bi-wallet2"></i>,
  label: "Coins",
},

{
  to: "",
  icon: <i className="bi bi-box-arrow-right"></i>,
  label: "Logout",
  onClick: handleLogout
}
];

export default function Header() {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const guest = isGuest();
  const guestProfile = guest ? getGuestProfile() : null;

  const hrefFor = (to) => (to.startsWith("/") ? to : `/${to}`);

  const renderNavLinks = () =>
    NAV_LINKS.map(({ to, icon, label, onClick }) => {
      const isHash = to === "#";
      let active = false;

      if (!isHash && to) {
        const windowPath = window.location.pathname.replace(/\/$/, "");
        const linkPath = hrefFor(to).replace(/\/$/, "");

        if (linkPath === "/dashboard") {
          active = windowPath === linkPath;
        } else {
          active = windowPath.startsWith(linkPath);
        }
      }

      return (
        <a
          key={label}
          href={isHash || !to ? "#" : hrefFor(to)}
          className={active ? "active" : ""}
          onClick={(e) => {
            if (onClick) {
              e.preventDefault();
              onClick();
            }

            if (isMobile) {
              setSidebarOpen(false);
            }
          }}
        >
          <span className="ico">{icon}</span>
          {label}
        </a>
      );
    });

  return (
    <>
      <div className="app ">
       
        <aside
          className={`sidebar${isMobile ? ' mobile' : ''}${isMobile && !sidebarOpen ? ' hidden' : ''}`}
          data-open={isMobile ? (sidebarOpen ? "true" : "false") : undefined}
        >
          {isMobile && (
            <div
              className="cp-mobile-sidebar-topbar"
            >
              <img className="kk-wordmark" src="/images/logo3.png" alt="KaKowa MChat" />
              <button
                aria-label="Close menu"
                onClick={() => setSidebarOpen(false)}
                className="cp-mobile-sidebar-close"
              >✕</button>
            </div>
          )}

          <div className="brand">
            <img className="kk-wordmark" src="/images/logo3.png" alt="KaKowa MChat" />
          </div>

          {guest && (
            <div className="cp-guest-chip">
              Guest · {guestProfile?.name || "Visitor"}
              <div className="cp-guest-chip-links">
                <a href="/login">Sign in</a>
                <a href="/signup">Register</a>
              </div>
            </div>
          )}

          <nav className="nav">
            {renderNavLinks()}
          </nav>
          <div className="divider" />
          
        </aside>
        {isMobile && (
          <button
            className={`sidebar-toggle${sidebarOpen ? " is-hidden" : ""}`}
            aria-label="Open menu"
            onClick={() => setSidebarOpen(true)}
          >
            <span aria-hidden>☰</span>
          </button>
        )}
        <main>
          <GuestActionGuard>
            <Outlet />
          </GuestActionGuard>
        </main>
      </div>

      <div className="bottom-nav">
       <div className="bar">
  <a
    className="nav-btn"
    href="/dashboard"
  >
    <span className="ico">
      <i className="bi bi-house-door-fill"></i>
    </span>
    
  </a>

  <a className="nav-btn" href="/chat">
    <span className="ico">
      <i className="bi bi-chat-dots-fill"></i>
    </span>
    
  </a>

  <a className="nav-btn" href="/live">
    <span className="ico">
      <i className="bi bi-broadcast-pin"></i>
    </span>
  </a>

  <a className="nav-btn" href="/wallet">
    <span className="ico">
      <i className="bi bi-coin"></i>
    </span>
    
  </a>

  <a
    className="nav-btn" 
            aria-label="Open menu"
            onClick={() => setSidebarOpen(true)}
  >
    <span className="ico">
      <i className="bi bi-list"></i>
    </span>
    
  </a>
</div>
      </div>
    </>
  );
}
