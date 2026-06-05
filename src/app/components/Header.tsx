import { ShoppingBag, User, Search, Menu, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import logo from "../../imports/logo.png";
import logoIcon from "../../imports/logo_icon.png";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navSearchVal, setNavSearchVal] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearchVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(navSearchVal.trim())}`);
      setNavSearchVal("");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-[#FAF8F5]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo (Left) */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <img src={logoIcon} alt="" className="h-18 w-auto object-contain mix-blend-multiply" />
              <img src={logo} alt="DRIP DOGGY" className="h-30 w-auto object-contain mix-blend-multiply" />
            </Link>
          </div>

          {/* Desktop Navigation (Center) */}
          <nav className="hidden lg:flex items-center gap-8 text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-500">
            <Link to="/shop" className="hover:text-black transition-colors">Shop All</Link>
            <Link to="/coming-soon" className="hover:text-black transition-colors">Men</Link>
            <Link to="/coming-soon" className="hover:text-black transition-colors">Accessories</Link>
            <Link to="/orders" className="hover:text-black transition-colors">Orders</Link>
            
            {/* Search Input Bar placed cleanly at the end of navigation */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center ml-4">
              <input
                type="text"
                value={navSearchVal}
                onChange={(e) => setNavSearchVal(e.target.value)}
                placeholder="SEARCH..."
                className="w-40 xl:w-48 bg-neutral-100/60 text-neutral-800 text-[10px] font-bold tracking-wider uppercase pl-8 pr-4 py-2 rounded-full border border-neutral-200/30 focus:outline-none focus:border-neutral-900 focus:bg-white transition-all placeholder-neutral-400"
              />
              <Search className="absolute left-3 h-3.5 w-3.5 text-neutral-400 pointer-events-none" />
            </form>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            <Link to="/wishlist" className="hidden sm:block hover:opacity-75 transition-opacity">
              <Heart className="h-4.5 w-4.5 stroke-[1.8] text-neutral-800" />
            </Link>
            
            <Link to="/profile" className="hidden sm:block hover:opacity-75 transition-opacity">
              <User className="h-4.5 w-4.5 stroke-[1.8] text-neutral-800" />
            </Link>
            
            <Link to="/cart" className="relative hover:opacity-75 transition-opacity flex items-center">
              <ShoppingBag className="h-4.5 w-4.5 stroke-[1.8] text-neutral-800" />
              <span className="absolute -top-1.5 -right-1.5 bg-[#b2533e] text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                3
              </span>
            </Link>

            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t py-4">
            <nav className="flex flex-col gap-4 text-xs font-bold tracking-widest uppercase text-neutral-800">
              <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="hover:text-black py-1">
                Shop All
              </Link>
              <Link to="/coming-soon" onClick={() => setIsMenuOpen(false)} className="hover:text-black py-1">
                Men
              </Link>
              <Link to="/coming-soon" onClick={() => setIsMenuOpen(false)} className="hover:text-black py-1">
                Accessories
              </Link>
              <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="hover:text-black py-1">
                Orders
              </Link>
              <Link to="/wishlist" onClick={() => setIsMenuOpen(false)} className="hover:text-black py-1 border-t pt-4">
                Wishlist
              </Link>
              <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="hover:text-black py-1">
                Account Settings
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
