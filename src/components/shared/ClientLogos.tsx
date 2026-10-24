import React from 'react';
import Image from 'next/image';
import { clientLogos } from '@/data/content';
import { withBasePath } from '@/lib/basePath';

export const ClientLogos: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
      {clientLogos.map((client) => (
        <div
          key={client.id}
          className="bg-white rounded-card-lg border border-line-subtle shadow-sm hover:shadow-md hover:border-brand-green/40 transition-all p-5 flex items-center gap-5"
        >
          <Image
            src={withBasePath(client.logo)}
            alt={`Logo ${client.name} – ${client.activity}`}
            width={112}
            height={112}
            className="w-24 h-24 sm:w-28 sm:h-28 object-contain shrink-0"
          />
          <div className="min-w-0">
            <p className="font-extrabold text-content-primary">{client.name}</p>
            <p className="text-sm font-semibold text-brand-green">{client.activity}</p>
            <p className="text-xs text-content-muted mt-1">{client.location}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
