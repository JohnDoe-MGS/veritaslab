"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b-4 border-primary">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">
          COMPLIANCE VERITAS
        </h2>
      </div>
      <div className="flex items-center">
        <span className="mr-4">Welcome, {user?.name}</span>
        <Button onClick={logout}>Logout</Button>
      </div>
    </header>
  );
}