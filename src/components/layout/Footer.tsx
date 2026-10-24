import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { withBasePath } from '@/lib/basePath';
import { Phone, MessageSquare, MapPin, Mail, ArrowUpRight, Facebook } from 'lucide-react';
import { companyInfo, navigationLinks, servicesData } from '@/data/content';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-dark text-slate-300 border-t border-slate-800" aria-label="Pied de page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Colonne 1: Marque & Mission */}
          <div className="space-y-4">
            <Link href="/" className="inline-block py-1" aria-label="Accueil ARISOFT">
              <Image
                src={withBasePath('/images/logo-white.png')}
                alt="ARISOFT - Assistance Informatique"
                width={967}
                height={266}
                className="h-10 sm:h-11 w-auto object-contain opacity-95 hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              {companyInfo.tagline}
            </p>
            <p className="text-xs text-slate-500 leading-normal">
              Partenaire informatique unique pour les entreprises, commerces et organisations en quête d’efficacité et de performance.
            </p>
          </div>

          {/* Colonne 2: Nos Services */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              {servicesData.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services/#${service.slug}`}
                    className="text-slate-400 hover:text-brand-green-light transition-colors inline-flex items-center group"
                  >
                    <span>{service.title}</span>
                    <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-brand-green-light" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3: Navigation rapide */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/logiciel-de-gestion/"
                  className="text-brand-green-light hover:underline font-medium inline-flex items-center"
                >
                  Démo du logiciel
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 4: Contact direct */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Contact & Support
            </h3>
            <div className="space-y-2.5 text-sm">
              <a
                href={companyInfo.phoneRaw}
                className="flex items-center gap-2.5 text-slate-300 hover:text-brand-green-light transition-colors"
                aria-label={`Téléphone: ${companyInfo.phoneDisplay}`}
              >
                <Phone className="w-4 h-4 text-brand-green shrink-0" aria-hidden="true" />
                <span>{companyInfo.phoneDisplay}</span>
              </a>

              <a
                href={companyInfo.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-slate-300 hover:text-brand-green-light transition-colors"
                aria-label="WhatsApp direct"
              >
                <MessageSquare className="w-4 h-4 text-brand-green shrink-0" aria-hidden="true" />
                <span>WhatsApp rapide</span>
              </a>

              <div className="flex items-start gap-2.5 text-slate-400">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{companyInfo.address}</span>
              </div>

              <a
                href={`mailto:${companyInfo.email}`}
                className="flex items-center gap-2.5 text-slate-400 hover:text-brand-green-light transition-colors"
              >
                <Mail className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
                <span>{companyInfo.email}</span>
              </a>

              <a
                href={companyInfo.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-slate-300 hover:text-brand-green-light transition-colors"
              >
                <Facebook className="w-4 h-4 text-brand-green shrink-0" aria-hidden="true" />
                <span>Suivez-nous sur Facebook</span>
              </a>
            </div>

            <div className="pt-2">
              <Link
                href="/contact/"
                className="inline-block text-xs font-bold uppercase tracking-wider text-white bg-brand-green hover:bg-brand-green-hover px-3.5 py-2 rounded-card-sm text-center"
              >
                Obtenir un devis gratuit
              </Link>
            </div>
          </div>
        </div>

        {/* Barre de copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {currentYear} {companyInfo.name} · {companyInfo.tagline}. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Performance, proximité et accompagnement.</span>
            <span>·</span>
            <Link href="/admin/" className="text-slate-600 hover:text-slate-400 transition-colors">
              Administration
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
