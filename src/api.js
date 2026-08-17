const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const api = {
  listEvents: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/events${query ? `?${query}` : ""}`);
  },
  getEvent: (id) => request(`/events/${id}`),
  vote: (eventId, fightId, pick, visitorId) =>
    request(`/events/${eventId}/fights/${fightId}/vote`, {
      method: "POST",
      body: JSON.stringify({ pick, visitorId }),
    }),
};
