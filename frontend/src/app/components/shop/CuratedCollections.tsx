export function CuratedCollections() {
  const collections = [
    {
      title: "New Arrivals",
      description: "Fresh styles just in",
      image: "https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?w=600&h=400&fit=crop",
    },
    {
      title: "Best Sellers",
      description: "Customer favorites",
      image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=400&fit=crop",
    },
    {
      title: "Oversized Collection",
      description: "Comfort meets style",
      image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&h=400&fit=crop",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-8 py-16">
      <h2 className="text-center mb-12">CURATED FOR YOU</h2>
      <div className="grid grid-cols-3 gap-6">
        {collections.map((collection, index) => (
          <div
            key={index}
            className="relative aspect-[3/2] overflow-hidden group cursor-pointer"
          >
            <img
              src={collection.image}
              alt={collection.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6 text-white">
              <h3 className="mb-2 text-white">{collection.title}</h3>
              <p className="text-sm text-white/90">{collection.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


