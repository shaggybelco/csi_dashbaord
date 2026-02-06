import { create } from 'zustand';
import type { Period } from '../types/api';

interface DateRange {
  startDate: string;
  endDate: string;
}

type Theme = 'light' | 'dark';

interface DashboardState {
  customerId: string;
  selectedPeriod: Period;
  customDateRange: DateRange | null;
  theme: Theme;
  setCustomerId: (customerId: string) => void;
  setSelectedPeriod: (period: Period) => void;
  setCustomDateRange: (range: DateRange | null) => void;
  toggleTheme: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  customerId: '12345',
  selectedPeriod: '30d',
  customDateRange: null,
  theme: (localStorage.getItem('theme') as Theme) || 'light',
  setCustomerId: (customerId) => set({ customerId }),
  setSelectedPeriod: (period) => set({ selectedPeriod: period }),
  setCustomDateRange: (range) => set({ customDateRange: range }),
  toggleTheme: () =>
    set((state) => {
      const next: Theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      return { theme: next };
    }),
}));
