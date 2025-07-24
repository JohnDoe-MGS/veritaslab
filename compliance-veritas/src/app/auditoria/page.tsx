"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { AuditTrail } from "@/components/common/AuditTrail";

export default function AuditoriaPage() {
  return (
    <MainLayout>
      <AuditTrail />
    </MainLayout>
  );
}