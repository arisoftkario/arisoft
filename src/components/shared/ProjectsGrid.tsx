'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Image as ImageIcon, Building2, ArrowRight } from 'lucide-react';
import { projectRealizations } from '@/data/content';
import { isFirebaseConfigured } from '@/lib/firebase';
import { fetchProjects } from '@/lib/projects';
import { ProjectItem } from '@/types';

interface ProjectsGridProps {
  /** Nombre maximum de cartes affichées (ex : 3 sur l'accueil). */
  limit?: number;
  /** Niveau de titre des cartes selon la page. */
  headingLevel?: 'h2' | 'h3';
}

export const ProjectsGrid: React.FC<ProjectsGridProps> = ({ limit, headingLevel = 'h3' }) => {
  // null = chargement en cours depuis Firebase
  const [projects, setProjects] = useState<ProjectItem[] | null>(
    isFirebaseConfigured ? null : projectRealizations
  );

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    fetchProjects()
      .then((items) => setProjects(items.length > 0 ? items : projectRealizations))
      .catch(() => setProjects(projectRealizations));
  }, []);

  const Heading = headingLevel;
  const visible = projects ? projects.slice(0, limit ?? projects.length) : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
      {visible === null
        ? Array.from({ length: limit ?? 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-card-lg border border-line-subtle h-[26rem] animate-pulse"
              aria-hidden="true"
            />
          ))
        : visible.map((project) => (
            <article
              key={project.id}
              className="bg-white rounded-card-lg overflow-hidden border border-line-subtle shadow-sm flex flex-col justify-between hover:border-brand-green/40 transition-colors"
            >
              {/* Photo du projet */}
              {project.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-52 sm:h-56 object-cover border-b border-line-subtle"
                />
              ) : (
                <div className="bg-slate-100 border-b border-line-subtle h-52 sm:h-56 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-white shadow-xs flex items-center justify-center text-slate-400 mb-2">
                    <ImageIcon className="w-7 h-7" aria-hidden="true" />
                  </div>
                  <span className="font-bold text-sm text-content-secondary">
                    {project.serviceCategory}
                  </span>
                </div>
              )}

              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-green-pale text-brand-green mb-3">
                    {project.serviceCategory}
                  </span>
                  <Heading className="text-lg sm:text-xl font-bold text-content-primary mb-2">
                    {project.title}
                  </Heading>
                  {project.clientName && (
                    <div className="text-sm font-semibold text-content-muted mb-4 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                      <span>Client : {project.clientName}</span>
                    </div>
                  )}
                  <p className="text-sm text-content-secondary leading-relaxed mb-4 whitespace-pre-line">
                    {project.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-line-subtle">
                  <Link
                    href={`/contact/?service=${encodeURIComponent(
                      project.serviceCategory
                    )}&ref=${encodeURIComponent(project.title)}`}
                    className="inline-flex items-center text-sm font-bold text-brand-green hover:text-brand-green-hover group"
                  >
                    <span>Demander un devis pour ce type de projet</span>
                    <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
    </div>
  );
};
