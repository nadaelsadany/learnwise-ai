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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      academic_terms: {
        Row: {
          created_at: string
          end_date: string
          id: string
          name: string
          start_date: string
          status: string
          type: string
          updated_at: string
          year: number
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          name: string
          start_date: string
          status?: string
          type?: string
          updated_at?: string
          year: number
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          name?: string
          start_date?: string
          status?: string
          type?: string
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      chapters: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          id: string
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          order_index?: number
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapters_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      content_library: {
        Row: {
          course_name: string | null
          created_at: string
          department: string | null
          downloads: number
          file_path: string
          file_size: string | null
          file_type: string
          id: string
          name: string
          uploaded_by: string
          uploaded_by_name: string
        }
        Insert: {
          course_name?: string | null
          created_at?: string
          department?: string | null
          downloads?: number
          file_path: string
          file_size?: string | null
          file_type?: string
          id?: string
          name: string
          uploaded_by: string
          uploaded_by_name?: string
        }
        Update: {
          course_name?: string | null
          created_at?: string
          department?: string | null
          downloads?: number
          file_path?: string
          file_size?: string | null
          file_type?: string
          id?: string
          name?: string
          uploaded_by?: string
          uploaded_by_name?: string
        }
        Relationships: []
      }
      course_sections: {
        Row: {
          capacity: number
          course_id: string
          created_at: string
          enrolled: number
          id: string
          instructor_id: string
          room: string | null
          schedule: string | null
          section_label: string
          term_id: string | null
          updated_at: string
        }
        Insert: {
          capacity?: number
          course_id: string
          created_at?: string
          enrolled?: number
          id?: string
          instructor_id: string
          room?: string | null
          schedule?: string | null
          section_label?: string
          term_id?: string | null
          updated_at?: string
        }
        Update: {
          capacity?: number
          course_id?: string
          created_at?: string
          enrolled?: number
          id?: string
          instructor_id?: string
          room?: string | null
          schedule?: string | null
          section_label?: string
          term_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_sections_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_sections_term_id_fkey"
            columns: ["term_id"]
            isOneToOne: false
            referencedRelation: "academic_terms"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          duration_hours: number | null
          id: string
          image_url: string | null
          instructor_id: string
          is_featured: boolean | null
          level: string | null
          status: Database["public"]["Enums"]["course_status"] | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          id?: string
          image_url?: string | null
          instructor_id: string
          is_featured?: boolean | null
          level?: string | null
          status?: Database["public"]["Enums"]["course_status"] | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          id?: string
          image_url?: string | null
          instructor_id?: string
          is_featured?: boolean | null
          level?: string | null
          status?: Database["public"]["Enums"]["course_status"] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      distractions: {
        Row: {
          created_at: string
          description: string | null
          distraction_type: string
          duration_seconds: number | null
          id: string
          logged_at: string
          session_id: string | null
          student_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          distraction_type?: string
          duration_seconds?: number | null
          id?: string
          logged_at?: string
          session_id?: string | null
          student_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          distraction_type?: string
          duration_seconds?: number | null
          id?: string
          logged_at?: string
          session_id?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "distractions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "study_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          completed_at: string | null
          course_id: string
          enrolled_at: string
          id: string
          progress_percentage: number | null
          student_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          enrolled_at?: string
          id?: string
          progress_percentage?: number | null
          student_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          enrolled_at?: string
          id?: string
          progress_percentage?: number | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_completions: {
        Row: {
          completed_at: string
          id: string
          lesson_id: string
          student_id: string
          time_spent_seconds: number | null
        }
        Insert: {
          completed_at?: string
          id?: string
          lesson_id: string
          student_id: string
          time_spent_seconds?: number | null
        }
        Update: {
          completed_at?: string
          id?: string
          lesson_id?: string
          student_id?: string
          time_spent_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_completions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          chapter_id: string
          content: string | null
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          lesson_type: Database["public"]["Enums"]["lesson_type"] | null
          order_index: number
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          chapter_id: string
          content?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          lesson_type?: Database["public"]["Enums"]["lesson_type"] | null
          order_index?: number
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          chapter_id?: string
          content?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          lesson_type?: Database["public"]["Enums"]["lesson_type"] | null
          order_index?: number
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          correct_answer: string
          created_at: string
          id: string
          options: Json
          order_index: number
          points: number | null
          question_text: string
          quiz_id: string
        }
        Insert: {
          correct_answer: string
          created_at?: string
          id?: string
          options?: Json
          order_index?: number
          points?: number | null
          question_text: string
          quiz_id: string
        }
        Update: {
          correct_answer?: string
          created_at?: string
          id?: string
          options?: Json
          order_index?: number
          points?: number | null
          question_text?: string
          quiz_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_results: {
        Row: {
          answers: Json
          completed_at: string
          id: string
          passed: boolean
          percentage: number
          quiz_id: string
          score: number
          student_id: string
          time_taken_seconds: number | null
          total_points: number
        }
        Insert: {
          answers?: Json
          completed_at?: string
          id?: string
          passed: boolean
          percentage: number
          quiz_id: string
          score: number
          student_id: string
          time_taken_seconds?: number | null
          total_points: number
        }
        Update: {
          answers?: Json
          completed_at?: string
          id?: string
          passed?: boolean
          percentage?: number
          quiz_id?: string
          score?: number
          student_id?: string
          time_taken_seconds?: number | null
          total_points?: number
        }
        Relationships: [
          {
            foreignKeyName: "quiz_results_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          id: string
          lesson_id: string | null
          passing_score: number | null
          time_limit_minutes: number | null
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          lesson_id?: string | null
          passing_score?: number | null
          time_limit_minutes?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          lesson_id?: string | null
          passing_score?: number | null
          time_limit_minutes?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      sr_cards: {
        Row: {
          answer: string
          created_at: string
          ease_factor: number
          id: string
          interval_days: number
          last_reviewed: string | null
          next_review: string
          question: string
          repetitions: number
          student_id: string
          topic: string
        }
        Insert: {
          answer: string
          created_at?: string
          ease_factor?: number
          id?: string
          interval_days?: number
          last_reviewed?: string | null
          next_review?: string
          question: string
          repetitions?: number
          student_id: string
          topic?: string
        }
        Update: {
          answer?: string
          created_at?: string
          ease_factor?: number
          id?: string
          interval_days?: number
          last_reviewed?: string | null
          next_review?: string
          question?: string
          repetitions?: number
          student_id?: string
          topic?: string
        }
        Relationships: []
      }
      study_sessions: {
        Row: {
          course_id: string | null
          duration_seconds: number | null
          ended_at: string | null
          id: string
          lesson_id: string | null
          started_at: string
          student_id: string
        }
        Insert: {
          course_id?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          lesson_id?: string | null
          started_at?: string
          student_id: string
        }
        Update: {
          course_id?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          lesson_id?: string | null
          started_at?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_sessions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_sessions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      time_blocks: {
        Row: {
          block_date: string
          category: string
          created_at: string
          end_time: string
          id: string
          start_time: string
          student_id: string
          title: string
        }
        Insert: {
          block_date?: string
          category?: string
          created_at?: string
          end_time: string
          id?: string
          start_time: string
          student_id: string
          title: string
        }
        Update: {
          block_date?: string
          category?: string
          created_at?: string
          end_time?: string
          id?: string
          start_time?: string
          student_id?: string
          title?: string
        }
        Relationships: []
      }
      university_announcements: {
        Row: {
          audience: string
          audience_detail: string | null
          author_id: string
          author_name: string
          body: string
          created_at: string
          id: string
          pinned: boolean
          title: string
        }
        Insert: {
          audience?: string
          audience_detail?: string | null
          author_id: string
          author_name?: string
          body: string
          created_at?: string
          id?: string
          pinned?: boolean
          title: string
        }
        Update: {
          audience?: string
          audience_detail?: string | null
          author_id?: string
          author_name?: string
          body?: string
          created_at?: string
          id?: string
          pinned?: boolean
          title?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "applicant" | "instructor" | "university"
      course_status: "draft" | "published" | "archived"
      lesson_type: "video" | "reading" | "quiz" | "assignment" | "interactive"
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
    Enums: {
      app_role: ["applicant", "instructor", "university"],
      course_status: ["draft", "published", "archived"],
      lesson_type: ["video", "reading", "quiz", "assignment", "interactive"],
    },
  },
} as const
