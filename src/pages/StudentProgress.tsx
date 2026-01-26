import { useState } from "react";
import { ApplicantSidebar, ApplicantSidebarContent } from "@/components/layout/ApplicantSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Trophy, BookOpen, Award, TrendingUp, Flame } from "lucide-react";
import { BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid } from "recharts";

const StudentProgress = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Enhanced Mock Data (In a real app, this would come from the API/Hook)
    const mockStats = {
        totalStudyTime: 2540, // minutes
        lessonsCompleted: 42,
        averageQuizScore: 88,
        certificatesEarned: 2,
        currentStreak: 15,
        totalPoints: 1250,
        weeklyActivity: [
            { day: 'Mon', minutes: 45 },
            { day: 'Tue', minutes: 60 },
            { day: 'Wed', minutes: 30 },
            { day: 'Thu', minutes: 90 },
            { day: 'Fri', minutes: 45 },
            { day: 'Sat', minutes: 120 },
            { day: 'Sun', minutes: 60 },
        ],
        courses: [
            { id: 1, title: 'Introduction to React', progress: 100, completedLessons: 12, totalLessons: 12, lastAccessed: '2 days ago' },
            { id: 2, title: 'Advanced CSS Patterns', progress: 45, completedLessons: 5, totalLessons: 11, lastAccessed: '5 hours ago' },
            { id: 3, title: 'Node.js Fundamentals', progress: 10, completedLessons: 2, totalLessons: 20, lastAccessed: '1 day ago' }
        ],
        achievements: [
            { id: 1, title: 'Fast Learner', description: 'Completed 5 lessons in one day', icon: <FlashIcon />, date: '2024-02-15' },
            { id: 2, title: 'Quiz Master', description: 'Scored 100% on 3 quizzes', icon: <StarIcon />, date: '2024-03-01' },
            { id: 3, title: 'Commitment', description: '7 Day Study Streak', icon: <FlameIcon />, date: '2024-03-10' },
            { id: 4, title: 'Early Bird', description: 'Studied before 8 AM', icon: <SunIcon />, date: '2024-03-12' },
        ]
    };

    const stats = mockStats; // Use mock data directly for this task "fill all data"

    return (
        <div className="min-h-screen bg-background">
            <ApplicantSidebar onCollapse={setSidebarCollapsed} />
            <Header
                sidebarCollapsed={sidebarCollapsed}
                userRole="Student"
                mobileSidebar={<ApplicantSidebarContent />}
            />

            <main className={cn(
                "pt-20 pb-8 px-4 sm:px-6 transition-all duration-300",
                sidebarCollapsed ? "lg:ml-20" : "lg:ml-64",
                "ml-0"
            )}>
                <div className="max-w-7xl mx-auto space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold">My Progress</h1>
                        <p className="text-muted-foreground mt-1">Track your learning journey and achievements</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Study Time</p>
                                        <h3 className="text-2xl font-bold">{Math.round(stats.totalStudyTime / 60)}h {stats.totalStudyTime % 60}m</h3>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Lessons Completed</p>
                                        <h3 className="text-2xl font-bold">{stats.lessonsCompleted}</h3>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                        <Flame className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Current Streak</p>
                                        <h3 className="text-2xl font-bold">{stats.currentStreak} Days</h3>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                        <Trophy className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Points</p>
                                        <h3 className="text-2xl font-bold">{stats.totalPoints}</h3>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Weekly Activity Chart */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-primary" />
                                    Weekly Activity
                                </CardTitle>
                                <CardDescription>Your study time over the last 7 days (minutes)</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={stats.weeklyActivity}>
                                            <defs>
                                                <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                            <XAxis dataKey="day" axisLine={false} tickLine={false} />
                                            <YAxis axisLine={false} tickLine={false} />
                                            <Tooltip
                                                cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1 }}
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="minutes"
                                                stroke="hsl(var(--primary))"
                                                fillOpacity={1}
                                                fill="url(#colorMinutes)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Achievements */}
                        <Card className="lg:col-span-1">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="w-5 h-5 text-yellow-500" />
                                    Recent Achievements
                                </CardTitle>
                                <CardDescription>Badges you've earned recently</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {stats.achievements.map(achievement => (
                                    <div key={achievement.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border/50">
                                        <div className="w-10 h-10 rounded-full bg-background border flex items-center justify-center shrink-0 shadow-sm text-yellow-500">
                                            {achievement.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm truncate">{achievement.title}</p>
                                            <p className="text-xs text-muted-foreground truncate">{achievement.description}</p>
                                        </div>
                                    </div>
                                ))}
                                <Button variant="outline" className="w-full text-xs">View All Achievements</Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Course Progress List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Progress Details</CardTitle>
                            <CardDescription>Detailed breakdown of your enrolled courses</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {stats.courses.map(course => (
                                    <div key={course.id} className="space-y-3">
                                        <div className="flex justify-between items-center sm:flex-row flex-col sm:gap-0 gap-2">
                                            <div>
                                                <h4 className="font-semibold">{course.title}</h4>
                                                <p className="text-xs text-muted-foreground">Last accessed: {course.lastAccessed}</p>
                                            </div>
                                            <span className="font-mono font-medium bg-secondary px-2 py-1 rounded text-xs">
                                                {course.progress}% Completed
                                            </span>
                                        </div>
                                        <div className="space-y-1">
                                            <Progress value={course.progress} className="h-2" />
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>{course.completedLessons} of {course.totalLessons} lessons completed</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

// Simple icons for mock data
const FlashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
const FlameIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-2.22-3.157-2.9-4.7A8 8 0 1 1 20 12a1 1 0 0 0-1-1 3 3 0 0 0-3 3c0 2 2.055 2.5 3 4A7.2 7.2 0 0 1 12 20a7 7 0 0 1-3.5-6.5Z" /></svg>;
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>;

export default StudentProgress;
