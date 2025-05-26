
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MetricCard from "@/components/dashboard/MetricCard";
import TenantList from "@/components/dashboard/TenantList";
import { formatDate } from "@/services/mockDataService";
import BackupStatusBadge from "@/components/dashboard/BackupStatusBadge";
import type { BackupStatus } from "@/components/dashboard/BackupStatusBadge";
import { useEffect, useState } from "react";

const Dashboard = () => {
  // const metrics = getDashboardMetrics();
  const [metrics, setMetrics] = useState<{
    lastBackupTime: string;
    objectsBackedUp: number;
    tenantsBackedUp: number;
    totalBackups: number;
    backupStatus: BackupStatus;
  }>({
    lastBackupTime: "",
    objectsBackedUp: 0,
    tenantsBackedUp: 0,
    totalBackups: 0,
    backupStatus: "success",
  });
  const queries = {
    lastBackupTime: "AzureADbackup_CL | where TimeGenerated >ago(30d) | summarize max(TimeGenerated)",
    tenantsBackedUp: "AzureEntraBackup_CL | where TimeGenerated >ago(30d) | distinct TenantId | count",
    objectsBackedUp: "AzureEntraBackup_CL | distinct securityIdentifier_s | count",
    totalBackups: "AzureEntraBackup_CL | where TimeGenerated >ago(30d) | extend only_date = dayofyear(TimeGenerated) | distinct only_date | count",
  }

  // write a fetch request with body should send data in json format
  useEffect(() => {
    console.log("Fetching metrics...");
    setMetrics((prev) => ({
      ...prev,
      backupStatus: "pending",
    }));
    const fetchMetrics = async (query) => {
      try {
        const response = await fetch('https://fn-entra-backup-srever-dev.azurewebsites.net/api/GetUserLogs?', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "workspaceId": "ad0ea146-ac18-46ac-bf5b-fd406e63e548",
            "query": query
          }),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const text = await response.text();
        if (!text) {
          return null;
        }
        const data = JSON.parse(text);
        return data;
      } catch (error) {
        console.error('Error fetching metrics:', error);
        return null;
      }
    };

    const fetchAllMetrics = async () => {
      const [
        lastBackUpDateData,
        tenantsBackedUpData,
        objectsBackedUpData,
        totalBackupsData
      ] = await Promise.all([
        fetchMetrics(queries.lastBackupTime),
        fetchMetrics(queries.tenantsBackedUp),
        fetchMetrics(queries.objectsBackedUp),
        fetchMetrics(queries.totalBackups)
      ]);

      setMetrics((prev) => ({
        ...prev,
        lastBackupTime: lastBackUpDateData ? formatDate(lastBackUpDateData.tables[0].rows[0][0]) : "",
        tenantsBackedUp: tenantsBackedUpData ? tenantsBackedUpData.tables[0].rows[0][0] : 0,
        objectsBackedUp: objectsBackedUpData ? objectsBackedUpData.tables[0].rows[0][0] : 0,
        totalBackups: totalBackupsData ? totalBackupsData.tables[0].rows[0][0] : 0,
        backupStatus: "success"
      }));
      console.log("Metrics fetched successfully");
    };

    fetchAllMetrics();
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
            <CardDescription>Last backup on {metrics.lastBackupTime}</CardDescription>
          </div>
          <div className="ml-auto">
            <BackupStatusBadge status={metrics.backupStatus} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            <MetricCard
              title="Total Backups"
              value={metrics.totalBackups}
            />
            <MetricCard
              title="Objects Backed Up"
              value={metrics.objectsBackedUp}
            />
            <MetricCard
              title="Tenants Backed Up"
              value={metrics.tenantsBackedUp}
            />
            <MetricCard
              title="Last Backup Time"
              value={metrics.lastBackupTime}
            />
          </div>
        </CardContent>
      </Card>

      <TenantList />
    </div>
  );
};

export default Dashboard;
