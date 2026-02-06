import { LucideIcon } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import styles from './KPICard.module.css';

interface KPICardProps {
  title: string;
  value: number | string;
  change?: number;
  icon: LucideIcon;
  currency?: string;
}

export const KPICard = ({ title, value, change, icon: Icon, currency }: KPICardProps) => {
  const displayValue = typeof value === 'number' && currency
    ? formatCurrency(value, currency)
    : value;

  return (
    <div className={styles.kpiCard}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <div className={styles.icon}>
          <Icon size={20} />
        </div>
      </div>
      <div className={styles.value}>{displayValue}</div>
      {change !== undefined && (
        <div className={`${styles.change} ${change >= 0 ? styles.positive : styles.negative}`}>
          {formatPercentage(change)} vs previous period
        </div>
      )}
    </div>
  );
};
