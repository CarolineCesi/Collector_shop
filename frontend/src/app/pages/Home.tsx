import { Link, useNavigate } from "react-router";
import { Flame, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { fetchTrendingProducts, fetchExclusiveProduct, addFavorite, removeFavorite, fetchUserFavorites } from "../../api";
import { useUser } from "../context/UserContext";
import { useI18n } from "../context/I18nContext";

const CATEGORY_KEYS = ["sneakers", "toys", "posters", "retroTech", "tradingCards", "comics", "watches"];

export function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [exclusive, setExclusive] = useState<any>(null);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const { userId, user } = useUser();
  const { t, formatPrice } = useI18n();
  const navigate = useNavigate();
  const isDev = import.meta.env.DEV;

  useEffect(() => {
    fetchTrendingProducts().then(setProducts).catch(console.error);
    fetchExclusiveProduct().then(setExclusive).catch(console.error);
  }, []);

  useEffect(() => {
    if (!userId) { setFavoriteIds(new Set()); return; }
    fetchUserFavorites(userId)
      .then(favs => setFavoriteIds(new Set(favs.map((f: any) => f.id))))
      .catch(console.error);
  }, [userId]);

  const toggleFavorite = async (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { navigate("/login"); return; }
    const isFav = favoriteIds.has(item.id);
    try {
      if (isFav) {
        await removeFavorite(userId!, item.id);
        setFavoriteIds(prev => { const next = new Set(prev); next.delete(item.id); return next; });
      } else {
        await addFavorite(userId!, item.id, {
          id: item.id, title: item.title, price: item.price,
          image: item.image || (item.images && item.images[0]), category: item.category,
        });
        setFavoriteIds(prev => new Set(prev).add(item.id));
      }
    } catch (err) { console.error('Failed to toggle favorite:', err); }
  };

  return (
    <div className="pb-24 bg-cyan-950 min-h-screen">
      {isDev && (
        <div className="fixed top-4 right-4 z-50">
          <div className="inline-flex items-center gap-2 bg-amber-400/90 text-cyan-950 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-400/20 border border-amber-200/30 backdrop-blur">
            DEV
            <span className="opacity-80 font-semibold normal-case tracking-normal">
              Environnement de développement Collector.shop - DEV
            </span>
          </div>
        </div>
      )}
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-cyan-950">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src={exclusive?.images?.[0] || exclusive?.image || "https://images.unsplash.com/photo-1576884456974-5d4f358a61c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYXJlJTIwdmludGFnZSUyMHNuZWFrZXIlMjBzaG9lfGVufDF8fHx8MTc3MTg3MTQ2NHww&ixlib=rb-4.1.0&q=80&w=1080"}
            alt="Exclusive drop" className="w-full h-full object-cover object-center opacity-40 blur-[2px] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-950 via-cyan-950/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-950 via-cyan-950/40 to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 py-16 md:py-32 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 bg-cyan-900/80 border border-amber-400/30 text-amber-400 px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wider backdrop-blur-md shadow-lg shadow-amber-900/10">
              <Flame size={16} className="text-amber-400 fill-amber-400" /> {t('home.exclusiveDrop')}
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tighter text-stone-100">
              {exclusive?.title?.split(' (')[0] || "Nike Air Jordan 1"} <br />
              <span className="text-cyan-200/70 font-light italic font-serif">
                {exclusive?.title?.includes('(') ? `(${exclusive.title.split('(')[1]}` : "Original (1985)"}
              </span>
            </h1>
            <p className="text-stone-300 text-lg md:text-xl max-w-xl leading-relaxed">
              {exclusive?.description?.substring(0, 100) || "Mint condition. Verified authentic."}...
            </p>
            <div className="pt-4 flex gap-4">
              <Link to={`/product/${exclusive?.id || 'item1'}`}
                className="bg-amber-400 hover:bg-amber-300 text-cyan-950 px-8 py-3 rounded-full font-bold transition-all hover:scale-105 shadow-lg shadow-amber-400/20">
                {t('home.viewDropDetails')}
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full max-w-lg">
            <div className="relative rounded-2xl overflow-hidden border border-cyan-800 shadow-2xl shadow-amber-400/10 rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
              <ImageWithFallback src={exclusive?.images?.[0] || exclusive?.image || ""} alt={exclusive?.title || ""} className="w-full h-auto aspect-square object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar snap-x">
          {CATEGORY_KEYS.map((key) => (
            <button key={key} className="whitespace-nowrap bg-cyan-900/40 border border-cyan-800/50 text-stone-300 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-cyan-800 hover:text-stone-100 transition-colors snap-start focus:ring-1 focus:ring-amber-400 outline-none">
              {t(`categories.${key}`)}
            </button>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-stone-100">{t('home.trendingNow')}</h2>
          <Link to="#" className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors">{t('home.viewAll')}</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((item) => {
            const isFav = favoriteIds.has(item.id);
            return (
              <Link key={item.id} to={`/product/${item.id}`} className="group block bg-cyan-900/20 rounded-2xl overflow-hidden border border-cyan-800/50 hover:border-cyan-700 transition-all hover:bg-cyan-900/40 shadow-lg hover:shadow-xl hover:shadow-cyan-900/20">
                <div className="relative aspect-[4/5] overflow-hidden bg-cyan-900">
                  <ImageWithFallback src={item.image || (item.images && item.images[0])} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <button onClick={(e) => toggleFavorite(e, item)} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-cyan-950/80 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-all shadow-lg z-10">
                    <Heart size={18} className={isFav ? "fill-amber-400 text-amber-400" : "text-white/80 hover:text-amber-400"} />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-xs text-cyan-400 font-medium mb-1 uppercase tracking-wider">{item.category}</p>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-stone-100 line-clamp-2 leading-tight group-hover:text-amber-400 transition-colors flex-1">{item.title}</h3>
                    <span className="font-bold text-lg text-stone-100 whitespace-nowrap shrink-0">{formatPrice(item.price)}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
