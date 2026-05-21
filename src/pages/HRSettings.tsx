import { useState } from "react";
import { HRSidebar, HRSidebarContent } from "@/components/layout/HRSidebar";
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
    Briefcase
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const HRSettings = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const { user, role } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const userName = user?.user_metadata?.full_name || "Demo HR";
    const userEmail = user?.email || "hr@demo.com";

    // Initial State (Mock Data)
    const [profile, setProfile] = useState({
        firstName: "Demo",
        lastName: "HR",
        email: "hr@demo.com",
        bio: "HR Manager focused on talent development and employee learning paths.",
        notifications: {
            employeeProgress: true,
            certificationAlerts: true,
            reportsReady: false
        }
    });

    const handleSave = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            toast({
                title: "Settings Saved",
                description: "HR preferences have been updated.",
            });
        }, 800);
    };

    return (
        <div className="min-h-screen bg-background">
            <HRSidebar onCollapse={setSidebarCollapsed} />
            <Header 
                sidebarCollapsed={sidebarCollapsed} 
                userRole="HR Manager"
                mobileSidebar={<HRSidebarContent collapsed={false} />}
            />

            <main className={cn(
                "pt-20 pb-8 px-6 transition-all duration-300",
                sidebarCollapsed ? "ml-20" : "ml-64"
            )}>
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="space-y-6">
                        {/* Profile Header */}
                        <Card className="border-border/50">
                            <CardContent className="p-6">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                                        {userName.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div className="flex-1">
                                        <h1 className="text-2xl font-bold">{userName}</h1>
                                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {userEmail}</span>
                                            <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> Global Tech Corp</span>
                                            <Badge variant="secondary" className="capitalize bg-indigo-50 text-indigo-700 border-indigo-200">HR Manager</Badge>
                                        </div>
                                        <div className="flex items-center gap-2 mt-3">
                                            <Briefcase className="w-4 h-4 text-indigo-500" />
                                            <span className="text-sm font-medium">Head of Learning & Development</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-center px-4 py-2 rounded-xl bg-muted/50 border border-border/50">
                                            <p className="text-2xl font-bold text-indigo-600">184</p>
                                            <p className="text-[10px] text-muted-foreground uppercase font-black">Employees</p>
                                        </div>
                                        <div className="text-center px-4 py-2 rounded-xl bg-muted/50 border border-border/50">
                                            <p className="text-2xl font-bold text-emerald-600">78%</p>
                                            <p className="text-[10px] text-muted-foreground uppercase font-black">Success</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="pt-4 border-t border-border/50">
                        <h2 className="text-xl font-bold">HR Account Configuration</h2>
                        <p className="text-sm text-muted-foreground">Adjust your account details and notification settings.</p>
                    </div>

                    <Tabs defaultValue="profile" className="space-y-6">
                        <TabsList className="bg-muted/50 p-1">
                            <TabsTrigger value="profile" className="gap-2 data-[state=active]:bg-white data-[state=active]:text-indigo-600"><User className="w-4 h-4" /> Profile</TabsTrigger>
                            <TabsTrigger value="notifications" className="gap-2 data-[state=active]:bg-white data-[state=active]:text-indigo-600"><Bell className="w-4 h-4" /> Management Alerts</TabsTrigger>
                            <TabsTrigger value="security" className="gap-2 data-[state=active]:bg-white data-[state=active]:text-indigo-600"><Lock className="w-4 h-4" /> Security</TabsTrigger>
                        </TabsList>

                        <TabsContent value="profile">
                            <Card className="border-border/50">
                                <CardHeader>
                                    <CardTitle>Personal Information</CardTitle>
                                    <CardDescription>Update your photo and HR contact details.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center gap-6">
                                        <Avatar className="w-20 h-20">
                                            <AvatarFallback className="text-lg bg-indigo-50 text-indigo-600">{profile.firstName[0]}{profile.lastName[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-2">
                                            <Button variant="outline" size="sm" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">Upload Photo</Button>
                                            <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 1MB.</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input
                                                id="firstName"
                                                value={profile.firstName}
                                                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                                className="rounded-xl border-border/50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input
                                                id="lastName"
                                                value={profile.lastName}
                                                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                                className="rounded-xl border-border/50"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Work Email</Label>
                                        <Input id="email" value={profile.email} disabled className="bg-muted border-border/50 rounded-xl" />
                                        <p className="text-[10px] text-muted-foreground">Work emails are managed by your system administrator.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bio">Professional Bio</Label>
                                        <Textarea
                                            id="bio"
                                            value={profile.bio}
                                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                            className="h-24 rounded-xl border-border/50"
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter className="border-t border-border/50 px-6 py-4">
                                    <Button onClick={handleSave} disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl">
                                        {isLoading ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        <TabsContent value="notifications">
                            <Card className="border-border/50">
                                <CardHeader>
                                    <CardTitle>Management Alerts</CardTitle>
                                    <CardDescription>Configure which employee events trigger a notification.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 rounded-xl border border-border/50">
                                            <div className="space-y-0.5">
                                                <Label>Employee Progress Alerts</Label>
                                                <p className="text-xs text-muted-foreground">Notify when an employee falls behind the assigned schedule.</p>
                                            </div>
                                            <Switch
                                                checked={profile.notifications.employeeProgress}
                                                onCheckedChange={(c) => setProfile(p => ({ ...p, notifications: { ...p.notifications, employeeProgress: c } }))}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between p-4 rounded-xl border border-border/50">
                                            <div className="space-y-0.5">
                                                <Label>Certification Approvals</Label>
                                                <p className="text-xs text-muted-foreground">Alert when new certificates are uploaded for review.</p>
                                            </div>
                                            <Switch
                                                checked={profile.notifications.certificationAlerts}
                                                onCheckedChange={(c) => setProfile(p => ({ ...p, notifications: { ...p.notifications, certificationAlerts: c } }))}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between p-4 rounded-xl border border-border/50">
                                            <div className="space-y-0.5">
                                                <Label>Weekly Summary Reports</Label>
                                                <p className="text-xs text-muted-foreground">Receive an automated Excel report every Monday morning.</p>
                                            </div>
                                            <Switch
                                                checked={profile.notifications.reportsReady}
                                                onCheckedChange={(c) => setProfile(p => ({ ...p, notifications: { ...p.notifications, reportsReady: c } }))}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="border-t border-border/50 px-6 py-4">
                                    <Button onClick={handleSave} disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl">Save Preferences</Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        <TabsContent value="security">
                            <Card className="border-border/50">
                                <CardHeader>
                                    <CardTitle>Account Security</CardTitle>
                                    <CardDescription>Ensure your HR management account remains secure.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label>Current Password</Label>
                                        <Input type="password" placeholder="••••••••" className="rounded-xl border-border/50" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>New Password</Label>
                                        <Input type="password" placeholder="Minimum 8 characters" className="rounded-xl border-border/50" />
                                    </div>
                                </CardContent>
                                <CardFooter className="border-t border-border/50 px-6 py-4">
                                    <Button onClick={handleSave} disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl">Update Password</Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
};

export default HRSettings;
