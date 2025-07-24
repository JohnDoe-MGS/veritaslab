"use client";

import { useState } from "react";
import { useActionPlans } from "@/contexts/ActionPlanContext";
import { ActionPlan } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ActionPlanForm } from "./ActionPlanForm";
import { Progress } from "@/components/ui/progress";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

export function ActionPlanTable() {
  const { actionPlans, addActionPlan, updateActionPlan, cancelActionPlan } = useActionPlans();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<ActionPlan | undefined>(undefined);

  const handleAddClick = () => {
    setSelectedPlan(undefined);
    setIsDialogOpen(true);
  };

  const handleEditClick = (plan: ActionPlan) => {
    setSelectedPlan(plan);
    setIsDialogOpen(true);
  };
  
  const handleCancelClick = (id: string) => {
    cancelActionPlan(id);
  };

  const handleSubmit = (values: any) => {
    if (selectedPlan) {
      // Passa os valores antigos (selectedPlan) e os novos (values)
      updateActionPlan({ ...selectedPlan, ...values }, selectedPlan);
    } else {
      addActionPlan(values);
    }
    setIsDialogOpen(false);
  };

  const getStatusColor = (status: ActionPlan['status'], dueDate: Date) => {
    const today = new Date();
    today.setHours(0,0,0,0);

    if (status === 'Concluído') return 'bg-green-500';
    if (status === 'Cancelado') return 'bg-red-500';
    if (new Date(dueDate) < today && status !== 'Concluído') return 'bg-orange-500';
    if (status === 'Em Andamento') return 'bg-blue-500';
    return 'bg-gray-500';
  }

  const getStatusText = (plan: ActionPlan) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    if (new Date(plan.dueDate) < today && plan.status !== 'Concluído' && plan.status !== 'Cancelado') return 'Atrasado';
    return plan.status;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Planos de Ação</h2>
        <Button onClick={handleAddClick}>Adicionar Plano</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{selectedPlan ? "Editar Plano de Ação" : "Adicionar Plano de Ação"}</DialogTitle>
          </DialogHeader>
          <ActionPlanForm onSubmit={handleSubmit} plan={selectedPlan} />
        </DialogContent>
      </Dialog>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead>Prazo</TableHead>
            <TableHead className="w-[150px]">Progresso</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {actionPlans.map((plan) => (
            <TableRow key={plan.id}>
              <TableCell
                className={`font-medium ${
                  plan.type === "Ação" ? "text-blue-600" : "text-red-600"
                }`}
              >
                {plan.id}
              </TableCell>
              <TableCell>{plan.title}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    plan.priority === "Crítica" ? "destructive"
                      : plan.priority === "Alta" ? "default"
                      : "secondary"
                  }
                >
                  {plan.priority}
                </Badge>
              </TableCell>
              <TableCell>
                  <span className={`h-2 w-2 rounded-full inline-block mr-2 ${getStatusColor(plan.status, plan.dueDate)}`} />
                  {getStatusText(plan)}
              </TableCell>
              <TableCell>{plan.assignee}</TableCell>
              <TableCell>{new Date(plan.dueDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                    <Progress value={plan.progress} className="w-full flex-1" />
                    <span className="text-xs text-muted-foreground">{plan.progress}%</span>
                </div>
                </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditClick(plan)}>Editar</DropdownMenuItem>
                    {plan.status !== 'Cancelado' && plan.status !== 'Concluído' && (
                        <ConfirmDialog
                            title="Cancelar Plano de Ação?"
                            description={`Tem certeza que deseja cancelar o plano "${plan.title}"?`}
                            onConfirm={() => handleCancelClick(plan.id)}
                        >
                            <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-red-600 w-full">
                                Cancelar
                            </div>
                       </ConfirmDialog>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}