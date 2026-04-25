import React, { useCallback, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  Palette,
  BarChart3,
  Building2,
  Sparkles,
  UserRound,
  BriefcaseBusiness,
  HelpCircle,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import "./App.css";

const GITHUB_BASE =
  "https://github.com/PolR18/spring-petclinic-microservices-main/blob/main";

const ROLE_CONFIG = {
  accountant: {
    name: "Laura",
    label: "Accountant",
    icon: BriefcaseBusiness,
    color: "#4ade80",
    intro: "No-code finance onboarding",
  },
  designer: {
    name: "Sofia",
    label: "Designer",
    icon: Palette,
    color: "#c084fc",
    intro: "Creative product onboarding",
  },
};

const SERVICE_MAP = {
  gateway: "spring-petclinic-api-gateway",
  customers: "spring-petclinic-customers-service",
  visits: "spring-petclinic-visits-service",
  vets: "spring-petclinic-vets-service",
  genai: "spring-petclinic-genai-service",
  monitoring: "spring-petclinic-admin-server", // 🔥 importante
  discovery: "spring-petclinic-discovery-server",
  config: "spring-petclinic-config-server",
};

const TECH_FILES_BY_ROLE = {
  accountant: {
    gateway: [
      "billing-entry-points.md",
      "accountant-routes.md",
    ],

    customers: [
      "customer-billing-profile.md",
      "owner-reconciliation.md",
    ],

    visits: [
      "visits-report.md",
      "visit-volume-metrics.md",
      "clinic-activity-dashboard.md",
    ],

    vets: [
      "vet-cost-allocation.md",
      "vet-performance-summary.md",
    ],

    discovery: [
      "service-availability-for-reports.md",
    ],

    config: [
      "accounting-config-overview.md",
    ],

    monitoring: [
      "accounting-health-checks.md",
    ],
  designer: {
    gateway: [
      "navigation-entry-points.md",
    ],

    customers: [
      "customer-search-flow.md",
      "owner-profile-ux.md",
    ],

    visits: [
      "visit-dashboard-wireframe.md",
      "visit-detail-empty-states.md",
    ],

    vets: [
      "vet-availability-calendar.md",
      "vet-card-design.md",
    ],

    discovery: [
      "service-discovery-visualization.md",
    ],

    config: [
      "environment-switcher-ui.md",
    ],

    monitoring: [
      "navigation-entry-points.md",
      "service-status-ui.md",
      "system-map-ux.md",
    ],
  },
},
};

const DISTRICTS = {
  gateway: {
    id: "gateway",
    title: "API Gateway",
    subtitle: "Main entry point and routing layer",
    icon: Building2,
    color: "#60a5fa",
    github: `${GITHUB_BASE}/tree/main/spring-petclinic-api-gateway`,
    files: [
      "spring-petclinic-api-gateway/",
      "src/main/resources/application.yml",
      "pom.xml",
    ],
    subgraph: ["Routes", "Frontend", "Customers", "Visits", "Vets"],
    context: {
      accountant:
        "This is the business entry point. It lets Laura access the application without needing to understand internal services.",
      designer:
        "This is the product entry point. It connects the user interface with the backend services behind the scenes.",
    },
    why: {
      accountant:
        "Because accountants need access to business flows, not routing code.",
      designer:
        "Because designers care about the user journey starting from the frontend.",
    },
    actions: {
      accountant: [
        "Opening Petclinic app",
        "Showing owners, pets and visits as business entities",
        "Preparing KPI-style overview",
      ],
      designer: [
        "Opening Petclinic frontend",
        "Reviewing main navigation",
        "Checking owner and pet user journey",
      ],
    },
  },

  customers: {
    id: "customers",
    title: "Customers Service",
    subtitle: "Owners and pets data",
    icon: UserRound,
    color: "#4ade80",
    github: `${GITHUB_BASE}/tree/main/spring-petclinic-customers-service`,
    files: [
      "spring-petclinic-customers-service/",
      "OwnerResource.java",
      "PetResource.java",
      "OwnerRepository.java",
      "PetRepository.java",
    ],
    subgraph: ["Owners", "Pets", "Forms", "Customer Data"],
    context: {
      accountant:
        "This service stores customer information. For Laura, it becomes a business database of owners and pets.",
      designer:
        "This service powers owner profiles, pet creation, forms and customer-facing screens.",
    },
    why: {
      accountant:
        "Because customer data is useful for segmentation, activity reports and business analysis.",
      designer:
        "Because this service directly affects forms, profiles and user experience.",
    },
    actions: {
      accountant: [
        "Opening owners overview",
        "Loading customer segmentation spreadsheet",
        "Preparing owner/pet business summary",
      ],
      designer: [
        "Opening owner profile flow",
        "Reviewing pet creation form",
        "Loading UX checklist for customer data",
      ],
    },
  },

  visits: {
    id: "visits",
    title: "Visits Service",
    subtitle: "Appointments and visit records",
    icon: BarChart3,
    color: "#facc15",
    github: `${GITHUB_BASE}/tree/main/spring-petclinic-visits-service`,
    files: [
      "spring-petclinic-visits-service/",
      "VisitResource.java",
      "VisitRepository.java",
      "Visit.java",
    ],
    subgraph: ["Appointments", "Visit History", "Clinic Activity"],
    context: {
      accountant:
        "This service stores visit activity. For Laura, it becomes an operations and demand dashboard.",
      designer:
        "This service powers appointment and visit flows, which are key parts of the user experience.",
    },
    why: {
      accountant:
        "Because visits can be translated into activity volume, demand and operational metrics.",
      designer:
        "Because booking and visit creation are critical UX flows.",
    },
    actions: {
      accountant: [
        "Opening visits report",
        "Calculating visit volume metrics",
        "Loading clinic activity dashboard",
      ],
      designer: [
        "Opening appointment flow",
        "Checking visit creation UX",
        "Showing friction points",
      ],
    },
  },

  vets: {
    id: "vets",
    title: "Vets Service",
    subtitle: "Veterinarians and specialties",
    icon: BriefcaseBusiness,
    color: "#38bdf8",
    github: `${GITHUB_BASE}/tree/main/spring-petclinic-vets-service`,
    files: [
      "spring-petclinic-vets-service/",
      "VetResource.java",
      "VetRepository.java",
      "Specialty.java",
    ],
    subgraph: ["Veterinarians", "Specialties", "Capacity"],
    context: {
      accountant:
        "This service contains veterinarian and specialty information. For Laura, it helps with capacity planning.",
      designer:
        "This service powers vet listings and specialty discovery in the product.",
    },
    why: {
      accountant:
        "Because vet data helps explain capacity, availability and operational planning.",
      designer:
        "Because users need to discover the right veterinarian quickly.",
    },
    actions: {
      accountant: [
        "Opening vets capacity overview",
        "Loading specialties distribution",
        "Preparing operations summary",
      ],
      designer: [
        "Opening vet listing UI",
        "Reviewing specialty filters",
        "Checking discoverability",
      ],
    },
  },

  genai: {
    id: "genai",
    title: "GenAI Service",
    subtitle: "Natural language assistant",
    icon: Sparkles,
    color: "#c084fc",
    github: `${GITHUB_BASE}/tree/main/spring-petclinic-genai-service`,
    files: [
      "spring-petclinic-genai-service/",
      "ChatClient configuration",
      "AI assistant endpoints",
    ],
    subgraph: ["Chatbot", "Prompts", "Natural Language Actions"],
    context: {
      accountant:
        "This service lets Laura ask questions in natural language instead of searching through technical dashboards.",
      designer:
        "This service is a conversational interface that must feel helpful, clear and human.",
    },
    why: {
      accountant:
        "Because non-technical users should ask business questions without knowing the system structure.",
      designer:
        "Because conversational UX is part of the product experience.",
    },
    actions: {
      accountant: [
        "Opening chatbot examples",
        "Asking: Which owners have dogs?",
        "Preparing natural-language business assistant",
      ],
      designer: [
        "Opening chatbot UX flow",
        "Reviewing assistant conversation design",
        "Loading prompt examples",
      ],
    },
  },

  monitoring: {
    id: "monitoring",
    title: "Monitoring",
    subtitle: "Admin server, service health and system status",
    icon: BarChart3,
    color: "#f97316",
    github: `${GITHUB_BASE}/tree/main/spring-petclinic-admin-server`,
    files: [
      "spring-petclinic-admin-server/",
      "accounting-health-checks.md",
      "navigation-entry-points.md",
      "service-status-ui.md",
      "system-map-ux.md",
    ],
    subgraph: ["Admin Server", "Health Checks", "Service Status", "System Map"],
    context: {
      accountant:
        "This district shows service health and operational checks in a business-readable way.",
      designer:
        "This district helps Sofia understand system status screens, service visibility and monitoring UX.",
    },
    why: {
      accountant:
        "Because accountants need confidence that business reports depend on healthy services.",
      designer:
        "Because monitoring screens must make service status understandable and easy to scan.",
    },
    actions: {
      accountant: [
        "Opening accounting health checks",
        "Checking service availability",
        "Preparing operational summary",
      ],
      designer: [
        "Opening service status UI",
        "Reviewing system map UX",
        "Checking monitoring navigation",
      ],
    },
  },
};

function DistrictNode({ data }) {
  const Icon = data.icon;

  return (
    <div
      className="district-node"
      style={{
        borderColor: data.color,
        boxShadow: `0 0 30px ${data.color}35`,
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div className="district-icon" style={{ background: data.color }}>
        <Icon size={22} />
      </div>
      <div>
        <div className="district-title">{data.title}</div>
        <div className="district-subtitle">{data.subtitle}</div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

const nodeTypes = { district: DistrictNode };

const initialNodes = Object.entries(DISTRICTS).map(([id, district], index) => {
  const positions = {
    gateway: { x: 420, y: 40 },
    customers: { x: 80, y: 240 },
    visits: { x: 420, y: 240 },
    vets: { x: 760, y: 240 },
    genai: { x: 250, y: 470 },
    monitoring: { x: 600, y: 470 },
  };

  return {
    id,
    type: "district",
    position: positions[id] || { x: 100 + index * 260, y: 100 },
    data: { ...district },
  };
});

const initialEdges = [
  { id: "e1", source: "gateway", target: "customers", animated: true },
  { id: "e2", source: "gateway", target: "visits", animated: true },
  { id: "e3", source: "gateway", target: "vets", animated: true },
  { id: "e4", source: "gateway", target: "genai", animated: true },
  { id: "e5", source: "monitoring", target: "gateway", animated: true },
  { id: "e6", source: "monitoring", target: "customers", animated: true },
  { id: "e7", source: "monitoring", target: "visits", animated: true },
  { id: "e8", source: "monitoring", target: "vets", animated: true },
];

export default function App() {
  const [role, setRole] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [logs, setLogs] = useState([
    "Welcome to the Universal Onboarding Engine.",
    "Choose a persona to start.",
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [leftCollapsed, setLeftCollapsed] = useState(false);

  const addLog = (text) => setLogs((prev) => [...prev, text]);

  const fakeOpen = (action) => {
    if (action.includes("Grafana")) {
      window.open("http://localhost:3000", "_blank");
    } else if (action.includes("Petclinic") || action.includes("frontend")) {
      window.open("http://localhost:8080", "_blank");
    } else if (action.includes("spreadsheet")) {
      window.open("https://docs.google.com/spreadsheets", "_blank");
    } else if (action.includes("Figma") || action.includes("UX")) {
      window.open("https://figma.com", "_blank");
    }
  };

  const getTechFileUrl = (districtId, currentRole, file) => {
    const serviceFolder = SERVICE_MAP[districtId];

    if (!serviceFolder) {
      return `${GITHUB_BASE}/${file}`;
    }

    return `${GITHUB_BASE}/${serviceFolder}/${file}`;
  };

  const openTechFiles = () => {
    if (!selectedDistrict || !role) {
      addLog("Select a persona and a district first.");
      return;
    }

    const districtId = selectedDistrict.id;
    const files = TECH_FILES_BY_ROLE[role]?.[districtId] || [];

    if (files.length === 0) {
      addLog(
        `No ${ROLE_CONFIG[role].label} files found for ${selectedDistrict.title}.`
      );
      return;
    }

    files.forEach((file) => {
      const url = getTechFileUrl(districtId, role, file);
      window.open(url, "_blank", "noopener,noreferrer");
      addLog(`Opening ${file}`);
    });

    addLog(
      `Opened ${files.length} ${ROLE_CONFIG[role].label} files for ${selectedDistrict.title}.`
    );
  };

  const runAgent = (districtId) => {
    if (!role) {
      setLogs(["Please select a persona first."]);
      return;
    }

    const district = DISTRICTS[districtId];
    const currentRole = ROLE_CONFIG[role];
    const actions = district.actions[role];

    setSelectedDistrict(district);
    setIsRunning(true);
    setLogs([]);

    const steps = [
      "Agent started.",
      "Reading selected microservice node...",
      "Detected repository: spring-petclinic-microservices.",
      `User identified as ${currentRole.name}, ${currentRole.label}.`,
      `Selected node: ${district.title}.`,
      district.context[role],
      `Preparing ${currentRole.label} context...`,
      ...actions.map((a) => `→ ${a}`),
      "Environment ready.",
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        addLog(step);

        if (step.startsWith("→")) fakeOpen(step);

        if (index === steps.length - 1) {
          setIsRunning(false);
        }
      }, index * 650);
    });
  };

  const onNodeClick = useCallback(
    (_, node) => {
      runAgent(node.id);
    },
    [role]
  );

  const explainWhy = () => {
    if (!selectedDistrict || !role) return;

    addLog("Why am I seeing this?");
    addLog(selectedDistrict.why[role]);
  };

  return (
    <div className={`app ${leftCollapsed ? "left-collapsed" : ""}`}>
      <aside className={`sidebar ${leftCollapsed ? "collapsed" : ""}`}>
        <div className="brand">
          {!leftCollapsed && (
            <div>
              <h1>Spring Petclinic Microservices Map</h1>
              <p>Click a microservice to translate for your role</p>
            </div>
          )}
          <button 
            className={`collapse-handle ${leftCollapsed ? "expanded" : ""}`} 
            onClick={() => setLeftCollapsed(!leftCollapsed)}
            title={leftCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {leftCollapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          </button>
        </div>

        <div className="section">
          {!leftCollapsed && <h2>Choose persona</h2>}

          <div className="role-list">
            {Object.entries(ROLE_CONFIG).map(([key, value]) => {
              const Icon = value.icon;
              const active = role === key;

              return (
                <button
                  key={key}
                  className={`role-card ${active ? "active" : ""}`}
                  onClick={() => {
                    setRole(key);
                    setLogs([
                      `${value.name} selected.`,
                      `${value.intro}.`,
                      "Click a microservice on the map.",
                    ]);
                  }}
                  title={leftCollapsed ? value.label : ""}
                >
                  <div className="role-icon" style={{ 
                    background: "transparent",
                    border: "none"
                  }}>
                    <Icon size={20} color={value.color} />
                  </div>
                  {!leftCollapsed && (
                    <div>
                      <strong>{value.name}</strong>
                      <span>{value.label}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </aside>

      <main className="map-area">
        <div className="flow-wrapper">
          <ReactFlow
            nodes={initialNodes}
            edges={initialEdges}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            fitView
            fitViewOptions={{ padding: 1.2 }}
          >
            <Background gap={24} size={1} />
            <Controls orientation="horizontal" position="bottom-center" />
          </ReactFlow>
        </div>
      </main>

      <aside className="agent-panel">
        <div className="agent-header">
          <div>
            <h2>Agent Output</h2>
            <p>
              {selectedDistrict
                ? selectedDistrict.title
                : "Waiting for microservice selection"}
            </p>
          </div>

          <div className={`status ${isRunning ? "running" : ""}`}>
            {isRunning ? "Running" : "Idle"}
          </div>
        </div>

        <div className="terminal">
          {logs.map((log, index) => (
            <div key={index} className="log-line">
              <span>&gt;</span> {log}
            </div>
          ))}
        </div>

        {selectedDistrict && (
          <div className="action-row">
            <button className="pro-button" onClick={explainWhy}>
              <HelpCircle size={16} />
              Why am I seeing this?
            </button>

            <button className="pro-button" onClick={openTechFiles}>
              View technical details
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}