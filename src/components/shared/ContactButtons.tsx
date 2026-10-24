import React from 'react';
import Link from 'next/link';
import { MessageSquare, PhoneCall, ArrowRight } from 'lucide-react';
import { companyInfo } from '@/data/content';

interface ContactButtonsProps {
  showQuoteButton?: boolean;
  whatsappLabel?: string;
  phoneLabel?: string;
  quoteLabel?: string;
  isDarkTheme?: boolean;
  className?: string;
  size?: 'default' | 'large';
}

export const ContactButtons: React.FC<ContactButtonsProps> = ({
  showQuoteButton = false,
  whatsappLabel = 'Écrire sur WhatsApp',
  phoneLabel = companyInfo.phoneDisplay,
  quoteLabel = 'Demander un devis',
  isDarkTheme = false,
  className = '',
  size = 'default',
}) => {
  const paddingClass =
    size === 'large'
      ? 'px-6 py-3.5 text-base sm:text-lg'
      : 'px-5 py-2.5 text-sm sm:text-base';

  return (
    <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 ${className}`}>
      {/* Bouton WhatsApp Vert */}
      <a
        href={companyInfo.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacter ARISOFT directement par WhatsApp"
        className={`inline-flex items-center justify-center font-bold text-white bg-brand-green hover:bg-brand-green-hover rounded-card transition-colors duration-150 shadow-sm active:translate-y-0.5 ${paddingClass}`}
      >
        <MessageSquare className="w-5 h-5 mr-2 shrink-0" aria-hidden="true" />
        <span>{whatsappLabel}</span>
      </a>

      {/* Bouton Téléphone */}
      <a
        href={companyInfo.phoneRaw}
        aria-label={`Appeler ARISOFT au ${companyInfo.phoneDisplay}`}
        className={`inline-flex items-center justify-center font-semibold rounded-card border transition-colors duration-150 active:translate-y-0.5 ${paddingClass} ${
          isDarkTheme
            ? 'text-white border-slate-400/40 hover:bg-white/10 hover:border-white'
            : 'text-content-primary border-line-subtle hover:bg-slate-50 hover:border-slate-400 bg-white'
        }`}
      >
        <PhoneCall className="w-4 h-4 mr-2 shrink-0 text-brand-green" aria-hidden="true" />
        <span>{phoneLabel}</span>
      </a>

      {/* Bouton optionnel Demander un devis */}
      {showQuoteButton && (
        <Link
          href="/contact/"
          className={`inline-flex items-center justify-center font-bold text-brand-green bg-brand-green-pale hover:bg-green-200 border border-green-300 rounded-card transition-colors duration-150 ${paddingClass}`}
        >
          <span>{quoteLabel}</span>
          <ArrowRight className="w-4 h-4 ml-2 shrink-0" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
};
