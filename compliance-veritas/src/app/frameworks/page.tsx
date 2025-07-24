"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { FrameworkList } from "@/components/frameworks/FrameworkList";

export default function FrameworksPage() {
  return (
    <MainLayout>
      <FrameworkList />
    </MainLayout>
  );
}