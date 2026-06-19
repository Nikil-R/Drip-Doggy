import { Link } from "react-router";

export function ComingSoon() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#030213] font-sans antialiased flex flex-col items-center justify-center px-6 selection:bg-neutral-200">
      <div className="text-center max-w-md">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-[0.1em] mb-4">
          COMING SOON!!!
        </h1>
        <p className="text-neutral-500 text-xs tracking-widest uppercase mb-8">
          We are currently focusing on our Women's Collection. The Men's collection will drop soon.
        </p>
        <Link
          to="/"
          className="inline-block bg-[#030213] text-white px-8 py-3.5 rounded-md text-xs font-bold tracking-[0.2em] hover:bg-neutral-800 transition-colors shadow-lg"
        >
          BACK TO HOME
        </Link>
      </div>
    </div>
  );
}

