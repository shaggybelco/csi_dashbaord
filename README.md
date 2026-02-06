# Customer Spending Insights Dashboard

A responsive financial dashboard that visualizes customer spending data, built with React 19 and TypeScript. Features interactive charts, transaction tables, spending category breakdowns, budget goal tracking, and a light/dark mode toggle.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite 7
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React
- **Styling**: CSS Modules with CSS Custom Properties
- **Testing**: Vitest, React Testing Library
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

## Testing

Tests are written with [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### What's tested

| Area | File | Coverage |
|------|------|----------|
| Formatters | `src/utils/formatters.test.ts` | Currency, date, percentage, and month formatting |
| Icons | `src/utils/icons.test.ts` | Icon mapping and fallback behavior |
| API Client | `src/api/customerApi.test.ts` | All endpoints: profile, spending summary, categories, trends, transactions (filtering, sorting, pagination), goals, filters |
| Store | `src/store/dashboardStore.test.ts` | State defaults, setters, theme toggle with localStorage |
| KPICard | `src/components/cards/KPICard.test.tsx` | Rendering with currency, string values, change indicators |
| PeriodSelector | `src/components/layout/PeriodSelector.test.tsx` | Button rendering, active state, click interaction |
| GoalsSection | `src/components/goals/GoalsSection.test.tsx` | Goal rendering, status labels, budget display |

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
│   ├── test/                 # Test setup
│   └── utils/                # Formatters, icon helpers
├── db.json                   # Mock data source
├── docker-compose.yml        # Docker setup
├── Dockerfile                # Multi-stage build (Node + Nginx)
└── nginx.conf                # Nginx configuration
```
