import type {
  CustomerProfile,
  CustomerListResponse,
  SpendingSummary,
  SpendingByCategory,
  SpendingTrends,
  TransactionsResponse,
  GoalsResponse,
  FiltersResponse,
  Period,
  SortBy,
  Transaction,
} from '../types/api';
import db from '../../db.json';

const profile = db.profile as CustomerProfile;
const transactions = db.transactions as Transaction[];
const trends = db.trends as SpendingTrends['trends'];
const goals = db.goals as GoalsResponse['goals'];
const filters = db.filters as FiltersResponse;

function getDateRangeForPeriod(period: Period): { startDate: Date; endDate: Date } {
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);
  const startDate = new Date(endDate);

  switch (period) {
    case '7d': startDate.setDate(startDate.getDate() - 7); break;
    case '30d': startDate.setDate(startDate.getDate() - 30); break;
    case '90d': startDate.setDate(startDate.getDate() - 90); break;
    case '1y': startDate.setFullYear(startDate.getFullYear() - 1); break;
  }

  startDate.setHours(0, 0, 0, 0);
  return { startDate, endDate };
}

function filterByDateRange(txns: Transaction[], start: Date, end: Date): Transaction[] {
  return txns.filter(t => {
    const d = new Date(t.date);
    return d >= start && d <= end;
  });
}

export const customerApi = {
  async getCustomers(): Promise<CustomerListResponse> {
    return { customers: [profile] };
  },

  async getProfile(_customerId: string): Promise<CustomerProfile> {
    return profile;
  },

  async getSpendingSummary(_customerId: string, period: Period = '30d'): Promise<SpendingSummary> {
    const { startDate, endDate } = getDateRangeForPeriod(period);
    const filtered = filterByDateRange(transactions, startDate, endDate);

    const totalSpent = filtered.reduce((sum, t) => sum + t.amount, 0);
    const transactionCount = filtered.length;
    const averageTransaction = transactionCount > 0 ? totalSpent / transactionCount : 0;

    const categoryTotals: Record<string, number> = {};
    filtered.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });
    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    return {
      period,
      totalSpent: Math.round(totalSpent * 100) / 100,
      transactionCount,
      averageTransaction: Math.round(averageTransaction * 100) / 100,
      topCategory,
      comparedToPrevious: { spentChange: 12.5, transactionChange: -3.2 },
    };
  },

  async getSpendingByCategory(
    _customerId: string,
    period: Period = '30d',
    customStartDate?: string,
    customEndDate?: string,
  ): Promise<SpendingByCategory> {
    let startDate: Date;
    let endDate: Date;

    if (customStartDate && customEndDate) {
      startDate = new Date(customStartDate);
      endDate = new Date(customEndDate);
      endDate.setHours(23, 59, 59, 999);
    } else {
      const range = getDateRangeForPeriod(period);
      startDate = range.startDate;
      endDate = range.endDate;
    }

    const filtered = filterByDateRange(transactions, startDate, endDate);
    const categoryData: Record<string, { amount: number; count: number; color: string; icon: string }> = {};
    let totalAmount = 0;

    filtered.forEach(t => {
      if (!categoryData[t.category]) {
        categoryData[t.category] = { amount: 0, count: 0, color: t.categoryColor, icon: t.icon };
      }
      categoryData[t.category].amount += t.amount;
      categoryData[t.category].count += 1;
      totalAmount += t.amount;
    });

    const categories = Object.entries(categoryData)
      .map(([name, data]) => ({
        name,
        amount: Math.round(data.amount * 100) / 100,
        percentage: totalAmount > 0 ? Math.round((data.amount / totalAmount) * 1000) / 10 : 0,
        transactionCount: data.count,
        color: data.color,
        icon: data.icon,
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      dateRange: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      },
      totalAmount: Math.round(totalAmount * 100) / 100,
      categories,
    };
  },

  async getSpendingTrends(_customerId: string, months: number = 12): Promise<SpendingTrends> {
    return { trends: trends.slice(-Math.min(months, 24)) };
  },

  async getTransactions(
    _customerId: string,
    params?: {
      limit?: number;
      offset?: number;
      category?: string;
      startDate?: string;
      endDate?: string;
      sortBy?: SortBy;
    },
  ): Promise<TransactionsResponse> {
    const limit = Math.min(params?.limit || 20, 100);
    const offset = params?.offset || 0;

    let filtered = [...transactions];

    if (params?.category) {
      filtered = filtered.filter(t => t.category === params.category);
    }
    if (params?.startDate) {
      const sd = new Date(params.startDate);
      filtered = filtered.filter(t => new Date(t.date) >= sd);
    }
    if (params?.endDate) {
      const ed = new Date(params.endDate);
      ed.setHours(23, 59, 59, 999);
      filtered = filtered.filter(t => new Date(t.date) <= ed);
    }

    switch (params?.sortBy || 'date_desc') {
      case 'date_asc': filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); break;
      case 'amount_desc': filtered.sort((a, b) => b.amount - a.amount); break;
      case 'amount_asc': filtered.sort((a, b) => a.amount - b.amount); break;
      default: filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    const total = filtered.length;
    const paged = filtered.slice(offset, offset + limit);

    return {
      transactions: paged,
      pagination: { total, limit, offset, hasMore: offset + limit < total },
    };
  },

  async getGoals(_customerId: string): Promise<GoalsResponse> {
    return { goals };
  },

  async getFilters(_customerId: string): Promise<FiltersResponse> {
    return filters;
  },
};
