import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { GoalsSection } from './GoalsSection';
import { useDashboardStore } from '../../store/dashboardStore';

describe('GoalsSection', () => {
  beforeEach(() => {
    useDashboardStore.setState({ customerId: '12345' });
  });

  it('renders budget goals heading', async () => {
    render(<GoalsSection />);
    await waitFor(() => {
      expect(screen.getByText('Budget Goals')).toBeInTheDocument();
    });
  });

  it('renders goal categories', async () => {
    render(<GoalsSection />);
    await waitFor(() => {
      expect(screen.getByText('Entertainment')).toBeInTheDocument();
      expect(screen.getByText('Groceries')).toBeInTheDocument();
    });
  });

  it('shows days remaining', async () => {
    render(<GoalsSection />);
    await waitFor(() => {
      const daysElements = screen.getAllByText(/days remaining/);
      expect(daysElements.length).toBeGreaterThan(0);
    });
  });

  it('shows On Track and Near Limit statuses', async () => {
    render(<GoalsSection />);
    await waitFor(() => {
      expect(screen.getByText('On Track')).toBeInTheDocument();
      expect(screen.getByText('Near Limit')).toBeInTheDocument();
    });
  });
});
