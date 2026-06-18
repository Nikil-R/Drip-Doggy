import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { Search, X, ArrowRight, Heart, Trash2, Clock, TrendingUp } from "lucide-react";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PopularProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("recent_searches");
      return stored ? JSON.parse(stored) : ["Oversized Tee", "Black Hoodie", "Summer Dress", "Cargo Pants"];
    } catch {
      return ["Oversized Tee", "Black Hoodie", "Summer Dress", "Cargo Pants"];
    }
  });

  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount/open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      document.body.style.overflow = "hidden"; // Lock scroll
    } else {
      document.body.style.overflow = ""; // Unlock scroll
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSearchSubmit = (searchVal: string) => {
    if (!searchVal.trim()) return;
    
    // Add to recents
    const updated = [searchVal.trim(), ...recentSearches.filter(s => s !== searchVal.trim())].slice(0, 6);
    setRecentSearches(updated);
    try {
      localStorage.setItem("recent_searches", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    onClose();
    navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`);
  };

  const clearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem("recent_searches");
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  const trendingSearches = [
    "New Arrivals",
    "Best Sellers",
    "Summer Collection",
    "Oversized Collection",
    "Streetwear Essentials",
    "Co-ords"
  ];

  const popularCategories = [
    {
      name: "Dresses",
      count: "248 Products",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=400",
      link: "/shop?category=dresses"
    },
    {
      name: "Tops",
      count: "184 Products",
      image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=400",
      link: "/shop?category=tops"
    },
    {
      name: "Oversized",
      count: "312 Products",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400",
      link: "/shop?category=oversized"
    },
    {
      name: "Accessories",
      count: "96 Products",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400",
      link: "/coming-soon"
    }
  ];

  const popularProducts: PopularProduct[] = [
    {
      id: 3,
      name: "STRUCTURE TACTICAL LAYER",
      price: 485.00,
      image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=300",
      category: "Architectural Precision Series"
    },
    {
      id: 104,
      name: "APEX SHELL JACKET",
      price: 320.00,
      image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=300",
      category: "Outerwear Collection"
    },
    {
      id: 105,
      name: "URBAN COMBAT BOOT",
      price: 350.00,
      image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=300",
      category: "Accessories Series"
    },
    {
      id: 106,
      name: "CORE HEAVYWEIGHT HOODIE",
      price: 180.00,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=300",
      category: "Oversized Collection"
    }
  ];

  // Dynamic live search suggestions matching (e.g. searching "over" / "hoodie" / "dress")
  const lowercaseQuery = query.toLowerCase();
  const showResults = query.trim().length > 0;

  // Filter dummy data for results
  const matchingProducts = [
    {
      id: 3,
      name: "Structure Tactical Layer",
      price: 485.00,
      category: "Architectural Series",
      image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=300"
    },
    {
      id: 107,
      name: "Oversized Graphic Streetwear Tee",
      price: 45.00,
      category: "Oversized Collection",
      image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=300"
    },
    {
      id: 108,
      name: "Oversized Linen Resort Shirt",
      price: 65.00,
      category: "Summer Essentials",
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=300"
    },
    {
      id: 106,
      name: "Core Heavyweight Hoodie",
      price: 180.00,
      category: "Oversized Collection",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=300"
    },
    {
      id: 109,
      name: "Floral Summer Day Dress",
      price: 110.00,
      category: "Dresses Collection",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=300"
    }
  ].filter(p => p.name.toLowerCase().includes(lowercaseQuery) || p.category.toLowerCase().includes(lowercaseQuery));

  const matchingCollections = [
    "Oversized Collection",
    "Summer Essentials",
    "New Arrivals",
    "Architectural Precision"
  ].filter(c => c.toLowerCase().includes(lowercaseQuery));

  const matchingCategoriesList = [
    "Oversized",
    "T-Shirts",
    "Dresses",
    "Hoodies",
    "Jackets",
    "Outerwear"
  ].filter(cat => cat.toLowerCase().includes(lowercaseQuery));

  return (
    <div className="fixed inset-0 z-[200] bg-black/45 backdrop-blur-xs flex flex-col justify-start animate-in fade-in duration-200">
      <div className="w-full bg-[#FAF8F5] shadow-2xl flex flex-col h-screen overflow-hidden animate-in slide-in-from-top-6 duration-300">
        
        {/* Search Header Bar */}
        <div className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between gap-6 border-b border-neutral-100">
          <div className="flex-1 max-w-3xl mx-auto relative flex items-center">
            <Search className="absolute left-4 h-5 w-5 text-neutral-400 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search products, collections, categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchSubmit(query);
                }
              }}
              className="w-full bg-neutral-100/60 text-neutral-900 placeholder-neutral-400 text-sm font-medium pl-12 pr-12 py-3.5 rounded-full border border-transparent focus:outline-none focus:border-neutral-800 focus:bg-white transition-all uppercase tracking-wide"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-4 p-1 text-neutral-400 hover:text-neutral-900 border-none bg-transparent cursor-pointer"
                aria-label="Clear search text"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 flex items-center justify-center transition-colors cursor-pointer border-none"
            aria-label="Close search"
          >
            <X className="h-5 w-5 stroke-[2]" />
          </button>
        </div>

        {/* Search Content */}
        <div className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 overflow-y-auto">
          {!showResults ? (
            <div className="space-y-12">
              
              {/* Row 1: Recent & Trending Searches */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-[10px] font-extrabold tracking-widest text-neutral-400 uppercase flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" /> Recent Searches
                      </h3>
                      <button
                        onClick={clearHistory}
                        className="text-[9px] font-extrabold tracking-wider text-[#b2533e] hover:underline uppercase border-none bg-transparent cursor-pointer"
                      >
                        Clear History
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {recentSearches.map((term, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setQuery(term);
                            handleSearchSubmit(term);
                          }}
                          className="bg-white hover:bg-neutral-950 hover:text-white border border-neutral-200/80 px-4 py-2 rounded-full text-xs font-semibold text-neutral-700 transition-all cursor-pointer uppercase tracking-wider"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Searches */}
                <div>
                  <h3 className="text-[10px] font-extrabold tracking-widest text-neutral-400 uppercase flex items-center gap-1.5 mb-4">
                    <TrendingUp className="h-3.5 w-3.5" /> Trending Searches
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {trendingSearches.map((term, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setQuery(term);
                          handleSearchSubmit(term);
                        }}
                        className="bg-white hover:bg-neutral-950 hover:text-white border border-neutral-200/80 px-4 py-2 rounded-full text-xs font-semibold text-neutral-700 transition-all cursor-pointer uppercase tracking-wider"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 2: Popular Categories */}
              <div>
                <h3 className="text-[10px] font-extrabold tracking-widest text-neutral-400 uppercase mb-5">
                  Popular Categories
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {popularCategories.map((cat, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        onClose();
                        navigate(cat.link);
                      }}
                      className="group text-left border-none bg-transparent cursor-pointer w-full focus:outline-none"
                    >
                      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100 mb-3 relative shadow-[0_4px_12px_rgba(0,0,0,0.01)] group-hover:shadow-md transition-all duration-300">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">{cat.name}</h4>
                      <p className="text-[9px] font-semibold text-neutral-400 uppercase tracking-widest mt-0.5">{cat.count}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 3: Popular Right Now */}
              <div>
                <h3 className="text-[10px] font-extrabold tracking-widest text-neutral-400 uppercase mb-5">
                  Popular Right Now
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {popularProducts.map(product => (
                    <div
                      key={product.id}
                      onClick={() => {
                        onClose();
                        navigate(`/product/${product.id === 3 ? 1 : product.id}`);
                      }}
                      className="group cursor-pointer bg-white rounded-xl border border-neutral-100 p-3 hover:border-neutral-900 transition-all duration-300 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.01)]"
                    >
                      <div className="aspect-[3/4] rounded-lg overflow-hidden bg-neutral-100 mb-3 relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <span className="text-[8px] font-bold tracking-widest text-[#b2533e] uppercase">{product.category}</span>
                      <h4 className="text-xs font-bold text-neutral-900 tracking-tight leading-tight mt-0.5 line-clamp-1">{product.name}</h4>
                      <span className="text-xs font-extrabold text-neutral-900 mt-1 block">₹{product.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            // Live Search Results
            <div className="space-y-8">
              {matchingProducts.length === 0 && matchingCollections.length === 0 && matchingCategoriesList.length === 0 ? (
                <div className="py-16 text-center max-w-md mx-auto">
                  <Search className="h-10 w-10 mx-auto text-neutral-300 stroke-[1.2] mb-4" />
                  <h4 className="text-sm font-bold uppercase tracking-wider mb-2">No Results Found for "{query}"</h4>
                  <p className="text-xs text-neutral-450 leading-relaxed mb-6 uppercase tracking-wider">
                    Try different keywords or explore one of our popular categories below.
                  </p>
                  <button
                    onClick={() => {
                      setQuery("");
                      handleSearchSubmit("Oversized");
                    }}
                    className="bg-[#030213] text-white px-8 py-3 rounded-md text-[10px] font-bold tracking-widest hover:bg-neutral-800 transition-colors uppercase border-none cursor-pointer"
                  >
                    Browse All Products
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                  
                  {/* Left Results Column: Products */}
                  {matchingProducts.length > 0 && (
                    <div className="lg:col-span-8 space-y-4">
                      <h3 className="text-[10px] font-extrabold tracking-widest text-neutral-400 uppercase pb-2 border-b border-neutral-100">
                        Product Suggestions ({matchingProducts.length})
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {matchingProducts.slice(0, 6).map(prod => (
                          <div
                            key={prod.id}
                            onClick={() => {
                              onClose();
                              navigate(`/product/${prod.id === 3 ? 1 : prod.id}`);
                            }}
                            className="flex gap-4 p-3 rounded-lg border border-neutral-100 bg-white hover:border-neutral-900 transition-colors cursor-pointer"
                          >
                            <div className="w-14 h-16 rounded bg-neutral-50 border border-neutral-100 overflow-hidden flex-shrink-0">
                              <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                              <span className="text-[8px] font-bold tracking-widest text-[#b2533e] uppercase">{prod.category}</span>
                              <h4 className="text-xs font-bold text-neutral-900 tracking-tight leading-snug mt-0.5 line-clamp-1">{prod.name}</h4>
                              <span className="text-xs font-extrabold text-neutral-900 mt-1 block">₹{prod.price.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Right Results Column: Collections & Categories */}
                  <div className="lg:col-span-4 space-y-8">
                    {/* Matching Collections */}
                    {matchingCollections.length > 0 && (
                      <div>
                        <h3 className="text-[10px] font-extrabold tracking-widest text-neutral-400 uppercase pb-2 border-b border-neutral-100 mb-3">
                          Suggested Collections
                        </h3>
                        <div className="divide-y divide-neutral-100">
                          {matchingCollections.map((col, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                onClose();
                                navigate(`/shop?collection=${encodeURIComponent(col)}`);
                              }}
                              className="w-full text-left py-3 flex justify-between items-center hover:text-[#b2533e] transition-colors text-xs font-bold uppercase tracking-wider bg-transparent border-none cursor-pointer focus:outline-none"
                            >
                              <span>{col}</span>
                              <ArrowRight className="h-3.5 w-3.5 text-neutral-400" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Matching Categories */}
                    {matchingCategoriesList.length > 0 && (
                      <div>
                        <h3 className="text-[10px] font-extrabold tracking-widest text-neutral-400 uppercase pb-2 border-b border-neutral-100 mb-3">
                          Suggested Categories
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {matchingCategoriesList.map((cat, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                onClose();
                                navigate(`/shop?category=${encodeURIComponent(cat)}`);
                              }}
                              className="bg-white hover:bg-neutral-950 hover:text-white border border-neutral-200/80 px-3.5 py-1.5 rounded-full text-[10px] font-bold text-neutral-700 transition-all cursor-pointer uppercase tracking-wider"
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* View All CTA */}
              <div className="pt-6 border-t border-neutral-100 text-center">
                <button
                  onClick={() => handleSearchSubmit(query)}
                  className="inline-flex items-center gap-2 text-[10px] font-extrabold tracking-widest hover:text-[#b2533e] transition-colors uppercase border-none bg-transparent cursor-pointer"
                >
                  View All Search Results ({matchingProducts.length + matchingCollections.length}) <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
