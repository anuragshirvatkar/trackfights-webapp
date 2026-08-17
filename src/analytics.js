import { logEvent, setUserId } from "firebase/analytics";
import { getAnalyticsInstance, initFirebase } from "./firebase";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const VISITOR_KEY = "tf_vid";
const SEEN_KEY = "tf_seen_v2";

export function getVisitorId() {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

function fingerprint(name, params) {
  return [
    name,
    params.event_id || "",
    params.fight_id || "",
    params.page_path || "",
    params.provider_id || "",
    params.source || "",
    name === "fight_vote" ? "" : params.pick || "",
  ].join("|");
}

function alreadySeen(key) {
  try {
    const seen = JSON.parse(localStorage.getItem(SEEN_KEY) || "{}");
    return Boolean(seen[key]);
  } catch {
    return false;
  }
}

function markSeen(key) {
  try {
    const seen = JSON.parse(localStorage.getItem(SEEN_KEY) || "{}");
    seen[key] = Date.now();
    const keys = Object.keys(seen);
    if (keys.length > 400) {
      keys
        .sort((a, b) => seen[a] - seen[b])
        .slice(0, keys.length - 400)
        .forEach((old) => delete seen[old]);
    }
    localStorage.setItem(SEEN_KEY, JSON.stringify(seen));
  } catch {
    // ignore storage failures
  }
}

function safeParams(params) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );
}

function sendToBackend(name, params, visitorId) {
  try {
    fetch(`${API_URL}/analytics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, visitorId, params }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Analytics must never affect the app.
  }
}

async function sendEvent(name, params = {}, { replace } = {}) {
  const payload = safeParams(params);
  const key = fingerprint(name, payload);
  if (!replace && alreadySeen(key)) return;
  markSeen(key);

  const visitorId = getVisitorId();
  sendToBackend(name, payload, visitorId);

  try {
    await initFirebase();
    const analytics = getAnalyticsInstance();
    if (!analytics) return;
    if (visitorId) setUserId(analytics, visitorId);
    logEvent(analytics, name, payload);
  } catch {
    // Analytics must never affect the app.
  }
}

export function trackPageView(pagePath) {
  if (!pagePath) return;
  sendEvent("page_view", { page_path: pagePath });
}

export function trackEventView({ eventId, status, promotion, fightCount }) {
  if (!eventId) return;
  sendEvent("event_view", {
    event_id: String(eventId),
    event_status: status,
    promotion,
    fight_count: fightCount,
  });
}

export function trackFightView({ eventId, fightId, isMainEvent, isTitleFight, weightClass, fightOrder }) {
  if (!eventId || !fightId) return;
  sendEvent("fight_view", {
    event_id: String(eventId),
    fight_id: String(fightId),
    is_main_event: Boolean(isMainEvent),
    is_title_fight: Boolean(isTitleFight),
    weight_class: weightClass || undefined,
    fight_order: fightOrder,
  });
}

export function trackWatchProviderClick({ eventId, providerId, providerName, providerType, source }) {
  sendEvent("watch_provider_click", {
    event_id: eventId,
    provider_id: providerId,
    provider_name: providerName,
    provider_type: providerType,
    source,
  });
}

export function trackFightVote({ eventId, fightId, pick, isMainEvent }) {
  sendEvent("fight_vote", {
    event_id: String(eventId),
    fight_id: String(fightId),
    pick,
    is_main_event: Boolean(isMainEvent),
  }, { replace: true });
}

const VOTES_KEY = "tf_votes";

export function getStoredVote(fightId) {
  try {
    const votes = JSON.parse(localStorage.getItem(VOTES_KEY) || "{}");
    return votes[fightId] || "";
  } catch {
    return "";
  }
}

export function setStoredVote(fightId, pick) {
  try {
    const votes = JSON.parse(localStorage.getItem(VOTES_KEY) || "{}");
    votes[fightId] = pick;
    localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
  } catch {
    // ignore
  }
}
