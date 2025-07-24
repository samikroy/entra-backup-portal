import { useParams, useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, User, Mail, Building, Shield, Activity } from "lucide-react";
import { getObjectDetails, getBackupHistory } from "@/services/mockDataService";

const ObjectDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const tenantId = searchParams.get("tenant") || "1";
  const type = searchParams.get("type") || "users";
  
  if (!id) return <div>Object not found</div>;
  
  const object = getObjectDetails(id, type);
  const backupHistory = getBackupHistory().filter(backup => 
    backup.tenantId === tenantId
  );

  if (!object) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to={`/objects?tenant=${tenantId}&type=${type}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Objects
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="p-6">
            <p>Object not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to={`/objects?tenant=${tenantId}&type=${type}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Objects
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {object.name || object.displayName}
                </CardTitle>
                <CardDescription>{object.objectType}</CardDescription>
              </div>
              <Badge variant={object.isActive ? "default" : "secondary"}>
                {object.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="details" className="w-full">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Object ID</label>
                      <p className="text-sm font-mono">{object.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Type</label>
                      <p className="text-sm">{object.objectType}</p>
                    </div>
                  </div>
                  
                  {object.email && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        Email
                      </label>
                      <p className="text-sm">{object.email}</p>
                    </div>
                  )}
                  
                  {object.department && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        Department
                      </label>
                      <p className="text-sm">{object.department}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Created
                      </label>
                      <p className="text-sm">{formatDate(object.createdDate)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        Last Modified
                      </label>
                      <p className="text-sm">{formatDate(object.lastModified)}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="permissions" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Assigned Roles
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {object.roles?.map((role: string) => (
                      <Badge key={role} variant="outline">{role}</Badge>
                    )) || <p className="text-sm text-muted-foreground">No roles assigned</p>}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Group Memberships</label>
                  <div className="flex flex-wrap gap-2">
                    {object.groups?.map((group: string) => (
                      <Badge key={group} variant="secondary">{group}</Badge>
                    )) || <p className="text-sm text-muted-foreground">No group memberships</p>}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="space-y-4">
                <div className="space-y-3">
                  {backupHistory.slice(0, 5).map((backup) => (
                    <div key={backup.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Backup #{backup.id}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(backup.timestamp)}</p>
                      </div>
                      <Badge variant={backup.status === 'completed' ? 'default' : backup.status === 'failed' ? 'destructive' : 'secondary'}>
                        {backup.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">
                <Link to={`/backup-diff?object=${id}&tenant=${tenantId}`}>
                  View Backup Differences
                </Link>
              </Button>
              <Button className="w-full" variant="outline">
                Export Object Data
              </Button>
              <Button className="w-full" variant="outline">
                View in Graph
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Backup Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total Backups</span>
                  <span className="text-sm font-medium">{backupHistory.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Last Backup</span>
                  <span className="text-sm font-medium">
                    {backupHistory[0] ? formatDate(backupHistory[0].timestamp) : 'Never'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Status</span>
                  <Badge variant={object.isActive ? "default" : "secondary"} className="text-xs">
                    {object.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ObjectDetails;