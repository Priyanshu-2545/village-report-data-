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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      api_health_log: {
        Row: {
          api_url: string
          checked_at: string | null
          error_message: string | null
          id: string
          response_time_ms: number | null
          status_code: number | null
          success: boolean | null
        }
        Insert: {
          api_url: string
          checked_at?: string | null
          error_message?: string | null
          id?: string
          response_time_ms?: number | null
          status_code?: number | null
          success?: boolean | null
        }
        Update: {
          api_url?: string
          checked_at?: string | null
          error_message?: string | null
          id?: string
          response_time_ms?: number | null
          status_code?: number | null
          success?: boolean | null
        }
        Relationships: []
      }
      districts: {
        Row: {
          created_at: string | null
          district_code: string
          district_name: string
          district_name_hi: string | null
          id: string
          state_code: string
          state_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          district_code: string
          district_name: string
          district_name_hi?: string | null
          id?: string
          state_code: string
          state_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          district_code?: string
          district_name?: string
          district_name_hi?: string | null
          id?: string
          state_code?: string
          state_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      mgnrega_performance: {
        Row: {
          average_wage_per_day: number | null
          budget_utilization_percentage: number | null
          completed_works: number | null
          created_at: string | null
          data_source: string | null
          district_code: string
          district_id: string | null
          financial_year: string
          households_provided_employment: number | null
          id: string
          last_updated: string | null
          material_expenditure: number | null
          month: string
          ongoing_works: number | null
          person_days_generated: number | null
          sc_persondays: number | null
          st_persondays: number | null
          state_code: string
          total_budget: number | null
          total_expenditure: number | null
          wage_expenditure: number | null
          women_persondays: number | null
        }
        Insert: {
          average_wage_per_day?: number | null
          budget_utilization_percentage?: number | null
          completed_works?: number | null
          created_at?: string | null
          data_source?: string | null
          district_code: string
          district_id?: string | null
          financial_year: string
          households_provided_employment?: number | null
          id?: string
          last_updated?: string | null
          material_expenditure?: number | null
          month: string
          ongoing_works?: number | null
          person_days_generated?: number | null
          sc_persondays?: number | null
          st_persondays?: number | null
          state_code: string
          total_budget?: number | null
          total_expenditure?: number | null
          wage_expenditure?: number | null
          women_persondays?: number | null
        }
        Update: {
          average_wage_per_day?: number | null
          budget_utilization_percentage?: number | null
          completed_works?: number | null
          created_at?: string | null
          data_source?: string | null
          district_code?: string
          district_id?: string | null
          financial_year?: string
          households_provided_employment?: number | null
          id?: string
          last_updated?: string | null
          material_expenditure?: number | null
          month?: string
          ongoing_works?: number | null
          person_days_generated?: number | null
          sc_persondays?: number | null
          st_persondays?: number | null
          state_code?: string
          total_budget?: number | null
          total_expenditure?: number | null
          wage_expenditure?: number | null
          women_persondays?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mgnrega_performance_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
        ]
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
