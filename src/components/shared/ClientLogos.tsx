import React from 'react';
import { getClients } from '@/lib/catalogServer';
import { ClientCarousel } from '@/components/shared/ClientCarousel';

/** Entreprises qui font confiance à ARISOFT : grille jusqu'à 3, diaporama au-delà. */
export async function ClientLogos() {
  const clients = await getClients();
  return <ClientCarousel clients={clients} />;
}
