import { useEffect, useState } from 'react';
import { TrendingUp, User, Sun, Moon } from 'lucide-react';
import { PeriodSelector } from './PeriodSelector';
import { customerApi } from '../../api/customerApi';
import { useDashboardStore } from '../../store/dashboardStore';
import type { CustomerProfile } from '../../types/api';
import styles from './DashboardHeader.module.css';
import sharedStyles from '../../styles/shared.module.css';

export const DashboardHeader = () => {
  const { customerId, theme, toggleTheme } = useDashboardStore();
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);

  useEffect(() => {
    customerApi.getProfile(customerId).then(setCustomer);
  }, [customerId]);

  return (
    <header className={styles.header}>
      <div className={sharedStyles.container}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <TrendingUp size={32} />
            <h1>Customer Spending Insights</h1>
          </div>

          <div className={styles.headerControls}>
            {customer && (
              <div className={styles.customerInfo}>
                <User size={18} />
                <span className={styles.customerName}>{customer.name}</span>
              </div>
            )}
            <button
              className={styles.themeToggle}
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <PeriodSelector />
          </div>
        </div>
      </div>
    </header>
  );
};
