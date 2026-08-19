import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { trackWatchProviderClick } from "../analytics";
import { formatIndiaDate, formatIndiaTime } from "../utils";
import { getWatchPlatforms, PlatformIcon } from "../platformIcons.jsx";

export default function Home() {
  const [banner, setBanner] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [live, setLive] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api.listEvents({ banner: "true" }),
      api.listEvents({ status: "upcoming" }),
      api.listEvents({ status: "live" }),
      api.listEvents({ status: "completed" }),
    ])
      .then(([b, u, l, c]) => {
        setBanner(b);
        setUpcoming(u);
        setLive(l);
        setCompleted(c);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const featured = banner[0];

  if (loading) return <Spinner />;

  return (
    <div>
      {error && <p className="error-msg page">{error}</p>}

      {featured && (
        <section className="banner banner-full">
          {featured.eventPoster ? (
            <img className="banner-img" src={featured.eventPoster} alt={featured.eventName} />
          ) : (
            <div className="banner-img" style={{ background: "#0c0c0e" }} />
          )}
          <div className="banner-overlay">
            <div className="banner-copy">
              <p className="banner-kicker">{featured.promotion}</p>
              <h1 className="banner-title">{featured.eventName}</h1>

              {getWatchPlatforms(featured).length > 0 && (
                <div className="watch-inline">
                  {getWatchPlatforms(featured).map((p) =>
                    p.url ? (
                      <a
                        key={p._id || p.name}
                        className="watch-chip"
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => {
                          trackWatchProviderClick({
                            eventId: featured._id,
                            providerId: p._id || p.name,
                            providerName: p.name,
                            providerType: p.type,
                            source: "home_banner",
                          });
                        }}
                      >
                        <PlatformIcon svg={p.svg} size={16} />
                        {p.name}
                      </a>
                    ) : (
                      <span key={p._id || p.name} className="watch-chip">
                        <PlatformIcon svg={p.svg} size={16} />
                        {p.name}
                      </span>
                    )
                  )}
                </div>
              )}
              <Link to={`/events/${featured._id}`} className="banner-cta">
                View fight card →
              </Link>
            </div>
          </div>
        </section>
      )}

      <div className="page home-body">
          {live.length > 0 && (
            <section style={{ marginBottom: 36 }}>
              <div className="section-head">
                <span className="live-pill">Live now</span>
                <div className="section-divider" />
              </div>
              <EventGrid events={live} />
            </section>
          )}

          <EventSection title="Upcoming events" events={upcoming} />
          <EventSection title="Results" events={completed} />
        </div>
    </div>
  );
}

function EventSection({ title, events }) {
  if (!events?.length) return null;
  return (
    <section style={{ marginBottom: 36 }}>
      <div className="section-head">
        <h2>{title}</h2>
        <div className="section-divider" />
      </div>
      <EventGrid events={events} />
    </section>
  );
}

function statusClass(status) {
  if (status === "live") return "badge badge-live";
  if (status === "completed") return "badge badge-completed";
  return "badge badge-upcoming";
}

function Spinner() {
  return (
    <div className="page-spinner">
      <div className="spinner" />
    </div>
  );
}

function EventGrid({ events }) {
  return (
    <div className="grid">
      {events.map((event) => (
        <Link key={event._id} to={`/events/${event._id}`} className="card">
          {event.eventPoster ? (
            <img src={event.eventPoster} alt={event.eventName} />
          ) : (
            <div className="card-placeholder" />
          )}
          <div className="card-body">
            <span className={statusClass(event.status)}>{event.status}</span>
            <h3>{event.eventName}</h3>
            <p className="card-meta">{event.promotion}</p>
            <p className="card-meta">
              {formatIndiaDate(event.date)} · {formatIndiaTime(event.startTime)}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
