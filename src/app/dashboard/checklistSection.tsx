"use client";

import React from "react";

type Checklist = { id: number; name: string; done?: boolean };

export default function ChecklistSection({
  sectionRef,
  checklists,
  onAdd,
  onToggle,
}: {
  sectionRef: React.RefObject<HTMLDivElement | null>;
  checklists: Checklist[];
  onAdd: () => void;
  onToggle: (id: number) => void;        // coche/décoche (géré par le parent)
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
            <button
              key={c.id}
              className="card card--rose text-left"
              onClick={() => onToggle(c.id)}
              title="Cliquer pour cocher/décocher"
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold">{c.name}</div>
                <span className="text-xs opacity-80">{c.done ? "✔️ Fait" : "À faire"}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}