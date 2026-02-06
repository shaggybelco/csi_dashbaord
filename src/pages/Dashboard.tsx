import { KPIOverview } from '../components/cards/KPIOverview';
import { SpendingTrendsChart } from '../components/charts/SpendingTrendsChart';
import { CategoryBreakdownChart } from '../components/charts/CategoryBreakdownChart';
import { TransactionsTable } from '../components/tables/TransactionsTable';
import { GoalsSection } from '../components/goals/GoalsSection';
import styles from './Dashboard.module.css';
import sharedStyles from '../styles/shared.module.css';

export const Dashboard = () => {
  return (
    <div className={styles.dashboard}>
      <div className={sharedStyles.container}>
        <KPIOverview />
        <CategoryBreakdownChart />

        <div className={styles.dashboardLayout}>
          <div className={styles.dashboardMain}>
            <SpendingTrendsChart />
            <TransactionsTable />
          </div>
          <div className={styles.dashboardSide}>
            <GoalsSection />
          </div>
        </div>
      </div>
    </div>
  );
};
