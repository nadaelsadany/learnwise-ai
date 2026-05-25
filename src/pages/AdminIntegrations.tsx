import { useState } from "react";
import { AdminSidebar, AdminSidebarContent } from "@/components/layout/AdminSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Cable, Plus, Settings, RefreshCw, CheckCircle2, Clock, Play, HelpCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Integration = {
    id: string;
    name: string;
    description: string;
    logoUrl?: string;
    connected: boolean;
    syncFrequency: string;
    syncEmployees: boolean;
    syncPerformance: boolean;
    syncRoles: boolean;
    lastSync: string;
};

type SyncLog = {
    id: string;
    system: string;
    timestamp: string;
    status: "Success" | "Failed";
    details: string;
};

const initialIntegrations: Integration[] = [
    {
        id: "int1",
        name: "Elevate Path",
        description: "Connect to Elevate talent acceleration framework for cross-system skill analysis and profile updates.",
        connected: true,
        syncFrequency: "Daily",
        syncEmployees: true,
        syncPerformance: true,
        syncRoles: true,
        lastSync: "Today, 10:45 AM"
    },
    {
        id: "int2",
        name: "SAP SuccessFactors",
        description: "Sync organizational hierarchies, department rosters, employee listings, and historic performance reports.",
        connected: false,
        syncFrequency: "Weekly",
        syncEmployees: true,
        syncPerformance: false,
        syncRoles: true,
        lastSync: "Never"
    }
];

const initialLogs: SyncLog[] = [
    { id: "log1", system: "Elevate Path", timestamp: "May 24, 2026, 10:45 AM", status: "Success", details: "Synced 248 employees and 14 course templates." },
    { id: "log2", system: "Elevate Path", timestamp: "May 23, 2026, 10:45 AM", status: "Success", details: "Profile changes synced for 12 accounts." },
    { id: "log3", system: "SAP SuccessFactors", timestamp: "May 20, 2026, 02:00 AM", status: "Failed", details: "API Gateway timeout. Credentials rejected." }
];

export default function AdminIntegrations() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);
    const [logs, setLogs] = useState<SyncLog[]>(initialLogs);
    const [isConfiguring, setIsConfiguring] = useState<string | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncProgress, setSyncProgress] = useState(0);

    const { toast } = useToast();

    // Configuration Modal state
    const [configData, setConfigData] = useState({
        apiKey: "••••••••••••••••••••••••",
        frequency: "Daily",
        syncEmployees: true,
        syncPerformance: true,
        syncRoles: true,
        mapFieldUser: "usr_mail",
        mapFieldManager: "manager_uid"
    });

    const handleConnectClick = (int: Integration) => {
        setIsConfiguring(int.id);
        setConfigData({
            apiKey: int.connected ? "••••••••••••••••••••••••" : "",
            frequency: int.syncFrequency,
            syncEmployees: int.syncEmployees,
            syncPerformance: int.syncPerformance,
            syncRoles: int.syncRoles,
            mapFieldUser: "usr_mail",
            mapFieldManager: "manager_uid"
        });
    };

    const handleSaveConfig = () => {
        if (!configData.apiKey) {
            toast({ variant: "destructive", title: "API Credentials Required" });
            return;
        }

        setIntegrations(prev => prev.map(int => {
            if (int.id === isConfiguring) {
                return {
                    ...int,
                    connected: true,
                    syncFrequency: configData.frequency,
                    syncEmployees: configData.syncEmployees,
                    syncPerformance: configData.syncPerformance,
                    syncRoles: configData.syncRoles,
                    lastSync: "Just now"
                };
            }
            return int;
        }));

        const activeInt = integrations.find(i => i.id === isConfiguring);
        if (activeInt) {
            const newLog: SyncLog = {
                id: Date.now().toString(),
                system: activeInt.name,
                timestamp: new Date().toLocaleString(),
                status: "Success",
                details: `Saved configurations and verified API access.`
            };
            setLogs([newLog, ...logs]);
        }

        setIsConfiguring(null);
        toast({ title: "Integration Connected", description: "API details saved and sync scheduling enabled." });
    };

    const triggerManualSync = () => {
        if (!integrations.some(i => i.connected)) {
            toast({ variant: "destructive", title: "No Active Connections", description: "Connect to Elevate Path or SAP SuccessFactors first." });
            return;
        }

        setIsSyncing(true);
        setSyncProgress(0);
        
        const interval = setInterval(() => {
            setSyncProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsSyncing(false);
                    
                    const newLog: SyncLog = {
                        id: Date.now().toString(),
                        system: "Elevate Path",
                        timestamp: new Date().toLocaleString(),
                        status: "Success",
                        details: "Completed on-demand sync: 248 records matching, no schema errors found."
                    };
                    setLogs(prevLogs => [newLog, ...prevLogs]);
                    
                    toast({ title: "Data Sync Complete", description: "Successfully updated employee list and performance scores." });
                    return 100;
                }
                return prev + 25;
            });
        }, 500);
    };

    return (
        <div className="min-h-screen bg-background">
            <AdminSidebar onCollapse={setSidebarCollapsed} />
            <Header sidebarCollapsed={sidebarCollapsed} userRole="Admin" mobileSidebar={<AdminSidebarContent collapsed={false} />} />

            <main className={cn("pt-20 pb-12 px-4 sm:px-6 transition-all duration-300", sidebarCollapsed ? "lg:ml-20" : "lg:ml-64")}>
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black">Integrations & Sync</h1>
                            <p className="text-muted-foreground text-sm mt-1">Connect HRIS, ERP, and skills engines to feed automation rules</p>
                        </div>
                        <Button 
                            disabled={isSyncing} 
                            onClick={triggerManualSync} 
                            className="bg-rose-500 hover:bg-rose-600 text-white border-0 font-semibold"
                        >
                            <RefreshCw className={cn("w-4 h-4 mr-2", isSyncing && "animate-spin")} />
                            {isSyncing ? `Syncing (${syncProgress}%)` : "Run Manual Sync"}
                        </Button>
                    </div>

                    {isSyncing && (
                        <Card className="border-rose-200 bg-rose-50/20 p-4">
                            <div className="flex items-center justify-between text-sm mb-1.5 font-bold text-rose-800">
                                <span>Running cross-system synchronization…</span>
                                <span>{syncProgress}%</span>
                            </div>
                            <Progress value={syncProgress} className="h-2 bg-muted [&>div]:bg-rose-500" />
                        </Card>
                    )}

                    {/* Active Integrations Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {integrations.map((int) => (
                            <Card key={int.id} className="border-border/50 flex flex-col justify-between hover:shadow-md transition-shadow">
                                <CardHeader className="pb-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center font-black text-lg text-primary select-none">
                                                {int.name.slice(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <CardTitle className="text-base font-bold">{int.name}</CardTitle>
                                                <CardDescription className="text-xs">Talent and HRIS Connector</CardDescription>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className={cn("text-xs font-bold", int.connected ? "text-emerald-600 border-emerald-200 bg-emerald-50" : "text-muted-foreground border-border bg-muted/50")}>
                                            {int.connected ? "Connected" : "Not Configured"}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-muted-foreground">{int.description}</p>
                                    
                                    {int.connected && (
                                        <div className="grid grid-cols-2 gap-2 text-xs border-t border-border/30 pt-3">
                                            <div>
                                                <span className="text-muted-foreground block">Sync Schedule:</span>
                                                <span className="font-semibold">{int.syncFrequency}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground block">Last Synced:</span>
                                                <span className="font-semibold flex items-center gap-1"><Clock className="w-3 h-3" /> {int.lastSync}</span>
                                            </div>
                                        </div>
                                    )}

                                    <Button variant="secondary" className="w-full font-bold text-xs" onClick={() => handleConnectClick(int)}>
                                        <Settings className="w-3.5 h-3.5 mr-2" />
                                        {int.connected ? "Configure Integration" : "Connect Credentials"}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* CONFIGURATION MODAL */}
                    <Dialog open={isConfiguring !== null} onOpenChange={(open) => !open && setIsConfiguring(null)}>
                        <DialogContent className="sm:max-w-[480px]">
                            <DialogHeader>
                                <DialogTitle>
                                    Configure {integrations.find(i => i.id === isConfiguring)?.name}
                                </DialogTitle>
                                <DialogDescription>
                                    Enter your authorization details and map information schemas.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>API Host / Client Secret Credentials</Label>
                                    <Input 
                                        type="password" 
                                        placeholder="Paste API authentication token here" 
                                        value={configData.apiKey} 
                                        onChange={(e) => setConfigData({...configData, apiKey: e.target.value})} 
                                    />
                                </div>

                                <div className="space-y-3 pt-2">
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase">Enable Data Sync:</Label>
                                    <div className="space-y-2">
                                        {[
                                            { key: "syncEmployees", label: "Sync Workforce Accounts", sub: "Load names, emails, department maps, and supervisors." },
                                            { key: "syncPerformance", label: "Sync Performance Metric Reviews", sub: "Import historical KPI grades." },
                                            { key: "syncRoles", label: "Sync Roles", sub: "Link active job designations." }
                                        ].map((item) => (
                                            <div key={item.key} className="flex items-center justify-between py-1 border-b border-border/30 last:border-0">
                                                <div>
                                                    <p className="text-xs font-bold">{item.label}</p>
                                                    <p className="text-[10px] text-muted-foreground">{item.sub}</p>
                                                </div>
                                                <Switch 
                                                    checked={configData[item.key as keyof typeof configData] as boolean} 
                                                    onCheckedChange={(v) => setConfigData({...configData, [item.key]: v})} 
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="space-y-2">
                                        <Label>Sync Frequency</Label>
                                        <Select value={configData.frequency} onValueChange={(val) => setConfigData({...configData, frequency: val})}>
                                            <SelectTrigger className="text-xs">
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {["Hourly", "Daily", "Weekly", "Manual"].map(f => (
                                                    <SelectItem key={f} value={f} className="text-xs">{f}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2 pt-2">
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase">Schema Mapping:</Label>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="space-y-1">
                                            <span className="text-muted-foreground">Source User Key</span>
                                            <Input className="h-8 text-xs font-mono" value={configData.mapFieldUser} onChange={(e) => setConfigData({...configData, mapFieldUser: e.target.value})} />
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-muted-foreground">Source Manager Key</span>
                                            <Input className="h-8 text-xs font-mono" value={configData.mapFieldManager} onChange={(e) => setConfigData({...configData, mapFieldManager: e.target.value})} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsConfiguring(null)}>Cancel</Button>
                                <Button onClick={handleSaveConfig} className="bg-rose-500 hover:bg-rose-600 text-white border-0">Connect System</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Sync Logs */}
                    <Card className="border-border/50">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <Cable className="w-4 h-4 text-rose-500" /> Synchronization Activity Log
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {logs.map((log) => (
                                <div key={log.id} className="flex items-start justify-between border-b border-border/30 pb-3 last:border-0 last:pb-0 text-sm">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">{log.system}</span>
                                            <Badge variant="outline" className={cn("text-[10px] font-bold py-0 h-4 border", log.status === "Success" ? "text-emerald-600 border-emerald-200 bg-emerald-50" : "text-destructive border-destructive/20 bg-destructive/5")}>
                                                {log.status}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">{log.details}</p>
                                    </div>
                                    <span className="text-xs text-muted-foreground font-mono">{log.timestamp}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
