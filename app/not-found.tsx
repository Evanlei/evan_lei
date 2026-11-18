import type { Metadata } from "next";

export const metadata: Metadata = { title: "Off the trail · Evan Lei" };

export default function NotFound() {
  return (
    <main className="not-found">
      <section className="panel">
        <span className="kicker">404 · Off the trail</span>
        <h2>This path doesn&apos;t go anywhere.</h2>
        <p>The page you&apos;re looking for isn&apos;t on the map.</p>
        <div className="links">
          <a href="/">Back to base camp</a>
        </div>
      </section>
    </main>
  );
}
