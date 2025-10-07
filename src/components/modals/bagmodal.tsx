"use client";

import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/ui/modal";

// Objets de base (simples, hardcodés pour le TFE)
const BASE_ITEMS: { key: string; name: string; weight?: number }[] = [
  { key: "tshirt", name: "T-shirt", weight: 0.2 },
  { key: "underwear", name: "Sous-vêtements", weight: 0.1 },
  { key: "socks", name: "Chaussettes", weight: 0.08 },
  { key: "charger", name: "Chargeur téléphone", weight: 0.1 },
  { key: "adapter", name: "Adaptateur prise", weight: 0.12 },
  { key: "toiletry", name: "Trousse de toilette", weight: 0.3 },
  { key: "bottle", name: "Bouteille réutilisable", weight: 0.25 },
];

type ContentItem = {
  key: string;              // identifiant local (évite doublons)
  name: string;
  weight?: number | null;
  source: "base" | "custom";
};

type EditBag = { id: number; name: string; description?: string | null };

function splitNameAndType(full: string): { baseName: string; type: "Cabine" | "En soute" | "Sac à dos" } {
  const TYPE_RX = /\s*\((Cabine|En soute|Sac à dos)\)\s*$/i;
  const m = full.match(TYPE_RX);
  if (m) {
    const t = (m[1] as any) as "Cabine" | "En soute" | "Sac à dos";
    const baseName = full.replace(TYPE_RX, "");
    return { baseName: baseName.trim(), type: t };
  }
  return { baseName: full.trim(), type: "Cabine" };
}

function parseDescriptionToContent(desc?: string | null): ContentItem[] {
  if (!desc) return [];
  const lines = desc.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  return lines.map((line) => {
    // Ex: "T-shirt (0.20kg)" ou "Brosse à dents"
    const m = line.match(/^(.*?)(?:\s*\(([-+]?\d*\.?\d+)\s*kg\))?$/i);
    const name = (m?.[1] ?? line).trim();
    const weight = m?.[2] ? Number(m[2]) : null;
    return {
      key: `recon:${name.toLowerCase()}#${Math.random().toString(36).slice(2, 8)}`,
      name,
      weight: Number.isFinite(weight as number) ? (weight as number) : null,
      source: "custom",
    } as ContentItem;
  });
}

export default function BagModal({
  open,
  onClose,
  editBag,                 // [ADD] si défini => mode édition
  onUpdated,               // [ADD] callback après update
}: {
  open: boolean;
  onClose: () => void;
  editBag?: EditBag | null;
  onUpdated?: () => void;
}) {
  // infos sac
  const [name, setName] = useState("");
  const [type, setType] = useState<"Cabine" | "En soute" | "Sac à dos">("Cabine");

  // contenu à ajouter/éditer avant enregistrement
  const [content, setContent] = useState<ContentItem[]>([]);
  const [customName, setCustomName] = useState("");
  const [customWeight, setCustomWeight] = useState<string>("");

  // user
  const [userId, setUserId] = useState<number | null>(null);

  // état d'enregistrement
  const [saving, setSaving] = useState(false);

  // Pré-remplissage si editBag + reset à la fermeture
  useEffect(() => {
    if (!open) {
      setName("");
      setType("Cabine");
      setContent([]);
      setCustomName("");
      setCustomWeight("");
      setSaving(false);
      setUserId(null);
      return;
    }

    // user
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const u = JSON.parse(raw);
        setUserId(typeof u?.id === "number" ? u.id : null);
      } else setUserId(null);
    } catch {
      setUserId(null);
    }

    // pré-remplissage en mode édition
    if (editBag) {
      const { baseName, type: detectedType } = splitNameAndType(editBag.name || "");
      setName(baseName);
      setType(detectedType);
      setContent(parseDescriptionToContent(editBag.description));
    } else {
      setName("");
      setType("Cabine");
      setContent([]);
    }
  }, [open, editBag]);

  // helpers
  const totalWeight = useMemo(
    () => content.reduce((acc, it) => acc + (typeof it.weight === "number" ? it.weight : 0), 0),
    [content]
  );

  const addBaseItem = (base: { key: string; name: string; weight?: number }) => {
    if (content.some((c) => c.key === `base:${base.key}`)) return; // 1 exemplaire par item de base
    setContent((prev) => [
      ...prev,
      { key: `base:${base.key}`, name: base.name, weight: base.weight ?? null, source: "base" },
    ]);
  };

  const addCustomItem = () => {
    const nameTrim = customName.trim();
    if (!nameTrim) {
      alert("Nom de l’objet requis.");
      return;
    }
    const w = customWeight.trim() === "" ? null : Number(customWeight);
    if (customWeight.trim() !== "" && !Number.isFinite(w)) {
      alert("Poids invalide (utilise un nombre, ex. 0.20).");
      return;
    }
    const key = `custom:${nameTrim.toLowerCase()}#${Date.now()}`;
    setContent((prev) => [...prev, { key, name: nameTrim, weight: w, source: "custom" }]);
    setCustomName("");
    setCustomWeight("");
  };

  const removeItem = (key: string) => {
    setContent((prev) => prev.filter((i) => i.key !== key));
  };

  const formatLine = (it: ContentItem) => {
    const w = typeof it.weight === "number" ? ` (${it.weight.toFixed(2)}kg)` : "";
    return `${it.name}${w}`;
  };

  // CREATE or UPDATE
  const handleSave = async () => {
    if (saving) return;
    if (!name.trim()) {
      alert("Donne un nom à ton sac.");
      return;
    }
    if (!userId) {
      alert("Utilisateur non détecté. Reconnecte-toi.");
      return;
    }

    const descriptionText = content.map(formatLine).join("\n") || null;
    const payload = {
      userId,
      name: `${name.trim()} (${type})`,
      description: descriptionText,
    };

    setSaving(true);
    try {
      let res: Response;
      if (editBag?.id) {
        // PATCH update
        res = await fetch(`/api/packages/${editBag.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // POST create
        res = await fetch("/api/packages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error("Bag save error:", data);
        alert(data?.error || "Erreur lors de l’enregistrement");
        return;
      }

      // notifier le dashboard pour refetch
      try {
        window.dispatchEvent(
          new CustomEvent(editBag?.id ? "packsmart:bag:updated" : "packsmart:bag:created")
        );
      } catch {}

      onUpdated?.();
      onClose();
    } catch (e) {
      console.error("Save bag error:", e);
      alert("Erreur lors de l’enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const isEdit = !!editBag?.id;

  return (
    <Modal open={open} title={isEdit ? "Modifier un sac" : "Créer un sac"} onClose={onClose}>
      {/* Infos du sac */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Nom du sac</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#171a1f] border border-ui-border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-rose/40"
            placeholder="Ex. Valise cabine"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full bg-[#171a1f] border border-ui-border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-rose/40"
          >
            <option>Cabine</option>
            <option>En soute</option>
            <option>Sac à dos</option>
          </select>
        </div>

        {/* Objets de base */}
        <div>
          <h4 className="text-sm font-semibold mb-2 text-white/90">Objets de base</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {BASE_ITEMS.map((b) => (
              <button
                key={b.key}
                type="button"
                onClick={() => addBaseItem(b)}
                className="card text-left p-4"
              >
                <div className="font-medium truncate">{b.name}</div>
                <div className="text-xs text-white/60">
                  {typeof b.weight === "number" ? `${b.weight.toFixed(2)} kg` : "—"}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Objet perso */}
        <div>
          <h4 className="text-sm font-semibold mb-2 text-white/90">Ajouter un objet perso</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Nom (ex. Brosse à dents)"
              className="bg-[#171a1f] border border-ui-border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-rose/40"
            />
            <input
              value={customWeight}
              onChange={(e) => setCustomWeight(e.target.value)}
              placeholder="Poids (ex. 0.20)"
              inputMode="decimal"
              className="bg-[#171a1f] border border-ui-border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-rose/40"
            />
            <button
              type="button"
              onClick={addCustomItem}
              className="rounded-xl border border-rose text-rose px-4 py-3 hover:bg-rose/10"
            >
              Ajouter
            </button>
          </div>
        </div>

        {/* Contenu courant */}
        <div>
          <h4 className="text-sm font-semibold mb-2 text-white/90">Contenu du sac</h4>
          {content.length === 0 ? (
            <div className="text-sm text-white/60 border border-ui-border rounded-lg px-4 py-3">
              Aucun objet pour l’instant.
            </div>
          ) : (
            <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {content.map((it) => (
                <li
                  key={it.key}
                  className="group flex items-center justify-between bg-[#171a1f] border border-ui-border rounded-lg px-3 py-2 transition-colors hover:border-rose/60"
                >
                  <div className="min-w-0">
                    <div className="font-medium truncate transition-colors group-hover:text-rose">
                      {it.name}
                    </div>
                    <div className="text-xs text-white/60 transition-opacity group-hover:opacity-90">
                      {typeof it.weight === "number" ? `${it.weight.toFixed(2)} kg` : "—"}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(it.key)}
                    className="ml-3 inline-flex h-7 w-7 items-center justify-center rounded-md border border-ui-border text-white/70
                               hover:text-rose hover:border-rose/60 hover:bg-rose/10 transition-colors"
                    aria-label={`Supprimer ${it.name}`}
                    title="Supprimer"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-white/80">
            Poids total estimé : <span className="font-semibold">{totalWeight.toFixed(2)} kg</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-xl border border-ui-border px-4 py-3 hover:bg-white/5"
              onClick={onClose}
              disabled={saving}
            >
              Fermer
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl border border-rose text-rose px-4 py-3 hover:bg-rose/10 disabled:opacity-60"
            >
              {saving ? "Enregistrement…" : (editBag?.id ? "Mettre à jour" : "Créer et enregistrer")}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
