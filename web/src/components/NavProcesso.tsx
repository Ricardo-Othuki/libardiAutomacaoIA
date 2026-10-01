"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ABAS = [
  { sufixo: "", rotulo: "Checklist", legenda: "Itens pedidos ao cliente e seus estados" },
  { sufixo: "/link", rotulo: "Link de envio", legenda: "Gerar, revogar e copiar o link do cliente" },
  { sufixo: "/dossie", rotulo: "Dossiê", legenda: "Ordenar documentos e exportar para o tribunal" },
  { sufixo: "/cobranca", rotulo: "Cobrança", legenda: "Configurar lembretes automáticos ao cliente" },
  { sufixo: "/historico", rotulo: "Histórico", legenda: "Linha do tempo de tudo que aconteceu no processo" },
];

export function NavProcesso({ processoId }: { processoId: string }) {
  const pathname = usePathname() ?? "";
  const base = `/advogado/processos/${processoId}`;
  return (
    <div className="mb-6 border-b border-border">
      <ul className="flex flex-wrap gap-1">
        {ABAS.map((aba) => {
          const href = `${base}${aba.sufixo}`;
          const ativo = pathname === href || (aba.sufixo === "" && pathname === base);
          return (
            <li key={aba.sufixo}>
              <Link
                href={href}
                title={aba.legenda}
                className={`block rounded-t-md border-b-2 px-3 py-2 text-sm font-medium ${
                  ativo
                    ? "border-primary text-primary"
                    : "border-transparent text-foreground/70 hover:text-foreground"
                }`}
              >
                {aba.rotulo}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
