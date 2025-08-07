import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Plus, Minus, RotateCcw, GitCompare } from "lucide-react";
import { getBackupDifferences } from "@/services/mockDataService";

const BackupDifferences = () => {
  const [searchParams] = useSearchParams();
  const objectId = searchParams.get("object");
  const tenantId = searchParams.get("tenant") || "1";
  
  const [fromBackup, setFromBackup] = useState("");
  const [toBackup, setToBackup] = useState("");
  
  const differences = getBackupDifferences(objectId || "", fromBackup, toBackup);
  
  const availableBackups = [
    { id: "backup_1", date: "2024-01-15 14:30", label: "Latest Backup" },
    { id: "backup_2", date: "2024-01-14 14:30", label: "Previous Backup" },
    { id: "backup_3", date: "2024-01-13 14:30", label: "3 days ago" },
    { id: "backup_4", date: "2024-01-12 14:30", label: "4 days ago" },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'added': return <Plus className="h-4 w-4 text-green-600" />;
      case 'removed': return <Minus className="h-4 w-4 text-red-600" />;
      case 'modified': return <RotateCcw className="h-4 w-4 text-blue-600" />;
      default: return <GitCompare className="h-4 w-4" />;
    }
  };

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'added': return 'border-l-green-500 bg-green-50';
      case 'removed': return 'border-l-red-500 bg-red-50';
      case 'modified': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 animate-fade-in">
      <div className="container mx-auto p-6 space-y-8">
        {/* Navigation */}
        <div className="glassmorphism rounded-2xl p-4 border border-primary/20">
          <Link to={`/objects/${objectId}?tenant=${tenantId}`}>
            <Button variant="outline" size="sm" className="glassmorphism border-primary/30 hover:bg-primary/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Object
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="glassmorphism rounded-3xl p-8 border border-primary/20 shadow-2xl">
          <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Backup Differences
          </h2>
          <p className="text-muted-foreground text-lg mt-2">
            Compare changes between different backup versions with AI-powered analysis.
          </p>
        </div>

        <Card className="glassmorphism border border-primary/20 rounded-3xl shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-b border-primary/20 rounded-t-3xl">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 rounded-xl bg-primary/20 text-primary">
                <GitCompare className="h-6 w-6" />
              </div>
              Compare Backups
            </CardTitle>
            <CardDescription className="text-lg">
              Select two backup versions to see what changed between them.
            </CardDescription>
          </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">From Backup</label>
              <Select value={fromBackup} onValueChange={setFromBackup}>
                <SelectTrigger>
                  <SelectValue placeholder="Select starting backup" />
                </SelectTrigger>
                <SelectContent>
                  {availableBackups.map((backup) => (
                    <SelectItem key={backup.id} value={backup.id}>
                      <div className="flex flex-col">
                        <span>{backup.label}</span>
                        <span className="text-xs text-muted-foreground">{formatDate(backup.date)}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">To Backup</label>
              <Select value={toBackup} onValueChange={setToBackup}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ending backup" />
                </SelectTrigger>
                <SelectContent>
                  {availableBackups.map((backup) => (
                    <SelectItem key={backup.id} value={backup.id}>
                      <div className="flex flex-col">
                        <span>{backup.label}</span>
                        <span className="text-xs text-muted-foreground">{formatDate(backup.date)}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {differences && fromBackup && toBackup && (
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="glassmorphism border border-primary/10 rounded-2xl p-2">
            <TabsTrigger value="summary" className="data-[state=active]:bg-primary/20">Summary</TabsTrigger>
            <TabsTrigger value="details" className="data-[state=active]:bg-primary/20">Detailed Changes</TabsTrigger>
            <TabsTrigger value="raw" className="data-[state=active]:bg-primary/20">Raw Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="glassmorphism border border-green-500/30 rounded-2xl shadow-xl bg-gradient-to-br from-green-500/10 to-green-600/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl text-green-600 flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Added
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-700">{differences.summary.added}</div>
                  <p className="text-sm text-muted-foreground mt-1">new attributes</p>
                </CardContent>
              </Card>
              
              <Card className="glassmorphism border border-blue-500/30 rounded-2xl shadow-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl text-blue-600 flex items-center gap-2">
                    <RotateCcw className="h-5 w-5" />
                    Modified
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-700">{differences.summary.modified}</div>
                  <p className="text-sm text-muted-foreground mt-1">changed attributes</p>
                </CardContent>
              </Card>
              
              <Card className="glassmorphism border border-red-500/30 rounded-2xl shadow-xl bg-gradient-to-br from-red-500/10 to-red-600/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl text-red-600 flex items-center gap-2">
                    <Minus className="h-5 w-5" />
                    Removed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-700">{differences.summary.removed}</div>
                  <p className="text-sm text-muted-foreground mt-1">deleted attributes</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="space-y-4">
            <div className="space-y-3">
              {differences.changes.map((change, index) => (
                <Card key={index} className={`border-l-4 ${getChangeColor(change.type)}`}>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      {getChangeIcon(change.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{change.field}</span>
                          <Badge variant="outline" className="text-xs">
                            {change.type}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-sm">
                          {change.type === 'modified' && (
                            <>
                              <div className="flex items-center gap-2">
                                <span className="text-red-600">-</span>
                                <code className="bg-red-100 px-1 rounded text-xs">{change.oldValue}</code>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-green-600">+</span>
                                <code className="bg-green-100 px-1 rounded text-xs">{change.newValue}</code>
                              </div>
                            </>
                          )}
                          
                          {change.type === 'added' && (
                            <div className="flex items-center gap-2">
                              <span className="text-green-600">+</span>
                              <code className="bg-green-100 px-1 rounded text-xs">{change.newValue}</code>
                            </div>
                          )}
                          
                          {change.type === 'removed' && (
                            <div className="flex items-center gap-2">
                              <span className="text-red-600">-</span>
                              <code className="bg-red-100 px-1 rounded text-xs">{change.oldValue}</code>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(change.timestamp)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="raw" className="space-y-4">
            <Card>
              <CardContent className="pt-4">
                <pre className="text-sm bg-muted p-4 rounded-lg overflow-auto">
                  {JSON.stringify(differences, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
      </div>
    </div>
  );
};

export default BackupDifferences;