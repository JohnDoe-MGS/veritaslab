"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { ActionPlanTable } from "@/components/planos-acao/ActionPlanTable";

export default function PlanosAcaoPage() {
  return (
    <MainLayout>
      <ActionPlanTable />
    </MainLayout>
  );
}