
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTenants, getRestorePoints, formatDate } from "@/services/mockDataService";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMetrics } from "@/contexts/MetricsContext";


const Restore = () => {
  const tenants = getTenants();
  const [selectedTenantId, setSelectedTenantId] = useState(tenants[0].id);
  const [selectedRestorePointId, setSelectedRestorePointId] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);
  const restorePoints = getRestorePoints(selectedTenantId);
  const { toast } = useToast();
  const { lastBackupTime, totalUsers, totalGroups, totalApplications, totalRoles, backupStatus } = useMetrics()


  const handleTenantChange = (value: string) => {
    setSelectedTenantId(value);
    setSelectedRestorePointId(null);
  };

  const handleRestorePointSelect = (id: string) => {
    setSelectedRestorePointId(id === selectedRestorePointId ? null : id);
  };

  const handleStartRestore = async () => {
    if (!selectedRestorePointId) {
      toast({
        title: "No restore point selected",
        description: "Please select a restore point to continue.",
        variant: "destructive",
      });
      return;
    }
    setRestoring(true);
    // Define restore payloads for each object type
    const restorePayloads = [
      {
        link: "https://fn-entra-backup-srever-dev.azurewebsites.net/api/GetUserLogs?",
        objectType: "users",
        fetchBody: {
          workspaceId: "ad0ea146-ac18-46ac-bf5b-fd406e63e548",
          query: "AzureEntraBackup_CL | where isnotempty(userPrincipalName_s) | summarize arg_max(TimeGenerated, *) by id_g"
        }
      },
      {
        link: "https://fn-entra-backup-srever-dev.azurewebsites.net/api/GetUserLogs?",
        objectType: "groups",
        fetchBody: {
          workspaceId: "ad0ea146-ac18-46ac-bf5b-fd406e63e548",
          query: "AzureEntraBackup_CL | where isnotempty(groupTypes_s) | summarize arg_max(TimeGenerated, *) by id_g"
        }
      },
      {
        link: "https://fn-entra-backup-srever-dev.azurewebsites.net/api/GetUserLogs?",
        objectType: "applications",
        fetchBody: {
          workspaceId: "ad0ea146-ac18-46ac-bf5b-fd406e63e548",
          query: "AzureEntraBackup_CL | where isnotempty(appId_g) and isempty(servicePrincipalType_s) | summarize arg_max(TimeGenerated, *) by id_g"
        }
      },
      // {
      //   link: "https://fn-entra-backup-srever-dev.azurewebsites.net/api/GetUserLogs?",
      //   objectType: "serviceprincipals",
      //   fetchBody: {
      //     workspaceId: "ad0ea146-ac18-46ac-bf5b-fd406e63e548",
      //     query: "AzureEntraBackup_CL | where isnotempty(appId_g) and isnotempty(servicePrincipalType_s)| summarize arg_max(TimeGenerated, *) by id_g | take 10"
      //   }
      // }
    ];

    for (const payload of restorePayloads) {
      try {
        toast({
          title: `Restore initiated for ${payload.objectType}`,
          description: `Restore operation for ${payload.objectType} has been queued.`,
        });
        const response = await fetch("https://fn-entra-backup-srever-dev.azurewebsites.net/api/RestoreData?", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error(`Failed to restore ${payload.objectType}`);
        }
        toast({
          title: `Restore completed for ${payload.objectType}`,
          description: `Restore operation for ${payload.objectType} has been completed.`,
        });
      } catch (error) {
        toast({
          title: `Error restoring ${payload.objectType}`,
          description: String(error),
          variant: "destructive",
        });
      }
    }

    setRestoring(false);
    toast({
      title: "Restoration completed",
      description: "All restore operations have been completed.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Restore</h2>
        <p className="text-muted-foreground">
          Restore your Entra ID objects from a backup point.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Restore Operations</CardTitle>
          <CardDescription>
            Select a tenant and restore point to begin the restore process.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {/* <div className="space-y-2">
              <label className="text-sm font-medium">Select Tenant</label>
              <Select value={selectedTenantId} onValueChange={handleTenantChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tenant" />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      {tenant.name} ({tenant.domain})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Available Restore Points</h3>

              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Groups</TableHead>
                      <TableHead>Apps</TableHead>
                      {/* <TableHead>Policies</TableHead> */}
                      <TableHead>Roles</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {restorePoints.map((point) => (
                      <TableRow
                        key={point.id}
                        className={selectedRestorePointId === point.id ? "bg-muted" : ""}
                        onClick={() => handleRestorePointSelect(point.id)}
                      >
                        <TableCell>
                          <input
                            type="radio"
                            checked={selectedRestorePointId === point.id}
                            onChange={() => handleRestorePointSelect(point.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{formatDate(point.timestamp)}</TableCell>
                        <TableCell>
                          <Badge variant={point.status === "completed" ? "default" : "outline"}>
                            {point.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{totalUsers}</TableCell>
                        <TableCell>{totalGroups}</TableCell>
                        <TableCell>{totalApplications}</TableCell>
                        {/* <TableCell>{point.objectsCaptured.policies.toLocaleString()}</TableCell> */}
                        <TableCell>{totalRoles}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                onClick={handleStartRestore}
                disabled={!selectedRestorePointId || restoring}
              >
                {restoring ? "Restoring..." : "Start Restore"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Restore;
