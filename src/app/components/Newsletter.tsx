import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function Newsletter() {
  return (
    <section className="py-16 lg:py-24 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-[0.1em] uppercase">
            JOIN THE SYNDICATE
          </h2>
          <p className="text-white/80 text-sm tracking-widest uppercase">
            Subscribe for early drop alerts, limited edition capsules, and culture updates.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto items-center border-b border-neutral-700 pb-2 pt-4">
            <input
              type="email"
              placeholder="ENTER YOUR EMAIL"
              className="bg-transparent border-none text-xs tracking-wider focus:outline-none flex-1 placeholder-neutral-500 uppercase text-white"
            />
            <button type="submit" className="text-xs font-bold tracking-[0.2em] text-white hover:opacity-75 transition-opacity uppercase">
              SUBSCRIBE
            </button>
          </form>
          
          <p className="text-white/40 text-[10px] tracking-wide uppercase pt-2">
            By subscribing, you agree to our Privacy Policy and consent to receive updates.
          </p>
        </div>
      </div>
    </section>
  );
}
