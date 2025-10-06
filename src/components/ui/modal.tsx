"use client";

import { useEffect, useState } from "react";

export default function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const [show, setShow] = useState(false);

  // animation + scroll lock + ESC pour fermer
  useEffect(() => {
    if (!open) return;
    setShow(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" role="dialog" aria-modal="true">
      {/* backdrop flou + clic pour fermer */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-500 ${show ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      {/* carte */}
      <div
        className={`relative w-full max-w-lg mx-4 rounded-2xl border border-ui-border bg-ui-surface p-6 shadow-2xl
                    transition-all duration-500 ease-out
                    ${show ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-3 scale-[.98]"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-semibold text-textSoft">{title}</h3>
          <button
            onClick={onClose}
            className="ml-4 rounded-lg px-2 py-1 text-sm text-rose hover:bg-rose/10 border border-transparent hover:border-rose/40"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
