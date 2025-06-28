
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getTenants, formatDate } from "@/services/mockDataService";
import BackupStatusBadge from "./BackupStatusBadge";
import { useMetrics } from "@/contexts/MetricsContext";

const TenantList = () => {
  const tenants = getTenants();
  const { lastBackupTime, objectsBackedUp, backupStatus } = useMetrics()


  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Tenants</h3>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tenant Name</TableHead>
              <TableHead>Domain</TableHead>
              <TableHead>Last Backup</TableHead>
              <TableHead>Objects</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenants.map((tenant) => {
              const totalObjects = Object.values(tenant.objectCount).reduce((acc, curr) => acc + curr, 0);

              return (
                <TableRow key={tenant.id}>
                  <TableCell className="font-medium">{tenant.name}</TableCell>
                  <TableCell>{tenant.domain}</TableCell>
                  <TableCell>{lastBackupTime}</TableCell>
                  <TableCell>{objectsBackedUp}</TableCell>
                  <TableCell>
                    <BackupStatusBadge status={backupStatus} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TenantList;
