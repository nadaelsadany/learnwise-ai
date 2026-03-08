CREATE TABLE public.distractions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  session_id UUID REFERENCES public.study_sessions(id) ON DELETE SET NULL,
  distraction_type TEXT NOT NULL DEFAULT 'other',
  description TEXT,
  duration_seconds INTEGER DEFAULT 0,
  logged_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.distractions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own distractions" ON public.distractions
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Students can insert their own distractions" ON public.distractions
  FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update their own distractions" ON public.distractions
  FOR UPDATE USING (student_id = auth.uid());

CREATE POLICY "Students can delete their own distractions" ON public.distractions
  FOR DELETE USING (student_id = auth.uid());