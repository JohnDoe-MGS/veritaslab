"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  LayoutDashboard,
  ClipboardList,
  FileArchive,
  LogOut,
  GanttChartSquare,
  History, // Ícone para auditoria
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/matriz-riscos", icon: ShieldCheck, label: "Matriz de Riscos" },
  { href: "/frameworks", icon: ClipboardList, label: "Frameworks" },
  { href: "/planos-acao", icon: GanttChartSquare, label: "Planos de Ação" },
  { href: "/lixeira", icon: FileArchive, label: "Lixeira" },
  { href: "/auditoria", icon: History, label: "Auditoria", adminOnly: true }, // Rota de admin
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="h-16 flex items-center justify-center text-2xl font-bold text-white bg-gray-900">
        VERITAS
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map((item) => {
          if (item.adminOnly && user?.role !== 'admin') {
            return null;
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                pathname === item.href
                  ? "bg-primary text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="px-4 py-4 border-t border-gray-700">
        <button 
            onClick={() => logout()}
            className="flex items-center px-4 py-2 mt-2 text-sm font-semibold text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white w-full transition-colors duration-200"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sair
        </button>
      </div>
    </aside>
  );
}