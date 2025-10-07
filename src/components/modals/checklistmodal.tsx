"use client";
import { useRef } from "react";                // [ADD]
import Modal from "@/components/ui/modal";

export default function ChecklistModal({
  open, onClose, onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: { title: string; prefill?: boolean }) => void;
}) {
  // [MOD] refs stables plutôt que des let + callback ref
  const titleRef = useRef<HTMLInputElement>(null);
  const prefillRef = useRef<HTMLInputElement>(null);

  const handleCreate = () => {
    const title = titleRef.current?.value?.trim() || "Nouvelle checklist";
    const prefill = !!prefillRef.current?.checked;
    onCreate({ title, prefill });
    onClose();
  };

  return (
    <Modal open={open} title="Créer une checklist" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Titre</label>
          <input
            ref={titleRef}                               // [MOD]
            className="w-full bg-[#171a1f] border border-ui-border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-rose/40"
            placeholder="Ex. City pack, Rando, Week-end…"
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input ref={prefillRef} type="checkbox" defaultChecked />   {/* [MOD] */}
          Pré-remplir une petite liste d’exemples
        </label>

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
            onClick={handleCreate}
          >
            Créer
          </button>
        </div>
      </div>
    </Modal>
  );
}
