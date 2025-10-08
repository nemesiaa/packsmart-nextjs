"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";

/* =========================
   Helpers (utilitaires)
   ========================= */

type RawAny = any;

function toBagArray(maybe: RawAny): Array<{ id: string; name: string }> {
  if (!maybe) return [];
  const arr = Array.isArray(maybe) ? maybe : [];

  return arr
    .map((b: RawAny, i: number) => {
      if (!b) return null;

      // Champs possibles pour l'id
      const idRaw = b.id ?? b._id ?? b.uuid ?? b.key ?? b.slug ?? `local-${i}`;

      // Champs possibles pour le nom
      const nameRaw =
        b.name ??
        b.label ??
        b.title ??
        b.nom ??
        (typeof b === "string" ? b : null);

      if (!nameRaw) return null;
      return { id: String(idRaw), name: String(nameRaw) };
    })
    .filter(Boolean) as Array<{ id: string; name: string }>;
}

function dedupeBags(bags: Array<{ id: string; name: string }>) {
  const seen = new Set<string>();
  const out: Array<{ id: string; name: string }> = [];
  for (const b of bags) {
    const key = `${b.id}::${b.name}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(b);
    }
  }
  return out;
}

/* =========================
   Types
   ========================= */

type User = { email: string; name?: string };
type Bag = { id: string; name: string };
type Post = {
  id: string;
  authorEmail: string;
  authorName?: string;
  createdAt: number;
  title: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  photoDataUrl?: string; // image en base64
  bagIds: string[];
  bagNames: string[];
};

const LS_USER = "user";
const LS_POSTS = "packsmart_posts";

/* =========================
   Page Actualité
   ========================= */

export default function Actualite() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [bags, setBags] = useState<Bag[]>([]);
  const [openForm, setOpenForm] = useState(false);

  // --- Form state ---
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [photoDataUrl, setPhotoDataUrl] = useState<string | undefined>();
  const [selectedBagIds, setSelectedBagIds] = useState<string[]>([]);
  const canSubmit = title.trim().length > 0;

  // Load user
  useEffect(() => {
    const raw = localStorage.getItem(LS_USER);
    if (raw) setUser(JSON.parse(raw));
  }, []);

  // Load posts from API
  useEffect(() => {
    fetchPosts();
  }, []);

  // Load bags (hyper-tolérant : plusieurs clés/format + tentative API optionnelle)
  useEffect(() => {
    let aborted = false;

    const readLS = (key: string) => {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        return JSON.parse(raw);
      } catch {
        return null;
      }
    };

    const harvestFromLocal = (): Bag[] => {
      const candidates: Array<{ id: string; name: string }> = [];

      // 1) Clés directes fréquentes
      candidates.push(...toBagArray(readLS("bags")));
      candidates.push(...toBagArray(readLS("packsmart_bags")));
      candidates.push(...toBagArray(readLS("packages")));
      candidates.push(...toBagArray(readLS("packsmart_packages")));

      // 2) Éventuellement dans l'objet user
      const userRaw = readLS("user");
      if (userRaw && typeof userRaw === "object") {
        candidates.push(...toBagArray(userRaw.bags));
        candidates.push(...toBagArray(userRaw.packages));
      }

      // 3) Nettoyage + dédoublonnage
      const clean = dedupeBags(candidates.filter((b) => b && b.name && b.id));

      // Map vers le type local
      return clean.map((b) => ({ id: b.id, name: b.name }));
    };

    // Toujours remplir depuis local d'abord (jamais écran vide)
    const local = harvestFromLocal();
    if (!aborted) setBags(local);

    // Tentative d'API (si jamais un GET /api/packages existe chez toi)
    (async () => {
      try {
        const r = await fetch("/api/packages", { cache: "no-store" });
        if (!r.ok) return; // pas de GET index → on ignore calmement
        const data = (await r.json()) as Array<{ id?: string | number; name?: string }>;
        const apiBags = toBagArray(data);
        if (!aborted && apiBags.length) {
          // Remplace uniquement si l’API renvoie quelque chose d’exploitable
          setBags(apiBags.map((b) => ({ id: b.id, name: b.name })));
        }
      } catch {
        // On garde les sacs du localStorage sans rien casser
      }
    })();

    return () => {
      aborted = true;
    };
  }, []);

  const currentAuthor = useMemo(
    () => (user ? user.name || user.email : "Invité"),
    [user]
  );

  const resetForm = () => {
    setTitle("");
    setDestination("");
    setStartDate("");
    setEndDate("");
    setDescription("");
    setPhotoDataUrl(undefined);
    setSelectedBagIds([]);
  };

  const handleImage = (file?: File | null) => {
    if (!file) {
      setPhotoDataUrl(undefined);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhotoDataUrl(String(reader.result));
    reader.readAsDataURL(file);
  };

  const toggleBag = (id: string) => {
    setSelectedBagIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const savePosts = (arr: Post[]) => {
    setPosts(arr.sort((a, b) => b.createdAt - a.createdAt));
    localStorage.setItem(LS_POSTS, JSON.stringify(arr));
  };

  // Fonction pour récupérer les posts depuis l'API
  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      if (response.ok) {
        const data = await response.json();
        if (data.ok && data.posts) {
          // Adapter le format des posts de l'API vers le format local
          const adaptedPosts = data.posts.map((apiPost: any) => ({
            id: apiPost.id.toString(),
            authorEmail: apiPost.userEmail,
            authorName: apiPost.userName || apiPost.userEmail,
            createdAt: new Date(apiPost.createdAt).getTime(),
            title: apiPost.description || "Post sans titre",
            destination: undefined,
            startDate: undefined,
            endDate: undefined,
            description: apiPost.description,
            photoDataUrl: apiPost.imageData,
            bagIds: [],
            bagNames: [],
          }));
          setPosts(adaptedPosts);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des posts:', error);
      // Fallback vers localStorage en cas d'erreur
      const raw = localStorage.getItem(LS_POSTS);
      if (raw) {
        try {
          const arr: Post[] = JSON.parse(raw);
          setPosts(arr.sort((a, b) => b.createdAt - a.createdAt));
        } catch {
          setPosts([]);
        }
      }
    }
  };

  const createPost = async () => {
    if (!canSubmit || !user) {
      setOpenForm(false);
      return;
    }

    try {
      // Préparer les données pour l'API
      const postData = {
        userEmail: user.email,
        userName: user.name || user.email,
        userAvatar: null, // Tu peux ajouter l'avatar plus tard si besoin
        imageData: photoDataUrl,
        description: title.trim() + (description.trim() ? `\n\n${description.trim()}` : ''),
      };

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.ok) {
          // Recharger tous les posts depuis l'API
          await fetchPosts();
          resetForm();
          setOpenForm(false);
        } else {
          console.error('Erreur API:', result.error);
          alert('Erreur lors de la publication: ' + result.error);
        }
      } else {
        console.error('Erreur HTTP:', response.status);
        alert('Erreur lors de la publication');
      }
    } catch (error) {
      console.error('Erreur lors de la création du post:', error);
      alert('Erreur de connexion lors de la publication');
    }
  };

  const removePost = (id: string) => {
    const p = posts.find((x) => x.id === id);
    if (!p) return;
    // uniquement l’auteur peut supprimer
    if (!user || user.email !== p.authorEmail) return;
    savePosts(posts.filter((x) => x.id !== id));
  };

  return (
    <div className="min-h-dvh bg-ui-base text-[#F5F5F7] flex flex-col">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-6 md:px-8 py-10 w-full">
        {/* Header page */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-1" style={{ color: "#B48EAD" }}>
              Actualités
            </h1>
            <p className="text-textSoft/80">
              Partage tes voyages avec une photo, une description et, si tu veux, les sacs utilisés.
            </p>
            {/* facultatif : afficher combien de sacs détectés */}
            {/* <p className="text-xs text-white/60 mt-1">
              {bags.length} sac{bags.length > 1 ? "s" : ""} disponible{bags.length > 1 ? "s" : ""}
            </p> */}
          </div>

          <button
            onClick={() => (user ? setOpenForm(true) : (window.location.href = "/login"))}
            className="h-10 px-4 rounded-lg border border-rose text-rose bg-ui-base/60 hover:bg-rose/10"
            title={user ? "Nouveau post" : "Connecte-toi pour publier"}
          >
            Publier
          </button>
        </div>

        {/* Formulaire modal */}
        {openForm && (
          <div className="fixed inset-0 z-50 grid place-items-center px-4">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpenForm(false)}
            />
            <div className="relative w-full max-w-2xl rounded-2xl border border-ui-border bg-ui-surface p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Nouveau partage</h2>
                <button
                  onClick={() => setOpenForm(false)}
                  className="w-9 h-9 grid place-items-center rounded-lg bg-white/5 hover:bg-white/10"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">Titre *</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-ui-border px-4 py-2.5 outline-none focus:border-rose/60"
                    placeholder="Roadtrip en Norvège"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Destination</label>
                  <input
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-ui-border px-4 py-2.5 outline-none focus:border-rose/60"
                    placeholder="Oslo, Lofoten…"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm mb-1">Début</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full rounded-xl bg-white/5 border border-ui-border px-4 py-2.5 outline-none focus:border-rose/60"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Fin</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full rounded-xl bg-white/5 border border-ui-border px-4 py-2.5 outline-none focus:border-rose/60"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">Description</label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-ui-border px-4 py-2.5 outline-none focus:border-rose/60 resize-y"
                    placeholder="Moments forts, conseils, immanquables…"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImage(e.target.files?.[0])}
                    className="block w-full text-sm file:mr-3 file:rounded-lg file:border file:border-white/10 file:bg-white/5 file:px-3 file:py-2 hover:file:bg-white/10"
                  />
                  {photoDataUrl && (
                    <img
                      src={photoDataUrl}
                      alt="preview"
                      className="mt-3 w-full h-40 object-cover rounded-xl border border-ui-border"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm mb-1">Sacs à associer</label>
                  <div className="rounded-xl border border-ui-border bg-white/5 p-2 max-h-40 overflow-auto">
                    {bags.length === 0 ? (
                      <p className="text-sm text-white/70 px-2 py-1.5">
                        Aucun sac trouvé. Crée d’abord un sac dans Dashboard.
                      </p>
                    ) : (
                      <ul className="grid gap-1">
                        {bags.map((b) => {
                          const checked = selectedBagIds.includes(b.id);
                          return (
                            <li key={b.id}>
                              <label className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleBag(b.id)}
                                  className="accent-current"
                                />
                                <span>{b.name}</span>
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    resetForm();
                    setOpenForm(false);
                  }}
                  className="rounded-lg border border-white/15 text-white/85 px-4 py-2 bg-white/5 hover:bg-white/10"
                >
                  Annuler
                </button>
                <button
                  onClick={createPost}
                  disabled={!canSubmit || !user}
                  className="rounded-lg border border-rose text-rose px-4 py-2 bg-ui-base/60 hover:bg-rose/10 disabled:opacity-60"
                >
                  Publier
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Feed */}
        <section className="mt-6 grid gap-6">
          {posts.length === 0 ? (
            <div className="rounded-2xl border border-ui-border bg-ui-surface p-8 text-center text-white/70">
              Aucun post pour le moment. Sois le premier à partager ton voyage !
            </div>
          ) : (
            posts.map((p) => (
              <article
                key={p.id}
                className="rounded-2xl border border-ui-border bg-ui-surface overflow-hidden shadow-lg"
              >
                {p.photoDataUrl && (
                  <img
                    src={p.photoDataUrl}
                    alt={p.title}
                    className="w-full h-72 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-semibold text-white/95">{p.title}</h3>
                      <p className="text-sm text-white/60">
                        par {p.authorName || p.authorEmail} •{" "}
                        {new Date(p.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {user?.email === p.authorEmail && (
                      <button
                        onClick={() => removePost(p.id)}
                        className="text-sm rounded-lg border border-white/15 px-3 py-1.5 bg-white/5 hover:bg-white/10"
                        title="Supprimer mon post"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>

                  {(p.destination || p.startDate || p.endDate) && (
                    <p className="mt-2 text-white/80">
                      {p.destination ? `📍 ${p.destination}` : ""}
                      {(p.startDate || p.endDate) && (
                        <>
                          {" "}
                          • 🗓 {p.startDate ?? "?"} → {p.endDate ?? "?"}
                        </>
                      )}
                    </p>
                  )}

                  {p.description && (
                    <p className="mt-3 text-white/90 leading-relaxed whitespace-pre-wrap">
                      {p.description}
                    </p>
                  )}

                  {p.bagNames.length > 0 && (
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {p.bagNames.map((n, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 rounded-md border border-rose/40 text-rose/90 bg-rose/5"
                        >
                          🎒 {n}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}