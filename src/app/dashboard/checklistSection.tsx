"use client";

import React from "react";

type Checklist = { id: number; name: string; done?: boolean };

export default function ChecklistSection({
  sectionRef,
  checklists,
  onAdd,
  onToggle,
  onDeleteChecklist, // [ADD]
}: {
  sectionRef: React.RefObject<HTMLDivElement | null>;
  checklists: Checklist[];
  onAdd: () => void;
  onToggle: (id: number) => void;        // coche/décoche (géré par le parent)
  onDeleteChecklist?: (id: number) => void; // [ADD]
}) {
  return (
    <div ref={sectionRef} className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-textSoft">Mes checklists</h2>
        <button className="text-rose hover:text-rose/80 transition-colors" onClick={onAdd}>
          + Ajouter
        </button>
      </div>

      {checklists.length === 0 ? (
        <div className="border border-ui-border rounded-2xl p-6 text-textSoft/70">
          Aucune checklist.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {checklists.map((c) => (
            <div key={c.id} className="card card--rose text-left">
              {/* header de la card */}
              <div className="flex items-start justify-between">
                <button
                  className="text-left"
                  onClick={() => onToggle(c.id)}
                  title="Cliquer pour cocher/décocher"
                >
                  <div className="font-semibold">{c.name}</div>
                  <span className="text-xs opacity-80">{c.done ? "✔️ Fait" : "À faire"}</span>
                </button>

                {/* [ADD] bouton supprimer */}
                {onDeleteChecklist && (
                  <button
                    onClick={() => onDeleteChecklist(c.id)}
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
          ))}
        </div>
      )}
    </div>
  );
}
