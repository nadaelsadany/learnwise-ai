import { useState } from "react";
import { ApplicantSidebar } from "@/components/layout/ApplicantSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
    User, Bell, Lock, Save, Mail, Building2, 
    TrendingUp
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";



const StudentSettings = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const { user, role } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const userName = user?.user_metadata?.full_name || "Alex Johnson";
    const userEmail = user?.email || "alex@example.com";

    // Initial State (Mock Data)
    const [profile, setProfile] = useState({
        firstName: "Alex",
        lastName: "Johnson",
        email: "alex@example.com",
        bio: "Computer Science student interested in Web Development and AI.",
        notifications: {
            assignments: true,
            reminders: true,
            announcements: false
        }
    });

    const handleSave = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            toast({
                title: "Settings Saved",
                description: "Your preferences have been updated.",
            });
        }, 800);
    };

    return (
        <div className="min-h-screen bg-background">
            <ApplicantSidebar onCollapse={setSidebarCollapsed} />
            <Header sidebarCollapsed={sidebarCollapsed} userRole="Student" />

            <main className={cn(
                "pt-20 pb-8 px-6 transition-all duration-300",
                sidebarCollapsed ? "ml-20" : "ml-64"
            )}>
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="space-y-6">
                        {/* Profile Header (from UserProfile) */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-lg">
                                        {userName.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div className="flex-1">
                                        <h1 className="text-2xl font-bold">{userName}</h1>
                                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {userEmail}</span>
                                            <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> Nafea Academy</span>
                                            <Badge variant="secondary" className="capitalize">{role || "Student"}</Badge>
                                        </div>
                                        <div className="flex items-center gap-2 mt-3">
                                            <Badge className="bg-primary/10 text-primary border-primary/20">Level 7</Badge>
                                            <span className="text-xs text-muted-foreground">2,450 / 3,000 XP</span>
                                        </div>
                                        <Progress value={82} className="h-2 mt-2 max-w-xs" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-center px-4 py-2 rounded-xl bg-muted">
                                            <p className="text-2xl font-bold text-primary">3</p>
                                            <p className="text-xs text-muted-foreground">Enrolled</p>
                                        </div>
                                        <div className="text-center px-4 py-2 rounded-xl bg-muted">
                                            <p className="text-2xl font-bold text-success">2</p>
                                            <p className="text-xs text-muted-foreground">Completed</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="pt-4 border-t">
                        <h2 className="text-xl font-bold">Preferences & Configuration</h2>
                        <p className="text-sm text-muted-foreground">Adjust your account details and notification settings.</p>
                    </div>

                    <Tabs defaultValue="profile" className="space-y-6">
                        <TabsList>
                            <TabsTrigger value="profile" className="gap-2"><User className="w-4 h-4" /> Profile</TabsTrigger>
                            <TabsTrigger value="notifications" className="gap-2"><Bell className="w-4 h-4" /> Notifications</TabsTrigger>
                            <TabsTrigger value="security" className="gap-2"><Lock className="w-4 h-4" /> Security</TabsTrigger>
                        </TabsList>

                        <TabsContent value="profile">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Personal Information</CardTitle>
                                    <CardDescription>Update your photo and personal details.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center gap-6">
                                        <Avatar className="w-20 h-20">
                                            <AvatarImage src="/placeholder-avatar-student.jpg" />
                                            <AvatarFallback className="text-lg">{profile.firstName[0]}{profile.lastName[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-2">
                                            <Button variant="outline" size="sm">Upload Photo</Button>
                                            <p className="text-xs text-muted-foreground">Max file size 1MB.</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input
                                                id="firstName"
                                                value={profile.firstName}
                                                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input
                                                id="lastName"
                                                value={profile.lastName}
                                                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input id="email" value={profile.email} disabled className="bg-muted" />
                                        <p className="text-xs text-muted-foreground">Contact support to change your email.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bio">About Me</Label>
                                        <Textarea
                                            id="bio"
                                            value={profile.bio}
                                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                            className="h-24"
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter className="border-t px-6 py-4">
                                    <Button onClick={handleSave} disabled={isLoading}>
                                        {isLoading ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        <TabsContent value="notifications">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Notification Preferences</CardTitle>
                                    <CardDescription>Decide when we should email you.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Assignment Deadlines</Label>
                                                <p className="text-sm text-muted-foreground">Get reminded 24 hours before a due date.</p>
                                            </div>
                                            <Switch
                                                checked={profile.notifications.assignments}
                                                onCheckedChange={(c) => setProfile(p => ({ ...p, notifications: { ...p.notifications, assignments: c } }))}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Daily Study Reminders</Label>
                                                <p className="text-sm text-muted-foreground">Notifications to keep your streak alive.</p>
                                            </div>
                                            <Switch
                                                checked={profile.notifications.reminders}
                                                onCheckedChange={(c) => setProfile(p => ({ ...p, notifications: { ...p.notifications, reminders: c } }))}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>New Announcements</Label>
                                                <p className="text-sm text-muted-foreground">Updates from your instructors.</p>
                                            </div>
                                            <Switch
                                                checked={profile.notifications.announcements}
                                                onCheckedChange={(c) => setProfile(p => ({ ...p, notifications: { ...p.notifications, announcements: c } }))}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="border-t px-6 py-4">
                                    <Button onClick={handleSave} disabled={isLoading}>Save Preferences</Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        <TabsContent value="security">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Password & Security</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label>Current Password</Label>
                                        <Input type="password" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>New Password</Label>
                                        <Input type="password" />
                                    </div>
                                </CardContent>
                                <CardFooter className="border-t px-6 py-4">
                                    <Button onClick={handleSave} disabled={isLoading}>Update Password</Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
};

export default StudentSettings;
