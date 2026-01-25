-- Create course status enum
CREATE TYPE public.course_status AS ENUM ('draft', 'published', 'archived');

-- Create lesson type enum
CREATE TYPE public.lesson_type AS ENUM ('video', 'reading', 'quiz', 'assignment', 'interactive');

-- Courses table (instructor-created courses)
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instructor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    level TEXT DEFAULT 'beginner',
    duration_hours INTEGER DEFAULT 0,
    image_url TEXT,
    status course_status DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Chapters table (course structure)
CREATE TABLE public.chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Lessons table (within chapters)
CREATE TABLE public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    lesson_type lesson_type DEFAULT 'reading',
    duration_minutes INTEGER DEFAULT 10,
    order_index INTEGER NOT NULL DEFAULT 0,
    video_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Quizzes table (associated with lessons or standalone)
CREATE TABLE public.quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    time_limit_minutes INTEGER,
    passing_score INTEGER DEFAULT 70,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Quiz questions table
CREATE TABLE public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL DEFAULT '[]',
    correct_answer TEXT NOT NULL,
    points INTEGER DEFAULT 1,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enrollments table (student-course relationship)
CREATE TABLE public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    progress_percentage INTEGER DEFAULT 0,
    UNIQUE(student_id, course_id)
);

-- Lesson completions (progress tracking)
CREATE TABLE public.lesson_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    time_spent_seconds INTEGER DEFAULT 0,
    UNIQUE(student_id, lesson_id)
);

-- Quiz results (progress tracking)
CREATE TABLE public.quiz_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    total_points INTEGER NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    passed BOOLEAN NOT NULL,
    answers JSONB NOT NULL DEFAULT '{}',
    time_taken_seconds INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Study sessions (time tracking)
CREATE TABLE public.study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    ended_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER DEFAULT 0
);

-- Enable RLS on all tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

-- Courses policies
CREATE POLICY "Published courses are viewable by everyone"
ON public.courses FOR SELECT
USING (status = 'published');

CREATE POLICY "Instructors can view their own courses"
ON public.courses FOR SELECT
USING (instructor_id = auth.uid());

CREATE POLICY "Instructors can create courses"
ON public.courses FOR INSERT
WITH CHECK (instructor_id = auth.uid() AND public.has_role(auth.uid(), 'instructor'));

CREATE POLICY "Instructors can update their own courses"
ON public.courses FOR UPDATE
USING (instructor_id = auth.uid() AND public.has_role(auth.uid(), 'instructor'));

CREATE POLICY "Instructors can delete their own courses"
ON public.courses FOR DELETE
USING (instructor_id = auth.uid() AND public.has_role(auth.uid(), 'instructor'));

-- Chapters policies
CREATE POLICY "Chapters are viewable for published courses"
ON public.chapters FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.courses 
    WHERE courses.id = chapters.course_id 
    AND (courses.status = 'published' OR courses.instructor_id = auth.uid())
));

CREATE POLICY "Instructors can manage chapters for their courses"
ON public.chapters FOR ALL
USING (EXISTS (
    SELECT 1 FROM public.courses 
    WHERE courses.id = chapters.course_id 
    AND courses.instructor_id = auth.uid()
));

-- Lessons policies
CREATE POLICY "Lessons are viewable for published courses"
ON public.lessons FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.chapters 
    JOIN public.courses ON courses.id = chapters.course_id
    WHERE chapters.id = lessons.chapter_id 
    AND (courses.status = 'published' OR courses.instructor_id = auth.uid())
));

CREATE POLICY "Instructors can manage lessons for their courses"
ON public.lessons FOR ALL
USING (EXISTS (
    SELECT 1 FROM public.chapters 
    JOIN public.courses ON courses.id = chapters.course_id
    WHERE chapters.id = lessons.chapter_id 
    AND courses.instructor_id = auth.uid()
));

-- Quizzes policies
CREATE POLICY "Quizzes are viewable for published courses"
ON public.quizzes FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.courses 
    WHERE courses.id = quizzes.course_id 
    AND (courses.status = 'published' OR courses.instructor_id = auth.uid())
));

CREATE POLICY "Instructors can manage quizzes for their courses"
ON public.quizzes FOR ALL
USING (EXISTS (
    SELECT 1 FROM public.courses 
    WHERE courses.id = quizzes.course_id 
    AND courses.instructor_id = auth.uid()
));

-- Quiz questions policies
CREATE POLICY "Quiz questions are viewable for published courses"
ON public.quiz_questions FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.quizzes 
    JOIN public.courses ON courses.id = quizzes.course_id
    WHERE quizzes.id = quiz_questions.quiz_id 
    AND (courses.status = 'published' OR courses.instructor_id = auth.uid())
));

CREATE POLICY "Instructors can manage quiz questions"
ON public.quiz_questions FOR ALL
USING (EXISTS (
    SELECT 1 FROM public.quizzes 
    JOIN public.courses ON courses.id = quizzes.course_id
    WHERE quizzes.id = quiz_questions.quiz_id 
    AND courses.instructor_id = auth.uid()
));

-- Enrollments policies
CREATE POLICY "Students can view their own enrollments"
ON public.enrollments FOR SELECT
USING (student_id = auth.uid());

CREATE POLICY "Instructors can view enrollments for their courses"
ON public.enrollments FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.courses 
    WHERE courses.id = enrollments.course_id 
    AND courses.instructor_id = auth.uid()
));

CREATE POLICY "Applicants can enroll in published courses"
ON public.enrollments FOR INSERT
WITH CHECK (
    student_id = auth.uid() 
    AND public.has_role(auth.uid(), 'applicant')
    AND EXISTS (
        SELECT 1 FROM public.courses 
        WHERE courses.id = course_id AND courses.status = 'published'
    )
);

CREATE POLICY "Students can update their own enrollments"
ON public.enrollments FOR UPDATE
USING (student_id = auth.uid());

-- Lesson completions policies
CREATE POLICY "Students can view their own lesson completions"
ON public.lesson_completions FOR SELECT
USING (student_id = auth.uid());

CREATE POLICY "Instructors can view completions for their courses"
ON public.lesson_completions FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.lessons
    JOIN public.chapters ON chapters.id = lessons.chapter_id
    JOIN public.courses ON courses.id = chapters.course_id
    WHERE lessons.id = lesson_completions.lesson_id
    AND courses.instructor_id = auth.uid()
));

CREATE POLICY "Students can create their own lesson completions"
ON public.lesson_completions FOR INSERT
WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update their own lesson completions"
ON public.lesson_completions FOR UPDATE
USING (student_id = auth.uid());

-- Quiz results policies
CREATE POLICY "Students can view their own quiz results"
ON public.quiz_results FOR SELECT
USING (student_id = auth.uid());

CREATE POLICY "Instructors can view results for their course quizzes"
ON public.quiz_results FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.quizzes
    JOIN public.courses ON courses.id = quizzes.course_id
    WHERE quizzes.id = quiz_results.quiz_id
    AND courses.instructor_id = auth.uid()
));

CREATE POLICY "Students can submit quiz results"
ON public.quiz_results FOR INSERT
WITH CHECK (student_id = auth.uid());

-- Study sessions policies
CREATE POLICY "Students can view their own study sessions"
ON public.study_sessions FOR SELECT
USING (student_id = auth.uid());

CREATE POLICY "Instructors can view study sessions for their courses"
ON public.study_sessions FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.courses 
    WHERE courses.id = study_sessions.course_id 
    AND courses.instructor_id = auth.uid()
));

CREATE POLICY "Students can create their own study sessions"
ON public.study_sessions FOR INSERT
WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update their own study sessions"
ON public.study_sessions FOR UPDATE
USING (student_id = auth.uid());

-- Create triggers for updated_at
CREATE TRIGGER update_courses_updated_at
BEFORE UPDATE ON public.courses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chapters_updated_at
BEFORE UPDATE ON public.chapters
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
BEFORE UPDATE ON public.lessons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at
BEFORE UPDATE ON public.quizzes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();