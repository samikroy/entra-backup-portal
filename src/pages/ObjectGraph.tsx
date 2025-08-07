import { useCallback, useState } from 'react';
import { ReactFlow, MiniMap, Controls, Background, useNodesState, useEdgesState, Node, Edge, Position } from '@xyflow/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Building, Smartphone, Shield, Settings, Maximize2, Minimize2, Filter } from "lucide-react";
import { getGraphData } from "@/services/mockDataService";
import '@xyflow/react/dist/style.css';

const ObjectGraph = () => {
  const [selectedTenant, setSelectedTenant] = useState("1");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const graphData = getGraphData(selectedTenant);
  const [nodes, setNodes, onNodesChange] = useNodesState(graphData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(graphData.edges);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'user': return '👤';
      case 'group': return '👥';
      case 'application': return '📱';
      case 'policy': return '🛡️';
      case 'servicePrincipal': return '⚙️';
      default: return '📄';
    }
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'user': return '#3b82f6';
      case 'group': return '#10b981';
      case 'application': return '#f59e0b';
      case 'policy': return '#ef4444';
      case 'servicePrincipal': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const nodeTypes = {
    custom: ({ data }: { data: any }) => (
      <div 
        className="glassmorphism rounded-2xl border-2 min-w-[140px] hover:shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer animate-fade-in"
        style={{ 
          borderColor: getNodeColor(data.type),
          background: `linear-gradient(135deg, ${getNodeColor(data.type)}15, ${getNodeColor(data.type)}05)`,
          boxShadow: `0 8px 32px ${getNodeColor(data.type)}20`
        }}
      >
        <div className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="p-2 rounded-xl text-2xl"
              style={{ 
                background: `${getNodeColor(data.type)}20`,
                color: getNodeColor(data.type)
              }}
            >
              {getNodeIcon(data.type)}
            </div>
            <div className="flex-1">
              <div className="font-bold text-sm text-foreground">{data.label}</div>
              <div className="text-xs opacity-70" style={{ color: getNodeColor(data.type) }}>
                {data.type.toUpperCase()}
              </div>
            </div>
          </div>
          {data.isActive !== undefined && (
            <Badge 
              variant={data.isActive ? "default" : "secondary"} 
              className={`text-xs ${data.isActive 
                ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
              } glassmorphism`}
            >
              {data.isActive ? "🟢 Active" : "⚫ Inactive"}
            </Badge>
          )}
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse" 
               style={{ background: getNodeColor(data.type) }}></div>
        </div>
      </div>
    ),
  };

  const filteredNodes = nodes.filter(node => {
    if (selectedFilter === 'all') return true;
    return node.data.type === selectedFilter;
  });

  const filteredEdges = edges.filter(edge => {
    const sourceVisible = filteredNodes.some(node => node.id === edge.source);
    const targetVisible = filteredNodes.some(node => node.id === edge.target);
    return sourceVisible && targetVisible;
  });

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    console.log('Node clicked:', node);
    // Could navigate to object details page
  }, []);

  const nodeStats = nodes.reduce((acc, node) => {
    const type = node.data?.type || 'unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 animate-fade-in">
      <div className="container mx-auto p-6 space-y-8">
        {/* Epic Hero Section */}
        <div className="glassmorphism rounded-3xl p-8 border border-primary/20 shadow-2xl bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Relationship Universe
              </h2>
              <p className="text-muted-foreground text-xl mt-2">
                Explore the interconnected web of your digital ecosystem in real-time
              </p>
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">Neural Network Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <span className="text-sm text-muted-foreground">AI Analysis Running</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="glassmorphism border-primary/30 bg-gradient-to-r from-primary/20 to-accent/20 hover:from-primary/30 hover:to-accent/30 text-lg px-6 py-3"
              >
                {isFullscreen ? <Minimize2 className="h-5 w-5 mr-2" /> : <Maximize2 className="h-5 w-5 mr-2" />}
                {isFullscreen ? 'Exit Immersive Mode' : 'Enter Immersive Mode'}
              </Button>
            </div>
          </div>
        </div>

        {/* Cyberpunk Stats Grid */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="glassmorphism border border-blue-500/30 rounded-2xl shadow-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                  <Users className="h-5 w-5" />
                </div>
                <span className="text-blue-300">Users</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400 animate-pulse">{nodeStats.user || 0}</div>
              <div className="text-xs text-blue-300 mt-1">Active Entities</div>
            </CardContent>
          </Card>
          
          <Card className="glassmorphism border border-green-500/30 rounded-2xl shadow-xl bg-gradient-to-br from-green-500/10 to-green-600/5 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-3">
                <div className="p-2 rounded-xl bg-green-500/20 text-green-400">
                  <Building className="h-5 w-5" />
                </div>
                <span className="text-green-300">Groups</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400 animate-pulse">{nodeStats.group || 0}</div>
              <div className="text-xs text-green-300 mt-1">Active Clusters</div>
            </CardContent>
          </Card>
          
          <Card className="glassmorphism border border-yellow-500/30 rounded-2xl shadow-xl bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-3">
                <div className="p-2 rounded-xl bg-yellow-500/20 text-yellow-400">
                  <Smartphone className="h-5 w-5" />
                </div>
                <span className="text-yellow-300">Applications</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400 animate-pulse">{nodeStats.application || 0}</div>
              <div className="text-xs text-yellow-300 mt-1">Connected Apps</div>
            </CardContent>
          </Card>
          
          <Card className="glassmorphism border border-red-500/30 rounded-2xl shadow-xl bg-gradient-to-br from-red-500/10 to-red-600/5 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-3">
                <div className="p-2 rounded-xl bg-red-500/20 text-red-400">
                  <Shield className="h-5 w-5" />
                </div>
                <span className="text-red-300">Policies</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-400 animate-pulse">{nodeStats.policy || 0}</div>
              <div className="text-xs text-red-300 mt-1">Security Rules</div>
            </CardContent>
          </Card>
        </div>

        {/* Epic Graph Container */}
        <Card className={`glassmorphism border border-primary/20 shadow-2xl ${isFullscreen ? "fixed inset-0 z-50 rounded-none bg-black/95" : "rounded-3xl"}`}>
          <CardHeader className={`${isFullscreen ? "bg-black/80" : "bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10"} border-b border-primary/20 ${isFullscreen ? "rounded-none" : "rounded-t-3xl"}`}>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Neural Network Visualization
                </CardTitle>
                <CardDescription className="text-lg">
                  Immersive 3D-style relationship mapping • Real-time data streams
                </CardDescription>
              </div>
              <div className="flex gap-3">
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-48 glassmorphism border-primary/30 bg-primary/10">
                    <Filter className="h-5 w-5 mr-2 text-primary" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glassmorphism border-primary/30">
                    <SelectItem value="all">🌐 All Objects</SelectItem>
                    <SelectItem value="user">👤 Users Only</SelectItem>
                    <SelectItem value="group">👥 Groups Only</SelectItem>
                    <SelectItem value="application">📱 Applications Only</SelectItem>
                    <SelectItem value="policy">🛡️ Policies Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className={isFullscreen ? "h-screen" : "h-[700px]"} style={{
              background: isFullscreen 
                ? 'radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, rgba(0, 0, 0, 0.8) 70%)'
                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)'
            }}>
              <ReactFlow
                nodes={filteredNodes.map(node => ({ ...node, type: 'custom' }))}
                edges={filteredEdges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                fitView
                attributionPosition="bottom-left"
                className="rounded-b-3xl"
                style={{
                  background: 'transparent'
                }}
              >
                <Background 
                  gap={20} 
                  size={2} 
                  color={isFullscreen ? "rgba(59, 130, 246, 0.3)" : "rgba(59, 130, 246, 0.2)"}
                />
                <Controls 
                  className="glassmorphism border border-primary/30 rounded-xl" 
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <MiniMap 
                  nodeColor={(node) => getNodeColor((node.data as any)?.type || 'default')}
                  nodeStrokeWidth={3}
                  zoomable
                  pannable
                  className="glassmorphism border border-primary/30 rounded-xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                />
              </ReactFlow>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="legend" className="w-full">
          <TabsList className="glassmorphism border border-primary/10 rounded-2xl p-2">
            <TabsTrigger value="legend" className="data-[state=active]:bg-primary/20">🎨 Legend</TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-primary/20">📊 Analytics</TabsTrigger>
            <TabsTrigger value="controls" className="data-[state=active]:bg-primary/20">🎮 Controls</TabsTrigger>
          </TabsList>
        
        <TabsContent value="legend">
          <Card className="glassmorphism border border-primary/20 rounded-3xl shadow-xl">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-primary/20 rounded-t-3xl">
              <CardTitle className="text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Neural Network Legend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Node Types</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: getNodeColor('user') }}></div>
                      <span className="text-sm">👤 Users</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: getNodeColor('group') }}></div>
                      <span className="text-sm">👥 Groups</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: getNodeColor('application') }}></div>
                      <span className="text-sm">📱 Applications</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: getNodeColor('policy') }}></div>
                      <span className="text-sm">🛡️ Policies</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Relationships</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-0.5 bg-gray-400"></div>
                      <span className="text-sm">Member of</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-0.5 bg-blue-400"></div>
                      <span className="text-sm">Assigned to</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-0.5 bg-green-400"></div>
                      <span className="text-sm">Has access to</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Graph Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Nodes:</span>
                    <span className="font-medium">{filteredNodes.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Edges:</span>
                    <span className="font-medium">{filteredEdges.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Density:</span>
                    <span className="font-medium">
                      {filteredNodes.length > 1 
                        ? ((filteredEdges.length / (filteredNodes.length * (filteredNodes.length - 1))) * 100).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Active Objects:</span>
                    <span className="font-medium">
                      {filteredNodes.filter(n => n.data.isActive).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inactive Objects:</span>
                    <span className="font-medium">
                      {filteredNodes.filter(n => !n.data.isActive).length}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="controls">
          <Card>
            <CardHeader>
              <CardTitle>Graph Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div><strong>Pan:</strong> Click and drag on empty space</div>
                <div><strong>Zoom:</strong> Mouse wheel or pinch gesture</div>
                <div><strong>Select Node:</strong> Click on any node</div>
                <div><strong>Fit View:</strong> Use the fit view button in controls</div>
                <div><strong>Reset:</strong> Double-click on empty space</div>
                <div><strong>Minimap:</strong> Click and drag in the minimap to navigate</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};

export default ObjectGraph;