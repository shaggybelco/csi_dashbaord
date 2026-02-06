import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PeriodSelector } from './PeriodSelector';
import { useDashboardStore } from '../../store/dashboardStore';

describe('PeriodSelector', () => {
  beforeEach(() => {
    useDashboardStore.setState({ selectedPeriod: '30d' });
  });

  it('renders all period buttons', () => {
    render(<PeriodSelector />);
    expect(screen.getByText('7d')).toBeInTheDocument();
    expect(screen.getByText('30d')).toBeInTheDocument();
    expect(screen.getByText('90d')).toBeInTheDocument();
    expect(screen.getByText('1y')).toBeInTheDocument();
  });

  it('highlights the active period', () => {
    render(<PeriodSelector />);
    const btn30d = screen.getByText('30d');
    expect(btn30d.className).toContain('active');
  });

  it('changes period on click', async () => {
    const user = userEvent.setup();
    render(<PeriodSelector />);

    await user.click(screen.getByText('7d'));
    expect(useDashboardStore.getState().selectedPeriod).toBe('7d');

    await user.click(screen.getByText('1y'));
    expect(useDashboardStore.getState().selectedPeriod).toBe('1y');
  });
});
