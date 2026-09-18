"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } }
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }

    // If email confirmation is required, there's no session yet.
    if (!data.session) {
      setConfirmationSent(true);
      return;
    }

    router.push("/");
  }

  if (confirmationSent) {
    return (
      <div className="max-w-sm mx-auto card p-6 text-center">
        <h1 className="text-xl font-bold mb-2">Check your email</h1>
        <p className="text-gray-400 text-sm">
          We sent a confirmation link to {email}. Click it, then come back and log in.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto card p-6">
      <h1 className="text-2xl font-bold mb-4">Create an account</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          required
          placeholder="Username (shown to friends)"
          className="input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          required
          placeholder="Email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Password (min 6 characters)"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="btn w-full">
          {loading ? "Creating account…" : "Sign up"}
        </button>
      </form>
      <p className="text-sm text-gray-500 mt-4">
        Already have an account?{" "}
        <Link href="/login" className="text-accent hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
