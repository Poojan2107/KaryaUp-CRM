# KaryaUP CRM Demo

A full-stack CRM built with the MERN stack. Built and deployed in under 1 hour.

**Live**: https://crm-demo-kayaup.vercel.app

## Features

- **Dashboard** — KPI cards, pipeline analytics (win rate, avg deal, conversion), bar/pie charts
- **Contacts** — Table with search, pagination, CRUD, enrichment (deal count, total value)
- **Deals** — Drag & drop Kanban (6 stages), inline value editing, column totals, detail page
- **Activities** — Type filter, completion toggle, edit, relative timestamps
- **Contact/Deal Detail** — Profile cards with linked activities and deals
- **Export** — PDF (contacts, deals, activities) + CSV (contacts)
- **Dark Mode** — Theme toggle in header
- **Undo Delete** — Snackbar with undo for contacts and deals

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React, Material UI, Recharts, @dnd-kit |
| Backend | Express.js, Mongoose |
| Database | MongoDB Atlas |
| Deployment | Vercel (serverless) |

## Quick Start

```bash
npm run install:all
MONGO_URI="<your-mongo-uri>" npm run seed
npm run dev
```

## Structure

```
api/              Vercel serverless entry
server/           Express app (models, routes, seed)
client/           React app (pages, components, context)
```
