export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          age: number | null
          gender: 'male' | 'female' | 'non-binary' | 'prefer_not_to_say' | null
          location: string | null
          bio: string | null
          interests: string[] | null
          photos: string[] | null
          verified: boolean | null
          role: 'user' | 'admin' | 'moderator' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          age?: number | null
          gender?: 'male' | 'female' | 'non-binary' | 'prefer_not_to_say' | null
          location?: string | null
          bio?: string | null
          interests?: string[] | null
          photos?: string[] | null
          verified?: boolean | null
          role?: 'user' | 'admin' | 'moderator' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          age?: number | null
          gender?: 'male' | 'female' | 'non-binary' | 'prefer_not_to_say' | null
          location?: string | null
          bio?: string | null
          interests?: string[] | null
          photos?: string[] | null
          verified?: boolean | null
          role?: 'user' | 'admin' | 'moderator' | null
          created_at?: string
          updated_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          user1_id: string
          user2_id: string
          status: 'pending' | 'accepted' | 'rejected' | null
          created_at: string
        }
        Insert: {
          id?: string
          user1_id: string
          user2_id: string
          status?: 'pending' | 'accepted' | 'rejected' | null
          created_at?: string
        }
        Update: {
          id?: string
          user1_id?: string
          user2_id?: string
          status?: 'pending' | 'accepted' | 'rejected' | null
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          match_id: string
          sender_id: string
          text: string | null
          image_url: string | null
          is_read: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          match_id: string
          sender_id: string
          text?: string | null
          image_url?: string | null
          is_read?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          sender_id?: string
          text?: string | null
          image_url?: string | null
          is_read?: boolean | null
          created_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          reporter_id: string | null
          reported_id: string
          reason: string
          status: 'pending' | 'under_review' | 'resolved' | 'dismissed' | null
          created_at: string
        }
        Insert: {
          id?: string
          reporter_id?: string | null
          reported_id: string
          reason: string
          status?: 'pending' | 'under_review' | 'resolved' | 'dismissed' | null
          created_at?: string
        }
        Update: {
          id?: string
          reporter_id?: string | null
          reported_id?: string
          reason?: string
          status?: 'pending' | 'under_review' | 'resolved' | 'dismissed' | null
          created_at?: string
        }
      }
      blocked_users: {
        Row: {
          id: string
          blocker_id: string
          blocked_id: string
          created_at: string
        }
        Insert: {
          id?: string
          blocker_id: string
          blocked_id: string
          created_at?: string
        }
        Update: {
          id?: string
          blocker_id?: string
          blocked_id?: string
          created_at?: string
        }
      }
    }
  }
}