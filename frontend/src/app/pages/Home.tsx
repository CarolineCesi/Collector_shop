import { Link } from "react-router";
import { Star, ShieldCheck, Flame } from "lucide-react";
import { useState, useEffect } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { CountdownTimer } from "../components/CountdownTimer";
import { fetchTrendingProducts, fetchExclusiveProduct } from "../../api";



const CATEGORIES = ["Sneakers", "Toys & Action Figures", "Posters", "Retro Tech", "Trading Cards", "Comics", "Watches"];

export function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [exclusive, setExclusive] = useState<any>(null);

  useEffect(() => {
    fetchTrendingProducts().then(setProducts).catch(console.error);
    fetchExclusiveProduct().then(setExclusive).catch(console.error);
  }, []);

  const targetDate = new Date();
  targetDate.setHours(targetDate.getHours() + 2);
  targetDate.setMinutes(targetDate.getMinutes() + 14);
  targetDate.setSeconds(targetDate.getSeconds() + 59);

  return (
    <div className="pb-24 bg-cyan-950 min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-cyan-950">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src={exclusive?.images?.[0] || exclusive?.image || "https://images.unsplash.com/photo-1576884456974-5d4f358a61c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYXJlJTIwdmludGFnZSUyMHNuZWFrZXIlMjBzaG9lfGVufDF8fHx8MTc3MTg3MTQ2NHww&ixlib=rb-4.1.0&q=80&w=1080"}
            alt="Exclusive drop item"
            className="w-full h-full object-cover object-center opacity-40 blur-[2px] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-950 via-cyan-950/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-950 via-cyan-950/40 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 py-16 md:py-32 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 bg-cyan-900/80 border border-amber-400/30 text-amber-400 px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wider backdrop-blur-md shadow-lg shadow-amber-900/10">
              <Flame size={16} className="text-amber-400 fill-amber-400" /> Exclusive Drop
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tighter text-stone-100">
              {exclusive?.title?.split(' (')[0] || "Nike Air Jordan 1"} <br />
              <span className="text-cyan-200/70 font-light italic font-serif">
                {exclusive?.title?.includes('(') ? `(${exclusive.title.split('(')[1]}` : "Original (1985)"}
              </span>
            </h1>

            <p className="text-stone-300 text-lg md:text-xl max-w-xl leading-relaxed">
              {exclusive?.description?.substring(0, 100) || "Mint condition. Verified authentic by Collector.shop experts. Extremely rare Chicago colorway."}...
            </p>

            <div className="pt-4">
              <p className="text-sm text-cyan-400 font-medium mb-3 uppercase tracking-wider">Starts In</p>
              <CountdownTimer targetDate={targetDate} />
            </div>

            <div className="pt-4 flex gap-4">
              <Link
                to={`/product/${exclusive?.id || 'item1'}`}
                className="bg-amber-400 hover:bg-amber-300 text-cyan-950 px-8 py-3 rounded-full font-bold transition-all hover:scale-105 shadow-lg shadow-amber-400/20"
              >
                View Drop Details
              </Link>
            </div>
          </div>

          <div className="flex-1 w-full max-w-lg">
            <div className="relative rounded-2xl overflow-hidden border border-cyan-800 shadow-2xl shadow-amber-400/10 rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
              <ImageWithFallback
                src={exclusive?.images?.[0] || exclusive?.image || "https://images.unsplash.com/photo-1576884456974-5d4f358a61c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYXJlJTIwdmludGFnZSUyMHNuZWFrZXIlMjBzaG9lfGVufDF8fHx8MTc3MTg3MTQ2NHww&ixlib=rb-4.1.0&q=80&w=1080"}
                alt={exclusive?.title || "Nike Air Jordan 1 Original"}
                className="w-full h-auto aspect-square object-cover"
              />
              <div className="absolute top-4 right-4 bg-cyan-950/90 text-stone-100 px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 backdrop-blur-md border border-cyan-800">
                <ShieldCheck size={16} className="text-amber-400" /> Verified
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Row */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar snap-x">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              className="whitespace-nowrap bg-cyan-900/40 border border-cyan-800/50 text-stone-300 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-cyan-800 hover:text-stone-100 transition-colors snap-start focus:ring-1 focus:ring-amber-400 outline-none"
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Trending Feed */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-stone-100">Trending Now</h2>
          <Link to="#" className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((item) => (
            <Link
              key={item.id}
              to={`/product/${item.id}`}
              className="group block bg-cyan-900/20 rounded-2xl overflow-hidden border border-cyan-800/50 hover:border-cyan-700 transition-all hover:bg-cyan-900/40 shadow-lg hover:shadow-xl hover:shadow-cyan-900/20"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-cyan-900">
                <ImageWithFallback
                  src={item.image || (item.images && item.images[0])}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 bg-cyan-950/80 text-stone-200 px-2 py-1 rounded text-xs font-semibold backdrop-blur-md flex items-center gap-1 border border-cyan-700">
                  <ShieldCheck size={14} className="text-amber-400" /> Authentic
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs text-cyan-400 font-medium mb-1 uppercase tracking-wider">{item.category}</p>
                <h3 className="font-semibold text-stone-100 line-clamp-2 leading-tight mb-3 group-hover:text-amber-400 transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-bold text-lg text-stone-100">{item.price}</span>
                  <div className="flex items-center gap-1 text-sm text-stone-400">
                    <Star size={14} className="fill-amber-500 text-amber-500" />
                    <span>{item.sellerRating || (item.seller && item.seller.rating)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
