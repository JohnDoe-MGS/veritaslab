"use client";

import { useState } from "react";
import { useRisks } from "@/contexts/RiskContext";
import { Risk } from "@/lib/types";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RiskForm } from "./RiskForm";

export function RiskMatrix() {
  const { risks, addRisk, updateRisk, archiveRisk } = useRisks();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<Risk | undefined>(undefined);

  const handleAddClick = () => {
    setSelectedRisk(undefined);
    setIsDialogOpen(true);
  };

  const handleEditClick = (risk: Risk) => {
    setSelectedRisk(risk);
    setIsDialogOpen(true);
  };
  
  const handleArchiveClick = (id: string) => {
    archiveRisk(id);
  };

  const handleSubmit = (values: any) => {
    if (selectedRisk) {
      updateRisk({ ...selectedRisk, ...values });
    } else {
      addRisk(values);
    }
    setIsDialogOpen(false);
  };

  const activeRisks = risks.filter(risk => risk.status !== 'Arquivado');


  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
       <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Matriz de Riscos</h2>
        <Button onClick={handleAddClick}>Adicionar Risco</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedRisk ? "Editar Risco" : "Adicionar Risco"}</DialogTitle>
          </DialogHeader>
          <RiskForm onSubmit={handleSubmit} risk={selectedRisk} />
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox />
            </TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Probabilidade</TableHead>
            <TableHead>Impacto</TableHead>
            <TableHead>Nível</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead>Prazo</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activeRisks.map((risk) => (
            <TableRow key={risk.id}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>{risk.id}</TableCell>
              <TableCell>{risk.title}</TableCell>
              <TableCell>{risk.category}</TableCell>
              <TableCell>{risk.probability}</TableCell>
              <TableCell>{risk.impact}</TableCell>
              <TableCell>
                <Badge
                  className={
                    risk.riskLevel === "Crítico"
                      ? "bg-red-500"
                      : risk.riskLevel === "Alto"
                      ? "bg-orange-500"
                      : "bg-green-500"
                  }
                >
                  {risk.riskLevel}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{risk.status}</Badge>
              </TableCell>
              <TableCell>{risk.owner}</TableCell>
              <TableCell>{new Date(risk.dueDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditClick(risk)}>Editar</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleArchiveClick(risk.id)}>Arquivar</DropdownMenuItem>
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