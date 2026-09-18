"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../lib/supabaseClient";
import { useAuth } from "../../../lib/useAuth";
import { computeSongMeans, userRatingMap } from "../../../lib/aggregate";
import { formatRating, ratingColorClass } from "../../../lib/ratingUtils";
import RatingInput from "../../../components/RatingInput";

export default function AlbumDetailPage() {
  const { id } = useParams();
  const albumId = Number(id);
  const { user, loading: authLoading } = useAuth();

  const [album, setAlbum] = useState(null);
  const [songs, setSongs] = useState([]);
  const [songMeans, setSongMeans] = useState(new Map());
  const [myRatings, setMyRatings] = useState(new Map());
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [albumRes, songsRes] = await Promise.all([
      supabase.from("albums").select("*").eq("id", albumId).maybeSingle(),
      supabase.from("songs").select("*").eq("album_id", albumId).order("track_number")
    ]);
    const songRows = songsRes.data || [];
    const songIds = songRows.map((s) => s.id);

    const ratingsRes = songIds.length
      ? await supabase.from("ratings").select("song_id, rating, user_id").in("song_id", songIds)
      : { data: [] };

    setAlbum(albumRes.data);
    setSongs(songRows);
    setSongMeans(computeSongMeans(ratingsRes.data || []));
    setMyRatings(user ? userRatingMap(ratingsRes.data || [], user.id) : new Map());
    setLoading(false);
  }, [albumId, user]);

  useEffect(() => {
    if (!authLoading) load();
  }, [authLoading, load]);

  const albumMean = (() => {
    const values = songs.map((s) => songMeans.get(s.id)?.mean).filter((v) => v !== undefined);
    if (values.length === 0) return null;
    return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
  })();

  if (loading) return <p className="text-gray-500">Loading…</p>;
  if (!album) return <p className="text-gray-500">Album not found.</p>;

  return (
    <div>
      <Link href="/albums" className="text-sm text-gray-500 hover:text-accent">
        ← All albums
      </Link>
      <div className="flex items-end justify-between mt-2 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold">{album.title}</h1>
          <p className="text-gray-500">{album.release_year}</p>
        </div>
        <div className="text-right">
          <p className={`text-4xl font-extrabold ${ratingColorClass(albumMean)}`}>
            {formatRating(albumMean)}
          </p>
          <p className="text-xs text-gray-500">community album mean</p>
        </div>
      </div>

      {!user && (
        <p className="mb-4 text-sm text-amber-300 bg-amber-900/20 border border-amber-800 rounded-lg px-3 py-2">
          <Link href="/login" className="underline">
            Log in
          </Link>{" "}
          to rate these songs yourself.
        </p>
      )}

      <div className="card divide-y divide-line">
        <div className="grid grid-cols-[2rem_1fr_5rem_11rem] gap-2 px-4 py-2 text-xs uppercase tracking-wide text-gray-500">
          <span>#</span>
          <span>Song</span>
          <span className="text-right">Mean</span>
          <span className="text-right">Your rating</span>
        </div>
        {songs.map((song) => {
          const stat = songMeans.get(song.id);
          return (
            <div
              key={song.id}
              className="grid grid-cols-[2rem_1fr_5rem_11rem] gap-2 items-center px-4 py-3"
            >
              <span className="text-gray-500 text-sm">{song.track_number}</span>
              <span className="font-medium">{song.title}</span>
              <span className={`text-right font-bold ${ratingColorClass(stat?.mean)}`}>
                {formatRating(stat?.mean)}
              </span>
              <div className="flex justify-end">
                {user ? (
                  <RatingInput
                    userId={user.id}
                    songId={song.id}
                    initialValue={myRatings.get(song.id) ?? null}
                    onSaved={(val) => {
                      setMyRatings((prev) => {
                        const next = new Map(prev);
                        if (val === null) next.delete(song.id);
                        else next.set(song.id, val);
                        return next;
                      });
                      // Recompute this song's community mean locally for snappy UI,
                      // then do a light refetch to stay accurate across users.
                      load();
                    }}
                  />
                ) : (
                  <span className="text-gray-600 text-sm">—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
