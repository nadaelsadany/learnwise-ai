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
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Bot, Plus, Play, Trash2, Cpu, Zap, Activity, ChevronRight, Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Rule = {
    id: string;
    name: string;
    conditionMetric: string;
    conditionOperator: string;
    conditionValue: number;
    conditionRole: string;
    actionPath: string;
    active: boolean;
    triggersCount: number;
};

type RuleTriggerLog = {
    id: string;
    ruleName: string;
    employeeName: string;
    metricDetails: string;
    timestamp: string;
};

const initialRules: Rule[] = [
    {
        id: "r1",
        name: "Low Performance Sales Assignment",
        conditionMetric: "Performance Score",
        conditionOperator: "<",
        conditionValue: 60,
        conditionRole: "Sales Executive",
        actionPath: "Sales Excellence Path",
        active: true,
        triggersCount: 8
    },
    {
        id: "r2",
        name: "New Software Engineers Core Mapping",
        conditionMetric: "Onboarding State",
        conditionOperator: "is",
        conditionValue: 1, // Simulated: Onboarding is incomplete or new
        conditionRole: "Software Engineer",
        actionPath: "Engineering Core Essentials",
        active: true,
        triggersCount: 15
    }
];

const initialLogs: RuleTriggerLog[] = [
    { id: "tl1", ruleName: "Low Performance Sales Assignment", employeeName: "Sarah Johnson", metricDetails: "Performance Score = 58%", timestamp: "Today, 10:50 AM" },
    { id: "tl2", ruleName: "New Software Engineers Core Mapping", employeeName: "Ben Luca", metricDetails: "Onboarding State = Joined", timestamp: "Yesterday, 11:30 AM" },
    { id: "tl3", ruleName: "Low Performance Sales Assignment", employeeName: "Alice Mercer", metricDetails: "Performance Score = 38%", timestamp: "May 22, 2026, 09:15 AM" }
];

export default function AdminAIAutomation() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [rules, setRules] = useState<Rule[]>(initialRules);
    const [logs, setLogs] = useState<RuleTriggerLog[]>(initialLogs);
    const [isOpen, setIsOpen] = useState(false);

    const [ruleForm, setRuleForm] = useState({
        name: "",
        metric: "Performance Score",
        operator: "<",
        value: 60,
        role: "Sales Executive",
        path: "Sales Excellence Path"
    });

    const { toast } = useToast();

    const handleCreateRule = () => {
        if (!ruleForm.name) {
            toast({ variant: "destructive", title: "Rule Name Required" });
            return;
        }

        const created: Rule = {
            id: Date.now().toString(),
            name: ruleForm.name,
            conditionMetric: ruleForm.metric,
            conditionOperator: ruleForm.operator,
            conditionValue: Number(ruleForm.value),
            conditionRole: ruleForm.role,
            actionPath: ruleForm.path,
            active: true,
            triggersCount: 0
        };

        setRules([...rules, created]);
        setIsOpen(false);
        setRuleForm({
            name: "",
            metric: "Performance Score",
            operator: "<",
            value: 60,
            role: "Sales Executive",
            path: "Sales Excellence Path"
        });
        toast({ title: "AI Automation Rule Saved", description: "This rule will run automatically on incoming HR syncs." });
    };

    const handleDeleteRule = (id: string) => {
        setRules(prev => prev.filter(r => r.id !== id));
        toast({ title: "Automation Rule Deleted" });
    };

    const toggleRuleActive = (id: string) => {
        setRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
        toast({ title: "Rule Status Updated" });
    };

    return (
        <div className="min-h-screen bg-background">
            <AdminSidebar onCollapse={setSidebarCollapsed} />
            <Header sidebarCollapsed={sidebarCollapsed} userRole="Admin" mobileSidebar={<AdminSidebarContent collapsed={false} />} />

            <main className={cn("pt-20 pb-12 px-4 sm:px-6 transition-all duration-300", sidebarCollapsed ? "lg:ml-20" : "lg:ml-64")}>
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black">AI Automation Rules</h1>
                            <p className="text-muted-foreground text-sm mt-1">Configure conditions to automatically assign paths or trigger learning alerts</p>
                        </div>
                        
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-rose-500 hover:bg-rose-600 text-white border-0 font-semibold">
                                    <Plus className="w-4 h-4 mr-2" /> Create Automation Rule
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[480px]">
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-rose-500" /> Create AI Automation Rule</DialogTitle>
                                    <DialogDescription>Define logic triggers to automatically coordinate training paths.</DialogDescription>
                                </DialogHeader>

                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Rule Name</Label>
                                        <Input placeholder="e.g. Sales performance intervention" value={ruleForm.name} onChange={(e) => setRuleForm({...ruleForm, name: e.target.value})} />
                                    </div>

                                    {/* CONDITION BUILDER */}
                                    <div className="rounded-xl border border-border/60 bg-muted/30 p-4 space-y-3">
                                        <p className="text-xs font-bold text-muted-foreground uppercase">Condition Builder (IF)</p>
                                        
                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="space-y-1 col-span-2">
                                                <span className="text-[10px] text-muted-foreground block">Metric</span>
                                                <Select value={ruleForm.metric} onValueChange={(val) => setRuleForm({...ruleForm, metric: val})}>
                                                    <SelectTrigger className="text-xs">
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {["Performance Score", "Assessment Score", "Overdue Tasks"].map(m => (
                                                            <SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[10px] text-muted-foreground block">Operator</span>
                                                <Select value={ruleForm.operator} onValueChange={(val) => setRuleForm({...ruleForm, operator: val})}>
                                                    <SelectTrigger className="text-xs">
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {["<", ">", "="].map(op => (
                                                            <SelectItem key={op} value={op} className="text-xs font-mono">{op}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-1">
                                                <span className="text-[10px] text-muted-foreground block">Threshold Value</span>
                                                <Input type="number" className="h-9 text-xs" value={ruleForm.value} onChange={(e) => setRuleForm({...ruleForm, value: Number(e.target.value)})} />
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[10px] text-muted-foreground block">Target Job Role</span>
                                                <Select value={ruleForm.role} onValueChange={(val) => setRuleForm({...ruleForm, role: val})}>
                                                    <SelectTrigger className="text-xs">
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {["Sales Executive", "Software Engineer", "QA Specialist", "HR Generalist", "Financial Analyst"].map(r => (
                                                            <SelectItem key={r} value={r} className="text-xs">{r}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ACTION SELECTOR */}
                                    <div className="rounded-xl border border-border/60 bg-muted/30 p-4 space-y-3">
                                        <p className="text-xs font-bold text-muted-foreground uppercase">Action Mapping (THEN)</p>
                                        
                                        <div className="space-y-1">
                                            <span className="text-[10px] text-muted-foreground block">Assign Learning Career Path</span>
                                            <Select value={ruleForm.path} onValueChange={(val) => setRuleForm({...ruleForm, path: val})}>
                                                <SelectTrigger className="text-xs">
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {["Sales Excellence Path", "Engineering Core Essentials", "Leadership Bootcamp", "Corporate Onboarding"].map(path => (
                                                        <SelectItem key={path} value={path} className="text-xs">{path}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                                    <Button onClick={handleCreateRule} className="bg-rose-500 hover:bg-rose-600 text-white border-0">Save Rule</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Rules listing cards */}
                    <div className="grid grid-cols-1 gap-4">
                        {rules.map((rule) => (
                            <Card key={rule.id} className="border-border/50 hover:border-rose-200/50 transition-colors">
                                <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                                            <Cpu className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-bold text-base">{rule.name}</h3>
                                                <Badge variant="secondary" className="text-[10px] font-semibold font-mono">
                                                    Triggered {rule.triggersCount} times
                                                </Badge>
                                            </div>
                                            {/* Rule logic expression display */}
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
                                                <span className="font-bold text-rose-600">IF</span>
                                                <span className="bg-muted px-1.5 py-0.5 rounded font-medium">{rule.conditionMetric} {rule.conditionOperator} {rule.conditionValue}</span>
                                                <span className="font-bold text-rose-600">AND</span>
                                                <span className="bg-muted px-1.5 py-0.5 rounded font-medium">Role is {rule.conditionRole}</span>
                                                <ChevronRight className="w-3.5 h-3.5" />
                                                <span className="font-bold text-emerald-600">THEN</span>
                                                <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded font-medium">Assign "{rule.actionPath}"</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-end">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground">{rule.active ? "Active" : "Paused"}</span>
                                            <Switch checked={rule.active} onCheckedChange={() => toggleRuleActive(rule.id)} />
                                        </div>
                                        <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteRule(rule.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Automation Trigger Logs */}
                    <Card className="border-border/50">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <Activity className="w-4 h-4 text-rose-500" /> Automation Trigger Log
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {logs.map((log) => (
                                <div key={log.id} className="flex items-start justify-between border-b border-border/30 pb-3 last:border-0 last:pb-0 text-sm">
                                    <div className="flex items-start gap-2.5">
                                        <Zap className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="font-medium text-foreground">
                                                Assigned Career Path for <span className="font-bold text-rose-600">{log.employeeName}</span>
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                Rule: <span className="underline">{log.ruleName}</span> ({log.metricDetails})
                                            </p>
                                        </div>
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
