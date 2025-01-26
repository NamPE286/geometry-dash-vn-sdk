export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      level_creator: {
        Row: {
          is_decorator: boolean
          is_gameplay_maker: boolean
          level_id: number
          part_end: number
          part_start: number
          user_id: string
        }
        Insert: {
          is_decorator?: boolean
          is_gameplay_maker?: boolean
          level_id: number
          part_end?: number
          part_start?: number
          user_id?: string
        }
        Update: {
          is_decorator?: boolean
          is_gameplay_maker?: boolean
          level_id?: number
          part_end?: number
          part_start?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "level_creator_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "level_creator_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      level_rating: {
        Row: {
          id: number
          list: string
          min_progress: number
          rating: number
        }
        Insert: {
          id?: number
          list: string
          min_progress?: number
          rating: number
        }
        Update: {
          id?: number
          list?: string
          min_progress?: number
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "level_rating_id_fkey"
            columns: ["id"]
            isOneToOne: false
            referencedRelation: "levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "level_rating_list_fkey"
            columns: ["list"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["name"]
          },
        ]
      }
      levels: {
        Row: {
          created_at: string
          creator: string
          id: number
          name: string
          youtube_video_id: string
        }
        Insert: {
          created_at?: string
          creator: string
          id: number
          name: string
          youtube_video_id: string
        }
        Update: {
          created_at?: string
          creator?: string
          id?: number
          name?: string
          youtube_video_id?: string
        }
        Relationships: []
      }
      lists: {
        Row: {
          description: string | null
          name: string
        }
        Insert: {
          description?: string | null
          name: string
        }
        Update: {
          description?: string | null
          name?: string
        }
        Relationships: []
      }
      records: {
        Row: {
          created_at: string
          level_id: number
          progress: number
          user_id: string
          video_link: string
        }
        Insert: {
          created_at?: string
          level_id: number
          progress: number
          user_id: string
          video_link: string
        }
        Update: {
          created_at?: string
          level_id?: number
          progress?: number
          user_id?: string
          video_link?: string
        }
        Relationships: [
          {
            foreignKeyName: "records_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_role: {
        Row: {
          add_level: boolean
          delete_level: boolean
          edit_own_profile: boolean
          modify_level: boolean
          modify_record: boolean
          name: string
          remove_record: boolean
          review_submission: boolean
          submit: boolean
        }
        Insert: {
          add_level?: boolean
          delete_level?: boolean
          edit_own_profile?: boolean
          modify_level?: boolean
          modify_record?: boolean
          name: string
          remove_record?: boolean
          review_submission?: boolean
          submit?: boolean
        }
        Update: {
          add_level?: boolean
          delete_level?: boolean
          edit_own_profile?: boolean
          modify_level?: boolean
          modify_record?: boolean
          name?: string
          remove_record?: boolean
          review_submission?: boolean
          submit?: boolean
        }
        Relationships: []
      }
      users: {
        Row: {
          city: string | null
          created_at: string
          is_hidden: boolean
          name: string
          province: string | null
          role: string
          user_id: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          is_hidden?: boolean
          name: string
          province?: string | null
          role?: string
          user_id: string
        }
        Update: {
          city?: string | null
          created_at?: string
          is_hidden?: boolean
          name?: string
          province?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "user_role"
            referencedColumns: ["name"]
          },
        ]
      }
    }
    Views: {
      records_view: {
        Row: {
          exp: number | null
          level_id: number | null
          list: string | null
          no: number | null
          point: number | null
          progress: number | null
          user_id: string | null
          video_link: string | null
        }
        Relationships: [
          {
            foreignKeyName: "level_rating_list_fkey"
            columns: ["list"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "records_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Functions: {
      refresh: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

