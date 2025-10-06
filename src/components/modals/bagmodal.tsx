"use client";
import Modal from "@/components/ui/modal";

export default function BagModal({ open, onClose }: { open: boolean; onClose: () => void; }) {
  return (
    <Modal open={open} title="Créer un sac" onClose={onClose}>
      <form className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Nom du sac</label>
          <input className="w-full bg-[#171a1f] border border-ui-border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-rose/40" placeholder="Ex. Valise cabine" />
        </div>
        <div>
          <label className="block text-sm mb-1">Type</label>
          <select className="w-full bg-[#171a1f] border border-ui-border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-rose/40">
            <option>Cabine</option>
            <option>En soute</option>
            <option>Sac à dos</option>
          </select>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" className="flex-1 rounded-xl border border-ui-border px-4 py-3 hover:bg-white/5" onClick={onClose}>Annuler</button>
          <button type="button" className="flex-1 rounded-xl border border-rose text-rose px-4 py-3 hover:bg-rose/10">Créer</button>
        </div>
      </form>
    </Modal>
  );
}
