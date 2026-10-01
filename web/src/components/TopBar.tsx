"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const ROTULOS: Record<string, string> = {
  pendencias: "Painel de pendências",
  processos: "Processos",
  novo: "Abrir processo",
  catalogo: "Catálogo de modelos",
  importar: "Importar lista em texto",
  link: "Link de envio",
  dossie: "Dossiê",
  conferencia: "Conferência contra a petição",
  cobranca: "Cobrança",
  historico: "Histórico e auditoria",
  documentos: "Conferência de documento",
};

function tituloDaRota(pathname: string): string {
  const segmentos = pathname.split("/").filter(Boolean).slice(1); // remove "advogado"
  for (let i = segmentos.length - 1; i >= 0; i--) {
    const rotulo = ROTULOS[segmentos[i]];
    if (rotulo) return rotulo;
  }
  return "Painel";
}

export function TopBar({ onAbrirMenu }: { onAbrirMenu: () => void }) {
  const pathname = usePathname() ?? "/advogado/pendencias";
  const router = useRouter();
  const titulo = tituloDaRota(pathname);
  const [busca, setBusca] = useState("");

  function buscar(e: React.FormEvent) {
    e.preventDefault();
    const termo = busca.trim();
    router.push(termo ? `/advogado/pendencias?busca=${encodeURIComponent(termo)}` : "/advogado/pendencias");
  }

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-surface/95 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onAbrirMenu}
          title="Abrir o menu de navegação"
          aria-label="Abrir o menu de navegação"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground/80 hover:text-foreground lg:hidden"
        >
          <Menu size={18} />
        </button>
        <h1 className="truncate text-base font-semibold text-foreground sm:text-lg">{titulo}</h1>
      </div>

      <form onSubmit={buscar} className="hidden max-w-xs flex-1 md:block" title="Buscar um processo pelo nome do cliente">
        <div className="relative">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar cliente..."
            aria-label="Buscar cliente"
            className="w-full rounded-lg border border-border bg-surface-alt py-2 pl-9 pr-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/15"
          />
        </div>
      </form>

      <div className="flex shrink-0 items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-foreground">Dr. Ian Libardi</p>
          <p className="text-xs text-muted">Libardi Advocacia</p>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
