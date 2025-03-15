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
      products: {
        Row: {
          created_at: string | null
          description: string
          id: string
          image_url: string
          price: number
          title: string
          type: Database["public"]["Enums"]["product_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          image_url: string
          price: number
          title: string
          type: Database["public"]["Enums"]["product_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          image_url?: string
          price?: number
          title?: string
          type?: Database["public"]["Enums"]["product_type"]
          updated_at?: string | null
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
      subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          end_date: string | null
          id: string
          razorpay_customer_id: string | null
          razorpay_subscription_id: string | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          end_date?: string | null
          id?: string
          razorpay_customer_id?: string | null
          razorpay_subscription_id?: string | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          end_date?: string | null
          id?: string
          razorpay_customer_id?: string | null
          razorpay_subscription_id?: string | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          updated_at?: string | null
          user_id?: string
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
          market_condition: string | null
          notes: string | null
          option_type: string | null
          outcome: string
          overall_emotional_state: string | null
          pcr: number | null
          put_iv: number | null
          quantity: number | null
          stop_loss: number | null
          strategy: string | null
          strike_price: number | null
          symbol: string
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
          market_condition?: string | null
          notes?: string | null
          option_type?: string | null
          outcome: string
          overall_emotional_state?: string | null
          pcr?: number | null
          put_iv?: number | null
          quantity?: number | null
          stop_loss?: number | null
          strategy?: string | null
          strike_price?: number | null
          symbol: string
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
          market_condition?: string | null
          notes?: string | null
          option_type?: string | null
          outcome?: string
          overall_emotional_state?: string | null
          pcr?: number | null
          put_iv?: number | null
          quantity?: number | null
          stop_loss?: number | null
          strategy?: string | null
          strike_price?: number | null
          symbol?: string
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
          last_reset_date: string | null
          next_reset_date: string | null
          purchased_credits: number
          subscription_credits: number
          total_credits_used: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_reset_date?: string | null
          next_reset_date?: string | null
          purchased_credits?: number
          subscription_credits?: number
          total_credits_used?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_reset_date?: string | null
          next_reset_date?: string | null
          purchased_credits?: number
          subscription_credits?: number
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
        Args: {
          entry_emotion: string
          exit_emotion: string
        }
        Returns: number
      }
      check_trade_limit: {
        Args: {
          entry_date: string
          user_id: string
        }
        Returns: boolean
      }
      deduct_credits: {
        Args: {
          user_id: string
          credits_to_deduct: number
        }
        Returns: number
      }
      get_daily_leaderboard: {
        Args: {
          limit_count?: number
        }
        Returns: {
          username: string
          avatar_url: string
          profit_loss: number
          rank: number
        }[]
      }
      has_active_subscription: {
        Args: {
          user_id: string
        }
        Returns: boolean
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
