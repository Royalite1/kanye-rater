// Pure JS aggregation so we don't depend on Postgres view embedding quirks.
// ratings: [{ song_id, rating, user_id }, ...]
// songs:   [{ id, album_id }, ...]

export function computeSongMeans(ratings) {
  const bySong = new Map(); // song_id -> { sum, count }
  for (const r of ratings) {
    if (r.rating === null || r.rating === undefined) continue;
    const entry = bySong.get(r.song_id) || { sum: 0, count: 0 };
    entry.sum += Number(r.rating);
    entry.count += 1;
    bySong.set(r.song_id, entry);
  }
  const result = new Map(); // song_id -> { mean, count }
  for (const [songId, { sum, count }] of bySong.entries()) {
    result.set(songId, { mean: Math.round((sum / count) * 10) / 10, count });
  }
  return result;
}

// Album rating = mean of that album's song means (only songs with >=1 rating count).
export function computeAlbumMeans(songs, songMeans) {
  const byAlbum = new Map(); // album_id -> { sum, count }
  for (const song of songs) {
    const stat = songMeans.get(song.id);
    if (!stat) continue;
    const entry = byAlbum.get(song.album_id) || { sum: 0, count: 0 };
    entry.sum += stat.mean;
    entry.count += 1;
    byAlbum.set(song.album_id, entry);
  }
  const result = new Map(); // album_id -> { mean, ratedSongCount }
  for (const [albumId, { sum, count }] of byAlbum.entries()) {
    result.set(albumId, { mean: Math.round((sum / count) * 10) / 10, ratedSongCount: count });
  }
  return result;
}

// Builds a lookup of a single user's ratings: song_id -> rating (or undefined).
export function userRatingMap(ratings, userId) {
  const map = new Map();
  for (const r of ratings) {
    if (r.user_id === userId) map.set(r.song_id, Number(r.rating));
  }
  return map;
}
