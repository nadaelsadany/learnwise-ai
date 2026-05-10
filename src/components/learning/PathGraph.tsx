import React, { useCallback, useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  Edge, 
  Node, 
  Position,
  Handle,
  MarkerType,
  useNodesState,
  useEdgesState,
  ConnectionLineType
} from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Lock, Sparkles, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// Custom Node Component
const CourseNode = ({ data }: { data: any }) => {
  const { title, level, duration, status, isRecommended, onClick } = data;
  
  const statusStyles = {
    completed: "bg-success/10 border-success/50 text-success shadow-sm",
    "in-progress": "bg-primary/5 border-primary text-primary shadow-glow-primary ring-1 ring-primary/20",
    available: "bg-card border-border hover:border-primary cursor-pointer hover:shadow-md",
    locked: "bg-muted/30 border-border/50 text-muted-foreground opacity-50 grayscale",
  };

  return (
    <div 
      onClick={() => status !== 'locked' && onClick?.()}
      className={cn(
        "px-4 py-4 rounded-2xl border-2 transition-all w-64 group relative",
        statusStyles[status as keyof typeof statusStyles],
        isRecommended && "ring-2 ring-accent ring-offset-2 animate-pulse-subtle"
      )}
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />
      
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="text-[9px] uppercase tracking-wider font-bold">
            {level}
          </Badge>
          {status === 'completed' ? (
            <CheckCircle2 className="w-4 h-4 text-success" />
          ) : status === 'locked' ? (
            <Lock className="w-3.5 h-3.5 text-muted-foreground" />
          ) : isRecommended ? (
            <Sparkles className="w-4 h-4 text-accent animate-bounce" />
          ) : null}
        </div>
        
        <h4 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors">
          {title}
        </h4>
        
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{duration}</span>
          </div>
          {status === 'available' && (
            <span className="text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              Start →
            </span>
          )}
        </div>
      </div>

      {isRecommended && (
        <div className="absolute -top-3 -right-3 px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-[9px] font-black shadow-lg">
          NEXT
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
};

const nodeTypes = {
  courseNode: CourseNode,
};

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  const nodeWidth = 280;
  const nodeHeight = 120;
  
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
  });

  return { nodes, edges };
};

interface PathGraphProps {
  pathName: string;
  onBack: () => void;
  courses: any[];
  onCourseClick?: (courseId: string) => void;
}

export const PathGraph = ({ pathName, onBack, courses, onCourseClick }: PathGraphProps) => {
  // Mock logic to determine status and recommendations
  const initialNodes: Node[] = courses.map((course, index) => ({
    id: course.id,
    type: 'courseNode',
    data: { 
      ...course,
      onClick: () => onCourseClick?.(course.id)
    },
    position: { x: 0, y: 0 }, // Positioned by Dagre
  }));

  const initialEdges: Edge[] = courses.flatMap(course => 
    (course.prerequisites || []).map((prereqId: string) => ({
      id: `e-${prereqId}-${course.id}`,
      source: prereqId,
      target: course.id,
      animated: courses.find(c => c.id === prereqId)?.status === 'in-progress',
      style: { stroke: '#94a3b8', strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#94a3b8',
      },
    }))
  );

  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(
    () => getLayoutedElements(initialNodes, initialEdges),
    [courses]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  return (
    <div className="h-[600px] w-full bg-muted/20 rounded-3xl border border-border/50 overflow-hidden relative group/graph">
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-1">
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={onBack}
          className="w-fit gap-2 bg-background/80 backdrop-blur-sm border-border/50 shadow-soft"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Learning Hub
        </Button>
        <h2 className="text-xl font-bold mt-2 ml-1">{pathName}</h2>
      </div>

      <div className="absolute top-6 right-6 z-10 flex gap-2">
        <div className="flex items-center gap-4 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-soft text-[10px] font-bold uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-success" /> 
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-primary" /> 
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-muted border" /> 
            <span>Locked</span>
          </div>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
        className="bg-dot-pattern"
      >
        <Background color="#94a3b8" gap={20} size={1} />
        <Controls showInteractive={false} className="bg-background border-border/50 shadow-soft rounded-lg overflow-hidden" />
      </ReactFlow>

      <style dangerouslySetInnerHTML={{ __html: `
        .bg-dot-pattern {
          background-image: radial-gradient(hsl(var(--muted-foreground) / 0.1) 1px, transparent 0);
          background-size: 24px 24px;
        }
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.02); }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 3s infinite ease-in-out;
        }
      `}} />
    </div>
  );
};
