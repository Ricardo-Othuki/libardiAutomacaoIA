"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FilePlus2, HelpCircle, LayoutDashboard, LibraryBig, LogOut, Scale } from "lucide-react";
import { Dica } from "./ui/Dica";

const GRUPOS = [
  {
    titulo: "Visão geral",
    links: [
      {
        href: "/advogado/pendencias",
        rotulo: "Painel de pendências",
        legenda: "Veja todos os processos e o que falta em cada um",
        Icone: LayoutDashboard,
      },
    ],
  },
  {
    titulo: "Casos",
    links: [
      {
        href: "/advogado/processos/novo",
        rotulo: "Abrir processo",
        legenda: "Inicie um caso novo a partir de um tipo de causa",
        Icone: FilePlus2,
      },
    ],
  },
  {
    titulo: "Cadastros",
    links: [
      {
        href: "/advogado/catalogo",
        rotulo: "Catálogo de modelos",
        legenda: "Edite as listas de documentos por tipo de causa",
        Icone: LibraryBig,
      },
    ],
  },
];

export function NavAdvogado({ onNavegar }: { onNavegar?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex h-full flex-col justify-between bg-surface p-4">
      <div>
        <Link
          href="/advogado/pendencias"
          onClick={onNavegar}
          className="mb-6 flex items-center gap-2 px-2 text-base font-semibold text-foreground"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-contrast">
            <Scale size={16} />
          </span>
          Libardi Advocacia
        </Link>

        <div className="space-y-5">
          {GRUPOS.map((grupo, gi) => (
            <div key={grupo.titulo} className={gi > 0 ? "border-t border-border pt-5" : undefined}>
              <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
                {grupo.titulo}
              </p>
              <ul className="space-y-1">
                {grupo.links.map((l) => {
                  const ativo = pathname?.startsWith(l.href);
                  return (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        onClick={onNavegar}
                        className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                          ativo
                            ? "bg-primary text-primary-contrast shadow-theme-xs"
                            : "text-foreground/70 hover:bg-surface-alt hover:text-foreground"
                        }`}
                      >
                        <l.Icone size={17} />
                        <span className="flex-1">{l.rotulo}</span>
                        <Dica texto={l.legenda} posicao="baixo">
                          <HelpCircle size={14} className={ativo ? "text-primary-contrast/70" : "text-muted"} />
                        </Dica>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2.5 border-t border-border pt-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
          IL
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">Dr. Ian Libardi</p>
          <Link href="/login" className="flex items-center gap-1 text-xs text-primary hover:underline">
            <LogOut size={12} />
            Sair da conta
            <Dica texto="Encerra a sessão e volta para a tela de entrada" posicao="cima">
              <HelpCircle size={12} className="text-muted" />
            </Dica>
          </Link>
        </div>
      </div>
    </nav>
  );
}
