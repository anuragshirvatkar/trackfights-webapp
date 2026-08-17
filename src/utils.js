export function formatIndiaTime(startTime) {
  if (!startTime) return "";
  if (/am|pm/i.test(startTime)) {
    return startTime.toUpperCase().includes("IST") ? startTime : `${startTime} IST`;
  }
  const match = String(startTime).trim().match(/^(\d{1,2}):(\d{2})/);
  if (!match) return `${startTime} IST`;
  const hours = Number(match[1]);
  const minutes = match[2];
  const mer = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes} ${mer} IST`;
}

export function formatIndiaDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function votePercents(fight) {
  const total = (fight.fighter1Votes || 0) + (fight.fighter2Votes || 0);
  if (!total) return { f1: 50, f2: 50, total: 0 };
  return {
    f1: Math.round((fight.fighter1Votes / total) * 100),
    f2: Math.round((fight.fighter2Votes / total) * 100),
    total,
  };
}

export function resultLabel(fight) {
  if (!fight.result) return null;
  if (fight.result === "fighter1") return `${fight.fighter1} wins`;
  if (fight.result === "fighter2") return `${fight.fighter2} wins`;
  if (fight.result === "draw") return "Draw";
  if (fight.result === "no_contest") return "No contest";
  return fight.result;
}

export function lastName(name) {
  if (!name) return "";
  const parts = String(name).trim().split(/\s+/);
  return parts[parts.length - 1];
}

export function splitEventTitle(eventName = "") {
  const idx = eventName.indexOf(":");
  if (idx === -1) return { headline: eventName, sub: "" };
  return {
    headline: eventName.slice(0, idx).trim(),
    sub: eventName.slice(idx + 1).trim(),
  };
}

export function formatEventDate(date) {
  if (!date) return "";
  return new Date(date)
    .toLocaleDateString("en-GB", {
      timeZone: "Asia/Kolkata",
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    .toUpperCase()
    .replace(/\s+(\d{4})$/, ", $1");
}
