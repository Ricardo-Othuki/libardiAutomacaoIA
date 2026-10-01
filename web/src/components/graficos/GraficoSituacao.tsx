import { AlertTriangle, CheckCircle2, Clock3 } from "lucide-react";

interface Props {
  travados: number;
  emAndamento: number;
  prontos: number;
}

// Barra única 100% empilhada com as cores reservadas de status (não é uma
// paleta categórica arbitrária: travado é crítico, em andamento é neutro,
// pronto é bom) — por isso vem sempre com ícone + rótulo, nunca só cor.
export function GraficoSituacao({ travados, emAndamento, prontos }: Props) {
  const total = travados + emAndamento + prontos;

  const segmentos = [
    { chave: "travados", valor: travados, cor: "bg-danger", rotulo: "Travado", Icone: AlertTriangle, corTexto: "text-danger" },
    { chave: "andamento", valor: emAndamento, cor: "bg-info", rotulo: "Em andamento", Icone: Clock3, corTexto: "text-info" },
    { chave: "prontos", valor: prontos, cor: "bg-success", rotulo: "Pronto", Icone: CheckCircle2, corTexto: "text-success" },
  ].filter((s) => s.valor > 0);

  return (
    <div>
      <h2 className="text-sm font-semibold text-foreground">Processos por situação</h2>
      <p className="mt-0.5 text-xs text-muted">De {total} processo(s) ativos agora</p>

      {total === 0 ? (
        <p className="mt-4 text-sm text-muted">Nenhum processo ainda.</p>
      ) : (
        <>
          <div className="mt-4 flex h-5 w-full overflow-hidden rounded-full bg-surface-alt">
            {segmentos.map((s, i) => (
              <div
                key={s.chave}
                className={`${s.cor} h-full transition-opacity hover:opacity-80 ${i < segmentos.length - 1 ? "border-r-2 border-surface" : ""}`}
                style={{ width: `${(s.valor / total) * 100}%` }}
                title={`${s.rotulo}: ${s.valor} de ${total}`}
              />
            ))}
          </div>

          <ul className="mt-4 space-y-2">
            {segmentos.map((s) => (
              <li key={s.chave} className="flex items-center justify-between text-sm">
                <span className={`flex items-center gap-1.5 ${s.corTexto}`}>
                  <s.Icone size={14} />
                  <span className="text-foreground/80">{s.rotulo}</span>
                </span>
                <span className="font-medium text-foreground">{s.valor}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
