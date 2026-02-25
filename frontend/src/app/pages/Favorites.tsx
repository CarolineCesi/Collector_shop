import { Link } from "react-router";
import { Heart, ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { fetchUserFavorites, removeFavorite } from "../../api";
import { useUser } from "../context/UserContext";
import { useI18n } from "../context/I18nContext";

export function Favorites() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useUser();
  const { t, formatPrice } = useI18n();

  useEffect(() => {
    if (!userId) { setFavorites([]); setLoading(false); return; }
    setLoading(true);
    fetchUserFavorites(userId).then(data => { setFavorites(data); setLoading(false); }).catch(err => { console.error(err); setLoading(false); });
  }, [userId]);

  const handleRemoveFavorite = async (e: React.MouseEvent, itemId: string) => {
    e.preventDefault(); e.stopPropagation();
    if (!userId) return;
    try { await removeFavorite(userId, itemId); setFavorites(prev => prev.filter(f => f.id !== itemId)); }
    catch (err) { console.error('Failed to remove favorite:', err); }
  };

  if (loading) return <div className="container mx-auto px-4 py-24 text-center text-cyan-400">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-stone-100 flex items-center gap-3">
          <Heart className="fill-amber-400 text-amber-400" size={32} /> {t('favorites.title')}
        </h1>
        <div className="text-cyan-400 text-sm font-medium">{favorites.length} {t('favorites.itemsSaved')}</div>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-cyan-900/20 rounded-2xl border border-cyan-800/50 border-dashed">
          <div className="w-16 h-16 rounded-full bg-cyan-900/50 flex items-center justify-center text-cyan-600 mb-4"><Heart size={32} /></div>
          <h2 className="text-xl font-bold text-stone-100 mb-2">{t('favorites.emptyTitle')}</h2>
          <p className="text-cyan-400 mb-6">{t('favorites.emptyDesc')}</p>
          <Link to="/" className="bg-amber-400 text-cyan-950 px-6 py-2.5 rounded-full font-bold hover:bg-amber-300 transition-colors">{t('favorites.explore')}</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((item) => (
            <div key={item.id} className="group bg-cyan-900/20 rounded-2xl overflow-hidden border border-cyan-800/50 hover:border-cyan-700 transition-all hover:bg-cyan-900/40 relative">
              <div className="relative aspect-[4/5] bg-cyan-900 overflow-hidden">
                <ImageWithFallback src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <button onClick={(e) => handleRemoveFavorite(e, item.id)} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-cyan-950/80 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-all shadow-lg z-10">
                  <Heart size={18} className="fill-amber-400 text-amber-400" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-stone-100 leading-tight mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-amber-400 transition-colors">
                  <Link to={`/product/${item.id}`}>{item.title}</Link>
                </h3>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg text-stone-100">{formatPrice(item.price)}</span>
                  <Link to={`/product/${item.id}`} className="text-cyan-400 hover:text-stone-100 transition-colors"><ArrowUpRight size={18} /></Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
