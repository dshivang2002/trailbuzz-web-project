export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      blogs: {
        Row: {
          author: string | null
          category: string | null
          content: string | null
          cover_image: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          is_featured: boolean | null
          published_at: string | null
          read_time_minutes: number | null
          slug: string
          status: string | null
          tags: string[] | null
          title: string
        }
        Insert: {
          author?: string | null
          category?: string | null
          content?: string | null
          cover_image?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          is_featured?: boolean | null
          published_at?: string | null
          read_time_minutes?: number | null
          slug: string
          status?: string | null
          tags?: string[] | null
          title: string
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string | null
          cover_image?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          is_featured?: boolean | null
          published_at?: string | null
          read_time_minutes?: number | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          title?: string
        }
        Relationships: []
      }
      destinations: {
        Row: {
          best_time_to_visit: string | null
          cover_image: string | null
          created_at: string | null
          description: string | null
          highlights: string[] | null
          how_to_reach: string | null
          id: string
          images: string[] | null
          is_featured: boolean | null
          name: string
          region: string | null
          short_description: string | null
          slug: string
          state: string | null
          status: string | null
          weather: string | null
        }
        Insert: {
          best_time_to_visit?: string | null
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          highlights?: string[] | null
          how_to_reach?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          name: string
          region?: string | null
          short_description?: string | null
          slug: string
          state?: string | null
          status?: string | null
          weather?: string | null
        }
        Update: {
          best_time_to_visit?: string | null
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          highlights?: string[] | null
          how_to_reach?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          name?: string
          region?: string | null
          short_description?: string | null
          slug?: string
          state?: string | null
          status?: string | null
          weather?: string | null
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string | null
          name: string
          num_travelers: number | null
          package_id: string | null
          package_name: string | null
          phone: string | null
          source: string | null
          status: string | null
          travel_date: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message?: string | null
          name: string
          num_travelers?: number | null
          package_id?: string | null
          package_name?: string | null
          phone?: string | null
          source?: string | null
          status?: string | null
          travel_date?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string | null
          name?: string
          num_travelers?: number | null
          package_id?: string | null
          package_name?: string | null
          phone?: string | null
          source?: string | null
          status?: string | null
          travel_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enquiries_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          badge: string | null
          category: string | null
          cover_image: string | null
          created_at: string | null
          description: string | null
          destination_id: string | null
          difficulty: string | null
          duration_days: number | null
          duration_nights: number | null
          exclusions: string[] | null
          id: string
          images: string[] | null
          inclusions: string[] | null
          is_best_seller: boolean | null
          is_featured: boolean | null
          itinerary: Json | null
          max_group_size: number | null
          original_price: number | null
          price_per_person: number | null
          short_description: string | null
          slug: string
          status: string | null
          title: string
        }
        Insert: {
          badge?: string | null
          category?: string | null
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          destination_id?: string | null
          difficulty?: string | null
          duration_days?: number | null
          duration_nights?: number | null
          exclusions?: string[] | null
          id?: string
          images?: string[] | null
          inclusions?: string[] | null
          is_best_seller?: boolean | null
          is_featured?: boolean | null
          itinerary?: Json | null
          max_group_size?: number | null
          original_price?: number | null
          price_per_person?: number | null
          short_description?: string | null
          slug: string
          status?: string | null
          title: string
        }
        Update: {
          badge?: string | null
          category?: string | null
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          destination_id?: string | null
          difficulty?: string | null
          duration_days?: number | null
          duration_nights?: number | null
          exclusions?: string[] | null
          id?: string
          images?: string[] | null
          inclusions?: string[] | null
          is_best_seller?: boolean | null
          is_featured?: boolean | null
          itinerary?: Json | null
          max_group_size?: number | null
          original_price?: number | null
          price_per_person?: number | null
          short_description?: string | null
          slug?: string
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "packages_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      page_visits: {
        Row: {
          id: string
          ip_address: string | null
          page: string
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          visited_at: string | null
        }
        Insert: {
          id?: string
          ip_address?: string | null
          page: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          visited_at?: string | null
        }
        Update: {
          id?: string
          ip_address?: string | null
          page?: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          visited_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
