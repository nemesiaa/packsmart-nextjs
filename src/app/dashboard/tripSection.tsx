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
}: {
  sectionRef: React.RefObject<HTMLDivElement | null>;
  trips: Trip[];
  onOpenCreate: () => void; // ouvre la modale "Créer un voyage"
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
                <span className="text-xs px-2 py-1 rounded border border-ui-border text-textSoft/80">
                  Local
                </span>
              </div>
              {t.notes ? <p className="text-sm text-textSoft/70">{t.notes}</p> : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}