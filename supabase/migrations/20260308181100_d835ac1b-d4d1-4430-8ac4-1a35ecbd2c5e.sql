
-- Academic Terms table
CREATE TABLE public.academic_terms (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    type text NOT NULL DEFAULT 'fall',
    year integer NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    status text NOT NULL DEFAULT 'upcoming',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.academic_terms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "University admins can manage academic terms"
ON public.academic_terms FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'university'))
WITH CHECK (public.has_role(auth.uid(), 'university'));

CREATE POLICY "Everyone can view active terms"
ON public.academic_terms FOR SELECT TO authenticated
USING (status = 'active');

-- Course Sections table
CREATE TABLE public.course_sections (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    term_id uuid REFERENCES public.academic_terms(id) ON DELETE SET NULL,
    section_label text NOT NULL DEFAULT 'Section A',
    instructor_id uuid NOT NULL,
    capacity integer NOT NULL DEFAULT 40,
    enrolled integer NOT NULL DEFAULT 0,
    schedule text,
    room text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.course_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "University admins can manage sections"
ON public.course_sections FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'university'))
WITH CHECK (public.has_role(auth.uid(), 'university'));

CREATE POLICY "Instructors can view their sections"
ON public.course_sections FOR SELECT TO authenticated
USING (instructor_id = auth.uid());

-- University Announcements table
CREATE TABLE public.university_announcements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    body text NOT NULL,
    audience text NOT NULL DEFAULT 'all',
    audience_detail text,
    author_id uuid NOT NULL,
    author_name text NOT NULL DEFAULT 'University Admin',
    pinned boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.university_announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "University admins can manage announcements"
ON public.university_announcements FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'university'))
WITH CHECK (public.has_role(auth.uid(), 'university'));

CREATE POLICY "Everyone can view announcements"
ON public.university_announcements FOR SELECT TO authenticated
USING (true);

-- Content Library table
CREATE TABLE public.content_library (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    file_type text NOT NULL DEFAULT 'document',
    department text,
    course_name text,
    uploaded_by uuid NOT NULL,
    uploaded_by_name text NOT NULL DEFAULT 'Unknown',
    file_path text NOT NULL,
    file_size text,
    downloads integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.content_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "University admins can manage content"
ON public.content_library FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'university'))
WITH CHECK (public.has_role(auth.uid(), 'university'));

CREATE POLICY "Instructors can upload content"
ON public.content_library FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'instructor'));

CREATE POLICY "Instructors can manage their own content"
ON public.content_library FOR ALL TO authenticated
USING (uploaded_by = auth.uid())
WITH CHECK (uploaded_by = auth.uid());

CREATE POLICY "Everyone can view content"
ON public.content_library FOR SELECT TO authenticated
USING (true);

-- Storage bucket for content library
INSERT INTO storage.buckets (id, name, public) VALUES ('content-library', 'content-library', true);

-- Storage policies
CREATE POLICY "Authenticated users can upload to content-library"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'content-library');

CREATE POLICY "Everyone can view content-library files"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'content-library');

CREATE POLICY "Owners can delete content-library files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'content-library' AND (auth.uid()::text = (storage.foldername(name))[1]));
