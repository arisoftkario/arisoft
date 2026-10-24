import React from 'react';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  isDarkTheme?: boolean;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  subtitle,
  centered = false,
  isDarkTheme = false,
  className = '',
}) => {
  return (
    <div
      className={`mb-8 sm:mb-12 ${
        centered ? 'text-center mx-auto max-w-2xl' : 'max-w-2xl'
      } ${className}`}
    >
      {badge && (
        <span
          className={`inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 ${
            isDarkTheme
              ? 'bg-navy-light text-brand-green-light border border-navy-subtle'
              : 'bg-brand-green-pale text-brand-green border border-green-200'
          }`}
        >
          {badge}
        </span>
      )}
      <h2
        className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight ${
          isDarkTheme ? 'text-white' : 'text-content-primary'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3 text-base sm:text-lg leading-relaxed ${
            isDarkTheme ? 'text-slate-300' : 'text-content-secondary'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
