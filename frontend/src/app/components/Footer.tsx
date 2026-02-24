import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="bg-cyan-950 border-t border-cyan-900 text-cyan-400/80 py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded bg-amber-400 flex items-center justify-center font-bold text-cyan-950 text-sm">
              C
            </div>
            <span className="font-bold text-lg tracking-tight text-stone-100 font-serif">
              Collector<span className="text-amber-400">.shop</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed">
            The premium C2C marketplace for passionate collectors. Discover rare finds, verified authentic items, and exclusive drops.
          </p>
        </div>
        
        <div>
          <h4 className="text-stone-100 font-semibold mb-4">Marketplace</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="#" className="hover:text-amber-400 transition-colors">All Categories</Link></li>
            <li><Link to="#" className="hover:text-amber-400 transition-colors">Live Auctions</Link></li>
            <li><Link to="#" className="hover:text-amber-400 transition-colors">Exclusive Drops</Link></li>
            <li><Link to="#" className="hover:text-amber-400 transition-colors">Trending</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-stone-100 font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="#" className="hover:text-amber-400 transition-colors">Help Center</Link></li>
            <li><Link to="#" className="hover:text-amber-400 transition-colors">Trust & Safety</Link></li>
            <li><Link to="#" className="hover:text-amber-400 transition-colors">Selling Guide</Link></li>
            <li><Link to="#" className="hover:text-amber-400 transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-stone-100 font-semibold mb-4">Newsletter</h4>
          <p className="text-sm mb-4">Get notified about the latest drops and rare items.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Email address" 
              className="bg-cyan-900/40 border border-cyan-800 rounded px-3 py-2 text-sm w-full focus:outline-none focus:border-amber-400 placeholder:text-cyan-400/50 text-stone-100"
            />
            <button className="bg-amber-400 text-cyan-950 px-4 py-2 rounded font-medium text-sm hover:bg-amber-300 transition-colors font-bold">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-cyan-900 text-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© 2026 Collector.shop. All rights reserved.</p>
        <div className="flex gap-4">
          <Link to="#" className="hover:text-stone-100 transition-colors">Terms of Service</Link>
          <Link to="#" className="hover:text-stone-100 transition-colors">Privacy Policy</Link>
          <Link to="#" className="hover:text-stone-100 transition-colors">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  );
}
