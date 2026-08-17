import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";
import {
  getStoredVote,
  getVisitorId,
  setStoredVote,
  trackEventView,
  trackFightVote,
  trackWatchProviderClick,
} from "../analytics";
import FightViewTracker from "../components/FightViewTracker.jsx";
import {
  formatEventDate,
  formatIndiaTime,
  lastName,
  resultLabel,
  splitEventTitle,
  votePercents,
} from "../utils";
import { getWatchPlatforms, PlatformIcon } from "../platformIcons.jsx";

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const [myVotes, setMyVotes] = useState({});

  useEffect(() => {
    let active = true;
    setEvent(null);
    api
      .getEvent(id)
      .then((data) => {
        if (!active) return;
        setEvent(data);
        const votes = {};
        for (const fight of data.fightCard || []) {
          const pick = getStoredVote(fight._id);
          if (pick) votes[fight._id] = pick;
        }
        setMyVotes(votes);
      })
      .catch((err) => {
        if (active) setError(err.message);
      });
    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (!event?._id) return;
    trackEventView({
      eventId: event._id,
      status: event.status,
      promotion: event.promotion,
      fightCount: event.fightCard?.length || 0,
    });
  }, [event?._id]);

  async function vote(fightId, pick, isMainEvent) {
    try {
      const updated = await api.vote(id, fightId, pick, getVisitorId());
      setEvent(updated);
      setStoredVote(fightId, pick);
      setMyVotes((prev) => ({ ...prev, [fightId]: pick }));
      trackFightVote({ eventId: id, fightId, pick, isMainEvent });
    } catch (err) {
      setError(err.message);
    }
  }

  function onWatchClick(platform) {
    trackWatchProviderClick({
      eventId: id,
      providerId: platform._id || platform.name,
      providerName: platform.name,
      providerType: platform.type,
      source: "event_detail",
    });
  }

  if (error) return <p className="error-msg page">{error}</p>;
  if (!event) return <p className="loading page">Loading…</p>;

  const platforms = getWatchPlatforms(event);
  const { headline, sub } = splitEventTitle(event.eventName);
  const venue = [event.venue, event.location].filter(Boolean).join(", ");

  return (
    <div className="page">
      <Link className="back-link" to="/">
        ← Back to events
      </Link>
      <header className="event-heading">
        {event.promotion ? <p className="event-kicker">{event.promotion}</p> : null}
        <h1 className="event-heading-title">
          <AccentNumbers text={headline || event.eventName} />
        </h1>
        {sub ? <p className="event-heading-sub">{sub}</p> : null}
      </header>

      <div className="info-bar">
        <div className="info-item">
          <IconCalendar />
          <span>{formatEventDate(event.date)}</span>
        </div>
        {event.startTime && (
          <div className="info-item">
            <IconClock />
            <span>{formatIndiaTime(event.startTime)}</span>
          </div>
        )}
        {venue && (
          <div className="info-item">
            <IconPin />
            <span>{venue}</span>
          </div>
        )}
      </div>

      {platforms.length > 0 && (
        <section className="watch-section">
          <h2 className="block-title">Where to watch</h2>
          <div className="watch-grid">
            {platforms.map((platform) => {
              const inner = (
                <>
                  <PlatformIcon svg={platform.svg} size={36} />
                  <span className="watch-card-text">
                    <span className="watch-card-name">{platform.name}</span>
                    <span className="watch-card-type">
                      {platform.type === "channel" ? "TV Channel" : "OTT"}
                    </span>
                  </span>
                  {platform.url ? <IconChevron /> : null}
                </>
              );
              return platform.url ? (
                <a
                  key={platform._id || platform.name}
                  className="watch-card"
                  href={platform.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => onWatchClick(platform)}
                >
                  {inner}
                </a>
              ) : (
                <div key={platform._id || platform.name} className="watch-card watch-card-static">
                  {inner}
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="fight-card-section">
        <div className="fight-card-head">
          <h2 className="block-title">Fight card</h2>
          <span className="fight-count">{event.fightCard.length} bouts</span>
        </div>

        {event.fightCard.map((fight) => {
          const pct = votePercents(fight);
          const isMain = Boolean(fight.isMainEvent);
          return (
            <FightViewTracker key={fight._id} eventId={event._id} fight={fight}>
              <article className={`fight${isMain ? " is-main" : ""}`}>
                <div className="fight-tags">
                  {isMain && <span className="fight-tag fight-tag-main">Main event</span>}
                  {fight.isTitleFight && <span className="fight-tag fight-tag-title">Title fight</span>}
                  {fight.weightClass && (
                    <span className="fight-tag-weight">{fight.weightClass}</span>
                  )}
                </div>

                <div className="fighters">
                <Fighter
                  name={fight.fighter1}
                  image={fight.fighter1Image}
                  record={fight.fighter1Record}
                  country={fight.fighter1Country}
                  flag={fight.fighter1CountryFlag}
                />
                <div className="vs-col">
                  <span className="vs-text">VS</span>
                </div>
                <Fighter
                  name={fight.fighter2}
                  image={fight.fighter2Image}
                  record={fight.fighter2Record}
                  country={fight.fighter2Country}
                  flag={fight.fighter2CountryFlag}
                />
                </div>

                <div className="vote-section">
                  <div className="bar">
                    <div className="left" style={{ width: `${pct.f1}%` }} />
                    <div className="right" style={{ width: `${pct.f2}%` }} />
                  </div>
                  <div className="votes">
                    <span>
                      <span className="vote-pct">{pct.total ? `${pct.f1}%` : "—"}</span>
                      {"  "}
                      {Number(fight.fighter1Votes || 0).toLocaleString()} votes
                    </span>
                    <span>
                      {Number(fight.fighter2Votes || 0).toLocaleString()} votes{"  "}
                      <span className="vote-pct">{pct.total ? `${pct.f2}%` : "—"}</span>
                    </span>
                  </div>

                  {event.status !== "completed" && (
                    <div className="vote-btns">
                      <button
                        className={`vote-btn ${isMain ? "vote-btn-red" : ""} ${myVotes[fight._id] === "fighter1" ? "is-selected" : ""}`}
                        onClick={() => vote(fight._id, "fighter1", isMain)}
                      >
                        Vote {lastName(fight.fighter1)}
                      </button>
                      <button
                        className={`vote-btn ${isMain ? "vote-btn-blue" : ""} ${myVotes[fight._id] === "fighter2" ? "is-selected" : ""}`}
                        onClick={() => vote(fight._id, "fighter2", isMain)}
                      >
                        Vote {lastName(fight.fighter2)}
                      </button>
                    </div>
                  )}
                </div>

                {fight.result && (
                  <div className="result-row">
                    <strong>Result:</strong> {resultLabel(fight)}
                  </div>
                )}
              </article>
            </FightViewTracker>
          );
        })}
      </section>
    </div>
  );
}

function Fighter({ name, image, record, country, flag }) {
  return (
    <div className="fighter">
      {image ? (
        <img
          className="fighter-photo"
          src={image}
          alt={name}
          onError={(e) => {
            e.currentTarget.style.visibility = "hidden";
          }}
        />
      ) : (
        <div className="fighter-photo fighter-photo-empty" />
      )}
      <p className="fighter-name">{name}</p>
      {(flag || country) ? (
        <p className="fighter-country">
          {flag ? (
            <img
              src={flag}
              alt=""
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : null}
          {country || "—"}
        </p>
      ) : null}
      {record ? <p className="fighter-record">{record}</p> : null}
    </div>
  );
}

function AccentNumbers({ text }) {
  return String(text)
    .split(/(\d+)/)
    .map((part, i) =>
      /^\d+$/.test(part) ? (
        <span key={i} className="accent">{part}</span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
}

function IconCalendar() {
  return (
    <svg className="info-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg className="info-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8v4l3 2" />
    </svg>
  );
}

function IconPin() {
  return (
    <svg className="info-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}

function IconChevron() {
  return (
    <svg className="watch-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}
