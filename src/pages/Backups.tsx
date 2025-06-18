
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTenants, getBackupConfig } from "@/services/mockDataService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

const Backups = () => {
  const tenants = getTenants();
  const { toast } = useToast();

  const firstTenant = tenants[0];
  const config = getBackupConfig(firstTenant.id);
  const [loadingAllTypes, setLoadingAllTypes] = useState(false);
  const [currentConfig, setCurrentConfig] = useState(
    {
      timeOfDay: '01:00',
      objectTypes: {
        users: false,
        groups: false,
        applications: false,
        servicePrincipals: false,
        domains: false,
        identity: false,
        roles: false,
      },
    }
  )

  const handleSaveConfig = async () => {
    const newTypes = Object.entries(currentConfig.objectTypes)
      .filter(([_, value]) => value)
      .map(([key]) => key)
      .join(',');

    // Format NewDateTime as "YYYY-MM-DD HH:mm"
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10); // "YYYY-MM-DD"
    const newDateTime = `${dateStr} ${currentConfig.timeOfDay}`;

    try {
      console.log("Saving configuration:", {
        newDateTime,
        newTypes,
      });
      const response = await fetch('https://fn-entra-backup-srever-dev.azurewebsites.net/api/ManageSchedule?', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          NewDateTime: newDateTime,
          newTypes: newTypes,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to save schedule');
      }
      console.log(response.status)
      // Optionally handle response here
      toast({
        title: "Configuration saved",
        description: "Your backup configuration has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save backup configuration.",
        variant: "destructive",
      });
    }
  };

  const handleRunBackup = () => {
    // make a fetch request to the API to run the backup
    fetch('https://fn-entra-backup-srever-dev.azurewebsites.net/api/TriggerEntraExploreWorkflow?', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        console.log("Response status:", response.ok);
        console.log("Response ", response)
        if (!response.ok) {
          throw new Error('Failed to initiate backup');
        }
        return response.text();
      })
      .then(data => {
        console.log("Backup initiated successfully:", data);
        toast({
          title: "Backup initiated",
          description: "Backup job has been queued and will run shortly.",
        });
      })
      .catch(error => {
        console.error("Error initiating backup:", error);
        toast({
          title: "Error",
          description: "Failed to initiate backup.",
          variant: "destructive",
        });
      });

  };

  useEffect(() => {
    setLoadingAllTypes(true);
    // fetch the current backup configuration and update the currentconfig in object types
    const fetchConfig = async () => {
      try {
        const response = await fetch(`https://fn-entra-backup-srever-dev.azurewebsites.net/api/ReadObjectTypes?`);
        if (!response.ok) {
          throw new Error('Failed to fetch backup configuration');
        }
        // console.log(response.result)
        const data = await response.text();
        const enabledTypes = data
          .split(',')
          .map(s => s.trim().toLowerCase());
        console.log(enabledTypes.includes('serviceprincipals'))
        // update currentconfig using setcurrentconfig - turn object types true if present in enabledTypes
        setCurrentConfig((prev) => ({
          ...prev,
          objectTypes: {
            users: enabledTypes.includes('users'),
            groups: enabledTypes.includes('groups'),
            applications: enabledTypes.includes('applications'),
            servicePrincipals: enabledTypes.includes('serviceprincipals'),
            domains: enabledTypes.includes('domains'),
            identity: enabledTypes.includes('identity'),
            roles: enabledTypes.includes('roles'),
          },
        }));
      } catch (error) {
        console.error("Error fetching backup configuration:", error);
      } finally {
        setLoadingAllTypes(false);
      }
    }
    fetchConfig()
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Configure and manage your Entra ID backups settings.
        </p>
      </div>

      <Tabs defaultValue="configure">
        <TabsList>
          <TabsTrigger value="configure">Configure</TabsTrigger>
          {/* <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger> */}
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
                          <Input
                            defaultValue={currentConfig.timeOfDay}
                            onChange={(e) =>
                              setCurrentConfig((prev) => ({
                                ...prev,
                                timeOfDay: e.target.value,
                              }))
                            }
                            type="time"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="retentionDays">Retention Period (days)</label>
                        <Input defaultValue={config.retentionDays.toString()} type="number" min={1} max={30} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Objects to Backup</h3>
                    {loadingAllTypes && (
                      <div className="text-sm text-muted-foreground mt-2">Loading all object types...</div>
                    )}
                    <div className="grid gap-4" style={{ "opacity": loadingAllTypes ? 0.5 : 1, "pointerEvents": loadingAllTypes ? "none" : "auto" }}>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="users"
                          checked={currentConfig.objectTypes.users}
                          onCheckedChange={() => setCurrentConfig((prev) => ({
                            ...prev,
                            objectTypes: {
                              ...prev.objectTypes,
                              users: !currentConfig.objectTypes.users,
                            },
                          }))} />
                        <label className="text-sm font-medium" htmlFor="users">Users</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="groups"
                          checked={currentConfig.objectTypes.groups}
                          onCheckedChange={() => setCurrentConfig((prev) => ({
                            ...prev,
                            objectTypes: {
                              ...prev.objectTypes,
                              groups: !currentConfig.objectTypes.groups,
                            },
                          }))}
                        />
                        <label className="text-sm font-medium" htmlFor="groups">Groups</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="applications"
                          checked={currentConfig.objectTypes.applications}
                          onCheckedChange={() => setCurrentConfig((prev) => ({
                            ...prev,
                            objectTypes: {
                              ...prev.objectTypes,
                              applications: !currentConfig.objectTypes.applications,
                            },
                          }))}
                        />
                        <label className="text-sm font-medium" htmlFor="applications">Applications</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="policies"
                          checked={currentConfig.objectTypes.servicePrincipals}
                          onCheckedChange={() => setCurrentConfig((prev) => ({
                            ...prev,
                            objectTypes: {
                              ...prev.objectTypes,
                              servicePrincipals: !currentConfig.objectTypes.servicePrincipals,
                            },
                          }))}
                        />
                        <label className="text-sm font-medium" htmlFor="policies">ServicePrincipals</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="policies"
                          checked={currentConfig.objectTypes.domains}
                          onCheckedChange={() => setCurrentConfig((prev) => ({
                            ...prev,
                            objectTypes: {
                              ...prev.objectTypes,
                              domains: !currentConfig.objectTypes.domains,
                            },
                          }))}
                        />
                        <label className="text-sm font-medium" htmlFor="policies">Domains</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="policies"
                          checked={currentConfig.objectTypes.identity}
                          onCheckedChange={() => setCurrentConfig((prev) => ({
                            ...prev,
                            objectTypes: {
                              ...prev.objectTypes,
                              identity: !currentConfig.objectTypes.identity,
                            },
                          }))}
                        />
                        <label className="text-sm font-medium" htmlFor="policies">Identity</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="roles"
                          checked={currentConfig.objectTypes.roles}
                          onCheckedChange={() => setCurrentConfig((prev) => ({
                            ...prev,
                            objectTypes: {
                              ...prev.objectTypes,
                              roles: !currentConfig.objectTypes.roles,
                            },
                          }))}
                        />
                        <label className="text-sm font-medium" htmlFor="roles">Roles</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Notifications</h3>
                  <div className="grid gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="notifyFailure" checked={config.notifyOnFailure} />
                      <label className="text-sm font-medium" htmlFor="notifyFailure">Notify on failure</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="notifySuccess" checked={config.notifyOnSuccess} />
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
