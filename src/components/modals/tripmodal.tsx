"use client";
import { useState, useEffect } from "react";
import Modal from "@/components/ui/modal";

type EditTrip = { id: number; destination: string; startDate: string; endDate: string; notes?: string };

export default function TripModal({
  open,
  onClose,
  onCreated,            // optionnel: pour mettre à jour le dashboard
  editTrip,             // si défini => mode édition
  onUpdated,            // callback après update
}: {
  open: boolean;
  onClose: () => void;
  onCreated?: (trip: any) => void;
  editTrip?: EditTrip | null;
  onUpdated?: () => void;
}) {
  const [destination, setDestination] = useState("");
  const [start, setStart]             = useState("");
  const [end, setEnd]                 = useState("");
  const [notes, setNotes]             = useState("");
  const [saving, setSaving]           = useState(false);

  // Remplir les champs si on édite un voyage existant
  useEffect(() => {
    if (editTrip) {
      setDestination(editTrip.destination || "");
      setStart(editTrip.startDate || "");
      setEnd(editTrip.endDate || "");
      setNotes(editTrip.notes || "");
    } else {
      // Reset pour création
      setDestination("");
      setStart("");
      setEnd("");
      setNotes("");
    }
  }, [editTrip, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      const list = JSON.parse(localStorage.getItem("trips") || "[]");
      
      if (editTrip) {
        // Mode édition: trouver et mettre à jour le voyage existant
        const updatedTrip = { 
          ...editTrip, 
          destination, 
          startDate: start, 
          endDate: end, 
          notes 
        };
        const index = list.findIndex((t: any) => t.id === editTrip.id);
        if (index !== -1) {
          list[index] = updatedTrip;
        }
        localStorage.setItem("trips", JSON.stringify(list));
        onUpdated?.();
      } else {
        // Mode création: ajouter un nouveau voyage
        const trip = { id: Date.now(), destination, startDate: start, endDate: end, notes };
        list.push(trip);
        localStorage.setItem("trips", JSON.stringify(list));
        onCreated?.(trip);
      }
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} title={editTrip ? "Modifier le voyage" : "Créer un voyage"} onClose={onClose}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm mb-1">Destination</label>
          <input
            required
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full bg-[#171a1f] border border-ui-border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-rose/40"
            placeholder="Ex. Lisbonne"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Départ</label>
            <input
              type="date"
              required
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full bg-[#171a1f] border border-ui-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-rose/40"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Retour</label>
            <input
              type="date"
              required
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full bg-[#171a1f] border border-ui-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-rose/40"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Notes</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-[#171a1f] border border-ui-border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-rose/40"
            placeholder="Détails utiles…"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            className="flex-1 rounded-xl border border-ui-border px-4 py-3 hover:bg-white/5"
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-xl border border-rose text-rose px-4 py-3 hover:bg-rose/10 disabled:opacity-60"
          >
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
