import { useCallback, useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Building, Smartphone, Shield, Settings, Maximize2, Minimize2, Filter } from "lucide-react";
import { getGraphData } from "@/services/mockDataService";

interface GraphNode {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: string;
  label: string;
  isActive?: boolean;
  radius: number;
}

interface GraphEdge {
  source: string;
  target: string;
  type: string;
}

const ObjectGraph = () => {
  const [selectedTenant, setSelectedTenant] = useState("1");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const graphData = getGraphData(selectedTenant);
  
  // Convert graph data to force-directed format
  const [nodes, setNodes] = useState<GraphNode[]>(() => {
    return graphData.nodes.map((node, index) => {
      const nodeX = Math.random() * 800;
      const nodeY = Math.random() * 600;
      return {
        id: node.id,
        x: nodeX,
        y: nodeY,
        vx: 0,
        vy: 0,
        type: node.data.type,
        label: node.data.label,
        isActive: node.data.isActive,
        radius: getNodeRadius(node.data.type)
      };
    });
  });
  
  const [edges] = useState<GraphEdge[]>(() => {
    return graphData.edges.map(edge => ({
      source: edge.source,
      target: edge.target,
      type: edge.type || 'default'
    }));
  });

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

  const getNodeRadius = (type: string) => {
    switch (type) {
      case 'user': return 25;
      case 'group': return 35;
      case 'application': return 30;
      case 'policy': return 20;
      case 'servicePrincipal': return 28;
      default: return 25;
    }
  };

  // Force-directed physics simulation
  const applyForces = (nodes: GraphNode[], edges: GraphEdge[]) => {
    const width = canvasRef.current?.width || 800;
    const height = canvasRef.current?.height || 600;
    
    // Reset forces
    nodes.forEach(node => {
      node.vx *= 0.8; // Damping
      node.vy *= 0.8;
    });

    // Repulsion between nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
          const force = 800 / (distance * distance);
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;
          
          nodes[i].vx -= fx;
          nodes[i].vy -= fy;
          nodes[j].vx += fx;
          nodes[j].vy += fy;
        }
      }
    }

    // Attraction along edges
    edges.forEach(edge => {
      const source = nodes.find(n => n.id === edge.source);
      const target = nodes.find(n => n.id === edge.target);
      
      if (source && target) {
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
          const force = distance * 0.001;
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;
          
          source.vx += fx;
          source.vy += fy;
          target.vx -= fx;
          target.vy -= fy;
        }
      }
    });

    // Center attraction
    const centerX = width / 2;
    const centerY = height / 2;
    nodes.forEach(node => {
      const dx = centerX - node.x;
      const dy = centerY - node.y;
      node.vx += dx * 0.0001;
      node.vy += dy * 0.0001;
    });

    // Update positions
    nodes.forEach(node => {
      if (draggedNode !== node.id) {
        node.x += node.vx;
        node.y += node.vy;
        
        // Boundary constraints
        node.x = Math.max(node.radius, Math.min(width - node.radius, node.x));
        node.y = Math.max(node.radius, Math.min(height - node.radius, node.y));
      }
    });
  };

  // Render the graph
  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply dark cyberpunk background
    const gradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, canvas.width / 2
    );
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid pattern
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    const filteredNodes = nodes.filter(node => {
      if (selectedFilter === 'all') return true;
      return node.type === selectedFilter;
    });

    const filteredEdges = edges.filter(edge => {
      const sourceVisible = filteredNodes.some(node => node.id === edge.source);
      const targetVisible = filteredNodes.some(node => node.id === edge.target);
      return sourceVisible && targetVisible;
    });

    // Draw edges with glow effect
    filteredEdges.forEach(edge => {
      const source = filteredNodes.find(n => n.id === edge.source);
      const target = filteredNodes.find(n => n.id === edge.target);
      
      if (source && target) {
        // Glow effect
        ctx.shadowColor = getNodeColor(source.type);
        ctx.shadowBlur = 10;
        ctx.strokeStyle = getNodeColor(source.type);
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6;
        
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
        
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }
    });

    // Draw nodes with enhanced cyberpunk styling
    filteredNodes.forEach(node => {
      const isHovered = hoveredNode === node.id;
      const scale = isHovered ? 1.2 : 1;
      const radius = node.radius * scale;
      
      // Outer glow
      const glowGradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 2);
      glowGradient.addColorStop(0, getNodeColor(node.type) + '40');
      glowGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGradient;
      ctx.fillRect(node.x - radius * 2, node.y - radius * 2, radius * 4, radius * 4);
      
      // Main node body
      const nodeGradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius);
      nodeGradient.addColorStop(0, getNodeColor(node.type) + '80');
      nodeGradient.addColorStop(0.7, getNodeColor(node.type) + '40');
      nodeGradient.addColorStop(1, getNodeColor(node.type) + '20');
      
      ctx.fillStyle = nodeGradient;
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      ctx.fill();
      
      // Border
      ctx.strokeStyle = getNodeColor(node.type);
      ctx.lineWidth = isHovered ? 3 : 2;
      ctx.stroke();
      
      // Pulsing ring for active nodes
      if (node.isActive) {
        const pulseRadius = radius + 5 + Math.sin(Date.now() * 0.005) * 3;
        ctx.strokeStyle = getNodeColor(node.type) + '60';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseRadius, 0, 2 * Math.PI);
        ctx.stroke();
      }
      
      // Icon
      ctx.fillStyle = '#ffffff';
      ctx.font = `${radius * 0.8}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(getNodeIcon(node.type), node.x, node.y);
      
      // Label on hover
      if (isHovered) {
        const labelY = node.y + radius + 20;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(node.x - 40, labelY - 10, 80, 20);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.fillText(node.label, node.x, labelY);
        
        ctx.fillStyle = getNodeColor(node.type);
        ctx.font = '10px Arial';
        ctx.fillText(node.type.toUpperCase(), node.x, labelY + 15);
      }
    });
  };

  // Animation loop
  const animate = () => {
    applyForces(nodes, edges);
    render();
    animationRef.current = requestAnimationFrame(animate);
  };

  // Mouse interaction handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    // Check for node hover
    const filteredNodes = nodes.filter(node => {
      if (selectedFilter === 'all') return true;
      return node.type === selectedFilter;
    });

    const hoveredNode = filteredNodes.find(node => {
      const dx = x - node.x;
      const dy = y - node.y;
      return Math.sqrt(dx * dx + dy * dy) < node.radius;
    });

    setHoveredNode(hoveredNode?.id || null);
    canvas.style.cursor = hoveredNode ? 'pointer' : 'default';

    // Handle dragging
    if (draggedNode) {
      const node = nodes.find(n => n.id === draggedNode);
      if (node) {
        node.x = x;
        node.y = y;
        node.vx = 0;
        node.vy = 0;
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const filteredNodes = nodes.filter(node => {
      if (selectedFilter === 'all') return true;
      return node.type === selectedFilter;
    });

    const clickedNode = filteredNodes.find(node => {
      const dx = x - node.x;
      const dy = y - node.y;
      return Math.sqrt(dx * dx + dy * dy) < node.radius;
    });

    if (clickedNode) {
      setDraggedNode(clickedNode.id);
    }
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  // Initialize canvas and start animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Update animation when filter changes
  useEffect(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame(animate);
  }, [selectedFilter]);

  const nodeStats = nodes.reduce((acc, node) => {
    const type = node.type || 'unknown';
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
              <canvas
                ref={canvasRef}
                className="w-full h-full rounded-b-3xl cursor-pointer"
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={() => {
                  setHoveredNode(null);
                  setDraggedNode(null);
                }}
              />
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
          <Card className="glassmorphism border border-primary/20 rounded-3xl shadow-xl">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-primary/20 rounded-t-3xl">
              <CardTitle className="text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Force-Directed Graph Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Nodes:</span>
                    <span className="font-medium text-primary">{nodes.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Edges:</span>
                    <span className="font-medium text-primary">{edges.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Graph Density:</span>
                    <span className="font-medium text-primary">
                       {nodes.length > 1
                        ? Math.round((edges.length / (nodes.length * (nodes.length - 1) / 2)) * 100)
                        : 0}%
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Active Objects:</span>
                    <span className="font-medium text-green-400">
                      {nodes.filter(n => n.isActive).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inactive Objects:</span>
                    <span className="font-medium text-red-400">
                      {nodes.filter(n => !n.isActive).length}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="controls">
          <Card className="glassmorphism border border-primary/20 rounded-3xl shadow-xl">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-primary/20 rounded-t-3xl">
              <CardTitle className="text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Force-Directed Interaction Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3 text-lg flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    Real-Time Physics Navigation
                  </h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                      <span>Drag any node to manipulate the force field</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                      <span>Hover over nodes for enhanced details and glow effects</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                      <span>Active objects pulse with energy rings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                      <span>Filter by object type for focused analysis</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3 text-lg flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    Advanced Force Simulation
                  </h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                      <span>Electrostatic repulsion prevents node clustering</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                      <span>Spring forces along relationships maintain structure</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                      <span>Gravitational center force creates stability</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                      <span>Velocity damping creates smooth, organic movement</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 border border-primary/20">
                  <h5 className="font-medium mb-2 text-primary">Neural Network Visualization</h5>
                  <p className="text-sm text-muted-foreground">
                    This force-directed graph simulates Entra ID object relationships as a living, breathing neural network. 
                    Each node represents an identity object with realistic physics interactions, creating an intuitive 
                    visualization of your organization's digital ecosystem.
                  </p>
                </div>
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