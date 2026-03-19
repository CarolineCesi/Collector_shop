import { Outlet, ScrollRestoration } from "react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Layout() {
  return (
    <div className="min-h-screen bg-cyan-950 text-stone-100 font-sans selection:bg-amber-400/30 selection:text-amber-400">
      <div className="fixed top-4 right-4 z-50">
        <div className="inline-flex items-center gap-2 bg-amber-400/90 text-cyan-950 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-400/20 border border-amber-200/30 backdrop-blur">
          DEV
          <span className="opacity-80 font-semibold normal-case tracking-normal">
            Environnement de développement
          </span>
        </div>
      </div>
      <Header />
      <main className="min-h-[calc(100vh-64px)]">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}
