import { useEffect, useState } from 'react';
import { Banknote, ShoppingCart, TrendingUp, Tag } from 'lucide-react';
import { customerApi } from '../../api/customerApi';
import { useDashboardStore } from '../../store/dashboardStore';
import type { SpendingSummary } from '../../types/api';
import { KPICard } from './KPICard';
import styles from '../../pages/Dashboard.module.css';

export const KPIOverview = () => {
  const { customerId, selectedPeriod } = useDashboardStore();
  const [summary, setSummary] = useState<SpendingSummary | null>(null);

  useEffect(() => {
    customerApi.getSpendingSummary(customerId, selectedPeriod).then(setSummary);
  }, [customerId, selectedPeriod]);

  if (!summary) return null;

  return (
    <div className={styles.kpiGrid}>
      <KPICard
        title="Total Spent"
        value={summary.totalSpent}
        change={summary.comparedToPrevious.spentChange}
        icon={Banknote}
        currency="ZAR"
      />
      <KPICard
        title="Transactions"
        value={summary.transactionCount}
        change={summary.comparedToPrevious.transactionChange}
        icon={ShoppingCart}
      />
      <KPICard
        title="Average Transaction"
        value={summary.averageTransaction}
        icon={TrendingUp}
        currency="ZAR"
      />
      <KPICard
        title="Top Category"
        value={summary.topCategory}
        icon={Tag}
      />
    </div>
  );
};
