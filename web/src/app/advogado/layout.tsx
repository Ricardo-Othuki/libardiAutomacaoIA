"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { NavAdvogado } from "@/components/NavAdvogado";
import { TopBar } from "@/components/TopBar";

export default function AdvogadoLayout({ children }: { children: React.ReactNode }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const pathname = usePathname();

  // Fecha o menu deslizante sempre que a rota muda (navegação pelo celular).
  // Ajuste de estado durante a renderização, não em efeito: evita um
  // reflow extra e segue o padrão recomendado para "resetar estado quando
  // algo externo muda".
  const [pathnameAnterior, setPathnameAnterior] = useState(pathname);
  if (pathname !== pathnameAnterior) {
    setPathnameAnterior(pathname);
    setMenuAberto(false);
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar fixa em telas grandes */}
      <aside className="hidden w-64 shrink-0 border-r border-border lg:block">
        <NavAdvogado />
      </aside>

      {/* Sidebar deslizante em telas pequenas */}
      {menuAberto && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <button
            type="button"
            aria-label="Fechar o menu"
            title="Fechar o menu"
            className="absolute inset-0 bg-black/50"
            onClick={() => setMenuAberto(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 border-r border-border bg-surface shadow-xl">
            <div className="flex justify-end p-2">
              <button
                type="button"
                onClick={() => setMenuAberto(false)}
                aria-label="Fechar o menu"
                title="Fechar o menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground/70 hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>
            <NavAdvogado onNavegar={() => setMenuAberto(false)} />
          </div>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col overflow-x-hidden">
        <TopBar onAbrirMenu={() => setMenuAberto(true)} />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
