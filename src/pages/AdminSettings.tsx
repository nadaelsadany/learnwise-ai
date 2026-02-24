import { useState } from "react";
import { AdminSidebar, AdminSidebarContent } from "@/components/layout/AdminSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Building2, Globe, Palette, Bot, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminSettings = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const { toast } = useToast();

    const [orgName, setOrgName] = useState("Acme Corporation");
    const [timezone, setTimezone] = useState("UTC+2");
    const [language, setLanguage] = useState("en");
    const [accent, setAccent] = useState("#f43f5e");
    const [aiEnabled, setAiEnabled] = useState(true);
    const [notifyOnCompletion, setNotifyOnCompletion] = useState(true);
    const [notifyAtRisk, setNotifyAtRisk] = useState(true);

    const handleSave = () => {
        toast({ title: "Settings Saved", description: "Your organisation settings have been updated." });
    };

    const timezones = ["UTC-8", "UTC-5", "UTC+0", "UTC+1", "UTC+2", "UTC+3", "UTC+5:30", "UTC+8", "UTC+9", "UTC+10"];
    const languages = [{ val: "en", label: "English" }, { val: "ar", label: "Arabic" }, { val: "fr", label: "French" }, { val: "de", label: "German" }, { val: "es", label: "Spanish" }];
    const accentColors = ["#f43f5e", "#6366f1", "#10b981", "#f59e0b", "#3b82f6", "#8b5cf6"];

    return (
        <div className="min-h-screen bg-background">
            <AdminSidebar onCollapse={setSidebarCollapsed} />
            <Header sidebarCollapsed={sidebarCollapsed} userRole="Admin" mobileSidebar={<AdminSidebarContent collapsed={false} />} />
            <main className={cn("pt-20 pb-12 px-4 sm:px-6 transition-all duration-300", sidebarCollapsed ? "lg:ml-20" : "lg:ml-64")}>
                <div className="max-w-3xl mx-auto space-y-6">
                    <div>
                        <h1 className="text-3xl font-black">Settings</h1>
                        <p className="text-muted-foreground text-sm mt-1">Configure your organisation workspace</p>
                    </div>

                    {/* Organization */}
                    <Card className="border-border/50">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-rose-500" /> Organisation
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="org-name">Organisation Name</Label>
                                <Input id="org-name" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Logo</Label>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-xl bg-rose-500/10 border-2 border-dashed border-rose-300 flex items-center justify-center text-rose-400 font-black text-xl cursor-pointer hover:bg-rose-500/20 transition-colors">
                                        {orgName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <Button variant="outline" size="sm" onClick={() => toast({ title: "Logo Upload", description: "Logo upload coming soon." })}>Upload Logo</Button>
                                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG · 512×512px recommended</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Locale */}
                    <Card className="border-border/50">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <Globe className="w-4 h-4 text-primary" /> Locale & Region
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Timezone</Label>
                                    <Select value={timezone} onValueChange={setTimezone}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>{timezones.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Language</Label>
                                    <Select value={language} onValueChange={setLanguage}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>{languages.map(l => <SelectItem key={l.val} value={l.val}>{l.label}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Branding */}
                    <Card className="border-border/50">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <Palette className="w-4 h-4 text-purple-500" /> Branding
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Accent Color</Label>
                                <div className="flex items-center gap-3 flex-wrap">
                                    {accentColors.map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => setAccent(c)}
                                            className={cn("w-9 h-9 rounded-xl transition-all duration-200 shadow-sm", accent === c ? "ring-2 ring-offset-2 ring-foreground scale-110" : "hover:scale-105")}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                    <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} className="w-9 h-9 rounded-xl cursor-pointer border border-border" title="Custom color" />
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: accent }} />
                                    <span className="text-xs text-muted-foreground font-mono">{accent}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* AI & Notifications */}
                    <Card className="border-border/50">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <Bot className="w-4 h-4 text-emerald-500" /> AI & Notifications
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            {[
                                { label: "Enable AI Assistant", sub: "Allow employees to use the AI Q&A chat in all courses", val: aiEnabled, set: setAiEnabled },
                                { label: "Notify on Course Completion", sub: "Send admin alerts when employees complete a course", val: notifyOnCompletion, set: setNotifyOnCompletion },
                                { label: "Alert on At-Risk Employees", sub: "Flag employees scoring below 50% for review", val: notifyAtRisk, set: setNotifyAtRisk },
                            ].map((s) => (
                                <div key={s.label} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-sm">{s.label}</p>
                                        <p className="text-xs text-muted-foreground">{s.sub}</p>
                                    </div>
                                    <Switch checked={s.val} onCheckedChange={s.set} />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white border-0 py-5 text-base font-semibold" onClick={handleSave}>
                        <Save className="w-5 h-5 mr-2" /> Save Settings
                    </Button>
                </div>
            </main>
        </div>
    );
};

export default AdminSettings;
