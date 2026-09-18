"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../lib/useAuth";

function NavLink({ href, children }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active ? "bg-panel text-accent" : "text-gray-300 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  const { user, profile, signOut } = useAuth();

  return (
    <header className="border-b border-line sticky top-0 z-20 bg-ink/95 backdrop-blur">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="font-bold text-lg tracking-tight text-accent">
          YE RATER
        </Link>
        <nav className="flex items-center gap-1">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/albums">Albums</NavLink>
          <NavLink href="/friends">Friends</NavLink>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-gray-400 hidden sm:inline">
                {profile?.username || user.email}
              </span>
              <button onClick={signOut} className="btn-ghost text-sm">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost text-sm">
                Log in
              </Link>
              <Link href="/signup" className="btn text-sm">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
