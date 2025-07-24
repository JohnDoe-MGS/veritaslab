"use client";

import { useAudit } from "@/contexts/AuditContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

export function AuditTrail() {
  const { auditTrail } = useAudit();

  const getActionBadgeVariant = (action: string) => {
    if (action.includes('CREATE') || action.includes('RESTORE')) return 'success';
    if (action.includes('UPDATE')) return 'default';
    if (action.includes('DELETE') || action.includes('CANCEL')) return 'destructive';
    if (action.includes('ARCHIVE')) return 'secondary';
    return 'outline';
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trilha de Auditoria do Sistema</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data e Hora</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Ação</TableeHead>
              <TableHead>Detalhes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditTrail.length > 0 ? (
                auditTrail.map((entry) => (
                <TableRow key={entry.id}>
                    <TableCell>{format(new Date(entry.timestamp), "dd/MM/yyyy 'às' HH:mm:ss")}</TableCell>
                    <TableCell>{entry.user}</TableCell>
                    <TableCell>
                        <Badge variant={getActionBadgeVariant(entry.action) as any}>
                            {entry.action.replace(/_/g, ' ')}
                        </Badge>
                    </TableCell>
                    <TableCell>{entry.details}</TableCell>
                </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        Nenhum evento de auditoria registrado.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}