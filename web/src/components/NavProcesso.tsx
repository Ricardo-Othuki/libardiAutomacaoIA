"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, FileStack, History, Link2, ListChecks } from "lucide-react";

const ABAS = [
  { sufixo: "", rotulo: "Checklist", legenda: "Itens pedidos ao cliente e seus estados", Icone: ListChecks },
  { sufixo: "/link", rotulo: "Link de envio", legenda: "Gerar, revogar e copiar o link do cliente", Icone: Link2 },
  { sufixo: "/dossie", rotulo: "Dossiê", legenda: "Ordenar documentos e exportar para o tribunal", Icone: FileStack },
  { sufixo: "/cobranca", rotulo: "Cobrança", legenda: "Configurar lembretes automáticos ao cliente", Icone: Bell },
  { sufixo: "/historico", rotulo: "Histórico", legenda: "Linha do tempo de tudo que aconteceu no processo", Icone: History },
];

// As etapas do fluxo do processo viram cards grandes, não abas de texto —
// cada um já mostra o que faz, sem precisar abrir pra descobrir.
export function NavProcesso({ processoId }: { processoId: string }) {
  const pathname = usePathname() ?? "";
  const base = `/advogado/processos/${processoId}`;

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {ABAS.map((aba) => {
        const href = `${base}${aba.sufixo}`;
        const ativo = pathname === href || (aba.sufixo === "" && pathname === base);
        return (
          <Link
            key={aba.sufixo}
            href={href}
            className={`rounded-xl border p-4 transition-all ${
              ativo
                ? "border-primary bg-primary text-primary-contrast shadow-theme-md"
                : "border-border bg-surface text-foreground hover:-translate-y-0.5 hover:shadow-theme-sm"
            }`}
          >
            <aba.Icone size={20} className={ativo ? "text-primary-contrast" : "text-primary"} />
            <p className="mt-2 text-sm font-semibold">{aba.rotulo}</p>
            <p className={`mt-0.5 text-xs leading-snug ${ativo ? "text-primary-contrast/80" : "text-muted"}`}>
              {aba.legenda}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
