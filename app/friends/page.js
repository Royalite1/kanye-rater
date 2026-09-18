"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../lib/useAuth";

export default function FriendsPage() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [counts, setCounts] = useState(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [{ data: profileRows }, { data: ratingRows }] = await Promise.all([
        supabase.from("profiles").select("id, username").order("username"),
        supabase.from("ratings").select("user_id")
      ]);

      const c = new Map();
      for (const r of ratingRows || []) {
        c.set(r.user_id, (c.get(r.user_id) || 0) + 1);
      }
      setProfiles(profileRows || []);
      setCounts(c);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-6">Friends</h1>
      {loading && <p className="text-gray-500">Loading…</p>}
      {!loading && profiles.length === 0 && (
        <p className="text-gray-500">Nobody's signed up yet — invite your friends!</p>
      )}
      <div className="grid sm:grid-cols-2 gap-3">
        {profiles.map((p) => (
          <Link
            key={p.id}
            href={`/friends/${p.id}`}
            className="card p-4 flex items-center justify-between hover:border-accent transition-colors"
          >
            <span className="font-semibold">
              {p.username}
              {p.id === user?.id && <span className="text-gray-500 font-normal"> (you)</span>}
            </span>
            <span className="text-sm text-gray-500">{counts.get(p.id) || 0} songs rated</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
