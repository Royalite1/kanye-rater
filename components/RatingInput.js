"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { clampRating, formatRating, ratingColorClass } from "../lib/ratingUtils";

export default function RatingInput({ userId, songId, initialValue, onSaved }) {
  const [value, setValue] = useState(
    initialValue === null || initialValue === undefined ? "" : String(initialValue)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function save(nextRaw) {
    if (nextRaw === "" || nextRaw === null) return;
    
    const clamped = clampRating(nextRaw);
    if (clamped === null) {
      setError("Enter a number between 0.0 and 10.0");
      return;
    }
    setError(null);
    setSaving(true);
    const { error: upsertError } = await supabase
      .from("ratings")
      .upsert(
        { user_id: userId, song_id: songId, rating: clamped },
        { onConflict: "user_id,song_id" }
      );
    setSaving(false);
    if (upsertError) {
      setError(upsertError.message);
      return;
    }
    setValue(String(clamped));
    onSaved?.(clamped);
  }

  async function clear() {
    setSaving(true);
    const { error: deleteError } = await supabase
      .from("ratings")
      .delete()
      .eq("user_id", userId)
      .eq("song_id", songId);
    setSaving(false);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setValue("");
    onSaved?.(null);
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min="0"
        max="10"
        step="0.1"
        value={value}
        placeholder="—"
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => value !== "" && save(value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") save(value);
        }}
        className="w-20 rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-center font-semibold text-white focus:border-yellow-500 focus:outline-none disabled:opacity-50"
        disabled={saving}
      />
      <input
        type="range"
        min="0"
        max="10"
        step="0.1"
        value={value === "" ? 0 : value}
        onChange={(e) => setValue(e.target.value)}
        onMouseUp={() => save(value)}
        onTouchEnd={() => save(value)}
        className="w-24 accent-yellow-500 cursor-pointer disabled:opacity-50"
        disabled={saving}
      />
      {value !== "" && (
        <button
          onClick={clear}
          title="Clear your rating"
          className="text-xs text-gray-500 hover:text-red-400"
          disabled={saving}
        >
          clear
        </button>
      )}
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}