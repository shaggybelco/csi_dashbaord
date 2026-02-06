import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { customerApi } from '../../api/customerApi';
import { useDashboardStore } from '../../store/dashboardStore';
import type { TransactionsResponse, SortBy } from '../../types/api';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { getIcon } from '../../utils/icons';
import styles from './TransactionsTable.module.css';

export const TransactionsTable = () => {
  const { customerId, customDateRange } = useDashboardStore();
  const [data, setData] = useState<TransactionsResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortBy>('date_desc');
  const limit = 10;

  const categories = ['Groceries', 'Entertainment', 'Transportation', 'Dining', 'Shopping', 'Utilities'];

  useEffect(() => {
    customerApi
      .getTransactions(customerId, {
        limit,
        offset: (currentPage - 1) * limit,
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        startDate: customDateRange?.startDate,
        endDate: customDateRange?.endDate,
        sortBy,
      })
      .then(setData);
  }, [customerId, currentPage, selectedCategory, sortBy, customDateRange]);

  if (!data) return null;

  const totalPages = Math.ceil(data.pagination.total / limit);

  return (
    <div className={styles.container}>
      <div className={styles.tableHeader}>
        <h2 className={styles.title}>Recent Transactions</h2>
        <div className={styles.controls}>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className={styles.select}
          >
            <option value="all">All Categories</option>
            {categories.map((cat: string) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className={styles.select}
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="amount_desc">Highest Amount</option>
            <option value="amount_asc">Lowest Amount</option>
          </select>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Merchant</th>
              <th>Category</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.transactions.map((transaction) => {
              const Icon = getIcon(transaction.icon);
              return (
                <tr key={transaction.id}>
                  <td>{formatDateTime(transaction.date)}</td>
                  <td>
                    <div className={styles.merchantCell}>
                      <div className={styles.merchantIcon} style={{ backgroundColor: `${transaction.categoryColor}20` }}>
                        <Icon size={18} style={{ color: transaction.categoryColor }} />
                      </div>
                      <div>
                        <div className={styles.merchantName}>{transaction.merchant}</div>
                        <div className={styles.paymentMethod}>{transaction.paymentMethod}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={styles.categoryBadge} style={{
                      backgroundColor: `${transaction.categoryColor}20`,
                      color: transaction.categoryColor,
                    }}>
                      {transaction.category}
                    </span>
                  </td>
                  <td className={styles.amountCell}>
                    {formatCurrency(transaction.amount, 'ZAR')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <div className={styles.paginationInfo}>
          Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, data.pagination.total)} of{' '}
          {data.pagination.total} transactions
        </div>
        <div className={styles.paginationControls}>
          <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className={`${styles.btn} ${styles.btnIcon}`}>
            <ChevronLeft size={18} />
          </button>
          <span className={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage >= totalPages} className={`${styles.btn} ${styles.btnIcon}`}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
