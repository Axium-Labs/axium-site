/**
 * AgentGraph — one task, delegated to parallel subagents, with tool
 * rounds and a memory write. Shows how AX executes rather than lists
 * features. Layout is a hand-placed SVG coordinate grid (viewBox 0 0 760 500).
 */

export type GraphNodeKind = 'input' | 'runtime' | 'child' | 'tool' | 'memory';

export interface GraphNode {
  id: string;
  label: string;
  sub: string;
  x: number;
  y: number;
  kind: GraphNodeKind;
  /** step at which this node turns active */
  activeStep: number;
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  /** step at which this edge pulses */
  activeStep: number;
}

export interface GraphStep {
  id: number;
  name: string;
  edges: string[];
}

export const GRAPH_NODES: GraphNode[] = [
  { id: 'task', label: 'task', sub: '"ship the dry-run flag"', x: 380, y: 46, kind: 'input', activeStep: 0 },
  { id: 'runtime', label: 'AX runtime', sub: 'agent loop · budget · events', x: 380, y: 148, kind: 'runtime', activeStep: 0 },
  { id: 'child1', label: 'sub · reviewer', sub: 'isolated workspace', x: 175, y: 260, kind: 'child', activeStep: 1 },
  { id: 'child2', label: 'sub · impl', sub: 'isolated workspace', x: 585, y: 260, kind: 'child', activeStep: 1 },
  { id: 'search', label: 'search', sub: 'find "dry.run"', x: 100, y: 378, kind: 'tool', activeStep: 2 },
  { id: 'read', label: 'read_file', sub: 'deploy.ps1', x: 268, y: 378, kind: 'tool', activeStep: 2 },
  { id: 'patch', label: 'patch', sub: 'src/scripts/deploy.ps1', x: 448, y: 378, kind: 'tool', activeStep: 3 },
  { id: 'shell', label: 'shell', sub: 'tests\\smoke.ps1', x: 616, y: 378, kind: 'tool', activeStep: 3 },
  { id: 'memory', label: 'memory', sub: 'project · write fact', x: 380, y: 462, kind: 'memory', activeStep: 4 },
];

export const GRAPH_EDGES: GraphEdge[] = [
  { id: 'e-task', from: 'task', to: 'runtime', activeStep: 0 },
  { id: 'e-c1', from: 'runtime', to: 'child1', activeStep: 1 },
  { id: 'e-c2', from: 'runtime', to: 'child2', activeStep: 1 },
  { id: 'e-s', from: 'child1', to: 'search', activeStep: 2 },
  { id: 'e-r', from: 'child1', to: 'read', activeStep: 2 },
  { id: 'e-p', from: 'child2', to: 'patch', activeStep: 3 },
  { id: 'e-sh', from: 'child2', to: 'shell', activeStep: 3 },
  { id: 'e-m1', from: 'child1', to: 'memory', activeStep: 4 },
  { id: 'e-m2', from: 'child2', to: 'memory', activeStep: 4 },
];

export const GRAPH_STEPS: GraphStep[] = [
  { id: 0, name: 'ingest', edges: ['e-task'] },
  { id: 1, name: 'delegate · parallel', edges: ['e-c1', 'e-c2'] },
  { id: 2, name: 'tools · round 1', edges: ['e-s', 'e-r'] },
  { id: 3, name: 'tools · round 2', edges: ['e-p', 'e-sh'] },
  { id: 4, name: 'persist', edges: ['e-m1', 'e-m2'] },
  { id: 5, name: 'done', edges: [] },
];
