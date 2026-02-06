import {
  ShoppingCart,
  Film,
  Car,
  Utensils,
  ShoppingBag,
  Zap,
  LucideIcon,
} from 'lucide-react';

export const iconMap: Record<string, LucideIcon> = {
  'shopping-cart': ShoppingCart,
  'film': Film,
  'car': Car,
  'utensils': Utensils,
  'shopping-bag': ShoppingBag,
  'zap': Zap,
};

export const getIcon = (iconName: string): LucideIcon => {
  return iconMap[iconName] || ShoppingCart;
};
