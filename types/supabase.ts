export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      igames: {
        Row: {
          active: boolean;
          created_at: string;
          id: number;
          period: number;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          id?: number;
          period?: number;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          id?: number;
          period?: number;
        };
        Relationships: [];
      };
      ilogs: {
        Row: {
          balances: number;
          created_at: string;
          expenditure: number;
          game: number;
          id: number;
          period: number;
          price: number;
        };
        Insert: {
          balances?: number;
          created_at?: string;
          expenditure?: number;
          game: number;
          id?: number;
          period?: number;
          price?: number;
        };
        Update: {
          balances?: number;
          created_at?: string;
          expenditure?: number;
          game?: number;
          id?: number;
          period?: number;
          price?: number;
        };
        Relationships: [
          {
            foreignKeyName: "ilogs_game_fkey";
            columns: ["game"];
            isOneToOne: false;
            referencedRelation: "igames";
            referencedColumns: ["id"];
          }
        ];
      };
      iplayers: {
        Row: {
          apple: number;
          balance: number;
          created_at: string;
          demand: number;
          game: number;
          id: number;
          ip: string;
          period: number;
        };
        Insert: {
          apple?: number;
          balance?: number;
          created_at?: string;
          demand?: number;
          game: number;
          id?: number;
          ip?: string;
          period?: number;
        };
        Update: {
          apple?: number;
          balance?: number;
          created_at?: string;
          demand?: number;
          game?: number;
          id?: number;
          ip?: string;
          period?: number;
        };
        Relationships: [
          {
            foreignKeyName: "iplayers_game_fkey";
            columns: ["game"];
            isOneToOne: false;
            referencedRelation: "igames";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      magic: {
        Args: {
          game_id: number;
          income: number;
          perio: number;
        };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never;
