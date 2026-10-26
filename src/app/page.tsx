import React from 'react';
import type { Metadata } from 'next';
import { HeroSection } from '@/components/home/HeroSection';
import { ServicesGrid } from '@/components/home/ServicesGrid';
import { AdsSection } from '@/components/home/AdsSection';
import { SoftwareFeature } from '@/components/home/SoftwareFeature';
import { ProjectsSection } from '@/components/home/ProjectsSection';
import { QuoteSection } from '@/components/home/QuoteSection';
import { ProcessSection } from '@/components/home/ProcessSection';
import { FaqSection } from '@/components/home/FaqSection';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { ContactBanner } from '@/components/home/ContactBanner';

export const metadata: Metadata = {
  alternates: { canonical: '/', languages: { fr: '/', sw: '/sw/' } },
};

export default function HomePage() {
  return (
    <>
      {/* 2. Hero (fond marine) */}
      <HeroSection />

      {/* Offres & actualités publiées depuis l'admin (masqué si aucune) */}
      <AdsSection />

      {/* 3. Services (fond #F4F7FB) */}
      <ServicesGrid />

      {/* Devis guidé en 4 clics → message WhatsApp */}
      <QuoteSection />

      {/* 4. Logiciel de gestion (produit phare) */}
      <SoftwareFeature />

      {/* 5. Réalisations (fond #F4F7FB) */}
      <ProjectsSection />

      {/* Déroulement d'un projet en 4 étapes (fond marine) */}
      <ProcessSection />

      {/* 6. Pourquoi choisir ARISOFT ? */}
      <WhyChooseUs />

      {/* Avis clients validés depuis l'admin (masqué si aucun) */}
      <TestimonialsSection />

      {/* Questions fréquentes (+ données FAQPage pour Google) */}
      <FaqSection />

      {/* 7. Bloc contact (carte marine arrondie) */}
      <ContactBanner />
    </>
  );
}
