import React from 'react';
import {
  LayoutDashboard,
  Globe,
  Smartphone,
  Cctv,
  Network,
  ShieldCheck,
  Headphones,
  Shirt,
  Printer,
  Wrench,
  Server,
  Wifi,
  Database,
  Cloud,
  Camera,
  GraduationCap,
  Zap,
  Monitor,
  type LucideIcon,
} from 'lucide-react';

/** Icônes proposées dans l'admin pour un service du catalogue. */
export const SERVICE_ICONS: Record<string, { Icon: LucideIcon; label: string }> = {
  LayoutDashboard: { Icon: LayoutDashboard, label: 'Logiciel' },
  Globe: { Icon: Globe, label: 'Site web' },
  Smartphone: { Icon: Smartphone, label: 'Mobile' },
  Cctv: { Icon: Cctv, label: 'Caméra' },
  Network: { Icon: Network, label: 'Réseau' },
  ShieldCheck: { Icon: ShieldCheck, label: 'Sécurité' },
  Headphones: { Icon: Headphones, label: 'Assistance' },
  Shirt: { Icon: Shirt, label: 'Textile' },
  Printer: { Icon: Printer, label: 'Impression' },
  Wrench: { Icon: Wrench, label: 'Dépannage' },
  Server: { Icon: Server, label: 'Serveur' },
  Wifi: { Icon: Wifi, label: 'Wi-Fi' },
  Database: { Icon: Database, label: 'Données' },
  Cloud: { Icon: Cloud, label: 'Cloud' },
  Camera: { Icon: Camera, label: 'Photo' },
  GraduationCap: { Icon: GraduationCap, label: 'Formation' },
  Monitor: { Icon: Monitor, label: 'Ordinateur' },
  Zap: { Icon: Zap, label: 'Énergie' },
};

export const ServiceIcon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  const { Icon } = SERVICE_ICONS[name] ?? SERVICE_ICONS.LayoutDashboard;
  return <Icon className={className} aria-hidden="true" />;
};
