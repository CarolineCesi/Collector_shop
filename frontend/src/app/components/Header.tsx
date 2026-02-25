import { Search, SlidersHorizontal, Bell, ChevronDown, Heart } from "lucide-react";
import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useUser } from "../context/UserContext";
import { useI18n, LOCALES } from "../context/I18nContext";
import { useState, useRef, useEffect } from "react";

export function Header() {
  const { user } = useUser();
  const { locale, localeConfig, t, setLocale } = useI18n();
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cyan-900 bg-cyan-950/90 backdrop-blur-md text-stone-100 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <div className="w-8 h-8 rounded bg-amber-400 flex items-center justify-center font-bold text-cyan-950 text-xl group-hover:bg-amber-300 transition-colors">
            C
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block font-serif">
            Collector<span className="text-amber-400">.shop</span>
          </span>
        </Link>

        {/* Search Bar - Desktop */}
        <div className="flex-1 max-w-xl mx-auto hidden md:flex items-center relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400/70">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder={t('header.search')}
            className="w-full bg-cyan-900/40 border border-cyan-800/50 rounded-full py-2 pl-10 pr-12 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm transition-all placeholder:text-cyan-400/50 text-stone-100"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400/70 hover:text-amber-400 transition-colors">
            <SlidersHorizontal size={18} />
          </button>
        </div>

        {/* Right Nav */}
        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
          {/* Language/Currency Switcher */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 text-sm font-medium text-cyan-400/80 hover:text-stone-100 transition-colors px-2 py-1 rounded-lg hover:bg-cyan-900/50"
            >
              <span className="text-lg">{localeConfig.flag}</span>
              <span className="hidden sm:inline">{localeConfig.currencySymbol} {localeConfig.currency}</span>
              <ChevronDown size={14} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-cyan-900 border border-cyan-800 rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-2">
                  {LOCALES.map((loc) => (
                    <button
                      key={loc.code}
                      onClick={() => { setLocale(loc.code); setLangOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${locale === loc.code
                        ? 'bg-amber-400/10 text-amber-400 font-semibold'
                        : 'text-stone-300 hover:bg-cyan-800 hover:text-stone-100'
                        }`}
                    >
                      <span className="text-xl">{loc.flag}</span>
                      <div className="flex-1 text-left">
                        <div className="font-medium">{loc.label}</div>
                        <div className="text-xs text-cyan-400/60">{loc.currency} ({loc.currencySymbol})</div>
                      </div>
                      {locale === loc.code && (
                        <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Icons Group */}
          {user ? (
            <>
              <div className="flex items-center gap-3 sm:gap-4 border-l border-cyan-800 pl-3 sm:pl-4 ml-1">
                <Link to="/favorites" className="text-cyan-400/80 hover:text-amber-400 transition-colors relative group">
                  <Heart size={20} className="group-hover:fill-amber-400/20" />
                </Link>

                <Link to="/messages" className="hidden sm:block relative text-cyan-400/80 hover:text-stone-100 transition-colors">
                  <Bell size={20} />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-cyan-950"></span>
                </Link>
              </div>

              {/* User Avatar */}
              <Link to="/profile" className="w-9 h-9 rounded-full overflow-hidden border-2 border-cyan-800 hover:border-amber-400 transition-colors ring-2 ring-cyan-950 bg-cyan-900 flex items-center justify-center">
                {user.avatar ? (
                  <ImageWithFallback
                    src={user.avatar}
                    alt={user.name || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-cyan-400 font-bold text-sm">
                    {user.name?.charAt(0) || <Heart size={14} />}
                  </div>
                )}
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3 pl-3 sm:pl-4 ml-1 border-l border-cyan-800">
              <Link to="/login" className="text-sm font-medium text-stone-300 hover:text-amber-400 transition-colors">
                {t('common.signIn')}
              </Link>
              <Link to="/register" className="text-sm font-bold bg-amber-400 text-cyan-950 px-4 py-1.5 rounded-full hover:bg-amber-300 transition-colors">
                {t('common.signUp')}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search - Visible only on small screens */}
      <div className="md:hidden px-4 pb-3 border-t border-cyan-900/50 pt-3">
        <div className="flex items-center relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400/70">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder={t('header.searchMobile')}
            className="w-full bg-cyan-900/40 border border-cyan-800/50 rounded-full py-2 pl-10 pr-12 focus:outline-none focus:border-amber-400 text-sm text-stone-100 placeholder:text-cyan-400/50"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400/70 hover:text-amber-400">
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
