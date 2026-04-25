import React, { useCallback, useMemo, useState } from "react";
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
  Server,
  Activity,
  Settings,
  Network,
} from "lucide-react";
import "./App.css";

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
  monitoring: "spring-petclinic-admin-server",
  discovery: "spring-petclinic-discovery-server",
  config: "spring-petclinic-config-server",
};

const TECH_FILES_BY_ROLE = {
  accountant: {
    gateway: ["billing-entry-points.md", "accountant-routes.md"],
    customers: [
      "customer-billing-profile.md",
      "owner-reconciliation.md",
      "RAW_DUMP_BENDING_SPOONS_2026.csv",
      "UX_JOURNEY_AUDIT_2026.csv",
    ],
    visits: [
      "visits-report.md",
      "visit-volume-metrics.md",
      "clinic-activity-dashboard.md",
      "RAW_DUMP_BENDING_SPOONS_2_2026.csv",
    ],
    vets: [
      "vet-cost-allocation.md",
      "vet-performance-summary.md",
      "RAW_DUMP_BENDING_SPOONS_3_2026.csv",
    ],
    discovery: ["service-availability-for-reports.md"],
    config: ["accounting-config-overview.md"],
    monitoring: ["accounting-health-checks.md"],
  },

  designer: {
    gateway: ["navigation-entry-points.md"],
    customers: [
      "customer-search-flow.md",
      "owner-profile-ux.md",
      "UX_JOURNEY_AUDIT_2026.csv",
    ],
    visits: [
      "visit-dashboard-wireframe.md",
      "visit-detail-empty-states.md",
      "DESIGN_SYSTEM_DEBT_AUDIT_2026.csv",
    ],
    vets: [
      "vet-availability-calendar.md",
      "vet-card-design.md",
      "DESIGN_SYSTEM_DEBT_AUDIT_2026.csv",
    ],
    discovery: ["service-discovery-visualization.md"],
    config: ["environment-switcher-ui.md"],
    monitoring: [
      "navigation-entry-points.md",
      "service-status-ui.md",
      "system-map-ux.md",
    ],
  },
};

const DISTRICTS = {
  gateway: {
    icon: Server,
    color: "#38bdf8",
    defaultTitle: "API Gateway",
    defaultSubtitle: "Single entry point for all Petclinic services",
    context: {
      accountant:
        "This is where finance-related requests enter before reaching the internal services.",
      designer:
        "This is the first navigation layer users touch before moving into product flows.",
    },
    why: {
      accountant:
        "Because billing, reporting and customer/accounting actions usually start from external entry points.",
      designer:
        "Because this node explains where users enter the product and how navigation is routed.",
    },
    actions: {
      accountant: [
        "Open Petclinic frontend",
        "Open spreadsheet for financial analysis",
      ],
      designer: ["Open Figma UX board", "Open Petclinic frontend"],
    },
  },

  customers: {
    icon: UserRound,
    color: "#f97316",
    defaultTitle: "Customers Service",
    defaultSubtitle: "Owners, pets and customer records",
    context: {
      accountant:
        "This service contains owner and customer data useful for billing reconciliation.",
      designer:
        "This service contains the customer profile flows and search experience.",
    },
    why: {
      accountant:
        "Because invoices and payments need to be connected to owners and customer profiles.",
      designer:
        "Because most user journeys involve searching, viewing or editing customer information.",
    },
    actions: {
      accountant: ["Open spreadsheet for customer billing"],
      designer: ["Open Figma UX board", "Open Petclinic frontend"],
    },
  },

  visits: {
    icon: BarChart3,
    color: "#22c55e",
    defaultTitle: "Visits Service",
    defaultSubtitle: "Visit history and clinic activity",
    context: {
      accountant:
        "This service gives visit volume, activity and revenue-related information.",
      designer:
        "This service controls visit screens, visit details and empty states.",
    },
    why: {
      accountant:
        "Because visits can be transformed into reports, cost summaries and revenue metrics.",
      designer:
        "Because visit tracking is a core user workflow in the clinic interface.",
    },
    actions: {
      accountant: ["Open spreadsheet for visit reports"],
      designer: ["Open Figma UX board", "Open Petclinic frontend"],
    },
  },

  vets: {
    icon: Building2,
    color: "#a78bfa",
    defaultTitle: "Vets Service",
    defaultSubtitle: "Veterinarians, specialties and availability",
    context: {
      accountant:
        "This service helps understand vet activity, cost allocation and performance.",
      designer:
        "This service supports vet cards, availability views and specialist discovery.",
    },
    why: {
      accountant:
        "Because vet workload and performance can affect operational accounting.",
      designer:
        "Because vets need clear cards, schedules and readable UI components.",
    },
    actions: {
      accountant: ["Open spreadsheet for vet performance"],
      designer: ["Open Figma UX board", "Open Petclinic frontend"],
    },
  },

  genai: {
    icon: Sparkles,
    color: "#ec4899",
    defaultTitle: "GenAI Service",
    defaultSubtitle: "AI assistant and intelligent features",
    context: {
      accountant:
        "This service can summarize reports or explain financial data in natural language.",
      designer:
        "This service can power assistant-like experiences inside the product.",
    },
    why: {
      accountant:
        "Because an accountant may need automatic summaries instead of raw technical logs.",
      designer:
        "Because AI features need UX flows, prompts and clear interaction design.",
    },
    actions: {
      accountant: ["Open Petclinic frontend"],
      designer: ["Open Figma UX board"],
    },
  },

  discovery: {
    icon: Network,
    color: "#0ea5e9",
    defaultTitle: "Discovery Server",
    defaultSubtitle: "Service registration and routing discovery",
    context: {
      accountant:
        "This tells whether internal services needed for reports are available.",
      designer:
        "This explains how services appear in the system map.",
    },
    why: {
      accountant:
        "Because if a required service is down, reports and accounting views may fail.",
      designer:
        "Because service discovery helps visualize how the product architecture connects.",
    },
    actions: {
      accountant: ["Open Grafana dashboard"],
      designer: ["Open Figma UX board"],
    },
  },

  config: {
    icon: Settings,
    color: "#f59e0b",
    defaultTitle: "Config Server",
    defaultSubtitle: "Central configuration for all services",
    context: {
      accountant:
        "This controls environment settings that may affect finance workflows.",
      designer:
        "This controls configuration that can change what UI or environment is active.",
    },
    why: {
      accountant:
        "Because wrong configuration can affect reports, billing rules or service behavior.",
      designer:
        "Because designers need to understand environment switches and configuration states.",
    },
    actions: {
      accountant: ["Open Grafana dashboard"],
      designer: ["Open Figma UX board"],
    },
  },

  monitoring: {
    icon: Activity,
    color: "#ef4444",
    defaultTitle: "Admin Server",
    defaultSubtitle: "Monitoring, health checks and service status",
    context: {
      accountant:
        "This shows whether the services needed for accounting workflows are healthy.",
      designer:
        "This gives a visual status layer for system health and errors.",
    },
    why: {
      accountant:
        "Because financial workflows depend on reliable services and health checks.",
      designer:
        "Because system status can be translated into dashboards, alerts and admin UI.",
    },
    actions: {
      accountant: ["Open Grafana dashboard"],
      designer: ["Open Figma UX board"],
    },
  },
};

const DISTRICT_CONTENT = {
  accountant: {
    gateway: {
      title: "Billing Entry Points",
      subtitle: "Invoices, payments and accounting flows",
    },
    customers: {
      title: "Customer Accounts",
      subtitle: "Owners, billing profiles and transactions",
    },
    visits: {
      title: "Visit Reports",
      subtitle: "Clinic activity and revenue per visit",
    },
    vets: {
      title: "Vet Cost Allocation",
      subtitle: "Costs and performance per vet",
    },
    genai: {
      title: "Financial AI Assistant",
      subtitle: "Automatic summaries and report explanations",
    },
    discovery: {
      title: "Service Availability",
      subtitle: "System status for financial reports",
    },
    config: {
      title: "Accounting Config",
      subtitle: "Financial rules and environment setup",
    },
    monitoring: {
      title: "Accounting Health",
      subtitle: "System health impacting billing",
    },
  },

  designer: {
    gateway: {
      title: "Navigation Entry Flows",
      subtitle: "User entry points and product routing",
    },
    customers: {
      title: "Customer UX",
      subtitle: "Search, profiles and interactions",
    },
    visits: {
      title: "Visit Dashboard",
      subtitle: "UI for visit tracking and visit details",
    },
    vets: {
      title: "Vet Interface",
      subtitle: "Availability, cards and layout patterns",
    },
    genai: {
      title: "AI Interaction Design",
      subtitle: "Assistant flows, prompts and UX behavior",
    },
    discovery: {
      title: "Service Map",
      subtitle: "Visual system architecture",
    },
    config: {
      title: "Environment UI",
      subtitle: "Switching environments visually",
    },
    monitoring: {
      title: "System Status UI",
      subtitle: "Visual health, errors and alerts",
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
      <div className="district-icon" style={{ background: data.color }}>
        <Icon size={22} />
      </div>
      <div>
        <div className="district-title">{data.title}</div>
        <div className="district-subtitle">{data.subtitle}</div>
      </div>
    </div>
  );
}

const nodeTypes = { district: DistrictNode };

const initialEdges = [];

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

  const nodes = useMemo(() => {
    const positions = {
      gateway: { x: 420, y: 40 },
      customers: { x: 80, y: 240 },
      visits: { x: 420, y: 240 },
      vets: { x: 760, y: 240 },
      genai: { x: 250, y: 470 },
      monitoring: { x: 600, y: 470 },
      discovery: { x: 80, y: 40 },
      config: { x: 760, y: 40 },
    };

    return Object.entries(DISTRICTS).map(([id, district], index) => {
      const dynamicContent = role ? DISTRICT_CONTENT[role]?.[id] : null;

      return {
        id,
        type: "district",
        position: positions[id] || { x: 100 + index * 260, y: 100 },
        data: {
          ...district,
          id,
          title: dynamicContent?.title || district.defaultTitle,
          subtitle: dynamicContent?.subtitle || district.defaultSubtitle,
        },
      };
    });
  }, [role]);

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

  const getTechFilePath = (districtId, file) => {
    const serviceFolder = SERVICE_MAP[districtId];

    if (!serviceFolder) {
      return file;
    }

    return `${serviceFolder}/${file}`;
  };

  const openTechFiles = async () => {
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

    const localPaths = files.map((file) => getTechFilePath(districtId, file));

    try {
      await fetch("http://localhost:3001/open-many", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paths: localPaths }),
      });

      localPaths.forEach((path) => {
        addLog(`Opening local file: ${path}`);
      });
    } catch (error) {
      addLog(`Error opening files: ${error.message}`);
    }
  };

  const runAgent = (districtId) => {
    if (!role) {
      setLogs(["Please select a persona first."]);
      return;
    }

    const baseDistrict = DISTRICTS[districtId];
    const dynamicContent = DISTRICT_CONTENT[role]?.[districtId];

    const district = {
      ...baseDistrict,
      id: districtId,
      title: dynamicContent?.title || baseDistrict.defaultTitle,
      subtitle: dynamicContent?.subtitle || baseDistrict.defaultSubtitle,
    };

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
            {leftCollapsed ? (
              <ChevronsRight size={18} />
            ) : (
              <ChevronsLeft size={18} />
            )}
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
                    setSelectedDistrict(null);
                    setLogs([
                      `${value.name} selected.`,
                      `${value.intro}.`,
                      "The map has been translated for this persona.",
                      "Click a microservice on the map.",
                    ]);
                  }}
                  title={leftCollapsed ? value.label : ""}
                >
                  <div
                    className="role-icon"
                    style={{
                      background: "transparent",
                      border: "none",
                    }}
                  >
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
            nodes={nodes}
            edges={initialEdges}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            fitView
            fitViewOptions={{ padding: 1.2 }}
          >
            <Background variant="dots" gap={24} size={1} color="#94a3b8" />
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