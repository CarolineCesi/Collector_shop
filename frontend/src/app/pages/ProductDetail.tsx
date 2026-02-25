import { useParams, Link, useNavigate } from "react-router";
import { ChevronRight, Heart, Share2, CheckCircle2, Lock, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { fetchProductById, checkFavorite, addFavorite, removeFavorite } from "../../api";
import { useUser } from "../context/UserContext";
import { useI18n } from "../context/I18nContext";

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const { user, userId } = useUser();
  const { t, formatPrice } = useI18n();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchProductById(id).then(data => { setItem(data); setLoading(false); }).catch(err => { setError(err.message); setLoading(false); });
    }
  }, [id]);

  useEffect(() => {
    if (userId && id) { checkFavorite(userId, id).then(res => setIsFav(res.isFavorite)).catch(() => { }); }
  }, [userId, id]);

  const handleFavoriteClick = async () => {
    if (!user) { navigate("/login"); return; }
    try {
      if (isFav) { await removeFavorite(userId!, id!); setIsFav(false); }
      else {
        await addFavorite(userId!, id!, { id: item.id, title: item.title, price: item.price, image: item.images?.[0] || '', category: item.category });
        setIsFav(true);
      }
    } catch (err) { console.error('Failed to toggle favorite:', err); }
  };

  if (loading) return <div className="p-24 text-stone-100 text-center text-xl">Loading...</div>;
  if (error || !item) return <div className="p-24 text-red-500 text-center text-xl">Error</div>;

  return (
    <div className="container mx-auto px-4 py-8 pb-24 max-w-6xl">
      <nav className="flex items-center gap-2 text-sm text-cyan-400 mb-8">
        <Link to="/" className="hover:text-amber-400 transition-colors flex items-center gap-1"><ArrowLeft size={14} /> {t('product.back')}</Link>
        <span className="mx-2 text-cyan-800">|</span>
        <Link to="/" className="hover:text-stone-100 transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link to="#" className="hover:text-stone-100 transition-colors">{item.category}</Link>
        <ChevronRight size={14} />
        <span className="text-stone-100 truncate max-w-[200px] sm:max-w-[400px] font-medium">{item.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="aspect-square bg-cyan-900/40 rounded-2xl overflow-hidden border border-cyan-800/50 flex items-center justify-center p-4 shadow-xl">
            <ImageWithFallback src={item.images[activeImage]} alt={item.title} className="w-full h-full object-contain drop-shadow-2xl mix-blend-lighten" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {item.images.map((img: string, idx: number) => (
              <button key={idx} onClick={() => setActiveImage(idx)} className={`aspect-square bg-cyan-900/40 rounded-xl overflow-hidden border-2 transition-all p-2 ${activeImage === idx ? 'border-amber-400' : 'border-cyan-800/50 hover:border-cyan-700'}`}>
                <ImageWithFallback src={img} alt={`${item.title} ${idx + 1}`} className="w-full h-full object-contain mix-blend-lighten" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-6">
            <div className="flex justify-between items-start gap-4 mb-4">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-100 leading-tight">{item.title}</h1>
              <div className="flex gap-2 shrink-0">
                <button onClick={handleFavoriteClick} className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${isFav ? "border-amber-400 bg-amber-400/10 text-amber-400" : "border-cyan-800 text-cyan-400 hover:text-amber-500 hover:border-amber-500 hover:bg-amber-500/10"}`}>
                  <Heart size={20} className={isFav ? "fill-amber-400" : ""} />
                </button>
                <button className="w-10 h-10 rounded-full border border-cyan-800 flex items-center justify-center text-cyan-400 hover:text-stone-100 hover:border-stone-100 hover:bg-white/10 transition-all">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm mb-6">
              <span className="bg-cyan-900/60 border border-cyan-700 text-stone-300 px-3 py-1 rounded-full font-medium">{item.condition}</span>
            </div>
            <div className="text-4xl md:text-5xl font-bold text-stone-100 font-mono tracking-tighter mb-8">{formatPrice(item.price)}</div>
          </div>

          <div className="space-y-4 mb-10">
            <button className="w-full bg-amber-400 hover:bg-amber-300 text-cyan-950 py-4 px-8 rounded-xl font-bold text-lg transition-transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20">
              <Lock size={20} /> {t('product.buyNow')}
            </button>
            <button className="w-full bg-transparent border-2 border-cyan-800 hover:border-cyan-700 text-stone-100 py-4 px-8 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2">
              {t('product.placeBid')}
            </button>
          </div>

          <div className="bg-cyan-900/30 border border-cyan-800/50 rounded-2xl p-6 mb-10 space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-amber-400 shrink-0 mt-0.5" size={20} />
              <div><h4 className="font-semibold text-stone-100 mb-1">{t('product.buyerProtection')}</h4><p className="text-sm text-stone-400 leading-relaxed">{t('product.buyerProtectionDesc')}</p></div>
            </div>
            <div className="flex items-start gap-3">
              <Lock className="text-amber-400 shrink-0 mt-0.5" size={20} />
              <div><h4 className="font-semibold text-stone-100 mb-1">{t('product.secureTransaction')}</h4><p className="text-sm text-stone-400 leading-relaxed">{t('product.secureTransactionDesc')}</p></div>
            </div>
          </div>

          {item.seller && (
            <div className="border-t border-cyan-900 pt-8 mb-10">
              <h3 className="text-lg font-bold text-stone-100 mb-4">{t('product.aboutSeller')}</h3>
              <div className="flex items-center justify-between bg-cyan-900/30 border border-cyan-800/50 rounded-2xl p-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-cyan-800">
                    <ImageWithFallback src={item.seller.avatar} alt={item.seller.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-100">{item.seller.name}</h4>
                    <div className="text-sm text-cyan-400 mt-1"><span>{item.seller.reviews} {t('product.reviews')}</span></div>
                  </div>
                </div>
                <button className="bg-cyan-800 hover:bg-cyan-700 text-stone-100 px-4 py-2 rounded-lg text-sm font-semibold transition-colors border border-cyan-700">{t('product.follow')}</button>
              </div>
            </div>
          )}

          <div className="border-t border-cyan-900 pt-8">
            <h3 className="text-lg font-bold text-stone-100 mb-4">{t('product.itemDescription')}</h3>
            <p className="text-stone-400 leading-relaxed whitespace-pre-wrap">{item.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
