"use client";

import { createContext, useContext, ReactNode } from "react";
import { Risk } from "@/lib/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAudit } from "./AuditContext";
import { useAuth } from "./AuthContext";

interface RiskContextType {
  risks: Risk[];
  addRisk: (risk: Omit<Risk, "id" | "createdAt" | "updatedAt" | "auditTrail" | "riskLevel" | "status" | "actionPlans" | "attachments" >) => void;
  updateRisk: (risk: Risk) => void;
  archiveRisk: (id: string) => void;
  getRiskById: (id: string) => Risk | undefined;
  restoreRisk: (id: string) => void;
  deleteRisk: (id: string) => void;
}

const RiskContext = createContext<RiskContextType | undefined>(undefined);

const initialRisks: Risk[] = [
    {
      id: "RISK-001",
      title: "Falha no Sistema de TI",
      description: "Risco de indisponibilidade dos sistemas críticos devido a falhas de hardware ou software.",
      category: "Operacional",
      probability: 3,
      impact: 4,
      riskLevel: "Alto",
      status: "Ativo",
      owner: "João Silva",
      dueDate: new Date("2024-12-31"),
      createdAt: new Date(),
      updatedAt: new Date(),
      attachments: [],
      actionPlans: ["AC-001"],
      auditTrail: [],
    },
    {
      id: "RISK-002",
      title: "Mudança na Legislação",
      description: "Impacto de novas regulamentações do setor que podem exigir mudanças significativas nos processos.",
      category: "Regulatório",
      probability: 4,
      impact: 5,
      riskLevel: "Crítico",
      status: "Monitorado",
      owner: "Maria Santos",
      dueDate: new Date("2024-08-15"),
      createdAt: new Date(),
      updatedAt: new Date(),
      attachments: [],
      actionPlans: [],
      auditTrail: [],
    },
    {
      id: "RISK-003",
      title: "Variação Cambial",
      description: "Exposição a variações de moeda estrangeira que afetam os custos e a receita.",
      category: "Financeiro",
      probability: 3,
      impact: 3,
      riskLevel: "Médio",
      status: "Mitigado",
      owner: "Carlos Oliveira",
      dueDate: new Date("2024-09-30"),
      createdAt: new Date(),
      updatedAt: new Date(),
      attachments: [],
      actionPlans: [],
      auditTrail: [],
    },
];

function calculateRiskLevel(probability: number, impact: number): 'Baixo' | 'Médio' | 'Alto' | 'Crítico' {
    const score = probability * impact;
    if (score > 20) return 'Crítico';
    if (score > 12) return 'Alto';
    if (score > 6) return 'Médio';
    return 'Baixo';
}

export function RiskProvider({ children }: { children: ReactNode }) {
  const [risks, setRisks] = useLocalStorage<Risk[]>("risks", initialRisks);
  const { addAuditEntry } = useAudit();
  const { user } = useAuth();

  const addRisk = (risk: Omit<Risk, "id" | "createdAt" | "updatedAt" | "auditTrail" | "riskLevel" | "status" | "actionPlans" | "attachments" >) => {
    const newRisk: Risk = {
      ...risk,
      id: `RISK-${String(risks.length + 1).padStart(3, '0')}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      auditTrail: [],
      riskLevel: calculateRiskLevel(risk.probability, risk.impact),
      status: 'Ativo',
      actionPlans: [],
      attachments: [],
    };
    setRisks([...risks, newRisk]);
    addAuditEntry({ action: "CREATE_RISK", user: user?.name || 'System', details: `New risk created: ${newRisk.title}` });
  };

  const updateRisk = (updatedRisk: Risk) => {
    setRisks(
      risks.map((risk) =>
        risk.id === updatedRisk.id ? { ...updatedRisk, updatedAt: new Date(), riskLevel: calculateRiskLevel(updatedRisk.probability, updatedRisk.impact) } : risk
      )
    );
    addAuditEntry({ action: "UPDATE_RISK", user: user?.name || 'System', details: `Risk updated: ${updatedRisk.title}` });
  };

  const archiveRisk = (id: string) => {
    const risk = risks.find(r => r.id === id);
    if(risk){
        setRisks(
          risks.map((r) =>
            r.id === id ? { ...r, status: "Arquivado", updatedAt: new Date() } : r
          )
        );
        addAuditEntry({ action: "ARCHIVE_RISK", user: user?.name || 'System', details: `Risk archived: ${risk.title}` });
    }
  };
  
  const restoreRisk = (id: string) => {
    const risk = risks.find(r => r.id === id);
    if(risk){
        setRisks(
          risks.map((r) =>
            r.id === id ? { ...r, status: "Ativo", updatedAt: new Date() } : r
          )
        );
        addAuditEntry({ action: "RESTORE_RISK", user: user?.name || 'System', details: `Risk restored: ${risk.title}` });
    }
  };

  const deleteRisk = (id: string) => {
    const risk = risks.find(r => r.id === id);
    if(risk){
        setRisks(risks.filter((r) => r.id !== id));
        addAuditEntry({ action: "DELETE_RISK", user: user?.name || 'System', details: `Risk deleted: ${risk.title}` });
    }
  };


  const getRiskById = (id: string) => {
    return risks.find((risk) => risk.id === id);
  };

  return (
    <RiskContext.Provider value={{ risks, addRisk, updateRisk, archiveRisk, getRiskById, restoreRisk, deleteRisk }}>
      {children}
    </RiskContext.Provider>
  );
}

export function useRisks() {
  const context = useContext(RiskContext);
  if (context === undefined) {
    throw new Error("useRisks must be used within a RiskProvider");
  }
  return context;
}