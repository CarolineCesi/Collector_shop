import { Link } from "react-router";
import { Heart, ShoppingBag, ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { fetchUserFavorites } from "../../api";
import { useUser } from "../context/UserContext";

export function Favorites() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useUser();

  useEffect(() => {
    if (!userId) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchUserFavorites(userId)
      .then(data => { setFavorites(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, [userId]);

  if (loading) {
    return <div className="container mx-auto px-4 py-24 text-center text-cyan-400">Loading favorites...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-stone-100 flex items-center gap-3">
          <Heart className="fill-amber-400 text-amber-400" size={32} />
          My Favorites
        </h1>
        <div className="text-cyan-400 text-sm font-medium">
          {favorites.length} items saved
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-cyan-900/20 rounded-2xl border border-cyan-800/50 border-dashed">
          <div className="w-16 h-16 rounded-full bg-cyan-900/50 flex items-center justify-center text-cyan-600 mb-4">
            <Heart size={32} />
          </div>
          <h2 className="text-xl font-bold text-stone-100 mb-2">Your wishlist is empty</h2>
          <p className="text-cyan-400 mb-6">Start exploring to find rare treasures.</p>
          <Link to="/" className="bg-amber-400 text-cyan-950 px-6 py-2.5 rounded-full font-bold hover:bg-amber-300 transition-colors">
            Explore Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((item) => (
            <div
              key={item.id}
              className="group bg-cyan-900/20 rounded-2xl overflow-hidden border border-cyan-800/50 hover:border-cyan-700 transition-all hover:bg-cyan-900/40 relative"
            >
              <div className="relative aspect-[4/5] bg-cyan-900 overflow-hidden">
                <ImageWithFallback
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Active Heart Icon */}
                <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-cyan-950/80 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform shadow-lg z-10">
                  <Heart size={16} className="fill-amber-400 text-amber-400" />
                </button>

                {/* Badge */}
                {item.badge && (
                  <div className="absolute top-3 left-3 bg-amber-400 text-cyan-950 text-[10px] font-bold px-2 py-1 rounded shadow-md uppercase tracking-wide">
                    {item.badge}
                  </div>
                )}

                {/* Quick Add Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-cyan-950/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
                  <button className="bg-stone-100 text-cyan-950 px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2 hover:bg-white transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <ShoppingBag size={14} /> Add to Cart
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-stone-100 leading-tight mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-amber-400 transition-colors">
                  <Link to={`/product/${item.id}`}>
                    {item.title}
                  </Link>
                </h3>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg text-stone-100">{item.price}</span>
                  <Link to={`/product/${item.id}`} className="text-cyan-400 hover:text-stone-100 transition-colors">
                    <ArrowUpRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
