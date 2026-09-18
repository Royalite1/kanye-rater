"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../lib/supabaseClient";
import { formatRating, ratingColorClass } from "../../../lib/ratingUtils";

export default function FriendProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [songsByAlbum, setSongsByAlbum] = useState(new Map());
  const [ratingsBySong, setRatingsBySong] = useState(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [profileRes, albumsRes, songsRes, ratingsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", id).maybeSingle(),
        supabase.from("albums").select("id, title, release_year, sort_order").order("sort_order"),
        supabase.from("songs").select("id, title, album_id, track_number").order("track_number"),
        supabase.from("ratings").select("song_id, rating").eq("user_id", id)
      ]);

      const grouped = new Map();
      for (const s of songsRes.data || []) {
        const list = grouped.get(s.album_id) || [];
        list.push(s);
        grouped.set(s.album_id, list);
      }

      const rMap = new Map();
      for (const r of ratingsRes.data || []) {
        rMap.set(r.song_id, Number(r.rating));
      }

      setProfile(profileRes.data);
      setAlbums(albumsRes.data || []);
      setSongsByAlbum(grouped);
      setRatingsBySong(rMap);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <p className="text-gray-500">Loading…</p>;
  if (!profile) return <p className="text-gray-500">User not found.</p>;

  return (
    <div>
      <Link href="/friends" className="text-sm text-gray-500 hover:text-accent">
        ← All friends
      </Link>
      <h1 className="text-3xl font-extrabold mt-2 mb-6">{profile.username}'s ratings</h1>

      <div className="space-y-6">
        {albums.map((album) => {
          const songs = songsByAlbum.get(album.id) || [];
          const rated = songs
            .map((s) => ratingsBySong.get(s.id))
            .filter((v) => v !== undefined);
          const personalMean =
            rated.length > 0
              ? Math.round((rated.reduce((a, b) => a + b, 0) / rated.length) * 10) / 10
              : null;

          return (
            <div key={album.id} className="card">
              <div className="flex items-center justify-between px-4 py-3 border-b border-line">
                <div>
                  <p className="font-bold">{album.title}</p>
                  <p className="text-xs text-gray-500">{album.release_year}</p>
                </div>
                <p className={`text-xl font-bold ${ratingColorClass(personalMean)}`}>
                  {formatRating(personalMean)}
                </p>
              </div>
              <div className="divide-y divide-line">
                {songs.map((song) => {
                  const value = ratingsBySong.get(song.id) ?? null;
                  return (
                    <div key={song.id} className="flex items-center justify-between px-4 py-2">
                      <span className="text-sm">{song.title}</span>
                      <span className={`font-semibold ${ratingColorClass(value)}`}>
                        {formatRating(value)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
