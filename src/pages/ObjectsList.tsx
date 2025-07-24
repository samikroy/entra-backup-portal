import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Users, Building, Smartphone, Shield, Settings } from "lucide-react";
import { getObjectsList } from "@/services/mockDataService";

const ObjectsList = () => {
  const [searchParams] = useSearchParams();
  const tenantId = searchParams.get("tenant") || "1";
  const type = searchParams.get("type") || "users";
  
  const [searchTerm, setSearchTerm] = useState("");
  
  const objectsData = getObjectsList(tenantId);
  
  const filteredObjects = objectsData[type as keyof typeof objectsData]?.filter((obj: any) =>
    obj.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    obj.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    obj.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getIcon = (objectType: string) => {
    switch (objectType) {
      case "users": return <Users className="h-4 w-4" />;
      case "groups": return <Building className="h-4 w-4" />;
      case "applications": return <Smartphone className="h-4 w-4" />;
      case "policies": return <Shield className="h-4 w-4" />;
      case "servicePrincipals": return <Settings className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const tabs = [
    { value: "users", label: "Users", count: objectsData.users?.length || 0 },
    { value: "groups", label: "Groups", count: objectsData.groups?.length || 0 },
    { value: "applications", label: "Applications", count: objectsData.applications?.length || 0 },
    { value: "policies", label: "Policies", count: objectsData.policies?.length || 0 },
    { value: "servicePrincipals", label: "Service Principals", count: objectsData.servicePrincipals?.length || 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Objects</h2>
        <p className="text-muted-foreground">
          Browse and manage backed up objects for this tenant.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search objects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs value={type} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} asChild>
              <Link to={`/objects?tenant=${tenantId}&type=${tab.value}`} className="flex items-center gap-2">
                {getIcon(tab.value)}
                {tab.label}
                <Badge variant="secondary" className="ml-1">
                  {tab.count}
                </Badge>
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={type} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getIcon(type)}
                {tabs.find(t => t.value === type)?.label || "Objects"}
              </CardTitle>
              <CardDescription>
                {filteredObjects.length} {type} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Modified</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredObjects.map((obj: any) => (
                    <TableRow key={obj.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{obj.name || obj.displayName}</span>
                          {obj.email && (
                            <span className="text-sm text-muted-foreground">{obj.email}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{obj.objectType}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={obj.isActive ? "default" : "secondary"}
                        >
                          {obj.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(obj.lastModified)}</TableCell>
                      <TableCell>
                        <Link
                          to={`/objects/${obj.id}?tenant=${tenantId}&type=${type}`}
                          className="text-primary hover:underline"
                        >
                          View Details
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ObjectsList;