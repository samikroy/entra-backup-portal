
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getTenants } from '@/services/mockDataService';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const TenantAdmin = () => {
  const { toast } = useToast();
  const [tenants] = useState(getTenants());
  const [filter, setFilter] = useState('');

  const filteredTenants = tenants.filter(tenant => 
    tenant.name.toLowerCase().includes(filter.toLowerCase()) || 
    tenant.domain.toLowerCase().includes(filter.toLowerCase())
  );

  const handleAddTenant = () => {
    toast({
      title: "Feature not implemented",
      description: "Adding new tenants is not available in the demo.",
    });
  };

  const handleToggleTenant = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    toast({
      title: `Tenant ${newStatus === 'active' ? 'activated' : 'deactivated'}`,
      description: `The tenant status has been updated to ${newStatus}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tenant Administration</h2>
          <p className="text-muted-foreground">
            Manage tenant access and configurations across your organization
          </p>
        </div>
        <Button onClick={handleAddTenant}>Add New Tenant</Button>
      </div>

      <Tabs defaultValue="tenants">
        <TabsList>
          <TabsTrigger value="tenants">Tenants</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="usage">Usage & Billing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tenants" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Managed Tenants</span>
                <Input
                  placeholder="Filter tenants..."
                  className="max-w-xs"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </CardTitle>
              <CardDescription>
                Manage all tenants registered with Entra Vault Keeper
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant Name</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Objects Count</TableHead>
                    <TableHead>Enabled</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTenants.map(tenant => {
                    const totalObjects = Object.values(tenant.objectCount).reduce((acc, curr) => acc + curr, 0);
                    return (
                      <TableRow key={tenant.id}>
                        <TableCell className="font-medium">{tenant.name}</TableCell>
                        <TableCell>{tenant.domain}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={tenant.status === 'active' ? 'default' : 
                                  (tenant.status === 'pending' ? 'outline' : 'secondary')}
                          >
                            {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{totalObjects.toLocaleString()}</TableCell>
                        <TableCell>
                          <Switch 
                            checked={tenant.status === 'active'} 
                            onCheckedChange={() => handleToggleTenant(tenant.id, tenant.status)} 
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">View Details</Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Showing {filteredTenants.length} of {tenants.length} tenants
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="policies" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Global Backup Policies</CardTitle>
              <CardDescription>
                Configure default policies that apply to all tenants
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h4 className="font-medium">Default Backup Frequency</h4>
                  <p className="text-sm text-muted-foreground">How often backups run by default</p>
                </div>
                <div className="flex items-center gap-2">
                  <select className="border rounded p-2">
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h4 className="font-medium">Retention Policy</h4>
                  <p className="text-sm text-muted-foreground">How long backups are stored</p>
                </div>
                <div className="flex items-center gap-2">
                  <select className="border rounded p-2">
                    <option>30 days</option>
                    <option>60 days</option>
                    <option>90 days</option>
                    <option>180 days</option>
                    <option>1 year</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Default Object Types</h4>
                  <p className="text-sm text-muted-foreground">What object types are backed up by default</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Global Policies</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="usage" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Usage & Billing</CardTitle>
              <CardDescription>
                Monitor tenant usage and billing information
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center">
              <p className="text-muted-foreground">
                Usage and billing reports would be displayed here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TenantAdmin;
