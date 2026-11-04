const norm = (s = "") =>
  s.toLowerCase().replace(/\(.*?\)|\[.*?\]/g, "").replace(/[^a-z0-9]/g, "");

export async function findDeezerAlbumId(title, artist) {
  try {
    const res = await fetch(`/api/deezer?q=${encodeURIComponent(`${title} ${artist}`)}`);
    if (!res.ok) return null;
    const data = await res.json();
    
    // Deezer API search returns data under `data`, not `albums`
    const albums = data.data || data.albums || [];
    if (albums.length === 0) return null;

    const t = norm(title);
    const a = norm(artist);

    // Pick the first result if available, or try to find a close match
    const match = albums.find((x) => {
      const xt = norm(x.title);
      const xa = norm(x.artist?.name || x.artist);
      return xt.includes(t) || t.includes(xt) || xa.includes(a) || a.includes(xa);
    }) || albums[0];

    return match?.id ?? null;
  } catch {
    return null;
  }
}