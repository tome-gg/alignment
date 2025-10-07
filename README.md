# Tome.gg Alignment

A growth journal visualization app that displays training entries and evaluation scores from GitHub repositories.

## Features

- 📅 Interactive calendar heatmap visualization using D3.js
- 📊 Daily standup (DSU) entry tracking with evaluation scores
- 📱 Responsive design with mobile dropdown fallback
- 🔄 Real-time data fetching from public GitHub repositories
- 📈 Progress tracking with dimension-based scoring

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and provide repository parameters via URL:

```
?source=github.com/username/repo&training=training.yaml&eval=eval.yaml
```

## Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **UI**: Material-UI (MUI)
- **Data Viz**: D3.js
- **Data Fetching**: SWR
- **Format**: YAML for training/evaluation data

## Project Structure

- `/src/app` - Next.js pages and main calendar component
- `/src/services` - GitHub repository data fetching service
- `/src/hooks` - React hooks for data management
- `/src/types` - TypeScript interfaces
- `/public` - Static assets and growth visualization images

See [CALENDAR_INTEGRATION.md](./CALENDAR_INTEGRATION.md) for calendar component details.
