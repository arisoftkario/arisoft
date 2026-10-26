import React from 'react';
import { getServices } from '@/lib/catalogServer';
import { QuoteWizard } from '@/components/home/QuoteWizard';

/** Devis guidé : propose les prestations du catalogue (admin), plus un projet global. */
export async function QuoteSection() {
  const services = (await getServices()).map((s) => s.title);
  return <QuoteWizard services={[...services, 'Projet global sur mesure']} />;
}
