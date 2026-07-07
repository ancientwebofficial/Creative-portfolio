export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "admin" | "editor";
export type Visibility = "public" | "private" | "draft";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: UserRole;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: UserRole;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          display_order: number;
          visibility: Visibility;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          display_order?: number;
          visibility?: Visibility;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
        Relationships: [];
      };
      portfolio_items: {
        Row: {
          id: string;
          title: string;
          slug: string;
          short_description: string | null;
          full_description: string | null;
          category_id: string | null;
          thumbnail_url: string | null;
          gallery_images: string[];
          tags: string[];
          featured: boolean;
          popularity_score: number;
          visibility: Visibility;
          client_name: string | null;
          client_permission: boolean;
          external_link: string | null;
          discord_order_link: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          short_description?: string | null;
          full_description?: string | null;
          category_id?: string | null;
          thumbnail_url?: string | null;
          gallery_images?: string[];
          tags?: string[];
          featured?: boolean;
          popularity_score?: number;
          visibility?: Visibility;
          client_name?: string | null;
          client_permission?: boolean;
          external_link?: string | null;
          discord_order_link?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["portfolio_items"]["Insert"]>;
        Relationships: [];
      };
      services: {
        Row: {
          id: string;
          title: string;
          slug: string;
          short_description: string | null;
          full_description: string | null;
          starting_price: number;
          delivery_time: string | null;
          revisions: string | null;
          feature_list: string[];
          featured: boolean;
          discord_order_link: string | null;
          active: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          short_description?: string | null;
          full_description?: string | null;
          starting_price?: number;
          delivery_time?: string | null;
          revisions?: string | null;
          feature_list?: string[];
          featured?: boolean;
          discord_order_link?: string | null;
          active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["services"]["Insert"]>;
        Relationships: [];
      };
      testimonials: {
        Row: {
          id: string;
          client_name: string;
          client_role: string | null;
          quote: string;
          rating: number;
          approved: boolean;
          featured: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_name: string;
          client_role?: string | null;
          quote: string;
          rating?: number;
          approved?: boolean;
          featured?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["testimonials"]["Insert"]>;
        Relationships: [];
      };
      homepage_blocks: {
        Row: {
          id: string;
          block_type: string;
          title: string | null;
          subtitle: string | null;
          content: string | null;
          image_url: string | null;
          linked_portfolio_ids: string[];
          alignment: string;
          style_variant: string;
          visibility: Visibility;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          block_type: string;
          title?: string | null;
          subtitle?: string | null;
          content?: string | null;
          image_url?: string | null;
          linked_portfolio_ids?: string[];
          alignment?: string;
          style_variant?: string;
          visibility?: Visibility;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["homepage_blocks"]["Insert"]>;
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: string;
          site_name: string;
          hero_title: string | null;
          hero_subtitle: string | null;
          about_text: string | null;
          discord_url: string | null;
          owner_name: string | null;
          owner_avatar_url: string | null;
          owner_email: string | null;
          owner_discord: string | null;
          owner_discord_server_url: string | null;
          owner_instagram_url: string | null;
          owner_x_url: string | null;
          owner_youtube_url: string | null;
          owner_fiverr_url: string | null;
          owner_behance_url: string | null;
          owner_website_url: string | null;
          owner_github_url: string | null;
          owner_modrinth_url: string | null;
          owner_location: string | null;
          owner_bio: string | null;
          socials: Json;
          footer_text: string | null;
          seo_title: string | null;
          seo_description: string | null;
          logo_url: string | null;
          favicon_url: string | null;
          singleton: boolean;
          updated_at: string;
        };
        Insert: {
          id?: string;
          site_name?: string;
          hero_title?: string | null;
          hero_subtitle?: string | null;
          about_text?: string | null;
          discord_url?: string | null;
          owner_name?: string | null;
          owner_avatar_url?: string | null;
          owner_email?: string | null;
          owner_discord?: string | null;
          owner_discord_server_url?: string | null;
          owner_instagram_url?: string | null;
          owner_x_url?: string | null;
          owner_youtube_url?: string | null;
          owner_fiverr_url?: string | null;
          owner_behance_url?: string | null;
          owner_website_url?: string | null;
          owner_github_url?: string | null;
          owner_modrinth_url?: string | null;
          owner_location?: string | null;
          owner_bio?: string | null;
          socials?: Json;
          footer_text?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          logo_url?: string | null;
          favicon_url?: string | null;
          singleton?: boolean;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Insert"]>;
        Relationships: [];
      };
      media_library: {
        Row: {
          id: string;
          file_name: string;
          file_url: string;
          file_type: string;
          alt_text: string | null;
          uploaded_by: string | null;
          storage_path: string;
          file_size: number | null;
          width: number | null;
          height: number | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          file_name: string;
          file_url: string;
          file_type: string;
          alt_text?: string | null;
          uploaded_by?: string | null;
          storage_path: string;
          file_size?: number | null;
          width?: number | null;
          height?: number | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["media_library"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type Inserts<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type Updates<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
