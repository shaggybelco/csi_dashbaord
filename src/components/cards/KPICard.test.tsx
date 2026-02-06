import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Banknote, ShoppingCart } from 'lucide-react';
import { KPICard } from './KPICard';

describe('KPICard', () => {
  it('renders title and string value', () => {
    render(<KPICard title="Top Category" value="Groceries" icon={ShoppingCart} />);
    expect(screen.getByText('Top Category')).toBeInTheDocument();
    expect(screen.getByText('Groceries')).toBeInTheDocument();
  });

  it('renders formatted currency when currency prop is provided', () => {
    render(<KPICard title="Total Spent" value={1234.5} icon={Banknote} currency="ZAR" />);
    expect(screen.getByText('Total Spent')).toBeInTheDocument();
    const valueEl = screen.getByText(/1.*234/);
    expect(valueEl).toBeInTheDocument();
  });

  it('renders raw number when no currency provided', () => {
    render(<KPICard title="Transactions" value={47} icon={ShoppingCart} />);
    expect(screen.getByText('47')).toBeInTheDocument();
  });

  it('shows positive change', () => {
    render(<KPICard title="Total" value={100} icon={Banknote} change={12.5} />);
    expect(screen.getByText(/\+12\.5%/)).toBeInTheDocument();
  });

  it('shows negative change', () => {
    render(<KPICard title="Total" value={100} icon={Banknote} change={-3.2} />);
    expect(screen.getByText(/-3\.2%/)).toBeInTheDocument();
  });

  it('does not show change when not provided', () => {
    render(<KPICard title="Total" value={100} icon={Banknote} />);
    expect(screen.queryByText(/vs previous period/)).not.toBeInTheDocument();
  });
});
