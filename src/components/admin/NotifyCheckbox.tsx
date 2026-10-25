'use client';

import React from 'react';
import { Bell } from 'lucide-react';

/** Case « Prévenir les abonnés », proposée uniquement pour une nouvelle publication. */
export const NotifyCheckbox: React.FC<{ checked: boolean; onChange: (checked: boolean) => void }> = ({
  checked,
  onChange,
}) => (
  <label className="flex items-start gap-3 p-3 rounded-card-sm bg-brand-green-pale/50 border border-green-200 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="mt-0.5 w-4 h-4 accent-brand-green"
    />
    <span className="text-sm">
      <span className="font-bold text-content-primary inline-flex items-center gap-1.5">
        <Bell className="w-4 h-4 text-brand-green" aria-hidden="true" />
        Prévenir les abonnés
      </span>
      <span className="block text-xs text-content-secondary">
        Envoie une notification à tous les visiteurs qui suivent ARISOFT.
      </span>
    </span>
  </label>
);
