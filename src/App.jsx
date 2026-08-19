import { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import EventDetail from "./pages/EventDetail.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import PageViewTracker from "./components/PageViewTracker.jsx";
import { api } from "./api";
import logo from "./images/logo.png";

export default function App() {
  const [navEvent, setNavEvent] = useState(null);
  const [navKind, setNavKind] = useState("upcoming");

  useEffect(() => {
    Promise.all([
      api.listEvents({ status: "live" }),
      api.listEvents({ status: "upcoming" }),
    ])
      .then(([live, upcoming]) => {
        if (live[0]) {
          setNavEvent(live[0]);
          setNavKind("live");
        } else if (upcoming[0]) {
          setNavEvent(upcoming[0]);
          setNavKind("upcoming");
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <PageViewTracker />
      <nav className="nav">
        <Link className="logo" to="/" aria-label="TrackFights">
          <img src={logo} alt="TrackFights" />
        </Link>
        {navEvent ? (
          <Link className="nav-event" to={`/events/${navEvent._id}`}>
            <span>
              <span className="nav-event-label">
                {navKind === "live" ? "Live now" : "Upcoming event"}
              </span>
              <span className="nav-event-name">{navEvent.eventName}</span>
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </Link>
        ) : (
          <span className="nav-tagline">MMA events for India</span>
        )}
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <div className="site-footer-inner">
          <span className="footer-copy">
            Made by{" "}
            <a href="https://nexgensoftwares.in" target="_blank" rel="noreferrer" className="footer-link">
              Nexgen
            </a>
          </span>
          <span className="footer-sep">·</span>
          <a href="/privacy-policy" className="footer-link">Privacy Policy</a>
        </div>
      </footer>
    </>
  );
}
