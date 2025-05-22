
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MetricCard from "@/components/dashboard/MetricCard";
import TenantList from "@/components/dashboard/TenantList";
import { getDashboardMetrics, formatDate } from "@/services/mockDataService";
import BackupStatusBadge from "@/components/dashboard/BackupStatusBadge";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const metrics = getDashboardMetrics();
  const [date, setDate] = useState(null);

  // write a fetch request with body should send data in json format
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('https://fn-entra-backup-srever-dev.azurewebsites.net/api/GetUserLogs?', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            {
              "workspaceId": "ad0ea146-ac18-46ac-bf5b-fd406e63e548",
              "query": "AzureADbackup_CL | where TimeGenerated >ago(30d) | summarize max(TimeGenerated)"
            }
          ),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const dateAndTime = data.tables[0].rows[0][0]
        setDate(dateAndTime);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your Entra ID backups across all tenants.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>Backup Status</CardTitle>
            <CardDescription>Last backup on {formatDate(metrics.lastBackupTime)}</CardDescription>
          </div>
          <div className="ml-auto">
            <BackupStatusBadge status={metrics.backupStatus} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            <MetricCard
              title="Total Backups"
              value={metrics.backupCount.toLocaleString()}
            />
            <MetricCard
              title="Objects Backed Up"
              value={metrics.objectsBackedUp.toLocaleString()}
            />
            <MetricCard
              title="Tenants Backed Up"
              value={metrics.tenantsBackedUp}
            />
            <MetricCard
              title="Last Backup Time"
              value={formatDate(date)}
            />
          </div>
        </CardContent>
      </Card>

      <TenantList />
    </div>
  );
};

export default Dashboard;
