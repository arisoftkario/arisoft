import React from 'react';
import { Facebook, Instagram } from 'lucide-react';
import { companyInfo } from '@/data/content';
import { TikTokIcon } from '@/components/shared/TikTokIcon';
import { WhatsAppIcon } from '@/components/shared/WhatsAppIcon';

export const socialNetworks = [
  {
    id: 'facebook',
    label: 'Facebook',
    href: companyInfo.facebookUrl,
    Icon: Facebook,
    className: 'bg-[#1877F2] hover:bg-[#0f63d6]',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    href: companyInfo.tiktokUrl,
    Icon: TikTokIcon,
    className: 'bg-black hover:bg-slate-800 ring-1 ring-white/20',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    href: companyInfo.instagramUrl,
    Icon: Instagram,
    className: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:brightness-110',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    href: companyInfo.whatsappUrl,
    Icon: WhatsAppIcon,
    className: 'bg-[#25D366] hover:bg-[#1ebe5b]',
  },
];

interface SocialLinksProps {
  /** Texte affiché avant les icônes. */
  label?: string;
  /** Texte clair sur fond sombre. */
  isDarkTheme?: boolean;
  size?: 'md' | 'lg';
}

export const SocialLinks: React.FC<SocialLinksProps> = ({ label, isDarkTheme = false, size = 'md' }) => {
  const box = size === 'lg' ? 'w-12 h-12' : 'w-10 h-10';
  const icon = size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';

  return (
    <div className="flex flex-wrap items-center gap-3">
      {label && (
        <span className={`text-sm font-semibold ${isDarkTheme ? 'text-slate-300' : 'text-content-secondary'}`}>
          {label}
        </span>
      )}
      <ul className="flex items-center gap-2.5">
        {socialNetworks.map(({ id, label: name, href, Icon, className }) => (
          <li key={id}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`ARISOFT sur ${name}`}
              title={name}
              className={`${box} ${className} rounded-full flex items-center justify-center text-white shadow-md transition-transform duration-150 hover:scale-110 active:scale-95`}
            >
              <Icon className={icon} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
