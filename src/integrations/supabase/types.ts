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
      trades: {
        Row: {
          actual_risk_reward: number | null
          ai_feedback: string | null
          call_iv: number | null
          chart_link: string | null
          confidence_level: number | null
          confidence_level_score: number | null
          ema_position: string | null
          emotional_score: number | null
          entry_emotion: string | null
          entry_price: number
          entry_time: string | null
          exit_efficiency: number | null
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
          plan_deviation_reason: string | null
          planned_risk_reward: number | null
          planned_target: number | null
          post_exit_price: number | null
          put_iv: number | null
          quantity: number | null
          slippage: number | null
          stop_loss: number | null
          strategy: string | null
          strike_price: number | null
          symbol: string
          target: number | null
          timeframe: string | null
          timestamp: string
          trade_direction: string | null
          trade_type: string
          user_id: string
          vix: number | null
          vwap_position: string | null
          what_if_analysis: Json | null
        }
        Insert: {
          actual_risk_reward?: number | null
          ai_feedback?: string | null
          call_iv?: number | null
          chart_link?: string | null
          confidence_level?: number | null
          confidence_level_score?: number | null
          ema_position?: string | null
          emotional_score?: number | null
          entry_emotion?: string | null
          entry_price: number
          entry_time?: string | null
          exit_efficiency?: number | null
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
          plan_deviation_reason?: string | null
          planned_risk_reward?: number | null
          planned_target?: number | null
          post_exit_price?: number | null
          put_iv?: number | null
          quantity?: number | null
          slippage?: number | null
          stop_loss?: number | null
          strategy?: string | null
          strike_price?: number | null
          symbol: string
          target?: number | null
          timeframe?: string | null
          timestamp?: string
          trade_direction?: string | null
          trade_type: string
          user_id: string
          vix?: number | null
          vwap_position?: string | null
          what_if_analysis?: Json | null
        }
        Update: {
          actual_risk_reward?: number | null
          ai_feedback?: string | null
          call_iv?: number | null
          chart_link?: string | null
          confidence_level?: number | null
          confidence_level_score?: number | null
          ema_position?: string | null
          emotional_score?: number | null
          entry_emotion?: string | null
          entry_price?: number
          entry_time?: string | null
          exit_efficiency?: number | null
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
          plan_deviation_reason?: string | null
          planned_risk_reward?: number | null
          planned_target?: number | null
          post_exit_price?: number | null
          put_iv?: number | null
          quantity?: number | null
          slippage?: number | null
          stop_loss?: number | null
          strategy?: string | null
          strike_price?: number | null
          symbol?: string
          target?: number | null
          timeframe?: string | null
          timestamp?: string
          trade_direction?: string | null
          trade_type?: string
          user_id?: string
          vix?: number | null
          vwap_position?: string | null
          what_if_analysis?: Json | null
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
