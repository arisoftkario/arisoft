'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Image as ImageIcon, Building2, ArrowRight } from 'lucide-react';
import { projectRealizations } from '@/data/content';
import { isFirebaseConfigured } from '@/lib/firebase';
import { fetchProjects } from '@/lib/projects';
import { MediaGallery } from '@/components/shared/MediaGallery';
import { EngagementBar, useComments } from '@/components/shared/EngagementBar';
import { postAnchor } from '@/lib/engagement';
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

  // Les exemples de content.ts ne sont pas dans Firebase : pas de J'aime ni de commentaires
  const [fromFirebase, setFromFirebase] = useState(false);
  const { comments, addLocal } = useComments('realisations', fromFirebase);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    fetchProjects()
      .then((items) => {
        setFromFirebase(items.length > 0);
        setProjects(items.length > 0 ? items : projectRealizations);
      })
      .catch(() => setProjects(projectRealizations));
  }, []);

  // Lien partagé vers une réalisation précise : défile jusqu'à elle
  useEffect(() => {
    const hash = window.location.hash;
    if (projects && hash.startsWith('#real-')) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [projects]);

  const Heading = headingLevel;
  const visible = projects ? projects.slice(0, limit ?? projects.length) : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-start">
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
              id={fromFirebase ? postAnchor('realisations', project.id) : undefined}
              className="bg-white rounded-card-lg overflow-hidden border border-line-subtle shadow-sm flex flex-col justify-between hover:border-brand-green/40 transition-colors scroll-mt-28 target:ring-2 target:ring-brand-green"
            >
              {/* Photos et vidéo du projet */}
              <div className="border-b border-line-subtle">
                <MediaGallery
                  images={project.images ?? []}
                  videoUrl={project.videoUrl}
                  alt={project.title}
                  frameClass="h-52 sm:h-56"
                  placeholder={
                    <div className="bg-slate-100 h-full flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-14 h-14 rounded-full bg-white shadow-xs flex items-center justify-center text-slate-400 mb-2">
                        <ImageIcon className="w-7 h-7" aria-hidden="true" />
                      </div>
                      <span className="font-bold text-sm text-content-secondary">
                        {project.serviceCategory}
                      </span>
                    </div>
                  }
                />
              </div>

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

                  {fromFirebase && (
                    <EngagementBar
                      type="realisations"
                      postId={project.id}
                      title={project.title}
                      likes={project.likes ?? 0}
                      comments={comments[project.id] ?? []}
                      onCommentAdded={addLocal}
                    />
                  )}
                </div>
              </div>
            </article>
          ))}
    </div>
  );
};
