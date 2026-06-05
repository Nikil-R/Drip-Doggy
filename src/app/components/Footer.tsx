import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router";
import logo from "../../imports/logo.png";
import logoIcon from "../../imports/logo_icon.png";

export function Footer() {
  return (
    <footer className="bg-gray-100 border-t">
      {/* Large Brand Name
      <div className="py-5 text-center">
        <h2 className="text-8xl tracking-wider text-gray-300">
          DRIP<br />DOGGY
        </h2>
      </div> */}

      <div className="container mx-auto px-4 py-5 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logoIcon} alt="" className="h-15 w-auto object-contain mix-blend-multiply" />
              <img src={logo} alt="DRIP DOGGY" className="h-15 w-auto object-contain mix-blend-multiply" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Your destination for premium streetwear and timeless style.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/shop" className="hover:underline">Shop All</Link></li>
              <li><Link to="/shop?new=true" className="hover:underline">New Arrivals</Link></li>
              <li><Link to="/shop" className="hover:underline">Women</Link></li>
              <li><Link to="/coming-soon" className="hover:underline">Men</Link></li>
              <li><Link to="/coming-soon" className="hover:underline">Accessories</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:underline">Contact Us</a></li>
              <li><a href="#" className="hover:underline">Shipping Info</a></li>
              <li><a href="#" className="hover:underline">Returns</a></li>
              <li><a href="#" className="hover:underline">Size Guide</a></li>
              <li><a href="#" className="hover:underline">FAQ</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:underline">About Us</a></li>
              <li><a href="#" className="hover:underline">Careers</a></li>
              <li><a href="#" className="hover:underline">Sustainability</a></li>
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 DRIP DOGGY. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
