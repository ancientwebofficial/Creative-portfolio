export interface PortfolioItem {
  id: string;
  title: string;
  slug?: string;
  category: string;
  category_id?: string | null;
  categoryName?: string | null;
  image: string;
  thumbnail_url?: string | null;
  thumbnail_width?: number | null;
  thumbnail_height?: number | null;
  gallery_images?: string[];
  tags: string[];
  featured: boolean;
  popularity_score?: number;
  visibility?: string;
  date: string;
  description: string;
  short_description?: string | null;
  full_description?: string | null;
  client_name?: string | null;
  client_permission?: boolean;
  external_link?: string | null;
  discord_order_link?: string | null;
  created_at?: string;
  updated_at?: string;
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: "1",
    title: "Nether Exploration Thumbnail",
    category: "thumbnails",
    image: "/placeholder-1.jpg",
    tags: ["action", "adventure", "nether"],
    featured: true,
    date: "2024-05-15",
    description: "High-impact thumbnail for nether exploration content",
  },
  {
    id: "2",
    title: "Studio Brand Logo",
    category: "logos",
    image: "/placeholder-2.jpg",
    tags: ["branding", "modern", "clean"],
    featured: true,
    date: "2024-05-10",
    description: "Professional logo design for creative studio",
  },
  {
    id: "3",
    title: "Crystal Texture Pack",
    category: "texture-packs",
    image: "/placeholder-3.jpg",
    tags: ["16x", "clean", "crystals"],
    featured: true,
    date: "2024-05-08",
    description: "Beautiful crystal-themed texture pack with pristine details",
  },
  {
    id: "4",
    title: "Survival Series Banner",
    category: "banners",
    image: "/placeholder-4.jpg",
    tags: ["series", "minecraft", "header"],
    featured: false,
    date: "2024-05-05",
    description: "Channel header banner for survival series",
  },
  {
    id: "5",
    title: "Boss Battle Thumbnail",
    category: "thumbnails",
    image: "/placeholder-5.jpg",
    tags: ["boss", "action", "dramatic"],
    featured: false,
    date: "2024-04-28",
    description: "Intense boss battle thumbnail design",
  },
  {
    id: "6",
    title: "Medieval Kingdom Logo",
    category: "logos",
    image: "/placeholder-6.jpg",
    tags: ["medieval", "kingdom", "fantasy"],
    featured: true,
    date: "2024-04-25",
    description: "Ornate medieval kingdom logo design",
  },
  {
    id: "7",
    title: "Dark Forest Texture Pack",
    category: "texture-packs",
    image: "/placeholder-7.jpg",
    tags: ["32x", "dark", "atmospheric"],
    featured: false,
    date: "2024-04-20",
    description: "Moody dark forest texture pack",
  },
  {
    id: "8",
    title: "Speedrun Guide Banner",
    category: "banners",
    image: "/placeholder-8.jpg",
    tags: ["speedrun", "guide", "tutorial"],
    featured: false,
    date: "2024-04-18",
    description: "Speedrun guide series banner",
  },
  {
    id: "9",
    title: "Underwater Adventure Thumbnail",
    category: "thumbnails",
    image: "/placeholder-9.jpg",
    tags: ["underwater", "exploration", "adventure"],
    featured: true,
    date: "2024-04-15",
    description: "Deep sea exploration thumbnail",
  },
  {
    id: "10",
    title: "Stream Overlay Logo",
    category: "logos",
    image: "/placeholder-10.jpg",
    tags: ["stream", "overlay", "gaming"],
    featured: false,
    date: "2024-04-12",
    description: "Professional streaming overlay logo",
  },
];

export const categories = [
  { id: "thumbnails", label: "Thumbnails", count: 25 },
  { id: "logos", label: "Logos", count: 18 },
  { id: "texture-packs", label: "Texture Packs", count: 12 },
  { id: "banners", label: "Banners", count: 15 },
];

export const sortOptions = [
  { id: "popular", label: "Most Popular" },
  { id: "recent", label: "Newest" },
  { id: "oldest", label: "Oldest" },
  { id: "featured", label: "Featured" },
];
