import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, formatDateTime, formatPercentage, formatMonth } from './formatters';

describe('formatCurrency', () => {
  it('formats ZAR currency with two decimal places', () => {
    const result = formatCurrency(1234.5, 'ZAR');
    expect(result).toContain('1');
    expect(result).toContain('234');
    expect(result).toContain('50');
  });

  it('defaults to ZAR when no currency provided', () => {
    const result = formatCurrency(100);
    expect(result).toContain('100');
  });

  it('handles zero', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0');
  });

  it('handles large numbers', () => {
    const result = formatCurrency(185595.64, 'ZAR');
    expect(result).toContain('185');
    expect(result).toContain('595');
  });
});

describe('formatDate', () => {
  it('formats a date string', () => {
    const result = formatDate('2026-01-15T09:00:00Z');
    expect(result).toContain('Jan');
    expect(result).toContain('2026');
  });
});

describe('formatDateTime', () => {
  it('formats a date string with time', () => {
    const result = formatDateTime('2026-01-15T09:30:00Z');
    expect(result).toContain('Jan');
    expect(result).toContain('2026');
  });
});

describe('formatPercentage', () => {
  it('formats positive percentage with + sign', () => {
    expect(formatPercentage(12.5)).toBe('+12.5%');
  });

  it('formats negative percentage', () => {
    expect(formatPercentage(-3.2)).toBe('-3.2%');
  });

  it('formats zero', () => {
    expect(formatPercentage(0)).toBe('0.0%');
  });
});

describe('formatMonth', () => {
  it('formats month string to readable format', () => {
    const result = formatMonth('2025-06');
    expect(result).toContain('Jun');
    expect(result).toContain('2025');
  });
});
