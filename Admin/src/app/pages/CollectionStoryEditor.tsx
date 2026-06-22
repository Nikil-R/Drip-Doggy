import { useState, useEffect } from "react";
import { RotateCcw, Check, Image as ImageIcon } from "lucide-react";
import { getCollectionStory, setCollectionStory, CollectionStory } from "../lib/admin-content-store";

export function CollectionStoryEditorPage() {
  const [story, setStory] = useState<CollectionStory>({
    tag: "", heading: "", description: "", image: "", ctaText: "", ctaLink: "", active: true,
  });
  const [toast, setToast] = useState("");

  useEffect(() => { setStory(getCollectionStory()); }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2000); };

  const save = () => { setCollectionStory(story); showToast("Collection story saved"); };

  const reset = () => {
    setStory({
      tag: "Drip Doggy Edit", heading: "The SS26 Collection: Luxury Streetwear Redefined",
      description: "Precision tailoring meets urban edge. The SS26 capsule explores architectural silhouettes, differential textures, and reinforced structural seams, redefining luxury streetwear for the modern wardrobe.",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop",
      ctaText: "Explore the Collection", ctaLink: "/shop", active: true,
    });
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-[#030213] uppercase tracking-widest">Collection Story</h1>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">Edit the Drip Doggy homepage collection editorial section</p>
        </div>
        <div className="flex gap-2">
          <button onClick={reset} className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase flex items-center gap-1.5 cursor-pointer bg-white rounded-none">
            <RotateCcw className="w-3 h-3" /> Reset Defaults
          </button>
          <button onClick={save} className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase flex items-center gap-1.5 cursor-pointer rounded-none border-none">
            <Check className="w-3.5 h-3.5" /> Save
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-neutral-200/80 p-6 space-y-4">
          <div>
            <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">Tag Label</label>
            <input value={story.tag} onChange={e => setStory({ ...story, tag: e.target.value })}
              className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none" />
          </div>
          <div>
            <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">Heading</label>
            <input value={story.heading} onChange={e => setStory({ ...story, heading: e.target.value })}
              className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none" />
          </div>
          <div>
            <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">Description</label>
            <textarea value={story.description} onChange={e => setStory({ ...story, description: e.target.value })}
              className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none h-24" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">CTA Text</label>
              <input value={story.ctaText} onChange={e => setStory({ ...story, ctaText: e.target.value })}
                className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none" />
            </div>
            <div>
              <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">CTA Link</label>
              <input value={story.ctaLink} onChange={e => setStory({ ...story, ctaLink: e.target.value })}
                className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-neutral-200/80 p-6">
          <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-2 block">Image URL</label>
          <input value={story.image} onChange={e => setStory({ ...story, image: e.target.value })}
            className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none mb-3" placeholder="https://..." />
          <div className="aspect-video bg-neutral-100 border border-neutral-200/50 overflow-hidden flex items-center justify-center">
            {story.image ? <img src={story.image} alt="" className="w-full h-full object-cover" />
              : <ImageIcon className="w-8 h-8 text-neutral-300" />}
          </div>
        </div>
      </div>

      {toast && <div className="fixed bottom-6 right-6 bg-[#030213] text-white text-[9px] font-extrabold tracking-widest px-4 py-3 uppercase z-50">{toast}</div>}
    </div>
  );
}
