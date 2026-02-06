import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { customerApi } from '../../api/customerApi';
import { useDashboardStore } from '../../store/dashboardStore';
import type { SpendingByCategory } from '../../types/api';
import { formatDate } from '../../utils/formatters';
import { CategoryCard } from './CategoryCard';
import chartStyles from './Chart.module.css';
import sharedStyles from '../../styles/shared.module.css';
import styles from './CategoryBreakdownChart.module.css';

export const CategoryBreakdownChart = () => {
  const { customerId, selectedPeriod } = useDashboardStore();
  const [categoryData, setCategoryData] = useState<SpendingByCategory | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [useCustomRange, setUseCustomRange] = useState(false);

  useEffect(() => {
    const start = useCustomRange && startDate ? startDate : undefined;
    const end = useCustomRange && endDate ? endDate : undefined;

    customerApi.getSpendingByCategory(
      customerId,
      selectedPeriod,
      start,
      end
    ).then(setCategoryData);
  }, [customerId, selectedPeriod, startDate, endDate, useCustomRange]);

  if (!categoryData) return null;

  const handleApplyCustomRange = () => {
    if (startDate && endDate) {
      setUseCustomRange(true);
    }
  };

  const handleClearCustomRange = () => {
    setStartDate('');
    setEndDate('');
    setUseCustomRange(false);
  };

  return (
    <div className={chartStyles.chartContainer}>
      <div className={styles.header}>
        <h2 className={chartStyles.chartTitle}>Spending by Category</h2>

        <div className={chartStyles.chartDateFilter}>
          <div className={chartStyles.dateFilterHeader}>
            <Calendar size={16} />
            <span>Filter Period</span>
          </div>
          <div className={chartStyles.dateFilterInputs}>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={chartStyles.dateInputSmall}
              placeholder="Start Date"
            />
            <span style={{ color: 'var(--text-muted)' }}>to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={chartStyles.dateInputSmall}
              placeholder="End Date"
            />
            <button
              onClick={handleApplyCustomRange}
              className={`${sharedStyles.btnSmall} ${sharedStyles.btnPrimary}`}
              disabled={!startDate || !endDate}
            >
              Apply
            </button>
            {useCustomRange && (
              <button onClick={handleClearCustomRange} className={`${sharedStyles.btnSmall} ${sharedStyles.btnSecondary}`}>
                Clear
              </button>
            )}
          </div>
        </div>

        {categoryData && (
          <div className={styles.dateRange}>
            {formatDate(categoryData.dateRange.startDate)} - {formatDate(categoryData.dateRange.endDate)}
          </div>
        )}
      </div>

      <div className={styles.categoriesGrid}>
        {categoryData.categories
          .slice()
          .sort((a, b) => b.amount - a.amount)
          .map((cat) => (
            <CategoryCard
              key={cat.name}
              name={cat.name}
              amount={cat.amount}
              percentage={cat.percentage}
              transactionCount={cat.transactionCount}
              color={cat.color}
              icon={cat.icon}
            />
          ))}
      </div>
    </div>
  );
};
