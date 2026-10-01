import Link from "next/link";
import { AlertTriangle, CheckCircle2, FolderClock, PauseCircle, Plus } from "lucide-react";
import { AjudaDaTela } from "@/components/ui/AjudaDaTela";
import { Aviso } from "@/components/ui/Aviso";
import { Botao } from "@/components/ui/Botao";
import { Tabela } from "@/components/ui/Tabela";
import { GraficoPorArea } from "@/components/graficos/GraficoPorArea";
import { GraficoSituacao } from "@/components/graficos/GraficoSituacao";
import { formatarDiasDesde, HOJE, PROCESSOS, contarPendentes } from "@/lib/mock/data";

const LIMITE_PARADO_DIAS = 7;

function diasParado(ultimaMovimentacaoEm: string): number {
  return Math.floor((HOJE.getTime() - new Date(ultimaMovimentacaoEm).getTime()) / (1000 * 60 * 60 * 24));
}

const CORES_CARTAO = {
  neutro: "bg-surface-alt text-foreground",
  perigo: "bg-danger-bg text-danger",
  sucesso: "bg-success-bg text-success",
  atencao: "bg-warning-bg text-warning",
} as const;

// Tela do painel de pendências (tarefa 1.3), o painel de controle do
// sistema: responde "o que está me travando agora" com um resumo
// numérico e dois gráficos antes mesmo da lista, com o próximo passo
// (abrir processo) sempre à mão no topo.
export default async function PendenciasPage({
  searchParams,
}: {
  searchParams: Promise<{ busca?: string }>;
}) {
  const { busca } = await searchParams;
  const termo = (busca ?? "").trim().toLowerCase();

  const todos = [...PROCESSOS].sort((a, b) => diasParado(b.ultimaMovimentacaoEm) - diasParado(a.ultimaMovimentacaoEm));
  const processos = termo ? todos.filter((p) => p.cliente.toLowerCase().includes(termo)) : todos;
  const travados = todos.filter((p) => diasParado(p.ultimaMovimentacaoEm) > LIMITE_PARADO_DIAS);
  const prontos = todos.filter((p) => p.pronto);
  const emAndamento = todos.filter((p) => !p.pronto && diasParado(p.ultimaMovimentacaoEm) <= LIMITE_PARADO_DIAS);
  const cobrancaSuspensa = todos.filter((p) => p.cobranca.estado === "suspensa");

  const porArea = Object.entries(
    todos.reduce<Record<string, number>>((acc, p) => {
      acc[p.tipoCausa] = (acc[p.tipoCausa] ?? 0) + 1;
      return acc;
    }, {})
  ).map(([area, quantidade]) => ({ area, quantidade }));

  const CARTOES = [
    { titulo: "Processos ativos", valor: todos.length, Icone: FolderClock, cor: "neutro" as const },
    { titulo: "Travados", valor: travados.length, Icone: AlertTriangle, cor: "perigo" as const },
    { titulo: "Prontos para o dossiê", valor: prontos.length, Icone: CheckCircle2, cor: "sucesso" as const },
    { titulo: "Com cobrança suspensa", valor: cobrancaSuspensa.length, Icone: PauseCircle, cor: "atencao" as const },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <AjudaDaTela titulo="Painel de pendências">
            Todos os seus processos ativos em uma tela só, ordenados do mais
            parado para o mais recente. Processos destacados em vermelho
            estão sem movimentação há mais de {LIMITE_PARADO_DIAS} dias.
          </AjudaDaTela>
        </div>
        <Link href="/advogado/processos/novo" className="shrink-0">
          <Botao legenda="Inicia um novo caso, escolhendo cliente e tipo de causa">
            <Plus size={16} />
            Novo processo
          </Botao>
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {CARTOES.map((c) => (
          <div key={c.titulo} className="rounded-xl border border-border bg-surface p-4 shadow-theme-xs" title={c.titulo}>
            <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${CORES_CARTAO[c.cor]}`}>
              <c.Icone size={18} />
            </span>
            <p className="mt-3 text-2xl font-semibold text-foreground">{c.valor}</p>
            <p className="text-xs text-muted">{c.titulo}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-5 shadow-theme-xs">
          <GraficoSituacao travados={travados.length} emAndamento={emAndamento.length} prontos={prontos.length} />
        </div>
        <div className="rounded-xl border border-border bg-surface p-5 shadow-theme-xs">
          <GraficoPorArea itens={porArea} />
        </div>
      </div>

      {todos.length <= 2 && (
        <Aviso tipo="info" titulo="Primeiro passo">
          Para começar um caso novo, clique em &quot;Novo processo&quot;
          acima, escolha o tipo de causa e gere o link para o cliente.
        </Aviso>
      )}

      {termo && (
        <p className="mt-2 mb-2 text-sm text-muted">
          {processos.length} resultado(s) para &quot;{busca}&quot; —{" "}
          <Link href="/advogado/pendencias" className="text-primary hover:underline">
            limpar busca
          </Link>
        </p>
      )}

      <div className="mt-4">
        <Tabela
          colunas={["Cliente", "Tipo de causa", "Pendentes", "Última movimentação", "Situação", "Ações"]}
          legenda="Cada linha é um processo. Clique em 'Abrir' para ver a checklist completa."
        >
          {processos.map((p) => {
            const dias = diasParado(p.ultimaMovimentacaoEm);
            const travado = dias > LIMITE_PARADO_DIAS;
            return (
              <tr key={p.id} className={travado ? "bg-danger-bg/40" : undefined}>
                <td className="px-4 py-2 font-medium text-foreground">{p.cliente}</td>
                <td className="px-4 py-2 text-foreground/80">{p.tipoCausa}</td>
                <td className="px-4 py-2 text-foreground/80">{contarPendentes(p)} de {p.itens.length}</td>
                <td className="px-4 py-2 text-foreground/80">{formatarDiasDesde(p.ultimaMovimentacaoEm)}</td>
                <td className="px-4 py-2">
                  {travado ? (
                    <span className="inline-flex items-center rounded-full bg-danger-bg px-2.5 py-0.5 text-xs font-medium text-danger" title={`Sem novos envios há mais de ${LIMITE_PARADO_DIAS} dias`}>
                      Travado
                    </span>
                  ) : p.pronto ? (
                    <span className="inline-flex items-center rounded-full bg-success-bg px-2.5 py-0.5 text-xs font-medium text-success" title="Obrigatórios aceitos, pronto para montar o dossiê">
                      Pronto
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-info-bg px-2.5 py-0.5 text-xs font-medium text-info" title="Coleta em andamento normalmente">
                      Em andamento
                    </span>
                  )}
                </td>
                <td className="px-4 py-2">
                  <Link href={`/advogado/processos/${p.id}`}>
                    <Botao compacto legenda="Abre a checklist completa deste processo" variante="secundario">
                      Abrir
                    </Botao>
                  </Link>
                </td>
              </tr>
            );
          })}
        </Tabela>
      </div>
    </div>
  );
}
