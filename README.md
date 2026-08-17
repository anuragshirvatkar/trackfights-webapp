# TrackFights Web App

Public React site for MMA events, fight cards, watch platforms, and fan votes.

Repo: [anuragshirvatkar/trackfights-webapp](https://github.com/anuragshirvatkar/trackfights-webapp)

## Setup

```bash
npm install
cp .env.example .env
```

Set `VITE_API_URL` to the backend API. For local development:

```
VITE_API_URL=http://localhost:5000/api
```

Optional Firebase analytics keys can go in the same `.env` file.

```bash
npm run dev
```

The site runs at `http://localhost:5173`.

## Scripts

- `npm run dev` — Vite dev server
- `npm run build` — production build
- `npm run preview` — preview the production build

The backend must be running for events, votes, and tracking.
