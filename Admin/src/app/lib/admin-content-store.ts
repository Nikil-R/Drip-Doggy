// ─── Admin Content Store ──────────────────────────────────────────────────
// Reads/writes the same localStorage keys as the frontend's content-store.ts

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
  lastUpdated: "dd_content_last_updated",
} as const;

function getItem<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); if (raw) return JSON.parse(raw) as T; } catch {}
  return fallback;
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
  localStorage.setItem(KEYS.lastUpdated, new Date().toISOString());
}

export interface HeroSlide { id: string; tagline: string; title: string; description: string; image: string; ctaText?: string; ctaLink?: string; order: number; active: boolean; }
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
export function getHeroSlides(): HeroSlide[] { return getItem<HeroSlide[]>(KEYS.heroSlides, defaultHeroSlides()); }
export function setHeroSlides(slides: HeroSlide[]): void { setItem(KEYS.heroSlides, slides); }
export function addHeroSlide(slide: HeroSlide): void { const s = getHeroSlides(); s.push(slide); setHeroSlides(s); }
export function updateHeroSlide(id: string, updates: Partial<HeroSlide>): void {
  const slides = getHeroSlides(); const idx = slides.findIndex(s => s.id === id);
  if (idx !== -1) { slides[idx] = { ...slides[idx], ...updates }; setHeroSlides(slides); }
}
export function deleteHeroSlide(id: string): void { setHeroSlides(getHeroSlides().filter(s => s.id !== id)); }

export interface FeaturedProductsConfig { sectionTitle: string; sectionSubtitle: string; productIds: number[]; maxProducts: number; active: boolean; }
export function getFeaturedProducts(): FeaturedProductsConfig { return getItem(KEYS.featuredProducts, { sectionTitle: "New In", sectionSubtitle: "New This Season", productIds: [], maxProducts: 4, active: true }); }
export function setFeaturedProducts(config: FeaturedProductsConfig): void { setItem(KEYS.featuredProducts, config); }

export interface SignaturePiecesConfig { sectionTitle: string; sectionSubtitle: string; productIds: number[]; maxProducts: number; active: boolean; }
export function getSignaturePieces(): SignaturePiecesConfig { return getItem(KEYS.signaturePieces, { sectionTitle: "Signature Pieces", sectionSubtitle: "Brand Uniform", productIds: [], maxProducts: 4, active: true }); }
export function setSignaturePieces(config: SignaturePiecesConfig): void { setItem(KEYS.signaturePieces, config); }

export interface HomeCategory { id: string; title: string; image: string; description: string; route: string; comingSoon: boolean; comingSeason?: string; order: number; active: boolean; }
export function getHomeCategories(): HomeCategory[] { return getItem<HomeCategory[]>(KEYS.homeCategories, []); }
export function setHomeCategories(cats: HomeCategory[]): void { setItem(KEYS.homeCategories, cats); }
export function addHomeCategory(cat: HomeCategory): void { const c = getHomeCategories(); c.push(cat); setHomeCategories(c); }
export function updateHomeCategory(id: string, updates: Partial<HomeCategory>): void {
  const cats = getHomeCategories(); const idx = cats.findIndex(c => c.id === id);
  if (idx !== -1) { cats[idx] = { ...cats[idx], ...updates }; setHomeCategories(cats); }
}
export function deleteHomeCategory(id: string): void { setHomeCategories(getHomeCategories().filter(c => c.id !== id)); }

export interface CollectionStory { tag: string; heading: string; description: string; image: string; ctaText: string; ctaLink: string; active: boolean; }
export function getCollectionStory(): CollectionStory { return getItem(KEYS.collectionStory, { tag: "", heading: "", description: "", image: "", ctaText: "", ctaLink: "", active: true }); }
export function setCollectionStory(story: CollectionStory): void { setItem(KEYS.collectionStory, story); }

export interface NewsletterConfig { heading: string; subtitle: string; placeholder: string; buttonText: string; consentText: string; successMessage: string; active: boolean; }
export function getNewsletterConfig(): NewsletterConfig { return getItem(KEYS.newsletter, { heading: "", subtitle: "", placeholder: "", buttonText: "", consentText: "", successMessage: "", active: true }); }
export function setNewsletterConfig(config: NewsletterConfig): void { setItem(KEYS.newsletter, config); }

export interface FooterLink { label: string; to: string; }
export interface SocialLink { platform: string; label: string; url: string; active: boolean; }
export interface FooterConfig {
  brandName: string; tagline: string; description: string; copyrightText: string;
  ctaSection: { tag: string; heading: string; description: string; buttonText: string; chips: string[]; };
  linkGroups: { title: string; links: FooterLink[]; }[]; socialLinks: SocialLink[]; active: boolean;
}
export function getFooterConfig(): FooterConfig { return getItem(KEYS.footer, { brandName: "", tagline: "", description: "", copyrightText: "", ctaSection: { tag: "", heading: "", description: "", buttonText: "", chips: [] }, linkGroups: [], socialLinks: [], active: true }); }
export function setFooterConfig(config: FooterConfig): void { setItem(KEYS.footer, config); }

export interface NavDropdownItem { label: string; to: string; children?: NavDropdownItem[]; }
export interface NavMenuItem { label: string; to: string; children?: NavDropdownItem[]; }
export interface NavConfig { desktopItems: NavMenuItem[]; mobileItems: { label: string; to: string }[]; active: boolean; }
export function getNavConfig(): NavConfig { return getItem(KEYS.navigation, { desktopItems: [], mobileItems: [], active: true }); }
export function setNavConfig(config: NavConfig): void { setItem(KEYS.navigation, config); }

export interface PageHeroSection { tag: string; heading: string; description: string; active: boolean; }
export interface SitePageData { slug: string; title: string; hero: PageHeroSection; active: boolean; }
export function getSitePages(): SitePageData[] { return getItem<SitePageData[]>(KEYS.sitePages, []); }
export function setSitePages(pages: SitePageData[]): void { setItem(KEYS.sitePages, pages); }
export function updateSitePage(slug: string, updates: Partial<SitePageData>): void {
  const pages = getSitePages(); const idx = pages.findIndex(p => p.slug === slug);
  if (idx !== -1) { pages[idx] = { ...pages[idx], ...updates }; setSitePages(pages); }
}

export interface CuratedCollection { id: string; title: string; description: string; image: string; link?: string; order: number; active: boolean; }
export function getCuratedCollections(): CuratedCollection[] { return getItem<CuratedCollection[]>(KEYS.curatedCollections, []); }
export function setCuratedCollections(cols: CuratedCollection[]): void { setItem(KEYS.curatedCollections, cols); }
export function addCuratedCollection(col: CuratedCollection): void { const c = getCuratedCollections(); c.push(col); setCuratedCollections(c); }
export function updateCuratedCollection(id: string, updates: Partial<CuratedCollection>): void {
  const cols = getCuratedCollections(); const idx = cols.findIndex(c => c.id === id);
  if (idx !== -1) { cols[idx] = { ...cols[idx], ...updates }; setCuratedCollections(cols); }
}
export function deleteCuratedCollection(id: string): void { setCuratedCollections(getCuratedCollections().filter(c => c.id !== id)); }

export function getLastUpdated(): string { return localStorage.getItem(KEYS.lastUpdated) || "Never"; }
export function seedAllContent(): boolean { return !localStorage.getItem(KEYS.heroSlides); }
