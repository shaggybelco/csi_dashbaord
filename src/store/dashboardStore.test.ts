import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useDashboardStore } from './dashboardStore';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    clear: vi.fn(() => { store = {}; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

describe('dashboardStore', () => {
  beforeEach(() => {
    localStorageMock.clear();
    useDashboardStore.setState({
      customerId: '12345',
      selectedPeriod: '30d',
      customDateRange: null,
      theme: 'light',
    });
  });

  it('has correct default values', () => {
    const state = useDashboardStore.getState();
    expect(state.customerId).toBe('12345');
    expect(state.selectedPeriod).toBe('30d');
    expect(state.customDateRange).toBeNull();
    expect(state.theme).toBe('light');
  });

  it('sets customer ID', () => {
    useDashboardStore.getState().setCustomerId('99999');
    expect(useDashboardStore.getState().customerId).toBe('99999');
  });

  it('sets selected period', () => {
    useDashboardStore.getState().setSelectedPeriod('7d');
    expect(useDashboardStore.getState().selectedPeriod).toBe('7d');

    useDashboardStore.getState().setSelectedPeriod('1y');
    expect(useDashboardStore.getState().selectedPeriod).toBe('1y');
  });

  it('sets custom date range', () => {
    const range = { startDate: '2026-01-01', endDate: '2026-01-31' };
    useDashboardStore.getState().setCustomDateRange(range);
    expect(useDashboardStore.getState().customDateRange).toEqual(range);
  });

  it('clears custom date range', () => {
    useDashboardStore.getState().setCustomDateRange({ startDate: '2026-01-01', endDate: '2026-01-31' });
    useDashboardStore.getState().setCustomDateRange(null);
    expect(useDashboardStore.getState().customDateRange).toBeNull();
  });

  it('toggles theme from light to dark', () => {
    useDashboardStore.getState().toggleTheme();
    expect(useDashboardStore.getState().theme).toBe('dark');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  it('toggles theme from dark to light', () => {
    useDashboardStore.setState({ theme: 'dark' });
    useDashboardStore.getState().toggleTheme();
    expect(useDashboardStore.getState().theme).toBe('light');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
  });

  it('toggles theme back and forth', () => {
    useDashboardStore.getState().toggleTheme();
    expect(useDashboardStore.getState().theme).toBe('dark');
    useDashboardStore.getState().toggleTheme();
    expect(useDashboardStore.getState().theme).toBe('light');
  });
});
