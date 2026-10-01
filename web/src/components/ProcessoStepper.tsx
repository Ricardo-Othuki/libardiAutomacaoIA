import { Check } from "lucide-react";
import type { Processo } from "@/lib/types";

// Guia visual do primeiro ao último passo dentro de um processo: mostra em
// qual etapa do ciclo de vida o caso está agora, calculado a partir do
// estado real dos itens — não é um campo separado para não duplicar dado.
export function ProcessoStepper({ processo }: { processo: Processo }) {
  const pendentes = processo.itens.filter((i) => i.estado === "pendente").length;
  const aguardandoConferencia = processo.itens.filter(
    (i) => i.estado === "recebido" || i.estado === "em_conferencia"
  ).length;

  const etapas = [
    { titulo: "Abertura", legenda: "Processo criado a partir de um modelo", feito: true },
    { titulo: "Coleta", legenda: "Aguardando o cliente enviar os documentos", feito: pendentes === 0 },
    {
      titulo: "Conferência",
      legenda: "Aceitando ou recusando o que o cliente enviou",
      feito: pendentes === 0 && aguardandoConferencia === 0,
    },
    { titulo: "Pronto para o dossiê", legenda: "Obrigatórios aceitos, pode montar e exportar", feito: processo.pronto },
  ];

  const indiceAtual = etapas.findIndex((e) => !e.feito);

  return (
    <ol className="mb-6 flex flex-wrap gap-y-3 sm:flex-nowrap" title="Etapas do processo, da abertura até o dossiê pronto">
      {etapas.map((etapa, i) => {
        const concluida = etapa.feito;
        const atual = !concluida && i === indiceAtual;
        return (
          <li key={etapa.titulo} className="flex flex-1 items-center gap-2">
            <div className="flex items-center gap-2">
              <span
                title={etapa.legenda}
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  concluida
                    ? "bg-success text-background"
                    : atual
                      ? "bg-primary text-primary-contrast"
                      : "bg-border text-foreground/60"
                }`}
              >
                {concluida ? <Check size={14} /> : i + 1}
              </span>
              <div>
                <p className={`text-xs font-medium ${atual ? "text-foreground" : "text-foreground/70"}`}>
                  {etapa.titulo}
                </p>
                <p className="hidden text-[11px] text-muted sm:block">{etapa.legenda}</p>
              </div>
            </div>
            {i < etapas.length - 1 && <div className="mx-2 hidden h-px flex-1 bg-border sm:block" />}
          </li>
        );
      })}
    </ol>
  );
}
