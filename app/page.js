"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
import { computeAlbumMeans, computeSongMeans } from "../lib/aggregate";
import { formatRating, ratingColorClass } from "../lib/ratingUtils";

export default function HomePage() {
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  const [songMeans, setSongMeans] = useState(new Map());
  const [albumMeans, setAlbumMeans] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      const [albumsRes, songsRes, ratingsRes] = await Promise.all([
        supabase.from("albums").select("id, title, release_year, sort_order").order("sort_order"),
        supabase.from("songs").select("id, title, album_id, track_number"),
        supabase.from("ratings").select("song_id, rating, user_id")
      ]);

      const anyError = albumsRes.error || songsRes.error || ratingsRes.error;
      if (anyError) {
        setError(anyError.message);
        setLoading(false);
        return;
      }

      const sMeans = computeSongMeans(ratingsRes.data || []);
      const aMeans = computeAlbumMeans(songsRes.data || [], sMeans);

      setAlbums(albumsRes.data || []);
      setSongs(songsRes.data || []);
      setSongMeans(sMeans);
      setAlbumMeans(aMeans);
      setLoading(false);
    }
    load();
  }, []);

  const rankedSongs = songs
    .map((s) => ({ ...s, stat: songMeans.get(s.id) }))
    .filter((s) => s.stat)
    .sort((a, b) => b.stat.mean - a.stat.mean);

  const albumTitleById = new Map(albums.map((a) => [a.id, a.title]));

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-3xl font-extrabold tracking-tight mb-1">Community Ratings</h1>
        <p className="text-gray-400">
          The combined mean score across everyone who's rated each Kanye album and song.
        </p>
      </section>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      {loading && <p className="text-gray-500">Loading…</p>}

      <section>
        <h2 className="text-xl font-bold mb-3">Albums</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {albums.map((album) => {
            const stat = albumMeans.get(album.id);
            return (
              <Link
                key={album.id}
                href={`/albums/${album.id}`}
                className="card p-4 flex items-center justify-between hover:border-accent transition-colors"
              >
                <div>
                  <p className="font-semibold">{album.title}</p>
                  <p className="text-sm text-gray-500">{album.release_year}</p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${ratingColorClass(stat?.mean)}`}>
                    {formatRating(stat?.mean)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {stat?.ratedSongCount || 0} songs rated
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {!loading && rankedSongs.length > 0 && (
        <section className="grid sm:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-bold mb-3">🔥 Highest Rated Songs</h2>
            <div className="card divide-y divide-line">
              {rankedSongs.slice(0, 5).map((s) => (
                <SongRow key={s.id} song={s} albumTitle={albumTitleById.get(s.album_id)} />
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-3">🧊 Lowest Rated Songs</h2>
            <div className="card divide-y divide-line">
              {rankedSongs
                .slice(-5)
                .reverse()
                .map((s) => (
                  <SongRow key={s.id} song={s} albumTitle={albumTitleById.get(s.album_id)} />
                ))}
            </div>
          </div>
        </section>
      )}

      {!loading && albums.length === 0 && (
        <p className="text-gray-500">
          No albums yet — run the seed SQL from the README in your Supabase project.
        </p>
      )}
    </div>
  );
}

function SongRow({ song, albumTitle }) {
  return (
    <div className="flex items-center justify-between px-4 py-2">
      <div>
        <p className="text-sm font-medium">{song.title}</p>
        <p className="text-xs text-gray-500">{albumTitle}</p>
      </div>
      <p className={`font-bold ${ratingColorClass(song.stat.mean)}`}>{formatRating(song.stat.mean)}</p>
    </div>
  );
}
