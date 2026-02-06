import { useDashboardStore } from '../../store/dashboardStore';
import type { Period } from '../../types/api';
import styles from './PeriodSelector.module.css';

const periods: { label: string; value: Period }[] = [
  { label: '7d', value: '7d' },
  { label: '30d', value: '30d' },
  { label: '90d', value: '90d' },
  { label: '1y', value: '1y' },
];

export const PeriodSelector = () => {
  const { selectedPeriod, setSelectedPeriod } = useDashboardStore();

  return (
    <div className={styles.periodSelector}>
      {periods.map((period) => (
        <button
          key={period.value}
          onClick={() => setSelectedPeriod(period.value)}
          className={`${styles.periodBtn} ${selectedPeriod === period.value ? styles.active : ''}`}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
};
