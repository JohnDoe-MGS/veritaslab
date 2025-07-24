import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { RiskProvider } from "@/contexts/RiskContext";
import { FrameworkProvider } from "@/contexts/FrameworkContext";
import { ActionPlanProvider } from "@/contexts/ActionPlanContext";
import { AuditProvider } from "@/contexts/AuditContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "COMPLIANCE VERITAS",
  description: "Corporate compliance management",
};

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <AuditProvider>
        <RiskProvider>
          <FrameworkProvider>
            <ActionPlanProvider>
              {children}
            </ActionPlanProvider>
          </FrameworkProvider>
        </RiskProvider>
      </AuditProvider>
    </AuthProvider>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}