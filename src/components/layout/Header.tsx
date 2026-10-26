'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { withBasePath } from '@/lib/basePath';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, Phone, Lock } from 'lucide-react';
import { navigationLinks, companyInfo } from '@/data/content';
import { NEW_ADS_EVENT } from '@/lib/ads';
import { FollowButton } from '@/components/shared/FollowButton';
import { LanguageSelector } from '@/components/layout/LanguageSelector';

// Pastille verte « nouveautés » sur le lien Offres
const NewBadge: React.FC<{ count: number }> = ({ count }) => (
  <span className="ml-1.5 inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-brand-green text-white text-[11px] font-extrabold align-middle animate-pulse">
    {count}
  </span>
);

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newAds, setNewAds] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const onNewAds = (e: Event) => setNewAds((e as CustomEvent<number>).detail);
    window.addEventListener(NEW_ADS_EVENT, onNewAds);
    return () => window.removeEventListener(NEW_ADS_EVENT, onNewAds);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Handle escape key to close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 bg-navy text-white border-b border-navy-light/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo ARISOFT officiel */}
          <Link
            href="/"
            className="flex items-center group focus:outline-none py-1"
            aria-label="Accueil ARISOFT"
          >
            <Image
              src={withBasePath('/images/logo-white.png')}
              alt="ARISOFT - Assistance Informatique"
              width={967}
              height={266}
              priority
              className="h-10 sm:h-12 w-auto object-contain transition-opacity group-hover:opacity-90"
            />
          </Link>

          {/* Navigation Bureau */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Navigation principale">
            {navigationLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname?.startsWith(link.href.replace(/\/$/, ''));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-brand-green-light py-1.5 border-b-2 ${
                    isActive
                      ? 'text-white border-brand-green font-semibold'
                      : 'text-slate-300 border-transparent'
                  }`}
                >
                  {link.label}
                  {link.href === '/publicites/' && newAds > 0 && <NewBadge count={newAds} />}
                </Link>
              );
            })}
          </nav>

          {/* Actions Droite Bureau */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSelector />

            <Link
              href="/admin/"
              title="Espace administrateur"
              aria-label="Espace administrateur"
              className="p-2 rounded-lg text-slate-400 hover:text-white border border-navy-subtle hover:border-brand-green transition-colors"
            >
              <Lock className="w-4 h-4" aria-hidden={true} />
            </Link>

            <FollowButton />

            <a
              href={companyInfo.phoneRaw}
              className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg border border-navy-subtle"
              aria-label={`Appeler le ${companyInfo.phoneDisplay}`}
            >
              <Phone className="w-3.5 h-3.5 text-brand-green-light" aria-hidden={true} />
              <span>{companyInfo.phoneDisplay}</span>
            </a>

            <Link
              href="/contact/"
              className="inline-flex items-center justify-center font-bold text-sm text-white bg-brand-green hover:bg-brand-green-hover px-4 py-2.5 rounded-card transition-colors duration-150 shadow-sm active:translate-y-0.5"
            >
              <span>Demander un devis</span>
              <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden={true} />
            </Link>
          </div>

          {/* Bouton Burger Mobile */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSelector compact />

            <FollowButton compact />

            <a
              href={companyInfo.phoneRaw}
              aria-label="Appeler ARISOFT"
              className="p-2.5 rounded-card-sm text-brand-green-light bg-navy-light border border-navy-subtle"
            >
              <Phone className="w-5 h-5" aria-hidden={true} />
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="relative p-2.5 rounded-card-sm text-slate-200 hover:text-white bg-navy-light border border-navy-subtle focus:outline-none focus:ring-2 focus:ring-brand-green"
              aria-label={mobileMenuOpen ? 'Fermer le menu de navigation' : 'Ouvrir le menu de navigation'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {newAds > 0 && !mobileMenuOpen && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-brand-green ring-2 ring-navy" aria-hidden={true} />
              )}
              {mobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden={true} />
              ) : (
                <Menu className="w-6 h-6" aria-hidden={true} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tiroir Menu Mobile */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="lg:hidden fixed inset-x-0 top-20 bottom-0 bg-navy/98 backdrop-blur-md z-50 overflow-y-auto px-6 py-6 border-t border-navy-light flex flex-col justify-between"
          aria-label="Menu mobile"
        >
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3">
              Navigation
            </div>
            {navigationLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname?.startsWith(link.href.replace(/\/$/, ''));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-3 px-4 rounded-card-sm text-base font-semibold transition-colors ${
                    isActive
                      ? 'bg-navy-light text-brand-green-light border-l-4 border-brand-green'
                      : 'text-slate-200 hover:bg-navy-light'
                  }`}
                >
                  {link.label}
                  {link.href === '/publicites/' && newAds > 0 && <NewBadge count={newAds} />}
                </Link>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-navy-light space-y-3">
            <Link
              href="/contact/"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center font-bold text-white bg-brand-green hover:bg-brand-green-hover py-3.5 rounded-card text-center"
            >
              Demander un devis gratuit
            </Link>
            <a
              href={companyInfo.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center font-semibold text-brand-green-light bg-navy-light border border-navy-subtle py-3 rounded-card text-center text-sm"
            >
              Écrire directement sur WhatsApp
            </a>
            <p className="text-center text-xs text-slate-400 pt-2">
              Ligne directe : {companyInfo.phoneDisplay}
            </p>
            <Link
              href="/admin/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 pt-1"
            >
              <Lock className="w-3.5 h-3.5" aria-hidden={true} />
              Espace administrateur
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
