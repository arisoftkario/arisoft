import React from 'react';
import {
  ShoppingCart,
  Users,
  Building,
  UtensilsCrossed,
  Hotel,
  GraduationCap,
  Hospital,
  HardHat,
  Zap,
  type LucideIcon,
} from 'lucide-react';

const MODULE_ICONS: Record<string, LucideIcon> = {
  commerce: ShoppingCart,
  rh: Users,
  ong: Building,
  restaurant: UtensilsCrossed,
  hotellerie: Hotel,
  ecoles: GraduationCap,
  hopitaux: Hospital,
  btp: HardHat,
};

/** Icône d'un module du logiciel de gestion (identifiant du module). */
export const ModuleIcon: React.FC<{ id: string; className?: string }> = ({ id, className }) => {
  const Icon = MODULE_ICONS[id] ?? Zap;
  return <Icon className={className} aria-hidden="true" />;
};
