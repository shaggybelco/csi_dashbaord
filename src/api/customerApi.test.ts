import { describe, it, expect } from 'vitest';
import { customerApi } from './customerApi';

describe('customerApi', () => {
  describe('getCustomers', () => {
    it('returns a list with one customer', async () => {
      const result = await customerApi.getCustomers();
      expect(result.customers).toHaveLength(1);
      expect(result.customers[0].customerId).toBe('12345');
    });
  });

  describe('getProfile', () => {
    it('returns the customer profile', async () => {
      const profile = await customerApi.getProfile('12345');
      expect(profile.customerId).toBe('12345');
      expect(profile.name).toBe('John Doe');
      expect(profile.email).toBe('john.doe@email.com');
      expect(profile.currency).toBe('ZAR');
    });
  });

  describe('getSpendingSummary', () => {
    it('returns a spending summary with required fields', async () => {
      const summary = await customerApi.getSpendingSummary('12345', '1y');
      expect(summary).toHaveProperty('period', '1y');
      expect(summary).toHaveProperty('totalSpent');
      expect(summary).toHaveProperty('transactionCount');
      expect(summary).toHaveProperty('averageTransaction');
      expect(summary).toHaveProperty('topCategory');
      expect(summary).toHaveProperty('comparedToPrevious');
      expect(typeof summary.totalSpent).toBe('number');
      expect(summary.transactionCount).toBeGreaterThan(0);
    });

    it('defaults to 30d period', async () => {
      const summary = await customerApi.getSpendingSummary('12345');
      expect(summary.period).toBe('30d');
    });

    it('computes average correctly', async () => {
      const summary = await customerApi.getSpendingSummary('12345', '1y');
      if (summary.transactionCount > 0) {
        const expectedAvg = Math.round((summary.totalSpent / summary.transactionCount) * 100) / 100;
        expect(summary.averageTransaction).toBe(expectedAvg);
      }
    });
  });

  describe('getSpendingByCategory', () => {
    it('returns categories sorted by amount descending', async () => {
      const result = await customerApi.getSpendingByCategory('12345', '1y');
      expect(result.categories.length).toBeGreaterThan(0);
      for (let i = 1; i < result.categories.length; i++) {
        expect(result.categories[i - 1].amount).toBeGreaterThanOrEqual(result.categories[i].amount);
      }
    });

    it('returns date range', async () => {
      const result = await customerApi.getSpendingByCategory('12345', '30d');
      expect(result.dateRange).toHaveProperty('startDate');
      expect(result.dateRange).toHaveProperty('endDate');
    });

    it('category percentages sum to approximately 100', async () => {
      const result = await customerApi.getSpendingByCategory('12345', '1y');
      const totalPercentage = result.categories.reduce((sum, c) => sum + c.percentage, 0);
      expect(totalPercentage).toBeGreaterThan(99);
      expect(totalPercentage).toBeLessThan(101);
    });

    it('supports custom date range', async () => {
      const result = await customerApi.getSpendingByCategory('12345', '30d', '2026-01-01', '2026-01-31');
      expect(result.dateRange.startDate).toBe('2026-01-01');
      expect(result.dateRange.endDate).toBe('2026-01-31');
      expect(result.categories.length).toBeGreaterThan(0);
    });
  });

  describe('getSpendingTrends', () => {
    it('returns 12 months of trends by default', async () => {
      const result = await customerApi.getSpendingTrends('12345');
      expect(result.trends).toHaveLength(12);
    });

    it('respects the months parameter', async () => {
      const result = await customerApi.getSpendingTrends('12345', 6);
      expect(result.trends).toHaveLength(6);
    });

    it('caps at 24 months', async () => {
      const result = await customerApi.getSpendingTrends('12345', 100);
      expect(result.trends.length).toBeLessThanOrEqual(24);
    });

    it('each trend has required fields', async () => {
      const result = await customerApi.getSpendingTrends('12345');
      result.trends.forEach((trend) => {
        expect(trend).toHaveProperty('month');
        expect(trend).toHaveProperty('totalSpent');
        expect(trend).toHaveProperty('transactionCount');
        expect(trend).toHaveProperty('averageTransaction');
      });
    });
  });

  describe('getTransactions', () => {
    it('returns paginated transactions', async () => {
      const result = await customerApi.getTransactions('12345');
      expect(result.transactions.length).toBeLessThanOrEqual(20);
      expect(result.pagination).toHaveProperty('total');
      expect(result.pagination).toHaveProperty('limit', 20);
      expect(result.pagination).toHaveProperty('offset', 0);
      expect(result.pagination).toHaveProperty('hasMore');
    });

    it('respects limit parameter', async () => {
      const result = await customerApi.getTransactions('12345', { limit: 5 });
      expect(result.transactions).toHaveLength(5);
      expect(result.pagination.limit).toBe(5);
    });

    it('caps limit at 100', async () => {
      const result = await customerApi.getTransactions('12345', { limit: 200 });
      expect(result.pagination.limit).toBe(100);
    });

    it('filters by category', async () => {
      const result = await customerApi.getTransactions('12345', { category: 'Groceries' });
      result.transactions.forEach((t) => {
        expect(t.category).toBe('Groceries');
      });
    });

    it('sorts by date descending by default', async () => {
      const result = await customerApi.getTransactions('12345', { limit: 10 });
      for (let i = 1; i < result.transactions.length; i++) {
        const prev = new Date(result.transactions[i - 1].date).getTime();
        const curr = new Date(result.transactions[i].date).getTime();
        expect(prev).toBeGreaterThanOrEqual(curr);
      }
    });

    it('sorts by amount ascending', async () => {
      const result = await customerApi.getTransactions('12345', { sortBy: 'amount_asc', limit: 50 });
      for (let i = 1; i < result.transactions.length; i++) {
        expect(result.transactions[i].amount).toBeGreaterThanOrEqual(result.transactions[i - 1].amount);
      }
    });

    it('sorts by amount descending', async () => {
      const result = await customerApi.getTransactions('12345', { sortBy: 'amount_desc', limit: 50 });
      for (let i = 1; i < result.transactions.length; i++) {
        expect(result.transactions[i].amount).toBeLessThanOrEqual(result.transactions[i - 1].amount);
      }
    });

    it('paginates with offset', async () => {
      const page1 = await customerApi.getTransactions('12345', { limit: 5, offset: 0 });
      const page2 = await customerApi.getTransactions('12345', { limit: 5, offset: 5 });
      expect(page1.transactions[0].id).not.toBe(page2.transactions[0].id);
    });

    it('hasMore is false on last page', async () => {
      const all = await customerApi.getTransactions('12345', { limit: 100, offset: 100 });
      expect(all.pagination.hasMore).toBe(false);
    });

    it('filters by date range', async () => {
      const result = await customerApi.getTransactions('12345', {
        startDate: '2026-01-01',
        endDate: '2026-01-31',
        limit: 100,
      });
      result.transactions.forEach((t) => {
        const d = new Date(t.date);
        expect(d.getFullYear()).toBe(2026);
        expect(d.getMonth()).toBe(0); // January
      });
    });
  });

  describe('getGoals', () => {
    it('returns goals array', async () => {
      const result = await customerApi.getGoals('12345');
      expect(result.goals.length).toBeGreaterThan(0);
      result.goals.forEach((goal) => {
        expect(goal).toHaveProperty('id');
        expect(goal).toHaveProperty('category');
        expect(goal).toHaveProperty('monthlyBudget');
        expect(goal).toHaveProperty('currentSpent');
        expect(goal).toHaveProperty('status');
        expect(['on_track', 'warning']).toContain(goal.status);
      });
    });
  });

  describe('getFilters', () => {
    it('returns categories and date range presets', async () => {
      const result = await customerApi.getFilters('12345');
      expect(result.categories.length).toBeGreaterThan(0);
      expect(result.dateRangePresets.length).toBeGreaterThan(0);
      result.categories.forEach((cat) => {
        expect(cat).toHaveProperty('name');
        expect(cat).toHaveProperty('color');
        expect(cat).toHaveProperty('icon');
      });
    });
  });
});
