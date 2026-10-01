import { HelpCircle } from "lucide-react";
import { Dica } from "./Dica";

export function Tabela({
  colunas,
  legenda,
  children,
}: {
  colunas: string[];
  /** Obrigatório: explica o que esta tabela está listando — aparece como dica ao passar o mouse no ícone. */
  legenda: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5">
        <Dica texto={legenda}>
          <HelpCircle size={14} className="text-muted hover:text-foreground" />
        </Dica>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border bg-surface shadow-theme-xs">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-alt">
            <tr>
              {colunas.map((c) => (
                <th key={c} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">{children}</tbody>
        </table>
      </div>
    </div>
  );
}
