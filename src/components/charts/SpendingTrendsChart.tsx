import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { customerApi } from '../../api/customerApi';
import { useDashboardStore } from '../../store/dashboardStore';
import type { SpendingTrends } from '../../types/api';
import { formatCurrency, formatMonth } from '../../utils/formatters';
import styles from './SpendingTrendsChart.module.css';
import chartStyles from './Chart.module.css';
import sharedStyles from '../../styles/shared.module.css';

export const SpendingTrendsChart = () => {
  const { customerId } = useDashboardStore();
  const [trends, setTrends] = useState<SpendingTrends | null>(null);
  const [months, setMonths] = useState(12);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    customerApi.getSpendingTrends(customerId, months).then(setTrends);
  }, [customerId, months]);

  useEffect(() => {
    const update = () => setIsSmallScreen(window.innerWidth <= 480);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  if (!trends) return null;

  const data = trends.trends.map((trend) => {
    const label = formatMonth(trend.month);
    return {
      month: isSmallScreen ? label.split(' ')[0] : label,
      amount: trend.totalSpent,
    };
  });

  return (
    <div className={chartStyles.chartContainer}>
      <div className={styles.header}>
        <h2 className={chartStyles.chartTitle}>Monthly Spending Trends</h2>
        <select
          value={months}
          onChange={(e) => setMonths(Number(e.target.value))}
          className={`${sharedStyles.select} ${styles.select}`}
        >
          <option value={6}>Last 6 months</option>
          <option value={12}>Last 12 months</option>
          <option value={18}>Last 18 months</option>
          <option value={24}>Last 24 months</option>
        </select>
      </div>
      <div className={chartStyles.chartLegend}>
        <div className={chartStyles.chartLegendItem}>
          <span className={`${chartStyles.chartLegendSwatch} ${styles.legendSwatch}`} />
          <span className={chartStyles.chartLegendLabel}>Total spent</span>
        </div>
      </div>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
            <XAxis 
              dataKey="month" 
              stroke="#94a3b8"
              fontSize={12}
              angle={isSmallScreen ? 0 : -45}
              textAnchor={isSmallScreen ? 'middle' : 'end'}
              height={isSmallScreen ? 24 : 44}
              interval={isSmallScreen ? Math.max(0, Math.ceil(data.length / 4) - 1) : 0}
            />
            <YAxis 
              stroke="#94a3b8"
              fontSize={12}
              tickFormatter={(value) => `R${(value / 1000).toFixed(0)}k`}
              domain={['dataMin - 300', 'dataMax + 300']}
              padding={{ top: 8, bottom: 8 }}
            />
            <Tooltip
              formatter={(value) => formatCurrency(value as number, 'ZAR')}
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '0.75rem',
                color: '#f1f5f9',
              }}
              labelStyle={{ color: '#cbd5e1' }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ fill: '#6366f1', r: 4, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, fill: '#6366f1' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
