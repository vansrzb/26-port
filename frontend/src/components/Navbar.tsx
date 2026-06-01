import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Menu, X } from "lucide-react";
import { navLinks } from "../data/portfolio";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Manila",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
      setDate(
        now.toLocaleDateString("en-US", {
          timeZone: "Asia/Manila",
          month: "short",
          day: "2-digit",
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const scrollTo = (section: string) => {
    const el = document.getElementById(section.toLowerCase());
    if (el) {
      setMenuOpen(false);
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth" });
      }, 100);
      setActive(section);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');

        .navbar-root {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 50;
          transition: background 0.45s ease, box-shadow 0.45s ease;
        }
        .navbar-root.scrolled {
          background: rgba(2, 4, 9, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow:
            0 1px 0 rgba(96,165,250,0.07),
            0 4px 24px rgba(0,0,0,0.45);
        }
        .navbar-root.top {
          background: transparent;
        }
        .navbar-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 28px;
          height: 66px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .logo-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          user-select: none;
        }
        .logo-mark {
          width: 36px; height: 36px;
          border-radius: 50%;
          overflow: hidden;
          border: 1.5px solid rgba(96,165,250,0.35);
          box-shadow: 0 0 14px rgba(37,99,235,0.25);
          flex-shrink: 0;
        }
        .logo-mark img {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
        }
        .logo-text {
          font-family: 'DM Mono', monospace;
          font-size: 14px; font-weight: 500;
          color: rgba(220,235,255,0.88);
          letter-spacing: 0.03em;
        }
        .logo-accent { color: #60a5fa; }

        .desktop-nav {
          display: none;
          align-items: center;
          gap: 2px;
        }
        @media (min-width: 768px) {
          .desktop-nav { display: flex; }
          .desktop-email { display: flex !important; }
          .desktop-clock { display: flex !important; }
          .hamburger-btn { display: none !important; }
        }
        .nav-link {
          position: relative;
          padding: 7px 14px;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          color: rgba(148,163,184,0.58);
          border-radius: 8px;
          border: none;
          background: transparent;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .nav-link:hover { color: rgba(220,235,255,0.88); }
        .nav-link.active { color: #60a5fa; }
        .nav-pill {
          position: absolute;
          inset: 0;
          border-radius: 8px;
          background: rgba(96,165,250,0.07);
          border: 0.5px solid rgba(96,165,250,0.18);
        }
        .nav-prefix { color: rgba(96,165,250,0.4); margin-right: 3px; }
        .right-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* Timezone clock */
        .tz-clock {
          display: none;
          align-items: center;
          gap: 8px;
          padding: 7px 13px;
          background: rgba(37,99,235,0.06);
          border: 0.5px solid rgba(96,165,250,0.14);
          border-radius: 8px;
        }
        .tz-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #60a5fa;
          opacity: 0.7;
          flex-shrink: 0;
          animation: tz-pulse 2s ease-in-out infinite;
        }
        @keyframes tz-pulse {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 0.9; }
        }
        .tz-inner {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1px;
        }
        .tz-time {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          color: rgba(180,210,255,0.82);
          letter-spacing: 0.06em;
          line-height: 1;
        }
        .tz-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          color: rgba(96,165,250,0.45);
          letter-spacing: 0.1em;
          line-height: 1;
        }

        .email-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 16px;
          background: rgba(37,99,235,0.1);
          border: 0.5px solid rgba(96,165,250,0.2);
          border-radius: 8px;
          cursor: pointer;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: rgba(96,165,250,0.78);
          letter-spacing: 0.08em;
          text-decoration: none;
          transition: all 0.22s ease;
        }
        .email-btn:hover {
          background: rgba(37,99,235,0.18);
          border-color: rgba(96,165,250,0.38);
          color: #93c5fd;
          transform: translateY(-1px);
        }
        .desktop-email { display: none; }
        .desktop-clock { display: none; }

        .hamburger-btn {
          background: transparent;
          border: 0.5px solid rgba(96,165,250,0.14);
          border-radius: 8px;
          padding: 7px 8px;
          cursor: pointer;
          color: rgba(148,163,184,0.65);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.18s ease;
        }
        .hamburger-btn:hover {
          border-color: rgba(96,165,250,0.28);
          color: rgba(220,235,255,0.88);
          background: rgba(96,165,250,0.06);
        }

        .mobile-drawer {
          overflow: hidden;
          background: rgba(2,4,9,0.94);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-top: 0.5px solid rgba(96,165,250,0.07);
        }
        .mobile-link {
          width: 100%;
          text-align: left;
          padding: 10px 12px;
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          color: rgba(148,163,184,0.58);
          border-radius: 8px;
          transition: all 0.18s ease;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .mobile-link:hover {
          background: rgba(96,165,250,0.06);
          color: rgba(220,235,255,0.85);
        }
        .mobile-clock {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          margin-top: 8px;
          background: rgba(37,99,235,0.06);
          border: 0.5px solid rgba(96,165,250,0.12);
          border-radius: 8px;
        }
      `}</style>

      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`navbar-root ${scrolled ? "scrolled" : "top"}`}
      >
        <div className="navbar-inner">
          {/* Logo */}
          <motion.div
            className="logo-wrap"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="logo-mark">
              <img src="/profile-2.png" alt="Ivan Brilata" />
            </div>
            <span className="logo-text">
              vans<span className="logo-accent">rzb</span>
            </span>
          </motion.div>

          {/* Desktop nav links */}
          <div className="desktop-nav">
            {navLinks.map((link) => (
              <motion.button
                key={link}
                className={`nav-link ${active === link ? "active" : ""}`}
                onClick={() => scrollTo(link)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {active === link && (
                  <motion.div
                    layoutId="nav-pill"
                    className="nav-pill"
                    transition={{
                      type: "spring",
                      bounce: 0.18,
                      duration: 0.38,
                    }}
                  />
                )}
                <span style={{ position: "relative", zIndex: 1 }}>
                  <span className="nav-prefix">./</span>
                  {link}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Right actions */}
          <div className="right-actions">
            {/* Timezone Clock — desktop only */}
            <div className="tz-clock desktop-clock">
              <div className="tz-dot" />
              <div className="tz-inner">
                <span className="tz-time">{time}</span>
                <span className="tz-label">{date} · PH / PHT</span>
              </div>
            </div>

            <motion.a
              href="/brilata-resume-ats.pdf"
              download
              className="email-btn desktop-email"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <Download size={13} />
              Resume
            </motion.a>

            <button
              className="hamburger-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="mobile-drawer"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                style={{
                  padding: "12px 20px 22px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                {navLinks.map((link, i) => (
                  <motion.button
                    key={link}
                    className="mobile-link"
                    onClick={() => scrollTo(link)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.045 }}
                  >
                    <span style={{ color: "rgba(96,165,250,0.38)" }}>./</span>
                    {link}
                  </motion.button>
                ))}

                {/* Clock row in mobile drawer */}
                <motion.div
                  className="mobile-clock"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: navLinks.length * 0.045 }}
                >
                  <div className="tz-dot" />
                  <div className="tz-inner">
                    <span className="tz-time">{time}</span>
                    <span className="tz-label">{date} · PH / PHT</span>
                  </div>
                </motion.div>

                <motion.a
                  href="/brilata-resume-ats.pdf"
                  download
                  className="email-btn"
                  style={{ marginTop: 6, alignSelf: "flex-start" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: navLinks.length * 0.045 + 0.05 }}
                >
                  <Download size={13} />
                  Resume
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}