/**
 * Database types for the CareerOS Supabase project.
 *
 * These are hand-written to match `supabase/migrations/*.sql` exactly. Once
 * the migrations are applied to a real project, regenerate this file from
 * the live schema instead of hand-editing it:
 *
 *   npx supabase gen types typescript --project-id <ref> > types/database.types.ts
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          headline: string | null;
          bio: string | null;
          location: string | null;
          linkedin_url: string | null;
          github_url: string | null;
          portfolio_url: string | null;
          skills: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          headline?: string | null;
          bio?: string | null;
          location?: string | null;
          linkedin_url?: string | null;
          github_url?: string | null;
          portfolio_url?: string | null;
          skills?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          headline?: string | null;
          bio?: string | null;
          location?: string | null;
          linkedin_url?: string | null;
          github_url?: string | null;
          portfolio_url?: string | null;
          skills?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      resumes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          is_primary: boolean;
          file_path: string | null;
          file_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          is_primary?: boolean;
          file_path?: string | null;
          file_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          is_primary?: boolean;
          file_path?: string | null;
          file_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'resumes_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      resume_versions: {
        Row: {
          id: string;
          resume_id: string;
          user_id: string;
          version_number: number;
          content: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          resume_id: string;
          user_id: string;
          version_number?: number;
          content?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          resume_id?: string;
          user_id?: string;
          version_number?: number;
          content?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'resume_versions_resume_id_fkey';
            columns: ['resume_id'];
            isOneToOne: false;
            referencedRelation: 'resumes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'resume_versions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      job_descriptions: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          company: string | null;
          description: string | null;
          structured_content: Json | null;
          source_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          company?: string | null;
          description?: string | null;
          structured_content?: Json | null;
          source_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          company?: string | null;
          description?: string | null;
          structured_content?: Json | null;
          source_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'job_descriptions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      ats_results: {
        Row: {
          id: string;
          user_id: string;
          resume_version_id: string;
          job_description_id: string;
          score: number | null;
          details: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          resume_version_id: string;
          job_description_id: string;
          score?: number | null;
          details?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          resume_version_id?: string;
          job_description_id?: string;
          score?: number | null;
          details?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ats_results_resume_version_id_fkey';
            columns: ['resume_version_id'];
            isOneToOne: false;
            referencedRelation: 'resume_versions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'ats_results_job_description_id_fkey';
            columns: ['job_description_id'];
            isOneToOne: false;
            referencedRelation: 'job_descriptions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'ats_results_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      interview_sessions: {
        Row: {
          id: string;
          user_id: string;
          job_description_id: string | null;
          session_type: 'behavioral' | 'technical' | 'mixed';
          status: 'not_started' | 'in_progress' | 'completed';
          summary: Json;
          started_at: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          job_description_id?: string | null;
          session_type?: 'behavioral' | 'technical' | 'mixed';
          status?: 'not_started' | 'in_progress' | 'completed';
          summary?: Json;
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          job_description_id?: string | null;
          session_type?: 'behavioral' | 'technical' | 'mixed';
          status?: 'not_started' | 'in_progress' | 'completed';
          summary?: Json;
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'interview_sessions_job_description_id_fkey';
            columns: ['job_description_id'];
            isOneToOne: false;
            referencedRelation: 'job_descriptions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'interview_sessions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      learning_roadmaps: {
        Row: {
          id: string;
          user_id: string;
          job_description_id: string | null;
          title: string;
          status: 'active' | 'completed' | 'archived';
          items: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          job_description_id?: string | null;
          title?: string;
          status?: 'active' | 'completed' | 'archived';
          items?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          job_description_id?: string | null;
          title?: string;
          status?: 'active' | 'completed' | 'archived';
          items?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'learning_roadmaps_job_description_id_fkey';
            columns: ['job_description_id'];
            isOneToOne: false;
            referencedRelation: 'job_descriptions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'learning_roadmaps_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      applications: {
        Row: {
          id: string;
          user_id: string;
          job_description_id: string | null;
          company: string;
          role_title: string;
          status: 'saved' | 'applied' | 'interviewing' | 'offer' | 'rejected' | 'withdrawn';
          applied_at: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          job_description_id?: string | null;
          company: string;
          role_title: string;
          status?: 'saved' | 'applied' | 'interviewing' | 'offer' | 'rejected' | 'withdrawn';
          applied_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          job_description_id?: string | null;
          company?: string;
          role_title?: string;
          status?: 'saved' | 'applied' | 'interviewing' | 'offer' | 'rejected' | 'withdrawn';
          applied_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'applications_job_description_id_fkey';
            columns: ['job_description_id'];
            isOneToOne: false;
            referencedRelation: 'job_descriptions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'applications_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
