"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { RiskMatrix } from "@/components/matriz-riscos/RiskMatrix";

export default function MatrizRiscosPage() {
  return (
    <MainLayout>
      <RiskMatrix />
    </MainLayout>
  );
}