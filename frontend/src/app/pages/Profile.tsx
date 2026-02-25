import { MapPin, Calendar, Star, Settings, Edit3, Grid, MessageSquare, Plus, LogOut } from "lucide-react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useState, useEffect } from "react";
import { fetchUser, fetchUserProducts, addProduct } from "../../api";
import { useUser } from "../context/UserContext";
import { useI18n } from "../context/I18nContext";
import { ModalAddItem } from "../components/ModalAddItem";

export function Profile() {
  const [activeTab, setActiveTab] = useState("listings");
  const [user, setUser] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const { userId, user: contextUser, logout } = useUser();
  const { t, formatPrice } = useI18n();

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    Promise.all([fetchUser(userId), fetchUserProducts(userId)])
      .then(([userData, productsData]) => { setUser(userData); setListings(productsData); setLoading(false); })
      .catch(err => { console.error(err); if (contextUser) setUser(contextUser); setLoading(false); });
  }, [userId]);

  const handleAddItem = async (item: { title: string; category: string; price: number; condition: string; description: string; imageUrl: string; }) => {
    if (!userId) return;
    try {
      const newProduct = await addProduct({
        title: item.title, category: item.category, price: item.price, condition: item.condition, description: item.description,
        images: item.imageUrl ? [item.imageUrl] : [],
        seller: contextUser ? { name: contextUser.name, avatar: contextUser.avatar, rating: contextUser.rating, reviews: contextUser.reviewsCount } : undefined,
        user_id: userId,
      });
      setListings(prev => [{ id: newProduct.id, title: newProduct.title, price: newProduct.price, image: newProduct.images?.[0] || item.imageUrl || '', status: "Active", views: 0, likes: 0 }, ...prev]);
    } catch (err) { console.error("Failed to add product:", err); }
  };

  if (loading) return <div className="container mx-auto px-4 py-24 text-center text-cyan-400">{t('profile.loading')}</div>;
  if (!user) return <div className="container mx-auto px-4 py-24 text-center text-red-400">{t('profile.error')}</div>;

  return (
    <div className="bg-cyan-950 min-h-screen pb-24">
      <div className="h-48 md:h-64 w-full relative overflow-hidden">
        <ImageWithFallback src={user.cover} alt="Cover" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-950 to-transparent"></div>
      </div>
      <div className="container mx-auto px-4 relative -mt-20">
        <div className="flex flex-col md:flex-row items-end md:items-center gap-6 mb-8">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-cyan-950 shadow-2xl overflow-hidden shrink-0 bg-cyan-900 relative group">
            <ImageWithFallback src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            <button className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Edit3 className="text-white" /></button>
          </div>
          <div className="flex-1 pb-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-stone-100">{user.name}</h1>
                <p className="text-cyan-400 font-medium">{user.handle}</p>
              </div>
              <div className="flex gap-3">
                <button className="bg-cyan-800 hover:bg-cyan-700 text-stone-100 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"><Edit3 size={16} /> {t('profile.editProfile')}</button>
                <button className="bg-cyan-800 hover:bg-cyan-700 text-stone-100 p-2 rounded-lg transition-colors"><Settings size={20} /></button>
                <button onClick={logout} className="bg-red-900/40 hover:bg-red-900/60 border border-red-800/50 text-red-200 p-2 rounded-lg transition-colors" title="Log out"><LogOut size={20} /></button>
              </div>
            </div>
            <p className="text-stone-300 mt-4 max-w-2xl text-sm leading-relaxed">{user.bio}</p>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-cyan-400/80">
              <span className="flex items-center gap-1"><Calendar size={14} /> {user.joined}</span>
              <span className="flex items-center gap-1"><MapPin size={14} /> {user.location}</span>
              <span className="flex items-center gap-1 text-amber-400 font-medium"><Star size={14} className="fill-amber-400" /> {user.rating} <span className="text-cyan-400/80">({user.reviewsCount || user.reviews_count} {t('profile.reviews').toLowerCase()})</span></span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 border-y border-cyan-800/50 py-6 mb-8">
          <div className="text-center"><div className="text-2xl font-bold text-stone-100">{user.stats?.sold ?? 0}</div><div className="text-xs text-cyan-400 uppercase tracking-wider font-medium">{t('profile.itemsSold')}</div></div>
          <div className="text-center border-l border-cyan-800/50"><div className="text-2xl font-bold text-stone-100">{user.stats?.active ?? listings.length}</div><div className="text-xs text-cyan-400 uppercase tracking-wider font-medium">{t('profile.activeListings')}</div></div>
          <div className="text-center border-l border-cyan-800/50"><div className="text-2xl font-bold text-stone-100">{user.stats?.followers ?? 0}</div><div className="text-xs text-cyan-400 uppercase tracking-wider font-medium">{t('profile.followers')}</div></div>
        </div>

        <div className="flex items-center gap-6 border-b border-cyan-800/50 mb-8">
          <button onClick={() => setActiveTab("listings")} className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${activeTab === "listings" ? "text-amber-400 border-amber-400" : "text-stone-400 border-transparent hover:text-stone-200"}`}><Grid size={16} /> {t('profile.myListings')}</button>
          <button onClick={() => setActiveTab("reviews")} className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${activeTab === "reviews" ? "text-amber-400 border-amber-400" : "text-stone-400 border-transparent hover:text-stone-200"}`}><MessageSquare size={16} /> {t('profile.reviews')}</button>
        </div>

        {activeTab === "listings" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div onClick={() => setShowAddModal(true)} className="aspect-[4/5] rounded-2xl border-2 border-dashed border-cyan-800 flex flex-col items-center justify-center gap-3 text-cyan-400 hover:text-amber-400 hover:border-amber-400/50 hover:bg-cyan-900/20 transition-all cursor-pointer group">
              <div className="w-12 h-12 rounded-full bg-cyan-900/50 flex items-center justify-center group-hover:scale-110 transition-transform"><Plus size={24} /></div>
              <span className="text-sm font-medium">{t('profile.addItem')}</span>
            </div>
            {listings.map(item => (
              <Link key={item.id} to={`/product/${item.id}`} className="group block bg-cyan-900/20 rounded-2xl overflow-hidden border border-cyan-800/50 hover:border-cyan-700 transition-all">
                <div className="relative aspect-square bg-cyan-900">
                  <ImageWithFallback src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  {item.status === "Sold" && <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm"><span className="font-bold text-white tracking-widest uppercase border-2 border-white px-4 py-1">{t('profile.sold')}</span></div>}
                  {item.status === "Active" && <div className="absolute top-2 right-2 bg-amber-400 text-cyan-950 text-xs font-bold px-2 py-0.5 rounded shadow-sm">{t('profile.active')}</div>}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-stone-100 truncate mb-1">{item.title}</h3>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-stone-100">{formatPrice(item.price)}</span>
                    <div className="text-xs text-cyan-400 flex items-center gap-3"><span>{item.views} {t('profile.views')}</span><span>{item.likes} {t('profile.likes')}</span></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <ModalAddItem open={showAddModal} onClose={() => setShowAddModal(false)} onSubmit={handleAddItem} />
    </div>
  );
}
