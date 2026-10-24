'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';
import { companyInfo } from '@/data/content';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <aside aria-label="Contact rapide" className="fixed bottom-5 right-5 z-50">
      <a
        href={companyInfo.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Discuter directement avec un conseiller ARISOFT sur WhatsApp"
        className="group flex items-center bg-brand-green hover:bg-brand-green-hover text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-offset-2 focus:ring-brand-green"
      >
        <MessageSquare className="w-6 h-6 shrink-0" aria-hidden="true" />
        <span className="hidden sm:inline-block ml-2.5 text-sm font-bold tracking-tight">
          WhatsApp direct
        </span>
      </a>
    </aside>
  );
};
