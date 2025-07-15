import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MetricCard from "@/components/dashboard/MetricCard";
import TenantList from "@/components/dashboard/TenantList";
import { formatDate } from "@/services/mockDataService";
import BackupStatusBadge from "@/components/dashboard/BackupStatusBadge";
import type { BackupStatus } from "@/components/dashboard/BackupStatusBadge";
import { useEffect, useState } from "react";
import { useMetrics } from "@/contexts/MetricsContext";

const Dashboard = () => {
  const {
    lastBackupTime,
    objectsBackedUp,
    tenantsBackedUp,
    totalBackups,
    backupStatus,
    consentGranted
  } = useMetrics();



  const clientId = "664cc9b7-5d59-4f66-848c-6f6213bd091e";
  const redirectUri = encodeURIComponent("http://localhost:8080/login");
  const tenantId = "common";

  const adminConsentUrl = `https://login.microsoftonline.com/${tenantId}/adminconsent?client_id=${clientId}&redirect_uri=${redirectUri}`;

  // const [showAdminConsent, setShowAdminConsent] = useState(true);

  // useEffect(() => {
  //   const checkConsentStatus = async () => {
  //     try {
  //       const response = await fetch(
  //         "https://fn-entra-backup-srever-dev.azurewebsites.net/api/CheckUserAdminPermission",
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({ targetTenantId: user.tenantId }),
  //         }
  //       );

  //       const data = await response.json();
  //       setShowAdminConsent(!data.consentGranted); // Show button if consent not granted
  //     } catch (error) {
  //       console.error("Failed to check admin consent status", error);
  //       setShowAdminConsent(true); // fallback to showing the button
  //     }
  //   };

  //   checkConsentStatus();
  // }, [user.tenantId]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your Entra ID backups across all tenants.
        </p>
      </div>

      {consentGranted && (
        <div>
          <a
            className="bg-blue-300 p-4 rounded"
            href={adminConsentUrl}
            target="_self"
            rel="noopener noreferrer"
          >
            Grant Admin Consent
          </a>
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>Backup Status</CardTitle>
            <CardDescription>Last backup on {lastBackupTime}</CardDescription>
          </div>
          <div className="ml-auto">
            <BackupStatusBadge status={backupStatus} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            <MetricCard title="Total Backups" value={totalBackups} />
            <MetricCard title="Objects Backed Up" value={objectsBackedUp} />
            <MetricCard title="Tenants Backed Up" value={tenantsBackedUp} />
            <MetricCard title="Last Backup Time" value={lastBackupTime} />
          </div>
        </CardContent>
      </Card>

      <TenantList />
    </div>
  );
};

export default Dashboard;
