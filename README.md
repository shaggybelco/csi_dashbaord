# Customer Spending Insights Dashboard

A responsive financial dashboard that visualizes customer spending data, built with React 19 and TypeScript. Features interactive charts, transaction tables, spending category breakdowns, budget goal tracking, and a light/dark mode toggle.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite 7
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React
- **Styling**: CSS Modules with CSS Custom Properties
- **Containerization**: Docker, Nginx

## Prerequisites

- **Docker** (recommended): Docker Engine 20+ and Docker Compose v2+
- **Without Docker**: Node.js 20+, npm 9+

## Running with Docker

```bash
# Build and start the application
docker compose up --build

# Run in detached mode
docker compose up --build -d

# Stop the application
docker compose down
```

Once running, open [http://localhost](http://localhost) in your browser.

## Running without Docker

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Once running, open [http://localhost:5173](http://localhost:5173) in your browser.

### Other scripts

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Lint the codebase
npm run lint
```

## Project Structure

```
csi-dashboard/
├── src/
│   ├── api/                  # API client with embedded mock data
│   ├── components/
│   │   ├── cards/            # KPI cards
│   │   ├── charts/           # Chart components (trends, categories)
│   │   ├── common/           # Shared components (ErrorBoundary)
│   │   ├── filters/          # Date range filter
│   │   ├── goals/            # Budget goals section
│   │   ├── layout/           # Header, period selector
│   │   └── tables/           # Transactions table
│   ├── pages/                # Dashboard page
│   ├── store/                # Zustand state management
│   ├── styles/               # Global styles, CSS variables
│   ├── types/                # TypeScript type definitions
│   └── utils/                # Formatters, icon helpers
├── db.json                   # Mock data source
├── docker-compose.yml        # Docker setup
├── Dockerfile                # Multi-stage build (Node + Nginx)
└── nginx.conf                # Nginx configuration
```
