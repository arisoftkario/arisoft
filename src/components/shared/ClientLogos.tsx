import React from 'react';
import { getClients } from '@/lib/catalogServer';
import { withBasePath } from '@/lib/basePath';

// Logo du site (/images/clients/…) ou publié depuis l'admin (data URL)
const logoSrc = (logo: string) => (logo.startsWith('/') ? withBasePath(logo) : logo);

export async function ClientLogos() {
  const clients = await getClients();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
      {clients.map((client) => (
        <div
          key={client.id}
          className="bg-white rounded-card-lg border border-line-subtle shadow-sm hover:shadow-md hover:border-brand-green/40 transition-all p-5 flex items-center gap-5"
        >
          {client.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoSrc(client.logo)}
              alt={`Logo ${client.name}${client.activity ? ` – ${client.activity}` : ''}`}
              width={112}
              height={112}
              loading="lazy"
              className="w-24 h-24 sm:w-28 sm:h-28 object-contain shrink-0"
            />
          )}
          <div className="min-w-0">
            <p className="font-extrabold text-content-primary">{client.name}</p>
            {client.activity && <p className="text-sm font-semibold text-brand-green">{client.activity}</p>}
            {client.location && <p className="text-xs text-content-muted mt-1">{client.location}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
