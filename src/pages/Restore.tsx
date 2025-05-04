
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTenants, getRestorePoints, formatDate } from "@/services/mockDataService";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const Restore = () => {
  const tenants = getTenants();
  const [selectedTenantId, setSelectedTenantId] = useState(tenants[0].id);
  const [selectedRestorePointId, setSelectedRestorePointId] = useState<string | null>(null);
  const restorePoints = getRestorePoints(selectedTenantId);
  const { toast } = useToast();

  const handleTenantChange = (value: string) => {
    setSelectedTenantId(value);
    setSelectedRestorePointId(null);
  };

  const handleRestorePointSelect = (id: string) => {
    setSelectedRestorePointId(id === selectedRestorePointId ? null : id);
  };

  const handleStartRestore = () => {
    if (!selectedRestorePointId) {
      toast({
        title: "No restore point selected",
        description: "Please select a restore point to continue.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Restore initiated",
      description: "Your restore operation has been queued and will start shortly.",
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
            <div className="space-y-2">
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
            </div>

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
                      <TableHead>Policies</TableHead>
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
                        <TableCell>{point.objectsCaptured.users.toLocaleString()}</TableCell>
                        <TableCell>{point.objectsCaptured.groups.toLocaleString()}</TableCell>
                        <TableCell>{point.objectsCaptured.applications.toLocaleString()}</TableCell>
                        <TableCell>{point.objectsCaptured.policies.toLocaleString()}</TableCell>
                        <TableCell>{point.objectsCaptured.roles.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button onClick={handleStartRestore} disabled={!selectedRestorePointId}>
                Start Restore
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Restore;
