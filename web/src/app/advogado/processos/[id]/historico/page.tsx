import { notFound } from "next/navigation";
import { AjudaDaTela } from "@/components/ui/AjudaDaTela";
import { Tabela } from "@/components/ui/Tabela";
import { formatarDataHora, getProcesso } from "@/lib/mock/data";
import type { EventoHistorico } from "@/lib/types";

// Tela de histórico e auditoria do processo (tarefa 1.14): autor, ação e
// data/hora de cada evento relevante, do mais recente para o mais antigo.
export default async function HistoricoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const processo = getProcesso(id);
  if (!processo) notFound();

  const eventos: EventoHistorico[] = [...processo.historico];

  eventos.push({
    id: "ev-link",
    autor: "Dr. Ian Libardi",
    acao: "Link de envio gerado e enviado ao cliente",
    dataHora: processo.link.criadoEm,
  });

  for (const item of processo.itens) {
    for (const doc of item.documentos) {
      eventos.push({
        id: `ev-doc-${doc.id}`,
        autor: "Cliente",
        acao: `Enviou "${doc.nomeArquivo}" para o item "${item.nomeTecnico}"`,
        dataHora: doc.enviadoEm,
      });
      if (doc.estado === "aceito" || doc.estado === "recusado") {
        eventos.push({
          id: `ev-doc-${doc.id}-decisao`,
          autor: "Dr. Ian Libardi",
          acao: doc.estado === "aceito" ? `Aceitou "${doc.nomeArquivo}"` : `Recusou "${doc.nomeArquivo}": ${doc.motivoRecusa ?? ""}`,
          dataHora: doc.enviadoEm,
        });
      }
    }
  }

  if (processo.cobranca.ultimoEnvioEm) {
    eventos.push({
      id: "ev-cobranca",
      autor: "Sistema",
      acao: "Lembrete de pendências enviado ao cliente",
      dataHora: processo.cobranca.ultimoEnvioEm,
    });
  }

  eventos.sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime());

  return (
    <div>
      <AjudaDaTela titulo="Histórico e auditoria">
        Toda ação relevante do processo fica registrada aqui, com quem fez,
        o quê e quando — serve como prova de diligência e para entender o
        que aconteceu em qualquer momento.
      </AjudaDaTela>

      <Tabela
        colunas={["Quando", "Quem", "O que aconteceu"]}
        legenda="Lista completa de eventos, do mais recente para o mais antigo."
      >
        {eventos.map((ev) => (
          <tr key={ev.id}>
            <td className="whitespace-nowrap px-4 py-2 text-foreground/80">{formatarDataHora(ev.dataHora)}</td>
            <td className="px-4 py-2 font-medium text-foreground">{ev.autor}</td>
            <td className="px-4 py-2 text-foreground/80">{ev.acao}</td>
          </tr>
        ))}
      </Tabela>
    </div>
  );
}
