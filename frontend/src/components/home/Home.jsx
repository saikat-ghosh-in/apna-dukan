import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  MdArrowForward, MdLocalOffer, MdVerified,
  MdStorefront, MdGridView, MdChevronLeft, MdChevronRight,
} from "react-icons/md";
import { FiArrowRight, FiChevronDown } from "react-icons/fi";
import { fetchCategories } from "../../reduxStore/actions/categoryActions";
import { fetchSellers } from "../../reduxStore/actions/sellerActions";
import api from "../../backend/api";
import ProductCard, { CardSkeleton } from "../product/ProductCard";
import { HERO_SLIDES, TRUST_BADGES, FOOTER_LINKS } from "./HomeData";

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`;

const GrainOverlay = ({ opacity = "opacity-[0.04]" }) => (
  <div
    className={`absolute inset-0 pointer-events-none ${opacity}`}
    style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }}
  />
);

const SectionHeader = ({ label, title, onViewAll }) => (
  <div className="flex items-end justify-between mb-8 sm:mb-10">
    <div>
      <p className="text-[10px] font-bold text-blue-500 tracking-[0.2em] uppercase mb-2">{label}</p>
      <h2 className="text-xl sm:text-2xl font-black text-gray-950">{title}</h2>
    </div>
    {onViewAll && (
      <button
        onClick={onViewAll}
        className="group flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-blue-500 transition-colors cursor-pointer shrink-0"
      >
        View All
        <MdArrowForward size={14} className="group-hover:translate-x-0.5 transition-transform" />
      </button>
    )}
  </div>
);

const HeroSlider = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % HERO_SLIDES.length);
    }, 5000);
  }, []);

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [startTimer]);

  const goTo = (i) => {
    if (i === current || animating) return;
    setAnimating(true);
    setCurrent(i);
    startTimer();
    setTimeout(() => setAnimating(false), 600);
  };

  const prev = () => goTo((current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const next = () => goTo((current + 1) % HERO_SLIDES.length);
  const slide = HERO_SLIDES[current];

  return (
    <section
      className={`relative overflow-hidden rounded-2xl sm:rounded-3xl bg-linear-to-br ${slide.gradient} transition-all duration-700`}
      style={{ minHeight: "clamp(400px, 78vh, 660px)" }}
    >
      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
      <GrainOverlay />

      {/* Ambient glow */}
      <div
        className={`absolute top-1/2 right-[-8%] -translate-y-1/2 w-125 h-125 ${slide.glowColor} rounded-full blur-[130px] pointer-events-none transition-colors duration-700`}
      />
      <div className="absolute -bottom-16 left-1/4 w-72 h-72 bg-indigo-500/8 rounded-full blur-[100px] pointer-events-none" />

      {/* Live pill — desktop */}
      {/* <div className="absolute top-6 right-6 hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        <span className="text-[11px] font-semibold text-white/50 tracking-wide">Live · 2M+ products</span>
      </div> */}

      {/* Floating stat badge — desktop */}
      <div className="absolute bottom-10 right-8 bg-white/8 border border-white/15 rounded-2xl px-4 py-3 text-right backdrop-blur-sm hidden sm:block">
        <p className="text-white/50 text-[10px] font-semibold uppercase tracking-widest">This month</p>
        <p className={`font-black text-2xl leading-none ${slide.textAccent}`}>{slide.badge.value}</p>
        <p className="text-white/50 text-[10px] mt-0.5">{slide.badge.label}</p>
      </div>

      {/* Main content */}
      <div
        key={current}
        className="relative z-10 flex flex-col justify-center px-6 py-14 sm:px-14 sm:py-20"
        style={{
          minHeight: "clamp(400px, 78vh, 660px)",
          animation: "slideIn 0.5s ease forwards",
        }}
      >
        {/* Tag pill */}
        <div className={`inline-flex items-center gap-2 text-white text-[10px] font-bold px-3.5 py-1.5 rounded-full mb-6 self-start ${slide.accentColor}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
          {slide.tag}
        </div>

        {/* Headline */}
        <h1 className="text-[clamp(2rem,7vw,5.5rem)] font-black tracking-tight leading-[0.95] mb-5 text-white">
          {slide.headline.map((line, i) => (
            <span key={i} className="block">
              {i === slide.italicLine
                ? <span className={`${slide.textAccent} italic font-light`}>{line}</span>
                : line
              }
            </span>
          ))}
        </h1>

        <p className="text-gray-400 text-sm max-w-sm mb-8 font-light leading-relaxed hidden sm:block">
          {slide.sub}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 items-start">
          <button
            onClick={() => navigate(slide.link)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-7 py-3.5 text-sm font-bold rounded-xl active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-blue-500/25"
          >
            {slide.cta} <FiArrowRight size={15} />
          </button>
          <button
            onClick={() => navigate(slide.ctaSecondaryLink)}
            className="flex items-center gap-2 border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white px-7 py-3.5 text-sm font-semibold rounded-xl transition-all cursor-pointer backdrop-blur-sm"
          >
            {slide.ctaSecondary}
          </button>
        </div>

        {/* Stats row */}
        <div className="flex gap-8 mt-10 pt-8 border-t border-white/[0.07]">
          {[["50K+", "Products"], ["200+", "Brands"], ["2M+", "Customers"]].map(([num, label]) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="text-xl sm:text-2xl font-black text-white tabular-nums">{num}</span>
              <span className="text-[9px] sm:text-[10px] font-semibold text-gray-500 uppercase tracking-[0.18em]">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-5 left-6 sm:left-14 flex items-center gap-2.5 z-10">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 cursor-pointer ${i === current ? "w-6 h-2 bg-white"
              : "w-2 h-2 bg-white/25 hover:bg-white/50"
              }`}
          />
        ))}
      </div>

      {/* Prev / Next arrows — desktop */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white/10 hover:bg-white/20 border border-white/15 rounded-full flex items-center justify-center text-white cursor-pointer transition-all backdrop-blur-sm max-sm:hidden"
      >
        <MdChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white/10 hover:bg-white/20 border border-white/15 rounded-full flex items-center justify-center text-white cursor-pointer transition-all backdrop-blur-sm max-sm:hidden"
      >
        <MdChevronRight size={20} />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
        <div
          key={`progress-${current}`}
          className="h-full bg-white/40"
          style={{ animation: "heroProgress 5s linear forwards" }}
        />
      </div>
    </section>
  );
};

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="bg-gray-950 text-gray-400 pt-14 pb-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-7 w-7 rounded-full overflow-hidden">
                <img src="/logo.jpg" alt="Mercato" className="h-full w-full object-cover" />
              </div>
              <h2 className="text-white text-xl font-black tracking-tight">
                Mercato<span className="text-blue-500">.</span>
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-gray-500 mb-6 max-w-xs">
              A curated marketplace for quality products at honest prices. Trusted by thousands.
            </p>
            <div className="flex gap-2">
              {["𝕏", "f", "in"].map((s, i) => (
                <button key={i} className="w-8 h-8 border border-gray-800 hover:border-gray-600 text-gray-500 hover:text-white text-xs rounded-lg transition-colors cursor-pointer">
                  {s}
                </button>
              ))}
            </div>
          </div>
          {FOOTER_LINKS.map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-white text-[10px] font-bold tracking-[0.18em] uppercase mb-5">{title}</h4>
              {links.map(({ label, href }) => (
                <button
                  key={label}
                  onClick={() => href.startsWith("/") ? navigate(href) : undefined}
                  className="block text-sm text-gray-500 hover:text-gray-200 mb-3 transition-colors cursor-pointer text-left w-full"
                >
                  {label}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800/60 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <span>© {new Date().getFullYear()} Mercato. All rights reserved.</span>
          <div className="flex gap-5">
            {["Terms", "Privacy", "Cookies"].map(l => (
              <a key={l} href="#" className="hover:text-gray-400 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};


const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categories } = useSelector(s => s.categories);
  const sellers = useSelector(s => s.sellers.sellers);

  const [products, setProducts] = useState([]);
  const [discounted, setDiscounted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDeals, setLoadingDeals] = useState(true);
  const [showAllCats, setShowAllCats] = useState(false);

  useEffect(() => {
    if (!categories?.length) dispatch(fetchCategories());
    if (!sellers?.length) dispatch(fetchSellers());
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/public/products", {
          params: { sortingOrder: "desc", pageSize: 8, sortBy: "createdAt" }
        });
        setProducts(data?.content ?? []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    const fetchDeals = async () => {
      try {
        const { data } = await api.get("/public/products", {
          params: { sortingOrder: "desc", pageSize: 4, sortBy: "discountPercent" }
        });
        setDiscounted((data?.content ?? []).filter(p => p.discountPercent > 0));
      } catch (err) { console.error(err); }
      finally { setLoadingDeals(false); }
    };
    fetchProducts();
    fetchDeals();
  }, []);

  const topSellers = sellers?.slice(0, 4) ?? [];
  const allCats = categories ?? [];
  const VISIBLE_COUNT = 8;
  const visibleCats = showAllCats ? allCats : allCats.slice(0, VISIBLE_COUNT);
  const hasMore = allCats.length > VISIBLE_COUNT;

  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
        <HeroSlider />
      </div>

      {/* Trust badges */}
      <section className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4">
            {TRUST_BADGES.map(({ icon, title, sub }) => (
              <div key={title} className="flex items-center gap-3">
                <span className="text-xl shrink-0">{icon}</span>
                <div>
                  <p className="text-xs font-bold text-gray-800">{title}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {allCats.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <SectionHeader
            label="Shop by Category"
            title="Browse Categories"
            onViewAll={() => navigate("/products")}
          />
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-3">
            {visibleCats.map(cat => (
              <button
                key={cat.categoryId}
                onClick={() => navigate(`/products?category=${encodeURIComponent(cat.categoryName)}`)}
                className="group relative overflow-hidden rounded-xl aspect-video flex items-center justify-center cursor-pointer"
              >
                <div className="absolute inset-0 bg-linear-to-br from-blue-400 to-indigo-500 transition-transform duration-300 group-hover:scale-105" />
                <GrainOverlay />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full bg-white/10 pointer-events-none" />
                <p className="relative text-[10px] sm:text-xs font-bold text-white text-center px-1 leading-snug drop-shadow-sm z-10">
                  {cat.categoryName}
                </p>
              </button>
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center mt-5">
              <button
                onClick={() => setShowAllCats(v => !v)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 text-gray-500 hover:text-blue-600 text-xs font-semibold rounded-xl transition-all cursor-pointer"
              >
                <MdGridView size={14} />
                {showAllCats ? "Show Less" : `View ${allCats.length - VISIBLE_COUNT} More`}
                <FiChevronDown size={13} className={`transition-transform duration-200 ${showAllCats ? "rotate-180" : ""}`} />
              </button>
            </div>
          )}
        </section>
      )}

      {/* New arrivals */}
      <section className="bg-gray-50 border-t border-gray-100 py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            label="Just In"
            title="New Arrivals"
            onViewAll={() => navigate("/products?sortBy=createdAt&sortingOrder=desc")}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
              : products.map(p => (
                <ProductCard key={p.productId} product={p} onClick={() => navigate(`/products/${p.productId}`)} />
              ))
            }
          </div>
        </div>
      </section>

      {/* Deals banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(125deg,#f59e0b 0%,#ef4444 55%,#ec4899 100%)" }} />
        <GrainOverlay opacity="opacity-[0.06]" />
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)", backgroundSize: "16px 16px" }}
        />
        <div className="relative max-w-6xl mx-auto px-6 sm:px-8 py-12 sm:py-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-[10px] font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-widest">
              <MdLocalOffer size={11} /> Limited Time
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight mb-1">Deals & Discounts</h2>
            <p className="text-sm text-white/70 font-light">Save big on select products across all categories</p>
          </div>
          <button
            onClick={() => navigate("/products?sortBy=discountPercent&sortingOrder=desc")}
            className="shrink-0 inline-flex items-center gap-2 bg-white text-gray-950 font-bold px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl text-sm hover:bg-gray-50 active:scale-[0.98] transition-all cursor-pointer shadow-xl"
          >
            Browse Deals <FiArrowRight size={15} />
          </button>
        </div>
      </section>

      {/* Discounted products */}
      {(loadingDeals || discounted.length > 0) && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <SectionHeader
            label="Save More"
            title="On Sale Now"
            onViewAll={() => navigate("/products?sortBy=discountPercent&sortingOrder=desc")}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {loadingDeals
              ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
              : discounted.map(p => (
                <ProductCard key={p.productId} product={p} onClick={() => navigate(`/products/${p.productId}`)} />
              ))
            }
          </div>
        </section>
      )}

      {/* Featured sellers */}
      {topSellers.length > 0 && (
        <section className="bg-gray-50 border-t border-gray-100 py-14 sm:py-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <SectionHeader label="Trusted Stores" title="Featured Sellers" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {topSellers.map(s => (
                <button
                  key={s.email}
                  onClick={() => navigate(`/products?sellers=${encodeURIComponent(s.sellerDisplayName)}`)}
                  className="group bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 flex items-center gap-4 hover:shadow-lg hover:border-blue-100 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer text-left"
                >
                  <div className="w-11 h-11 rounded-2xl bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                    {s.profileImageUrl
                      ? <img src={s.profileImageUrl} alt={s.sellerDisplayName} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><MdStorefront size={18} className="text-gray-400" /></div>
                    }
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-900 truncate">{s.sellerDisplayName}</p>
                    {s.emailVerified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-500 mt-0.5">
                        <MdVerified size={11} /> Verified
                      </span>
                    )}
                  </div>
                  <MdArrowForward size={15} className="text-gray-300 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 60%,#1d4ed8 0%,#0f172a 65%)" }} />
        <GrainOverlay opacity="opacity-[0.06]" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-500/8 blur-[120px] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)", backgroundSize: "28px 28px" }}
        />
        <div className="relative max-w-6xl mx-auto px-6 py-20 sm:py-24 text-center">
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.22em] mb-4">Start Shopping</p>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
            Thousands of products<br className="hidden sm:block" /> waiting for you
          </h2>
          <p className="text-sm text-white/40 mb-10 max-w-md mx-auto leading-relaxed">
            From electronics to fashion, home essentials to baby products — find it all on Mercato.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="inline-flex items-center gap-2.5 bg-white text-gray-950 font-bold px-8 sm:px-9 py-3.5 sm:py-4 rounded-xl text-sm hover:bg-gray-50 active:scale-[0.98] transition-all cursor-pointer shadow-2xl shadow-black/30"
          >
            Explore All Products <FiArrowRight size={15} />
          </button>
        </div>
      </section>

      <Footer />

      {/* Progress bar animation */}
      <style>{`
                @keyframes heroProgress {
                    from { width: 0%; }
                    to { width: 100%; }
                }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
    </div>
  );
};

export default HomePage;