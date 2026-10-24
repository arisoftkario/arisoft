import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { ServicesGrid } from '@/components/home/ServicesGrid';
import { SoftwareFeature } from '@/components/home/SoftwareFeature';
import { ProjectsSection } from '@/components/home/ProjectsSection';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { ContactBanner } from '@/components/home/ContactBanner';

export default function HomePage() {
  return (
    <>
      {/* 2. Hero (fond marine) */}
      <HeroSection />

      {/* 3. Services (fond #F4F7FB) */}
      <ServicesGrid />

      {/* 4. Logiciel de gestion (produit phare) */}
      <SoftwareFeature />

      {/* 5. Réalisations (fond #F4F7FB) */}
      <ProjectsSection />

      {/* 6. Pourquoi choisir ARISOFT ? */}
      <WhyChooseUs />

      {/* 7. Bloc contact (carte marine arrondie) */}
      <ContactBanner />
    </>
  );
}
