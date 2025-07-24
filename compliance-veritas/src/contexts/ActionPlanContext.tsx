"use client";

import { createContext, useContext, ReactNode } from "react";
import { ActionPlan } from "@/lib/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAudit } from "./AuditContext";
import { useAuth } from "./AuthContext";

interface ActionPlanContextType {
  actionPlans: ActionPlan[];
  addActionPlan: (plan: Omit<ActionPlan, "id" | "status" | "progress" | "completionDate" | "attachments" | "relatedRisks" >) => void;
  updateActionPlan: (plan: ActionPlan, oldValues: ActionPlan) => void;
  getActionPlanById: (id: string) => ActionPlan | undefined;
  cancelActionPlan: (id: string) => void;
}

const ActionPlanContext = createContext<ActionPlanContextType | undefined>(undefined);

const initialActionPlans: ActionPlan[] = [
    {
      id: "AC-001",
      title: "Implementação de Backup Automático",
      description: "Configurar rotinas de backup diárias para todos os sistemas críticos.",
      type: "Ação",
      priority: "Alta",
      status: "Em Andamento",
      assignee: "Equipe TI",
      startDate: new Date("2024-06-01"),
      dueDate: new Date("2024-08-30"),
      relatedRisks: ["RISK-001"],
      budget: 5000,
      progress: 65,
      attachments: [],
    },
    {
      id: "CT-001",
      title: "Plano de Contingência para Falha de Sistema",
      description: "Procedimento detalhado para ativação de sistemas de backup e comunicação em caso de falha.",
      type: "Contingência",
      priority: "Crítica",
      status: "Planejado",
      assignee: "João Silva",
      startDate: new Date("2024-07-01"),
      dueDate: new Date("2024-09-15"),
      relatedRisks: ["RISK-001"],
      budget: 2000,
      progress: 0,
      attachments: [],
    },
];

const getPlanStatus = (progress: number, currentStatus: ActionPlan['status']): ActionPlan['status'] => {
    if (currentStatus === 'Cancelado') return 'Cancelado';
    if (progress === 100) return 'Concluído';
    if (progress > 0) return 'Em Andamento';
    return 'Planejado';
}

export function ActionPlanProvider({ children }: { children: ReactNode }) {
  const [actionPlans, setActionPlans] = useLocalStorage<ActionPlan[]>("actionPlans", initialActionPlans);
  const { addAuditEntry } = useAudit();
  const { user } = useAuth();

  const addActionPlan = (plan: Omit<ActionPlan, "id" | "status" | "progress" | "completionDate" | "attachments" | "relatedRisks">) => {
    const newPlan: ActionPlan = {
        ...plan,
        id: `${plan.type === 'Ação' ? 'AC' : 'CT'}-${String(actionPlans.length + 1).padStart(3, '0')}`,
        status: 'Planejado',
        progress: 0,
        attachments: [],
        relatedRisks: [],
    };
    setActionPlans([...actionPlans, newPlan]);
    addAuditEntry({ action: "CREATE_ACTION_PLAN", user: user?.name || "System", details: `Plano de ação criado: ${newPlan.title}`});
  };
  
  const updateActionPlan = (updatedPlan: ActionPlan, oldValues: ActionPlan) => {
     const newStatus = getPlanStatus(updatedPlan.progress, oldValues.status);
     const completionDate = newStatus === 'Concluído' && !oldValues.completionDate ? new Date() : oldValues.completionDate;

     const finalPlan = { ...updatedPlan, status: newStatus, completionDate };

     setActionPlans(
      actionPlans.map((plan) =>
        plan.id === finalPlan.id ? finalPlan : plan
      )
    );

    // Lógica de Auditoria Detalhada
    const changes = Object.keys(finalPlan).filter(key => key !== 'status' && finalPlan[key as keyof ActionPlan] !== oldValues[key as keyof ActionPlan]);
    let details = `Plano de ação '${finalPlan.title}' atualizado. `;
    if (changes.length > 0) {
        details += `Campos alterados: ${changes.join(', ')}.`;
    }
    if (finalPlan.status !== oldValues.status) {
        details += ` Status alterado de '${oldValues.status}' para '${finalPlan.status}'.`;
    }

    addAuditEntry({ action: "UPDATE_ACTION_PLAN", user: user?.name || "System", details});
  };

  const cancelActionPlan = (id: string) => {
    const plan = actionPlans.find(p => p.id === id);
    if(plan){
        setActionPlans(
            actionPlans.map((p) =>
            p.id === id ? { ...p, status: 'Cancelado' } : p
            )
        );
        addAuditEntry({ action: "CANCEL_ACTION_PLAN", user: user?.name || "System", details: `Plano de ação cancelado: ${plan.title}`});
    }
  };

  const getActionPlanById = (id: string) => {
    return actionPlans.find((plan) => plan.id === id);
  };


  return (
    <ActionPlanContext.Provider value={{ actionPlans, addActionPlan, getActionPlanById, updateActionPlan, cancelActionPlan }}>
      {children}
    </ActionPlanContext.Provider>
  );
}

export function useActionPlans() {
  const context = useContext(ActionPlanContext);
  if (context === undefined) {
    throw new Error("useActionPlans must be used within an ActionPlanProvider");
  }
  return context;
}