import { describe, it, expect } from 'vitest';
import { ShoppingCart, Film, Car, Utensils, ShoppingBag, Zap } from 'lucide-react';
import { getIcon, iconMap } from './icons';

describe('iconMap', () => {
  it('maps all expected icon names', () => {
    expect(iconMap['shopping-cart']).toBe(ShoppingCart);
    expect(iconMap['film']).toBe(Film);
    expect(iconMap['car']).toBe(Car);
    expect(iconMap['utensils']).toBe(Utensils);
    expect(iconMap['shopping-bag']).toBe(ShoppingBag);
    expect(iconMap['zap']).toBe(Zap);
  });
});

describe('getIcon', () => {
  it('returns the correct icon for a known name', () => {
    expect(getIcon('film')).toBe(Film);
    expect(getIcon('car')).toBe(Car);
  });

  it('returns ShoppingCart as fallback for unknown icon names', () => {
    expect(getIcon('unknown')).toBe(ShoppingCart);
    expect(getIcon('')).toBe(ShoppingCart);
  });
});
