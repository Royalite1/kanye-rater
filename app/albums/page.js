"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";
import { computeAlbumMeans, computeSongMeans } from "../../lib/aggregate";
import { formatRating, ratingColorClass } from "../../lib/ratingUtils";

export default function AlbumsPage() {
  const [albums, setAlbums] = useState([]);
  const [albumMeans, setAlbumMeans] = useState(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [albumsRes, songsRes, ratingsRes] = await Promise.all([
        supabase.from("albums").select("id, title, release_year, sort_order").order("sort_order"),
        supabase.from("songs").select("id, album_id"),
        supabase.from("ratings").select("song_id, rating")
      ]);
      const sMeans = computeSongMeans(ratingsRes.data || []);
      const aMeans = computeAlbumMeans(songsRes.data || [], sMeans);
      setAlbums(albumsRes.data || []);
      setAlbumMeans(aMeans);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-6">Albums</h1>
      {loading && <p className="text-gray-500">Loading…</p>}
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
              <p className={`text-2xl font-bold ${ratingColorClass(stat?.mean)}`}>
                {formatRating(stat?.mean)}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
