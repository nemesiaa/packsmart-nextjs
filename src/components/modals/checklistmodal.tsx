"use client";
import { useEffect, useRef } from "react";
import Modal from "@/components/ui/modal";

type Checklist = {
  id: number;
  name: string;
  done?: boolean;
};

export default function ChecklistModal({
  open,
  onClose,
  onCreate,
  onUpdate,         // [ADD] callback après modification
  editChecklist,    // [ADD] données si mode édition
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: { title: string; prefill?: boolean; done?: boolean }) => void;
  onUpdate?: (payload: Checklist) => void;
  editChecklist?: Checklist | null;
}) {
  const titleRef = useRef<HTMLInputElement>(null);
  const prefillRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLInputElement>(null);

  // Remplir les champs en mode édition
  useEffect(() => {
    if (!open) return;
    if (editChecklist) {
      if (titleRef.current) titleRef.current.value = editChecklist.name;
      if (doneRef.current) doneRef.current.checked = !!editChecklist.done;
      if (prefillRef.current) prefillRef.current.checked = false;
    } else {
      if (titleRef.current) titleRef.current.value = "";
      if (doneRef.current) doneRef.current.checked = false;
      if (prefillRef.current) prefillRef.current.checked = true;
    }
  }, [open, editChecklist]);

  const handleSave = () => {
    const title = titleRef.current?.value?.trim() || "Nouvelle checklist";
    const prefill = !!prefillRef.current?.checked;
    const done = !!doneRef.current?.checked;

    if (editChecklist) {
      const updated = { ...editChecklist, name: title, done };
      onUpdate?.(updated);
    } else {
      onCreate({ title, prefill, done });
    }

    onClose();
  };

  const isEdit = !!editChecklist;

  return (
    <Modal
      open={open}
      title={isEdit ? "Modifier la checklist" : "Créer une checklist"}
      onClose={onClose}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Titre</label>
          <input
            ref={titleRef}
            className="w-full bg-[#171a1f] border border-ui-border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-rose/40"
            placeholder="Ex. City pack, Rando, Week-end…"
          />
        </div>

        {/* Case "Fait" */}
        <label className="flex items-center gap-2 text-sm">
          <input ref={doneRef} type="checkbox" />
          Marquer comme fait
        </label>

        {/* Préremplissage (création uniquement) */}
        {!isEdit && (
          <label className="flex items-center gap-2 text-sm">
            <input ref={prefillRef} type="checkbox" defaultChecked />
            Pré-remplir une petite liste d’exemples
          </label>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            className="flex-1 rounded-xl border border-ui-border px-4 py-3 hover:bg-white/5"
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            type="button"
            className="flex-1 rounded-xl border border-rose text-rose px-4 py-3 hover:bg-rose/10"
            onClick={handleSave}
          >
            {isEdit ? "Mettre à jour" : "Créer"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
