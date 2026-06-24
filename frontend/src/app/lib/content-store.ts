// ─── Shared Content Store ─────────────────────────────────────────────────
// This is the localStorage-backed data layer that both the frontend and admin
// use to read/write all editable content sections.
// Seed data mirrors the current hardcoded values from frontend components.
// ──────────────────────────────────────────────────────────────────────────

import type {
  HeroSlide,
  HomeCategory,
  CollectionStory,
  NewsletterConfig,
  FeaturedProductsConfig,
  SignaturePiecesConfig,
  FooterConfig,
  NavConfig,
  SitePageData,
  CuratedCollection,
  ContentConfig,
} from "./content-types";

// ─── localStorage Keys ────────────────────────────────────────────────────

const KEYS = {
  heroSlides: "dd_content_hero_slides",
  featuredProducts: "dd_content_featured_products",
  signaturePieces: "dd_content_signature_pieces",
  homeCategories: "dd_content_home_categories",
  collectionStory: "dd_content_collection_story",
  newsletter: "dd_content_newsletter",
  footer: "dd_content_footer",
  navigation: "dd_content_navigation",
  sitePages: "dd_content_site_pages",
  curatedCollections: "dd_content_collections",
  comingSoonTeasers: "dd_content_coming_soon_teasers",
  lastUpdated: "dd_content_last_updated",
} as const;

// ─── Helper ───────────────────────────────────────────────────────────────

function now(): string {
  return new Date().toISOString();
}

function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    // ignore parse errors
  }
  return fallback;
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
  localStorage.setItem(KEYS.lastUpdated, now());
  window.dispatchEvent(new CustomEvent("dd-content-changed", { detail: { key } }));
}

// ═══════════════════════════════════════════════════════════════════════════
// SEED DEFAULTS — mirrors current hardcoded frontend values
// ═══════════════════════════════════════════════════════════════════════════

function defaultHeroSlides(): HeroSlide[] {
  return [
    {
      id: "slide-1",
      tagline: "TACTICAL SILHOUETTES",
      title: "SS26 WOMEN'S COLLECTION",
      description: "Engineered for the urban frontier. Utility meets attitude.",
      image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1600&auto=format&fit=crop",
      ctaText: "Explore Collection",
      ctaLink: "/shop",
      order: 0,
      active: true,
    },
    {
      id: "slide-2",
      tagline: "DRIP DOGGY APPAREL",
      title: "HIGH-END DRIP FOR THE BOLD",
      description: "Precision-crafted streetwear for those who demand more. Every stitch, a statement.",
      image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop",
      ctaText: "Explore Collection",
      ctaLink: "/shop",
      order: 1,
      active: true,
    },
    {
      id: "slide-3",
      tagline: "THE ARCHIVE SERIES",
      title: "UNCOMPROMISED LUXURY",
      description: "Rebels make the rules. Redefining luxury, one drop at a time.",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop",
      ctaText: "Explore Collection",
      ctaLink: "/shop",
      order: 2,
      active: true,
    },
  ];
}

function defaultFeaturedProducts(): FeaturedProductsConfig {
  return {
    sectionTitle: "New In",
    sectionSubtitle: "New This Season",
    // Products with badge=NEW or rating>=4.8 — currently filters dynamically
    productIds: [3, 7, 4, 1], // Boxy Minimalist Maxi, Parachute Cargo Skirt, Structured Canvas, Sartorial Trench
    maxProducts: 4,
    active: true,
  };
}

function defaultSignaturePieces(): SignaturePiecesConfig {
  return {
    sectionTitle: "Signature Pieces",
    sectionSubtitle: "Brand Uniform",
    productIds: [4, 9, 1, 6], // Structured Canvas, French Terry Hoodie, Sartorial Trench, Drape Rib
    active: true,
  };
}

function defaultHomeCategories(): HomeCategory[] {
  return [
    {
      id: "cat-1",
      title: "Women's Collection",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
      description: "Utility layers & draped silhouettes",
      route: "/shop?gender=women",
      comingSoon: false,
      order: 0,
      active: true,
    },
    {
      id: "cat-2",
      title: "Men's Syndicate",
      image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800",
      description: "Upcoming menswear capsule",
      route: "/coming-soon",
      comingSoon: true,
      comingSeason: "FW26",
      order: 1,
      active: true,
    },
  ];
}

function defaultCollectionStory(): CollectionStory {
  return {
    tag: "The Current Drop",
    heading: "SS26 Women's Capsule",
    description:
      "Architectural silhouettes meet utility-driven design. The new season explores precision-molded panels, differential ribbing, and reinforced structural seams \u2014 redefining luxury streetwear through the lens of womenswear.",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop",
    ctaText: "Explore the Capsule",
    ctaLink: "/shop",
    active: true,
  };
}

function defaultNewsletter(): NewsletterConfig {
  return {
    heading: "JOIN THE SYNDICATE",
    subtitle: "Subscribe for early drop alerts, limited edition capsules, and culture updates.",
    placeholder: "ENTER YOUR EMAIL",
    buttonText: "SUBSCRIBE",
    consentText: "By subscribing, you agree to our Privacy Policy and consent to receive updates.",
    successMessage: "Thanks for subscribing! Welcome to the Syndicate.",
    active: true,
  };
}

function defaultFooter(): FooterConfig {
  return {
    brandName: "DRIP DOGGY",
    tagline: "Luxury Streetwear / Est. 2026",
    description:
      "Architectural silhouettes, premium fabrication, and uncompromised street luxury for the modern wardrobe.",
    copyrightText: "\u00a9 2026 Drip Doggy. All rights reserved.",
    ctaSection: {
      tag: "Private Access / Drip Doggy Syndicate",
      heading: "Join the Next Drop",
      description:
        "Receive early access to limited capsules, archival restocks, and editorial releases before the public drop.",
      buttonText: "SUBSCRIBE",
      chips: ["EARLY ACCESS", "LIMITED CAPSULES", "MEMBERS-ONLY"],
    },
    linkGroups: [
      {
        title: "Shop",
        links: [
          { label: "New In", to: "/shop" },
          { label: "Outerwear", to: "/shop?category=outerwear" },
          { label: "Knitwear", to: "/shop?category=knitwear" },
          { label: "Wishlist", to: "/account#wishlist" },
          { label: "Accessories (Soon)", to: "/coming-soon" },
          { label: "Men's Syndicate (Soon)", to: "/coming-soon" },
        ],
      },
      {
        title: "Client Services",
        links: [
          { label: "Contact Us", to: "/contact" },
          { label: "FAQ & Shipping", to: "/faq" },
          { label: "Returns & Size Guide", to: "/returns" },
          { label: "Track Order", to: "/account#orders" },
        ],
      },
      {
        title: "The House",
        links: [
          { label: "About Drip Doggy", to: "/about" },
          { label: "Privacy Policy", to: "/privacy" },
          { label: "Terms of Service", to: "/terms" },
        ],
      },
    ],
    socialLinks: [
      { platform: "instagram", label: "Instagram", url: "#", active: true },
      { platform: "youtube", label: "YouTube", url: "#", active: true },
      { platform: "twitter", label: "X / Twitter", url: "#", active: true },
      { platform: "facebook", label: "Facebook", url: "#", active: true },
    ],
    active: true,
  };
}

function defaultNavigation(): NavConfig {
  return {
    desktopItems: [
      {
        label: "Categories",
        to: "#",
        children: [
          {
            label: "Women",
            to: "/shop?gender=women",
            children: [
              { label: "All Women's", to: "/shop?gender=women" },
              { label: "Dresses", to: "/shop?gender=women&category=dresses" },
              { label: "Outerwear", to: "/shop?gender=women&category=outerwear" },
              { label: "Tops", to: "/shop?gender=women&category=tops" },
              { label: "Skirts", to: "/shop?gender=women&category=skirts" },
            ],
          },
          { label: "Men", to: "/coming-soon" },
          { label: "Accessories", to: "/coming-soon" },
        ],
      },
      { label: "About", to: "/about" },
      { label: "Help", to: "/help" },
    ],
    mobileItems: [
      { label: "Women", to: "/shop" },
      { label: "Men", to: "/coming-soon" },
      { label: "Accessories", to: "/coming-soon" },
      { label: "About", to: "/about" },
      { label: "Help", to: "/help" },
      { label: "Wishlist", to: "/wishlist" },
      { label: "Account Settings", to: "/account" },
    ],
    active: true,
  };
}

function defaultSitePages(): SitePageData[] {
  return [
    { slug: "about", title: "About", hero: { tag: "DRIP DOGGY APPAREL", heading: "The Story", description: "Founded in 2026, Drip Doggy is a luxury streetwear label born at the intersection of architectural precision and functional urban utility.", active: true }, active: true },
    { slug: "contact", title: "Contact", hero: { tag: "CLIENT SERVICES", heading: "Contact Us", description: "We're here to help. Whether you have a question about your order, need sizing advice, or want to discuss wholesale opportunities \u2014 reach out and our team will get back to you.", active: true }, active: true },
    { slug: "faq", title: "FAQ & Shipping", hero: { tag: "CLIENT SERVICES", heading: "FAQ & Shipping", description: "Everything you need to know about ordering, shipping, delivery, and more.", active: true }, active: true },
    { slug: "returns", title: "Returns & Size Guide", hero: { tag: "CLIENT SERVICES", heading: "Returns & Size Guide", description: "Hassle-free returns, complimentary exchanges, and detailed sizing guidance.", active: true }, active: true },
    { slug: "terms", title: "Terms of Service", hero: { tag: "THE HOUSE", heading: "Terms of Service", description: "Last updated: June 2026. Please read these terms carefully before using our website or making a purchase.", active: true }, active: true },
    { slug: "privacy", title: "Privacy Policy", hero: { tag: "THE HOUSE", heading: "Privacy Policy", description: "Last updated: June 2026. This policy describes how Drip Doggy Apparel collects, uses, and protects your personal information.", active: true }, active: true },
    { slug: "help", title: "Help Center", hero: { tag: "SUPPORT HUB", heading: "Help & FAQs", description: "Shipping timelines, returns, size guides, and everything you need to know about your order.", active: true }, active: true },
    { slug: "coming-soon", title: "Coming Soon", hero: { tag: "UPCOMING RELEASE", heading: "Men's Syndicate", description: "An exploration of structural tailoring, heavyweight fabrication, and utilitarian precision. The first menswear capsule from Drip Doggy — engineered for the modern wardrobe.", active: true }, active: true },
  ];
}

function defaultCuratedCollections(): CuratedCollection[] {
  return [
    { id: "col-1", title: "New Arrivals", description: "Fresh styles just in", image: "https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?w=600&h=400&fit=crop", order: 0, active: true },
    { id: "col-2", title: "Best Sellers", description: "Customer favorites", image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=400&fit=crop", order: 1, active: true },
    { id: "col-3", title: "Oversized Collection", description: "Comfort meets style", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&h=400&fit=crop", order: 2, active: true },
  ];
}

function defaultComingSoonTeasers(): ComingSoonTeaser[] {
  return [
    { id: "t-1", name: "Outerwear", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=400", coming: "SS26", order: 0, active: true },
    { id: "t-2", name: "Knitwear", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=400", coming: "SS26", order: 1, active: true },
    { id: "t-3", name: "Tailoring", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=400", coming: "FW26", order: 2, active: true },
    { id: "t-4", name: "Accessories", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=400", coming: "FW26", order: 3, active: true },
  ];
}

// ═══════════════════════════════════════════════════════════════════════════
// PUBLIC API — Getters & Setters
// ═══════════════════════════════════════════════════════════════════════════

// ─── Hero Slides ──────────────────────────────────────────────────────────

export function getHeroSlides(): HeroSlide[] {
  return getItem(KEYS.heroSlides, defaultHeroSlides());
}

export function setHeroSlides(slides: HeroSlide[]): void {
  setItem(KEYS.heroSlides, slides);
}

export function resetHeroSlides(): void {
  setItem(KEYS.heroSlides, defaultHeroSlides());
}

// ─── Featured Products ────────────────────────────────────────────────────

export function getFeaturedProducts(): FeaturedProductsConfig {
  return getItem(KEYS.featuredProducts, defaultFeaturedProducts());
}

export function setFeaturedProducts(config: FeaturedProductsConfig): void {
  setItem(KEYS.featuredProducts, config);
}

export function resetFeaturedProducts(): void {
  setItem(KEYS.featuredProducts, defaultFeaturedProducts());
}

// ─── Signature Pieces ─────────────────────────────────────────────────────

export function getSignaturePieces(): SignaturePiecesConfig {
  return getItem(KEYS.signaturePieces, defaultSignaturePieces());
}

export function setSignaturePieces(config: SignaturePiecesConfig): void {
  setItem(KEYS.signaturePieces, config);
}

export function resetSignaturePieces(): void {
  setItem(KEYS.signaturePieces, defaultSignaturePieces());
}

// ─── Home Categories ──────────────────────────────────────────────────────

export function getHomeCategories(): HomeCategory[] {
  return getItem(KEYS.homeCategories, defaultHomeCategories());
}

export function setHomeCategories(categories: HomeCategory[]): void {
  setItem(KEYS.homeCategories, categories);
}

export function resetHomeCategories(): void {
  setItem(KEYS.homeCategories, defaultHomeCategories());
}

// ─── Collection Story ─────────────────────────────────────────────────────

export function getCollectionStory(): CollectionStory {
  return getItem(KEYS.collectionStory, defaultCollectionStory());
}

export function setCollectionStory(story: CollectionStory): void {
  setItem(KEYS.collectionStory, story);
}

export function resetCollectionStory(): void {
  setItem(KEYS.collectionStory, defaultCollectionStory());
}

// ─── Newsletter ───────────────────────────────────────────────────────────

export function getNewsletterConfig(): NewsletterConfig {
  return getItem(KEYS.newsletter, defaultNewsletter());
}

export function setNewsletterConfig(config: NewsletterConfig): void {
  setItem(KEYS.newsletter, config);
}

export function resetNewsletterConfig(): void {
  setItem(KEYS.newsletter, defaultNewsletter());
}

// ─── Footer ───────────────────────────────────────────────────────────────

export function getFooterConfig(): FooterConfig {
  return getItem(KEYS.footer, defaultFooter());
}

export function setFooterConfig(config: FooterConfig): void {
  setItem(KEYS.footer, config);
}

export function resetFooterConfig(): void {
  setItem(KEYS.footer, defaultFooter());
}

// ─── Navigation ───────────────────────────────────────────────────────────

export function getNavConfig(): NavConfig {
  return getItem(KEYS.navigation, defaultNavigation());
}

export function setNavConfig(config: NavConfig): void {
  setItem(KEYS.navigation, config);
}

export function resetNavConfig(): void {
  setItem(KEYS.navigation, defaultNavigation());
}

// ─── Site Pages ───────────────────────────────────────────────────────────

export function getSitePages(): SitePageData[] {
  return getItem(KEYS.sitePages, defaultSitePages());
}

export function setSitePages(pages: SitePageData[]): void {
  setItem(KEYS.sitePages, pages);
}

export function getSitePage(slug: string): SitePageData | undefined {
  return getSitePages().find((p) => p.slug === slug);
}

export function updateSitePage(slug: string, updates: Partial<SitePageData>): void {
  const pages = getSitePages();
  const idx = pages.findIndex((p) => p.slug === slug);
  if (idx === -1) return;
  pages[idx] = { ...pages[idx], ...updates };
  setSitePages(pages);
}

export function resetSitePages(): void {
  setItem(KEYS.sitePages, defaultSitePages());
}

// ─── Curated Collections ──────────────────────────────────────────────────

export function getCuratedCollections(): CuratedCollection[] {
  return getItem(KEYS.curatedCollections, defaultCuratedCollections());
}

export function setCuratedCollections(collections: CuratedCollection[]): void {
  setItem(KEYS.curatedCollections, collections);
}

export function resetCuratedCollections(): void {
  setItem(KEYS.curatedCollections, defaultCuratedCollections());
}

// ─── Coming Soon Teasers ──────────────────────────────────────────────────

export function getComingSoonTeasers(): ComingSoonTeaser[] {
  return getItem(KEYS.comingSoonTeasers, defaultComingSoonTeasers());
}

export function setComingSoonTeasers(teasers: ComingSoonTeaser[]): void {
  setItem(KEYS.comingSoonTeasers, teasers);
}

export function resetComingSoonTeasers(): void {
  setItem(KEYS.comingSoonTeasers, defaultComingSoonTeasers());
}

// ─── Bulk Operations ──────────────────────────────────────────────────────

export function getAllContent(): ContentConfig {
  return {
    heroSlides: getHeroSlides(),
    featuredProducts: getFeaturedProducts(),
    signaturePieces: getSignaturePieces(),
    homeCategories: getHomeCategories(),
    collectionStory: getCollectionStory(),
    newsletter: getNewsletterConfig(),
    footer: getFooterConfig(),
    navigation: getNavConfig(),
    sitePages: getSitePages(),
    curatedCollections: getCuratedCollections(),
    comingSoonTeasers: getComingSoonTeasers(),
    lastUpdated: localStorage.getItem(KEYS.lastUpdated) || now(),
  };
}

export function seedAllContent(): void {
  // Only seed if no content exists yet (first run)
  if (!localStorage.getItem(KEYS.heroSlides)) {
    setHeroSlides(defaultHeroSlides());
    setFeaturedProducts(defaultFeaturedProducts());
    setSignaturePieces(defaultSignaturePieces());
    setHomeCategories(defaultHomeCategories());
    setCollectionStory(defaultCollectionStory());
    setNewsletterConfig(defaultNewsletter());
    setFooterConfig(defaultFooter());
    setNavConfig(defaultNavigation());
    setSitePages(defaultSitePages());
    setCuratedCollections(defaultCuratedCollections());
    setComingSoonTeasers(defaultComingSoonTeasers());
  }
}

export function resetAllContent(): void {
  resetHeroSlides();
  resetFeaturedProducts();
  resetSignaturePieces();
  resetHomeCategories();
  resetCollectionStory();
  resetNewsletterConfig();
  resetFooterConfig();
  resetNavConfig();
  resetSitePages();
  resetCuratedCollections();
  resetComingSoonTeasers();
}

export function getLastUpdated(): string {
  return localStorage.getItem(KEYS.lastUpdated) || now();
}
