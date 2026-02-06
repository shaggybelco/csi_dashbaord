import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { customerApi } from '../../api/customerApi';
import { useDashboardStore } from '../../store/dashboardStore';
import type { GoalsResponse } from '../../types/api';
import { formatCurrency } from '../../utils/formatters';
import styles from './GoalsSection.module.css';

export const GoalsSection = () => {
  const { customerId } = useDashboardStore();
  const [goalsData, setGoalsData] = useState<GoalsResponse | null>(null);

  useEffect(() => {
    customerApi.getGoals(customerId).then(setGoalsData);
  }, [customerId]);

  if (!goalsData) return null;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Budget Goals</h2>

      <div className={styles.goalsList}>
        {goalsData.goals.map((goal) => {
          const isWarning = goal.status === 'warning';
          const remaining = goal.monthlyBudget - goal.currentSpent;

          return (
            <div key={goal.id} className={styles.goalItem}>
              <div className={styles.goalHeader}>
                <div className={styles.goalTitle}>
                  <span>{goal.category}</span>
                  {isWarning ? <AlertCircle size={18} color="#f59e0b" /> : <CheckCircle size={18} color="#10b981" />}
                </div>
                <div className={styles.goalAmounts}>
                  <div className={styles.goalSpent}>
                    {formatCurrency(goal.currentSpent, 'ZAR')} / {formatCurrency(goal.monthlyBudget, 'ZAR')}
                  </div>
                  <div className={styles.goalDays}>{goal.daysRemaining} days remaining</div>
                </div>
              </div>

              <div className={styles.progressBar}>
                <div
                  className={`${styles.progressFill} ${isWarning ? styles.warning : ''}`}
                  style={{ width: `${Math.min(goal.percentageUsed, 100)}%` }}
                />
              </div>

              <div className={styles.goalFooter}>
                <div className={`${styles.goalRemaining} ${remaining > 0 ? styles.positive : styles.negative}`}>
                  {remaining > 0 ? (
                    <span>{formatCurrency(remaining, 'ZAR')} remaining</span>
                  ) : (
                    <span>{formatCurrency(Math.abs(remaining), 'ZAR')} over budget</span>
                  )}
                </div>
                <span className={`${styles.goalStatus} ${isWarning ? styles.warning : styles.onTrack}`}>
                  {isWarning ? 'Near Limit' : 'On Track'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
