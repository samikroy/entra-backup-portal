
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MetricCard from "@/components/dashboard/MetricCard";
import TenantList from "@/components/dashboard/TenantList";
import { getDashboardMetrics, formatDate } from "@/services/mockDataService";
import BackupStatusBadge from "@/components/dashboard/BackupStatusBadge";

const Dashboard = () => {
  const metrics = getDashboardMetrics();

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
              value={formatDate(metrics.lastBackupTime)}
            />
          </div>
        </CardContent>
      </Card>

      <TenantList />
    </div>
  );
};

export default Dashboard;
