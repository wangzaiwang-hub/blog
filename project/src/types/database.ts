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
      articles: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          excerpt: string
          category_id: string
          author_id: string
          thumbnail_url: string | null
          published_at: string | null
          created_at: string
          updated_at: string
          view_count: number
          comment_count: number
          is_published: boolean
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          excerpt: string
          category_id: string
          author_id: string
          thumbnail_url?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
          view_count?: number
          comment_count?: number
          is_published?: boolean
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          excerpt?: string
          category_id?: string
          author_id?: string
          thumbnail_url?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
          view_count?: number
          comment_count?: number
          is_published?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "articles_author_id_fkey"
            columns: ["author_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      article_tags: {
        Row: {
          article_id: string
          tag_id: string
        }
        Insert: {
          article_id: string
          tag_id: string
        }
        Update: {
          article_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_tags_article_id_fkey"
            columns: ["article_id"]
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_tags_tag_id_fkey"
            columns: ["tag_id"]
            referencedRelation: "tags"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          created_at: string
          article_count: number
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          created_at?: string
          article_count?: number
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          created_at?: string
          article_count?: number
        }
        Relationships: []
      }
      comments: {
        Row: {
          id: string
          content: string
          article_id: string
          user_id: string
          created_at: string
          updated_at: string
          parent_id: string | null
        }
        Insert: {
          id?: string
          content: string
          article_id: string
          user_id: string
          created_at?: string
          updated_at?: string
          parent_id?: string | null
        }
        Update: {
          id?: string
          content?: string
          article_id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_article_id_fkey"
            columns: ["article_id"]
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      music: {
        Row: {
          id: string
          title: string
          artist: string
          url: string
          cover_url: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          artist: string
          url: string
          cover_url: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          artist?: string
          url?: string
          cover_url?: string
          created_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          username: string
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
          is_admin: boolean
          email: string
        }
        Insert: {
          id: string
          username: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
          is_admin?: boolean
          email: string
        }
        Update: {
          id?: string
          username?: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
          is_admin?: boolean
          email?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string
          url: string
          image_url: string | null
          github_url: string | null
          tech_stack: string[]
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          url: string
          image_url?: string | null
          github_url?: string | null
          tech_stack: string[]
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          url?: string
          image_url?: string | null
          github_url?: string | null
          tech_stack?: string[]
          created_at?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          id: string
          name: string
          level: number
          category: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          level: number
          category: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          level?: number
          category?: string
          created_at?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
          article_count: number
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
          article_count?: number
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
          article_count?: number
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