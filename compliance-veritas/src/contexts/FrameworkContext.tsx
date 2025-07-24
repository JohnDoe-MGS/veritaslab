"use client";

import { createContext, useContext, ReactNode } from "react";
import { Framework, Requirement } from "@/lib/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAudit } from "./AuditContext";
import { useAuth } from "./AuthContext";

interface FrameworkContextType {
  frameworks: Framework[];
  updateRequirementStatus: (frameworkId: string, requirementId: string, newStatus: Requirement['status']) => void;
  getFrameworkById: (id: string) => Framework | undefined;
}

const FrameworkContext = createContext<FrameworkContextType | undefined>(undefined);

const initialFrameworks: Framework[] = [
    {
      id: "iso-37301",
      name: "ISO 37301",
      description: "Compliance Management Systems",
      type: "ISO",
      complianceLevel: 75,
      lastAssessment: new Date("2024-01-15"),
      status: "Em Implementação",
      requirements: [
        { id: "4.1", description: "Understanding the organization and its context", status: "Concluído", owner: "Admin", dueDate: new Date(), comments: [], evidence: [] },
        { id: "4.2", description: "Understanding the needs and expectations of interested parties", status: "Em Progresso", owner: "Admin", dueDate: new Date(), comments: [], evidence: [] },
        { id: "5.1", description: "Leadership and commitment", status: "Não Iniciado", owner: "Admin", dueDate: new Date(), comments: [], evidence: [] },
      ],
    },
     {
      id: "coso",
      name: "COSO",
      description: "Committee of Sponsoring Organizations",
      type: "COSO",
      complianceLevel: 60,
      lastAssessment: new Date("2023-12-10"),
      status: "Em Implementação",
      requirements: [
         { id: "1.1", description: "Demonstrates commitment to integrity and ethical values", status: "Concluído", owner: "Admin", dueDate: new Date(), comments: [], evidence: [] },
         { id: "1.2", description: "Establishes structures, reporting lines, and appropriate authorities and responsibilities", status: "Em Progresso", owner: "Admin", dueDate: new Date(), comments: [], evidence: [] },
      ],
    },
];

export function FrameworkProvider({ children }: { children: ReactNode }) {
  const [frameworks, setFrameworks] = useLocalStorage<Framework[]>("frameworks", initialFrameworks);
  const { addAuditEntry } = useAudit();
  const { user } = useAuth();

  const updateRequirementStatus = (frameworkId: string, requirementId: string, newStatus: Requirement['status']) => {
    const framework = frameworks.find(f => f.id === frameworkId);
    const requirement = framework?.requirements.find(r => r.id === requirementId);

    if(framework && requirement){
        const oldStatus = requirement.status;
        if (oldStatus === newStatus) return; // Não faz nada se o status for o mesmo

        setFrameworks(prevFrameworks =>
          prevFrameworks.map(fw =>
            fw.id === frameworkId
              ? {
                  ...fw,
                  requirements: fw.requirements.map(req =>
                    req.id === requirementId ? { ...req, status: newStatus } : req
                  ),
                }
              : fw
          )
        );
        addAuditEntry({ 
            action: "UPDATE_REQUIREMENT", 
            user: user?.name || "System", 
            details: `Framework '${framework.name}': Requisito '${requirement.id}' status alterado de '${oldStatus}' para '${newStatus}'.`
        });
    }
  };
  
  const getFrameworkById = (id: string) => {
    return frameworks.find((framework) => framework.id === id);
  };

  return (
    <FrameworkContext.Provider value={{ frameworks, getFrameworkById, updateRequirementStatus }}>
      {children}
    </FrameworkContext.Provider>
  );
}

export function useFrameworks() {
  const context = useContext(FrameworkContext);
  if (context === undefined) {
    throw new Error("useFrameworks must be used within a FrameworkProvider");
  }
  return context;
}