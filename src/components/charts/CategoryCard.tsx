import { formatCurrency } from '../../utils/formatters';
import { getIcon } from '../../utils/icons';
import styles from './CategoryCard.module.css';

interface CategoryCardProps {
  name: string;
  amount: number;
  percentage: number;
  transactionCount: number;
  color: string;
  icon: string;
}

export const CategoryCard = ({
  name,
  amount,
  percentage,
  transactionCount,
  color,
  icon,
}: CategoryCardProps) => {
  const Icon = getIcon(icon);

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardInfo}>
          <div className={styles.iconWrapper} style={{ backgroundColor: `${color}15` }}>
            <Icon size={24} style={{ color }} />
          </div>
          <div className={styles.details}>
            <h3 className={styles.categoryName}>{name}</h3>
            <p className={styles.transactionCount}>{transactionCount} transactions</p>
          </div>
        </div>
        <div className={styles.cardAmount}>
          <div className={styles.amount}>{formatCurrency(amount, 'ZAR')}</div>
          <div className={styles.percentage}>{percentage}%</div>
        </div>
      </div>
    </div>
  );
};
