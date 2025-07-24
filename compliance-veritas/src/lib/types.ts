export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  category: 'Operacional' | 'Financeiro' | 'Regulatório' | 'Reputacional' | 'Estratégico';
  probability: 1 | 2 | 3 | 4 | 5;
  impact: 1 | 2 | 3 | 4 | 5;
  riskLevel: 'Baixo' | 'Médio' | 'Alto' | 'Crítico';
  status: 'Ativo' | 'Mitigado' | 'Monitorado' | 'Arquivado';
  owner: string;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  attachments: string[];
  actionPlans: string[];
  auditTrail: AuditEntry[];
}

export interface Framework {
  id: string;
  name: string;
  description: string;
  type: 'ISO' | 'COSO' | 'DOJ' | 'Outro';
  requirements: Requirement[];
  complianceLevel: number;
  lastAssessment: Date;
  status: 'Implementado' | 'Em Implementação' | 'Planejado';
}

export interface ActionPlan {
  id: string;
  title: string;
  description: string;
  type: 'Ação' | 'Contingência';
  priority: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  status: 'Planejado' | 'Em Andamento' | 'Concluído' | 'Cancelado';
  assignee: string;
  startDate: Date;
  dueDate: Date;
  completionDate?: Date;
  relatedRisks: string[];
  budget: number;
  progress: number;
  attachments: string[];
}

export interface Requirement {
    id: string;
    description: string;
    status: 'Não Iniciado' | 'Em Progresso' | 'Concluído';
    evidence: string[];
    owner: string;
    dueDate: Date;
    comments: string[];
}

export interface AuditEntry {
    id: string;
    timestamp: Date;
    user: string;
    action: string;
    details: string;
}