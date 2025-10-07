"use client";

import React from "react";

type Bag = { id: number; name: string; description?: string | null };

export default function BagsSection({
  sectionRef,
  loading,
  bags,
  onOpenCreate,
  onDeleteBag,        // [EXISTANT]
  onEditBag,          // [ADD]
}: {
  sectionRef: React.RefObject<HTMLDivElement | null>;
  loading: boolean;
  bags: Bag[];
  onOpenCreate: () => void;
  onDeleteBag?: (id: number) => void;
  onEditBag?: (id: number) => void;      // [ADD]
}) {
  return (
    <div ref={sectionRef} className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-textSoft">Tous mes sacs</h2>
        <button className="text-rose hover:text-rose/80 transition-colors" onClick={onOpenCreate}>
          + Créer un sac
        </button>
      </div>

      {loading ? (
        <div className="text-textSoft/70">Chargement…</div>
      ) : bags.length === 0 ? (
        <div className="border border-ui-border rounded-2xl p-6 text-textSoft/70">
          Aucun sac pour l’instant.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bags.map((p) => (
            <div key={p.id} className="bg-ui-surface border border-ui-border p-6 rounded-2xl">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{p.name}</h3>

                <div className="flex items-center gap-2">
                  {/* [ADD] Modifier */}
                  {onEditBag && (
                    <button
                      onClick={() => onEditBag(p.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg
                                 text-textSoft/60 hover:text-textSoft
                                 border border-transparent hover:border-ui-border hover:bg-white/5
                                 transition-colors"
                      aria-label="Modifier"
                      title="Modifier"
                    >
                      <span
                        className="material-symbols-outlined text-[20px] leading-none"
                        style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
                      >
                        edit
                      </span>
                    </button>
                  )}

                  {/* Supprimer */}
                  {onDeleteBag && (
                    <button
                      onClick={() => onDeleteBag(p.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg
                                 text-textSoft/60 hover:text-rose
                                 border border-transparent hover:border-ui-border hover:bg-white/5
                                 transition-colors"
                      aria-label="Supprimer"
                      title="Supprimer"
                    >
                      <span
                        className="material-symbols-outlined text-[20px] leading-none"
                        style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
                      >
                        delete
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {p.description ? (
                <p className="text-sm text-textSoft/70 whitespace-pre-line line-clamp-3">
                  {p.description}
                </p>
              ) : (
                <p className="text-sm text-textSoft/60 italic">Aucune description</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
