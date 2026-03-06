
-- Time blocks table
CREATE TABLE public.time_blocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  title TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'study',
  block_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.time_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own time blocks"
  ON public.time_blocks FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Students can insert their own time blocks"
  ON public.time_blocks FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update their own time blocks"
  ON public.time_blocks FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Students can delete their own time blocks"
  ON public.time_blocks FOR DELETE
  TO authenticated
  USING (student_id = auth.uid());

-- Spaced repetition cards table
CREATE TABLE public.sr_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  topic TEXT NOT NULL DEFAULT 'General',
  interval_days INTEGER NOT NULL DEFAULT 1,
  ease_factor NUMERIC NOT NULL DEFAULT 2.5,
  repetitions INTEGER NOT NULL DEFAULT 0,
  next_review TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_reviewed TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.sr_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own sr cards"
  ON public.sr_cards FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Students can insert their own sr cards"
  ON public.sr_cards FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update their own sr cards"
  ON public.sr_cards FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Students can delete their own sr cards"
  ON public.sr_cards FOR DELETE
  TO authenticated
  USING (student_id = auth.uid());
