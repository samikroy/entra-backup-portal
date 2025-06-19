
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTenants, formatDate } from "@/services/mockDataService";
import BackupStatusBadge from "@/components/dashboard/BackupStatusBadge";

const Tenants = () => {
  const tenants = getTenants();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Tenants</h2>
        <p className="text-muted-foreground">
          Manage your connected Azure AD (Entra ID) tenants.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connected Tenants</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Last Backup</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Groups</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell className="font-medium">{tenant.name}</TableCell>
                  <TableCell>{tenant.domain}</TableCell>
                  <TableCell>June 03, 2025 at 02:53 AM</TableCell>
                  <TableCell>23</TableCell>
                  <TableCell>2</TableCell>
                  <TableCell>37</TableCell>
                  <TableCell>
                    <BackupStatusBadge
                      status={tenant.status === 'active' ? 'success' : (tenant.status === 'pending' ? 'pending' : 'warning')}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tenants;
