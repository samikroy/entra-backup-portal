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
        className="px-3 py-2 shadow-lg rounded-lg border-2 bg-white min-w-[120px]"
        style={{ borderColor: getNodeColor(data.type) }}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{getNodeIcon(data.type)}</span>
          <div className="flex-1">
            <div className="font-medium text-sm">{data.label}</div>
            <div className="text-xs text-gray-500">{data.type}</div>
          </div>
        </div>
        {data.isActive !== undefined && (
          <Badge 
            variant={data.isActive ? "default" : "secondary"} 
            className="text-xs mt-1"
          >
            {data.isActive ? "Active" : "Inactive"}
          </Badge>
        )}
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Object Relationships</h2>
          <p className="text-muted-foreground">
            Interactive graph showing relationships between backed up objects.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFullscreen(!isFullscreen)}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nodeStats.user || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Building className="h-4 w-4 text-green-500" />
              Groups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nodeStats.group || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-yellow-500" />
              Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nodeStats.application || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="h-4 w-4 text-red-500" />
              Policies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nodeStats.policy || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card className={isFullscreen ? "fixed inset-0 z-50 rounded-none" : ""}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Object Relationship Graph</CardTitle>
              <CardDescription>
                Drag to pan, scroll to zoom, click nodes for details
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Objects</SelectItem>
                  <SelectItem value="user">Users Only</SelectItem>
                  <SelectItem value="group">Groups Only</SelectItem>
                  <SelectItem value="application">Applications Only</SelectItem>
                  <SelectItem value="policy">Policies Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className={isFullscreen ? "h-screen" : "h-[600px]"}>
            <ReactFlow
              nodes={filteredNodes.map(node => ({ ...node, type: 'custom' }))}
              edges={filteredEdges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              attributionPosition="bottom-left"
              className="bg-gray-50"
            >
              <Background />
              <Controls />
              <MiniMap 
                nodeColor={(node) => getNodeColor((node.data as any)?.type || 'default')}
                nodeStrokeWidth={3}
                zoomable
                pannable
              />
            </ReactFlow>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="legend" className="w-full">
        <TabsList>
          <TabsTrigger value="legend">Legend</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
        </TabsList>
        
        <TabsContent value="legend">
          <Card>
            <CardHeader>
              <CardTitle>Graph Legend</CardTitle>
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
  );
};

export default ObjectGraph;