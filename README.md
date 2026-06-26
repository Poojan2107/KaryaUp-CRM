# CRM Demo

A full-stack CRM demo built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **Dashboard** — Summary cards (contacts, active deals, pipeline value, closed won) + bar charts
- **Contacts** — Table with search, create/edit modal, delete
- **Deals** — Kanban board with drag & drop across pipeline stages
- **Activities** — Log calls, emails, meetings, notes, and tasks with contact association

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React, Material UI, Recharts, @dnd-kit |
| Backend | Express.js, Mongoose |
| Database | MongoDB |

## Setup

### Prerequisites

- Node.js 18+
- MongoDB running locally on port 27017 (or set `MONGO_URI` env var)

### Install & Run

```bash
# Install root + server + client dependencies
npm run install:all

# Seed sample data
npm run seed

# Start both server and client
npm run dev
```

- Server runs on `http://localhost:5000`
- Client runs on `http://localhost:3000`

### Environment Variables

| Variable | Default |
|---|---|
| `PORT` | `5000` |
| `MONGO_URI` | `mongodb://localhost:27017/crm-demo` |

## Project Structure

```
crm-demo/
├── server/
│   ├── models/       (Contact, Deal, Activity)
│   ├── routes/       (REST API endpoints)
│   ├── seed.js       (sample data seeder)
│   └── index.js      (Express entry point)
├── client/
│   ├── src/
│   │   ├── context/  (AppContext with API calls)
│   │   ├── components/ (Layout)
│   │   ├── pages/    (Dashboard, Contacts, Deals, Activities)
│   │   └── App.jsx
│   ├── index.html
│   └── vite.config.js
└── package.json
```

## API Endpoints

### Contacts
- `GET /api/contacts?search=` — List contacts (optional search)
- `POST /api/contacts` — Create contact
- `PUT /api/contacts/:id` — Update contact
- `DELETE /api/contacts/:id` — Delete contact

### Deals
- `GET /api/deals` — List all deals
- `POST /api/deals` — Create deal
- `PUT /api/deals/:id` — Update deal
- `DELETE /api/deals/:id` — Delete deal

### Activities
- `GET /api/activities?contactId=` — List activities (optional filter by contact)
- `POST /api/activities` — Create activity
- `PUT /api/activities/:id` — Update activity
- `DELETE /api/activities/:id` — Delete activity

### Misc
- `GET /api/stages` — Returns pipeline stage names
