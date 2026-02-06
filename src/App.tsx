import { useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { DashboardHeader } from './components/layout/DashboardHeader';
import { Dashboard } from './pages/Dashboard';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { useDashboardStore } from './store/dashboardStore';
import './styles/variables.css';
import './styles/global.css';

function App() {
  const { theme, toggleTheme } = useDashboardStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ErrorBoundary>
      <div className="app">
        <DashboardHeader />
        <Dashboard />
        <button
          className="mobileThemeToggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </ErrorBoundary>
  );
}

export default App;
