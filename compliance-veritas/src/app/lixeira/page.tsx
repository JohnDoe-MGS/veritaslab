"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { useRisks } from "@/contexts/RiskContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

export default function LixeiraPage() {
  const { risks, restoreRisk, deleteRisk } = useRisks();
  const archivedRisks = risks.filter((risk) => risk.status === "Arquivado");

  const handleRestore = (id: string) => {
    restoreRisk(id);
  };

  const handleDelete = (id: string) => {
    deleteRisk(id);
  };

  return (
    <MainLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
            <h2 className="text-2xl font-bold">Lixeira</h2>
            <p className="text-sm text-gray-500">Itens arquivados são excluídos permanentemente após 90 dias.</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Data de Arquivamento</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {archivedRisks.length > 0 ? (
                archivedRisks.map((risk) => (
              <TableRow key={risk.id}>
                <TableCell>{risk.id}</TableCell>
                <TableCell>{risk.title}</TableCell>
                <TableCell>
                    <span className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded-full">Risco</span>
                </TableCell>
                <TableCell>
                  {new Date(risk.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" className="mr-2" onClick={() => handleRestore(risk.id)}>
                    Restaurar
                  </Button>
                  <ConfirmDialog
                    title="Excluir Permanentemente?"
                    description={`Tem certeza que deseja excluir o item "${risk.title}"? Esta ação não pode ser desfeita.`}
                    onConfirm={() => handleDelete(risk.id)}
                  >
                    <Button variant="destructive" size="sm">
                        Excluir
                    </Button>
                  </ConfirmDialog>
                </TableCell>
              </TableRow>
            ))
            ) : (
                <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                        A lixeira está vazia.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </MainLayout>
  );
}