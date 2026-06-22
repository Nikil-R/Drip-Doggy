// ─── Hero Slides ──────────────────────────────────────────────────────────

export interface HeroSlide {
  id: string;
  tagline: string;
  title: string;
  description: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
  order: number;
  active: boolean;
}

// ─── Home Categories ──────────────────────────────────────────────────────

export interface HomeCategory {
  id: string;
  title: string;
  image: string;
  description: string;
  route: string;
  comingSoon: boolean;
  comingSeason?: string;
  order: number;
  active: boolean;
}

// ─── Collection Story ─────────────────────────────────────────────────────

export interface CollectionStory {
  tag: string;
  heading: string;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  active: boolean;
}

// ─── Newsletter Config ────────────────────────────────────────────────────

export interface NewsletterConfig {
  heading: string;
  subtitle: string;
  placeholder: string;
  buttonText: string;
  consentText: string;
  successMessage: string;
  active: boolean;
}

// ─── Featured Products ────────────────────────────────────────────────────

export interface FeaturedProductsConfig {
  sectionTitle: string;
  sectionSubtitle: string;
  productIds: number[];
  maxProducts: number;
  active: boolean;
}

// ─── Signature Pieces ─────────────────────────────────────────────────────

export interface SignaturePiecesConfig {
  sectionTitle: string;
  sectionSubtitle: string;
  productIds: number[];
  active: boolean;
}

// ─── Footer Settings ──────────────────────────────────────────────────────

export interface FooterLink {
  label: string;
  to: string;
}

export interface SocialLink {
  platform: string;
  label: string;
  url: string;
  active: boolean;
}

export interface FooterConfig {
  brandName: string;
  tagline: string;
  description: string;
  copyrightText: string;
  ctaSection: {
    tag: string;
    heading: string;
    description: string;
    buttonText: string;
    chips: string[];
  };
  linkGroups: {
    title: string;
    links: FooterLink[];
  }[];
  socialLinks: SocialLink[];
  active: boolean;
}

// ─── Navigation Menu ──────────────────────────────────────────────────────

export interface NavMenuItem {
  label: string;
  to: string;
  children?: NavDropdownItem[];
}

export interface NavDropdownItem {
  label: string;
  to: string;
  children?: NavDropdownItem[];
}

export interface NavConfig {
  desktopItems: NavMenuItem[];
  mobileItems: { label: string; to: string }[];
  active: boolean;
}

// ─── Site Pages ───────────────────────────────────────────────────────────

export interface SitePageContent {
  slug: string;
  title: string;
  content: string; // Rich text / HTML
  lastEdited: string;
  active: boolean;
}

// ─── Curated Collections ──────────────────────────────────────────────────

export interface CuratedCollection {
  id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
  order: number;
  active: boolean;
}

// ─── Hero Content for About/Contact/FAQ/Returns/Terms/Privacy ─────────────

export interface PageHeroSection {
  tag: string;
  heading: string;
  description: string;
  active: boolean;
}

export interface SitePageData {
  slug: string;
  title: string;
  hero: PageHeroSection;
  active: boolean;
}

// ─── Top-Level Content Config ─────────────────────────────────────────────

export interface ContentConfig {
  heroSlides: HeroSlide[];
  featuredProducts: FeaturedProductsConfig;
  signaturePieces: SignaturePiecesConfig;
  homeCategories: HomeCategory[];
  collectionStory: CollectionStory;
  newsletter: NewsletterConfig;
  footer: FooterConfig;
  navigation: NavConfig;
  sitePages: SitePageData[];
  curatedCollections: CuratedCollection[];
  lastUpdated: string;
}
