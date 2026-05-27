import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Mail, Menu, X } from "lucide-react";
import { navLinks } from "../data/portfolio";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (section: string) => {
    const el = document.getElementById(section.toLowerCase());
    if (el) {
      setMenuOpen(false); // close first
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth" });
      }, 100); // wait for drawer animation to finish
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
          /* No border-bottom — eliminates the bright white scroll line */
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

        /* Desktop nav links — shown via media query */
        .desktop-nav {
          display: none;
          align-items: center;
          gap: 2px;
        }
        @media (min-width: 768px) {
          .desktop-nav { display: flex; }
          .desktop-email { display: flex !important; }
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

        /* Mobile drawer */
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
                <motion.a
                  href="/brilata-resume-ats.pdf"
                  download
                  className="email-btn"
                  style={{ marginTop: 10, alignSelf: "flex-start" }}
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
