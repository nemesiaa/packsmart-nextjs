"use client";

import React from "react";

type Trip = {
  id: number;
  destination: string;
  startDate: string;
  endDate: string;
  notes?: string;
};

export default function TripsSection({
  sectionRef,
  trips,
  onOpenCreate,
  onDeleteTrip,          // [EXISTANT]
  onEditTrip,            // [ADD]
}: {
  sectionRef: React.RefObject<HTMLDivElement | null>;
  trips: Trip[];
  onOpenCreate: () => void; // ouvre la modale "Créer un voyage"
  onDeleteTrip?: (id: number) => void;
  onEditTrip?: (id: number) => void;     // [ADD]
}) {
  return (
    <div ref={sectionRef} className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-textSoft">Tous mes voyages</h2>
        <button className="text-rose hover:text-rose/80 transition-colors" onClick={onOpenCreate}>
          + Nouveau
        </button>
      </div>

      {trips.length === 0 ? (
        <div className="border border-ui-border rounded-2xl p-6 text-textSoft/70">
          Aucun voyage pour l’instant.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trips.map((t) => (
            <div key={t.id} className="bg-ui-surface border border-ui-border p-6 rounded-2xl">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-textSoft">{t.destination}</h3>
                  <p className="text-textSoft/70">
                    {t.startDate} → {t.endDate}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* [ADD] Modifier */}
                  {onEditTrip && (
                    <button
                        onClick={() => onEditTrip?.(t.id)}
  className="inline-flex h-8 w-8 items-center justify-center rounded-lg
             text-textSoft/60 hover:text-white
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
                  {onDeleteTrip && (
                    <button
                      onClick={() => onDeleteTrip(t.id)}
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

              {t.notes ? <p className="text-sm text-textSoft/70">{t.notes}</p> : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
