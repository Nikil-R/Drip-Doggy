import { useState } from "react";
import { FileText, Image, ChevronRight, Clock, Layers, Globe, Star, ShoppingBag, Menu, Mail, Footprints, Shirt } from "lucide-react";

const RS = "\u20B9";

const sections = [
  { name: "Hero Slides", icon: Image, status: "3 Active", lastEdited: "2 days ago", desc: "Main carousel slides", route: "hero-slides", color: "from-[#030213] to-neutral-800" },
  { name: "Featured Products", icon: Star, status: "8 Products", lastEdited: "5 days ago", desc: "Homepage featured grid", route: "featured-products", color: "from-[#b2533e] to-[#8a3f2e]" },
  { name: "Signature Pieces", icon: Shirt, status: "6 Products", lastEdited: "1 week ago", desc: "Signature collection showcase", route: "signature-pieces", color: "from-[#030213] to-neutral-700" },
  { name: "Home Categories", icon: Layers, status: "6 Categories", lastEdited: "1 week ago", desc: "Category grid on homepage", route: "home-categories", color: "from-[#556b2f] to-[#3d4f20]" },
  { name: "Curated Collections", icon: ShoppingBag, status: "4 Collections", lastEdited: "2 weeks ago", desc: "Curated collection blocks", route: "curated-collections", color: "from-[#36454f] to-[#1a2226]" },
  { name: "Newsletter Config", icon: Mail, status: "Active", lastEdited: "2 weeks ago", desc: "Email signup section", route: "newsletter-config", color: "from-[#c49a6c] to-[#a67c4e]" },
  { name: "Footer Settings", icon: Footprints, status: "Configured", lastEdited: "3 weeks ago", desc: "Footer links & social", route: "footer-settings", color: "from-[#030213] to-[#1a1a1a]" },
  { name: "Navigation Menu", icon: Menu, status: "2 Menus", lastEdited: "1 month ago", desc: "Desktop & mobile nav", route: "navigation-menu", color: "from-[#030213] to-neutral-800" },
  { name: "Site Pages", icon: Globe, status: "6 Pages", lastEdited: "2 weeks ago", desc: "About, Contact, Legal", route: "site-pages", color: "from-[#717182] to-neutral-600" },
];

const stats = [
  { label: "Content Blocks", value: "32", icon: Layers, desc: "Active on homepage" },
  { label: "Published Slides", value: "3", icon: Image, desc: "Hero carousel slides" },
  { label: "Live Products", value: "24", icon: ShoppingBag, desc: "In product catalog" },
  { label: "Active Pages", value: "6", icon: Globe, desc: "Visible site pages" },
];

export function ContentPage() {
  return (
    <div className="space-y-8 font-sans">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-xl font-bold text-[#030213] uppercase tracking-widest">Navigation Menu</h1>
        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
          Drip Doggy homepage &amp; site content editor
        </p>
      </div>

      {/* ── Stats Cards ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-card border border-neutral-200/80 p-4 flex items-center gap-3">
            <stat.icon className="w-5 h-5 text-neutral-400 shrink-0" />
            <div>
              <p className="text-lg font-bold text-[#030213]">{stat.value}</p>
              <p className="text-[7px] text-neutral-400 font-semibold uppercase tracking-wider">{stat.label}</p>
              <p className="text-[6.5px] text-neutral-400 font-bold mt-0.5">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Search & Filter Bar ────────────────────────────────────── */}
      <div className="flex items-center justify-between bg-card border border-neutral-200/80 p-4">
        <span className="text-[8px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
          All Content Sections
        </span>
        <div className="flex gap-1.5">
          <button className="px-3 py-1.5 bg-[#030213] text-white text-[7px] font-semibold tracking-widest uppercase border-none cursor-pointer">All</button>
          <button className="px-3 py-1.5 bg-transparent text-neutral-400 hover:text-[#030213] text-[7px] font-semibold tracking-widest uppercase border-none cursor-pointer">Active</button>
          <button className="px-3 py-1.5 bg-transparent text-neutral-400 hover:text-[#030213] text-[7px] font-semibold tracking-widest uppercase border-none cursor-pointer">Draft</button>
        </div>
      </div>

      {/* ── Content Sections Grid ──────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sections.map((section) => (
          <div
            key={section.name}
            className="bg-card border border-neutral-200/80 hover:shadow-sm transition-all group cursor-pointer"
          >
            {/* Colored top bar */}
            <div className={`h-1.5 w-full bg-gradient-to-r ${section.color}`} />

            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 bg-card border border-neutral-200 flex items-center justify-center group-hover:border-neutral-400 transition-colors">
                  <section.icon className="h-4 w-4 text-neutral-500 group-hover:text-[#030213] transition-colors" />
                </div>
                <ChevronRight className="h-4 w-4 text-neutral-300 group-hover:text-[#030213] transition-colors" />
              </div>
              <h3 className="text-[10px] font-bold text-[#030213] uppercase tracking-wide">{section.name}</h3>
              <p className="text-[7px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">{section.desc}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
                <span className="text-[8px] font-bold text-neutral-500">{section.status}</span>
                <span className="text-[6.5px] text-neutral-400 font-medium flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {section.lastEdited}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Quick Overview ─────────────────────────────────────────── */}
      <div className="bg-card border border-neutral-200/80 p-6">
        <h2 className="text-[9px] font-bold tracking-[0.2em] text-neutral-400 uppercase mb-4">Content Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Last Published", value: "2 days ago", sub: "Hero Slide #3 updated" },
            { label: "Total Edits (Week)", value: "47", sub: "Across all sections" },
            { label: "Pending Review", value: "0", sub: "No pending drafts" },
            { label: "Next Scheduled", value: "SS26 Drop", sub: "Featured Products update" },
          ].map((item, i) => (
            <div key={i} className="border border-neutral-100 bg-card/60 p-3">
              <p className="text-[7px] font-semibold tracking-wider text-neutral-400 uppercase">{item.label}</p>
              <p className="text-[11px] font-bold text-[#030213] mt-0.5">{item.value}</p>
              <p className="text-[7px] text-neutral-400 font-bold mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
