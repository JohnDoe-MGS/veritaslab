"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { AuditEntry } from "@/lib/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface AuditContextType {
  auditTrail: AuditEntry[];
  addAuditEntry: (entry: Omit<AuditEntry, "id" | "timestamp">) => void;
}

const AuditContext = createContext<AuditContextType | undefined>(undefined);

export function AuditProvider({ children }: { children: ReactNode }) {
  const [auditTrail, setAuditTrail] = useLocalStorage<AuditEntry[]>("auditTrail", []);

  const addAuditEntry = (entry: Omit<AuditEntry, "id" | "timestamp">) => {
    const newEntry: AuditEntry = {
      ...entry,
      id: `AUDIT-${Date.now()}`,
      timestamp: new Date(),
    };
    setAuditTrail([newEntry, ...auditTrail]);
  };

  return (
    <AuditContext.Provider value={{ auditTrail, addAuditEntry }}>
      {children}
    </AuditContext.Provider>
  );
}

export function useAudit() {
  const context = useContext(AuditContext);
  if (context === undefined) {
    throw new Error("useAudit must be used within an AuditProvider");
  }
  return context;
}