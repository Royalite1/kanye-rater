import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Ye Rater — Kanye Song & Album Ratings",
  description: "Rate every Kanye West song with your friends and compare scores."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ink text-gray-100">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
