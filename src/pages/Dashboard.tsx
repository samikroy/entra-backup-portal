import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import MetricCard from "@/components/dashboard/MetricCard";
import TenantList from "@/components/dashboard/TenantList";
import { formatDate } from "@/services/mockDataService";
import BackupStatusBadge from "@/components/dashboard/BackupStatusBadge";
import type { BackupStatus } from "@/components/dashboard/BackupStatusBadge";
import { useEffect, useState } from "react";
import { useMetrics } from "@/contexts/MetricsContext";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts";
import { Activity, Users, Shield, Database, TrendingUp, Server, Zap, Eye } from "lucide-react";

const Dashboard = () => {
  const {
    lastBackupTime,
    objectsBackedUp,
    tenantsBackedUp,
    totalBackups,
    backupStatus,
    consentGranted,
    totalUsers,
    totalApplications,
    totalRoles
  } = useMetrics();

  // Mock chart data for stunning visualizations
  const trendData = [
    { name: 'Jan', backups: 45, users: 1200, apps: 89 },
    { name: 'Feb', backups: 52, users: 1350, apps: 95 },
    { name: 'Mar', backups: 61, users: 1580, apps: 103 },
    { name: 'Apr', backups: 58, users: 1420, apps: 98 },
    { name: 'May', backups: 67, users: 1650, apps: 112 },
    { name: 'Jun', backups: 73, users: 1780, apps: 118 },
  ];

  const securityMetrics = [
    { name: 'Secure', value: 78, color: 'hsl(var(--primary))' },
    { name: 'Warning', value: 15, color: 'hsl(45 93% 47%)' },
    { name: 'Critical', value: 7, color: 'hsl(var(--destructive))' },
  ];

  const performanceData = [
    { name: 'Users', value: totalUsers, icon: Users, color: 'hsl(217 91% 60%)' },
    { name: 'Apps', value: totalApplications, icon: Server, color: 'hsl(142 76% 36%)' },
    { name: 'Roles', value: totalRoles, icon: Shield, color: 'hsl(262 83% 58%)' },
    { name: 'Backups', value: totalBackups, icon: Database, color: 'hsl(346 87% 43%)' },
  ];

  const clientId = "664cc9b7-5d59-4f66-848c-6f6213bd091e";
  const redirectUri = encodeURIComponent("http://localhost:8080/login");
  const tenantId = "common";
  const adminConsentUrl = `https://login.microsoftonline.com/${tenantId}/adminconsent?client_id=${clientId}&redirect_uri=${redirectUri}`;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Cyberpunk Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background/80 to-primary/5 -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary))_0%,transparent_50%)] opacity-10 -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent))_0%,transparent_50%)] opacity-10 -z-10" />
      
      <div className="relative space-y-8 p-6">
        {/* Hero Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="relative inline-block">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
              Neural Command Center
            </h1>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full animate-ping" />
          </div>
          <p className="text-xl text-muted-foreground/80 max-w-2xl mx-auto">
            Real-time analytics and intelligence for your Entra ID ecosystem
          </p>
        </div>

        {/* Admin Consent Alert */}
        {consentGranted && (
          <div className="glassmorphism p-6 border border-primary/20 rounded-2xl animate-scale-in backdrop-blur-xl bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/20 backdrop-blur-sm">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-primary">Security Authorization Required</h3>
                <p className="text-sm text-muted-foreground">Grant admin consent to unlock full system capabilities</p>
              </div>
              <a
                className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-medium hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-primary/25"
                href={adminConsentUrl}
                target="_self"
                rel="noopener noreferrer"
              >
                Authorize Access
              </a>
            </div>
          </div>
        )}

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {performanceData.map((metric, index) => (
            <div
              key={metric.name}
              className="glassmorphism p-6 rounded-2xl border border-white/10 hover:border-primary/30 transition-all duration-500 hover:scale-105 group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br from-transparent to-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300`}>
                  <metric.icon className="w-6 h-6" style={{ color: metric.color }} />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground">{metric.value.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">{metric.name}</div>
                </div>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-transparent to-current rounded-full animate-pulse"
                  style={{ 
                    width: `${Math.min((metric.value / Math.max(...performanceData.map(d => d.value))) * 100, 100)}%`,
                    color: metric.color 
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Trend Analysis */}
          <div className="glassmorphism p-6 rounded-2xl border border-white/10 hover:border-primary/20 transition-all duration-500 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Performance Trends</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="backupGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="backups" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#backupGradient)" />
                <Area type="monotone" dataKey="users" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#userGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Security Overview */}
          <div className="glassmorphism p-6 rounded-2xl border border-white/10 hover:border-primary/20 transition-all duration-500 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-destructive/20 to-primary/20">
                <Shield className="w-5 h-5 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold">Security Status</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={securityMetrics}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {securityMetrics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {securityMetrics.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="glassmorphism p-6 rounded-2xl border border-white/10 hover:border-primary/20 transition-all duration-500 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-accent/20 to-primary/20">
              <Activity className="w-5 h-5 text-accent" />
            </div>
            <h3 className="text-xl font-semibold">System Activity</h3>
            <div className="ml-auto">
              <BackupStatusBadge status={backupStatus} />
            </div>
          </div>
          
          <div className="space-y-4">
            {[
              { time: '2 min ago', action: 'Backup completed', status: 'success', users: '1,247 users' },
              { time: '15 min ago', action: 'Security scan', status: 'warning', users: '89 applications' },
              { time: '1 hour ago', action: 'Data sync', status: 'success', users: '456 roles' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300">
                <div className={`w-3 h-3 rounded-full ${
                  activity.status === 'success' ? 'bg-green-500' : 
                  activity.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                } animate-pulse`} />
                <div className="flex-1">
                  <div className="font-medium">{activity.action}</div>
                  <div className="text-sm text-muted-foreground">{activity.users}</div>
                </div>
                <div className="text-sm text-muted-foreground">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Tenant List */}
        <div className="glassmorphism p-6 rounded-2xl border border-white/10 hover:border-primary/20 transition-all duration-500 animate-fade-in">
          <TenantList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
