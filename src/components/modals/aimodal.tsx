"use client";
import Modal from "@/components/ui/modal";

type Pkg = { id: number; name: string; weight?: number | null; description?: string | null; updatedAt?: string };

export default function AIModal({
  open,
  onClose,
  packages = [],
  loading = false,
}: {
  open: boolean;
  onClose: () => void;
  packages?: Pkg[];
  loading?: boolean;
}) {
  return (
    <Modal open={open} title="IA Assistant" onClose={onClose}>
      {/* Liste des sacs enregistrés */}
      <div className="mb-5">
        <h4 className="text-sm font-semibold mb-2 text-white/90">Mes sacs enregistrés</h4>

        {loading ? (
          <div className="text-sm text-white/70">Chargement…</div>
        ) : packages.length === 0 ? (
          <div className="text-sm text-white/60 border border-ui-border rounded-lg px-4 py-3">
            Aucun sac pour l’instant. Créez-en un dans “Mes Sacs”.
          </div>
        ) : (
          <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {packages.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between bg-[#171a1f] border border-ui-border rounded-lg px-3 py-2"
              >
                <div className="min-w-0">
                  <div className="font-medium truncate">{p.name}</div>
                  {p.description ? (
                    <div className="text-xs text-white/60 truncate">{p.description}</div>
                  ) : null}
                </div>
                {typeof p.weight === "number" ? (
                  <span className="ml-3 text-xs text-white/70 whitespace-nowrap">
                    {p.weight.toFixed(1)} kg
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Formulaire IA (ton bloc existant) */}
      <form className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Votre destination / contexte</label>
          <input
            className="w-full bg-[#171a1f] border border-ui-border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-rose/40"
            placeholder="Ex. 5 jours à Oslo en février"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Que voulez-vous optimiser ?</label>
          <textarea
            rows={3}
            className="w-full bg-[#171a1f] border border-ui-border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-rose/40"
            placeholder="Poids, météo, activités..."
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            className="flex-1 rounded-xl border border-ui-border px-4 py-3 hover:bg-white/5"
            onClick={onClose}
          >
            Fermer
          </button>
          <button
            type="button"
            className="flex-1 rounded-xl border border-rose text-rose px-4 py-3 hover:bg-rose/10"
          >
            Générer des idées
          </button>
        </div>
      </form>
    </Modal>
  );
}
