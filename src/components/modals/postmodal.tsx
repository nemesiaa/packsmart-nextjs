"use client";

import React, { useRef, useState } from "react";

export type PostInput = {
  imageDataUrl: string | null;
  description: string;
};

export default function PostModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (input: PostInput) => void;
}) {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePick = () => fileRef.current?.click();

  const handleFile = async (file?: File | null) => {
    setError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Merci de choisir une image (jpg, png…).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageDataUrl) {
      setError("Ajoute une photo pour ta publication.");
      return;
    }
    setSubmitting(true);
    onCreate({ imageDataUrl, description: description.trim() });
    setSubmitting(false);
    setImageDataUrl(null);
    setDescription("");
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Créer une publication"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-ui-border bg-ui-surface p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-textSoft">Créer une publication</h3>
          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 w-9 h-9"
            aria-label="Fermer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image */}
          <div className="rounded-xl border border-ui-border p-3">
            {imageDataUrl ? (
              <div className="space-y-2">
                <img
                  src={imageDataUrl}
                  alt="Aperçu"
                  className="w-full rounded-lg object-cover max-h-72"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handlePick}
                    className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-sm"
                  >
                    Changer la photo
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageDataUrl(null)}
                    className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-sm"
                  >
                    Retirer
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-white/70">
                <span className="material-symbols-outlined text-4xl">add_a_photo</span>
                <p className="text-sm">Ajoute une image (ton sac, un voyage…)</p>
                <button
                  type="button"
                  onClick={handlePick}
                  className="mt-2 px-4 py-2 rounded-lg border border-rose text-rose bg-ui-base/60 hover:bg-rose/10 text-sm"
                >
                  Choisir une image
                </button>
              </div>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-white/80 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-ui-border bg-ui-base/60 px-3 py-2 outline-none focus:ring-1 focus:ring-white/20"
              placeholder="Dis-nous en plus…"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-sm"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg border border-rose text-rose bg-ui-base/60 hover:bg-rose/10 text-sm disabled:opacity-50"
            >
              Publier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
