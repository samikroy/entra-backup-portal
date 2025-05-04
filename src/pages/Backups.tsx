
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTenants, getBackupConfig } from "@/services/mockDataService";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const Backups = () => {
  const tenants = getTenants();
  const { toast } = useToast();
  
  const firstTenant = tenants[0];
  const config = getBackupConfig(firstTenant.id);

  const handleSaveConfig = () => {
    toast({
      title: "Configuration saved",
      description: "Your backup configuration has been saved successfully.",
    });
  };

  const handleRunBackup = () => {
    toast({
      title: "Backup initiated",
      description: "Backup job has been queued and will run shortly.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Backups</h2>
        <p className="text-muted-foreground">
          Configure and manage your Entra ID backups.
        </p>
      </div>

      <Tabs defaultValue="configure">
        <TabsList>
          <TabsTrigger value="configure">Configure</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="configure" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Backup Configuration - {firstTenant.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Schedule</h3>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium" htmlFor="frequency">Frequency</label>
                          <Select defaultValue={config.frequency}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium" htmlFor="timeOfDay">Time of Day</label>
                          <Input defaultValue={config.timeOfDay} type="time" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="retentionDays">Retention Period (days)</label>
                        <Input defaultValue={config.retentionDays.toString()} type="number" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Objects to Backup</h3>
                    <div className="grid gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="users" defaultChecked={config.objectTypes.users} />
                        <label className="text-sm font-medium" htmlFor="users">Users</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="groups" defaultChecked={config.objectTypes.groups} />
                        <label className="text-sm font-medium" htmlFor="groups">Groups</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="applications" defaultChecked={config.objectTypes.applications} />
                        <label className="text-sm font-medium" htmlFor="applications">Applications</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="policies" defaultChecked={config.objectTypes.policies} />
                        <label className="text-sm font-medium" htmlFor="policies">Policies</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="roles" defaultChecked={config.objectTypes.roles} />
                        <label className="text-sm font-medium" htmlFor="roles">Roles</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Notifications</h3>
                  <div className="grid gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="notifyFailure" defaultChecked={config.notifyOnFailure} />
                      <label className="text-sm font-medium" htmlFor="notifyFailure">Notify on failure</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="notifySuccess" defaultChecked={config.notifyOnSuccess} />
                      <label className="text-sm font-medium" htmlFor="notifySuccess">Notify on success</label>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="notificationEmail">Email address</label>
                      <Input defaultValue={config.notificationEmail} type="email" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleRunBackup}>Run Backup Now</Button>
                  <Button onClick={handleSaveConfig}>Save Configuration</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Backup History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Backup history will be displayed here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Backup Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Detailed logs of backup processes will be displayed here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Backups;
