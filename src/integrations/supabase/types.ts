export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      credit_transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      disclaimer_acceptances: {
        Row: {
          accepted_at: string | null
          disclaimer_version: number
          id: string
          user_id: string
        }
        Insert: {
          accepted_at?: string | null
          disclaimer_version?: number
          id?: string
          user_id: string
        }
        Update: {
          accepted_at?: string | null
          disclaimer_version?: number
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          phone_number: string | null
          telegram_id: string | null
          twitter_id: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone_number?: string | null
          telegram_id?: string | null
          twitter_id?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone_number?: string | null
          telegram_id?: string | null
          twitter_id?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      secrets: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      trades: {
        Row: {
          ai_feedback: string | null
          analysis_count: number | null
          call_iv: number | null
          chart_link: string | null
          confidence_level: number | null
          confidence_level_score: number | null
          ema_position: string | null
          emotional_score: number | null
          entry_date: string | null
          entry_emotion: string | null
          entry_price: number
          entry_time: string | null
          exit_emotion: string | null
          exit_price: number | null
          exit_reason: string | null
          exit_time: string | null
          id: string
          is_impulsive: boolean | null
          market_condition: string | null
          notes: string | null
          option_type: string | null
          outcome: string
          overall_emotional_state: string | null
          pcr: number | null
          plan_deviation: boolean | null
          put_iv: number | null
          quantity: number | null
          satisfaction_score: number | null
          stop_loss: number | null
          strategy: string | null
          stress_level: number | null
          strike_price: number | null
          symbol: string
          time_pressure: string | null
          timeframe: string | null
          timestamp: string | null
          trade_direction: string | null
          trade_type: string
          user_id: string
          vix: number | null
          vwap_position: string | null
        }
        Insert: {
          ai_feedback?: string | null
          analysis_count?: number | null
          call_iv?: number | null
          chart_link?: string | null
          confidence_level?: number | null
          confidence_level_score?: number | null
          ema_position?: string | null
          emotional_score?: number | null
          entry_date?: string | null
          entry_emotion?: string | null
          entry_price: number
          entry_time?: string | null
          exit_emotion?: string | null
          exit_price?: number | null
          exit_reason?: string | null
          exit_time?: string | null
          id?: string
          is_impulsive?: boolean | null
          market_condition?: string | null
          notes?: string | null
          option_type?: string | null
          outcome: string
          overall_emotional_state?: string | null
          pcr?: number | null
          plan_deviation?: boolean | null
          put_iv?: number | null
          quantity?: number | null
          satisfaction_score?: number | null
          stop_loss?: number | null
          strategy?: string | null
          stress_level?: number | null
          strike_price?: number | null
          symbol: string
          time_pressure?: string | null
          timeframe?: string | null
          timestamp?: string | null
          trade_direction?: string | null
          trade_type: string
          user_id: string
          vix?: number | null
          vwap_position?: string | null
        }
        Update: {
          ai_feedback?: string | null
          analysis_count?: number | null
          call_iv?: number | null
          chart_link?: string | null
          confidence_level?: number | null
          confidence_level_score?: number | null
          ema_position?: string | null
          emotional_score?: number | null
          entry_date?: string | null
          entry_emotion?: string | null
          entry_price?: number
          entry_time?: string | null
          exit_emotion?: string | null
          exit_price?: number | null
          exit_reason?: string | null
          exit_time?: string | null
          id?: string
          is_impulsive?: boolean | null
          market_condition?: string | null
          notes?: string | null
          option_type?: string | null
          outcome?: string
          overall_emotional_state?: string | null
          pcr?: number | null
          plan_deviation?: boolean | null
          put_iv?: number | null
          quantity?: number | null
          satisfaction_score?: number | null
          stop_loss?: number | null
          strategy?: string | null
          stress_level?: number | null
          strike_price?: number | null
          symbol?: string
          time_pressure?: string | null
          timeframe?: string | null
          timestamp?: string | null
          trade_direction?: string | null
          trade_type?: string
          user_id?: string
          vix?: number | null
          vwap_position?: string | null
        }
        Relationships: []
      }
      user_credits: {
        Row: {
          created_at: string | null
          id: string
          purchased_credits: number
          total_credits_used: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          purchased_credits?: number
          total_credits_used?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          purchased_credits?: number
          total_credits_used?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_feedback: {
        Row: {
          created_at: string
          description: string
          feedback_type: string
          id: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          feedback_type: string
          id?: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          feedback_type?: string
          id?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_emotional_score: {
        Args: { entry_emotion: string; exit_emotion: string }
        Returns: number
      }
      check_trade_limit: {
        Args: { entry_date: string; user_id: string }
        Returns: boolean
      }
      deduct_credits: {
        Args: { user_id: string; credits_to_deduct: number }
        Returns: number
      }
      get_daily_leaderboard: {
        Args: { limit_count?: number }
        Returns: {
          username: string
          avatar_url: string
          profit_loss: number
          rank: number
        }[]
      }
    }
    Enums: {
      product_type: "chart" | "poster"
      subscription_status: "active" | "cancelled" | "past_due" | "unpaid"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      product_type: ["chart", "poster"],
      subscription_status: ["active", "cancelled", "past_due", "unpaid"],
    },
  },
} as const
