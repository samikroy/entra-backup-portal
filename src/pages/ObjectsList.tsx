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
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 animate-fade-in">
      <div className="container mx-auto p-6 space-y-8">
        {/* Hero Section with Glassmorphism */}
        <div className="glassmorphism rounded-3xl p-8 border border-primary/20 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Objects Database
              </h2>
              <p className="text-muted-foreground text-lg mt-2">
                Browse and manage backed up objects with AI-powered insights
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Live Sync Active</span>
            </div>
          </div>
        </div>

        {/* Enhanced Search */}
        <div className="glassmorphism rounded-2xl p-6 border border-primary/10">
          <div className="relative">
            <Search className="absolute left-4 top-4 h-5 w-5 text-primary/70" />
            <Input
              placeholder="Search across all objects with AI-powered search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 bg-background/80 border-primary/20 text-lg glassmorphism-light"
            />
          </div>
        </div>

        <Tabs value={type} className="w-full">
          <TabsList className="grid w-full grid-cols-5 glassmorphism border border-primary/10 rounded-2xl p-2">
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

        <TabsContent value={type} className="mt-8">
          <Card className="glassmorphism border border-primary/20 rounded-3xl shadow-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-b border-primary/20">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 rounded-xl bg-primary/20 text-primary">
                  {getIcon(type)}
                </div>
                {tabs.find(t => t.value === type)?.label || "Objects"}
              </CardTitle>
              <CardDescription className="text-lg">
                {filteredObjects.length} {type} found • Real-time data
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow className="border-primary/20 hover:bg-primary/5">
                      <TableHead className="text-primary font-semibold">Name</TableHead>
                      <TableHead className="text-primary font-semibold">Type</TableHead>
                      <TableHead className="text-primary font-semibold">Status</TableHead>
                      <TableHead className="text-primary font-semibold">Last Modified</TableHead>
                      <TableHead className="text-primary font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredObjects.map((obj: any, index: number) => (
                      <TableRow 
                        key={obj.id} 
                        className="border-primary/10 hover:bg-primary/5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                            <div className="flex flex-col">
                              <span className="font-medium text-foreground">{obj.name || obj.displayName}</span>
                              {obj.email && (
                                <span className="text-sm text-muted-foreground">{obj.email}</span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="glassmorphism border-primary/30 bg-primary/10">
                            {obj.objectType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={obj.isActive ? "default" : "secondary"}
                            className={obj.isActive ? "bg-green-500/20 text-green-700 border-green-500/30" : ""}
                          >
                            {obj.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(obj.lastModified)}</TableCell>
                        <TableCell>
                          <Link
                            to={`/objects/${obj.id}?tenant=${tenantId}&type=${type}`}
                            className="inline-flex items-center px-3 py-1 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 text-primary hover:from-primary/30 hover:to-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                          >
                            View Details
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};

export default ObjectsList;