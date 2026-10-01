"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AjudaDaTela } from "@/components/ui/AjudaDaTela";
import { Aviso } from "@/components/ui/Aviso";
import { Botao } from "@/components/ui/Botao";
import { Card } from "@/components/ui/Card";
import { EstadoItemBadge } from "@/components/ui/EstadoBadge";
import { getProcesso } from "@/lib/mock/data";
import type { ItemChecklist } from "@/lib/types";

// Tela do processo (tarefa 1.5): a checklist com os cinco estados possíveis
// por item, ações de aceitar/recusar, e a área de triagem de documentos
// enviados fora da lista.
export default function ProcessoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const processoOriginal = getProcesso(id);
  if (!processoOriginal) notFound();

  const [itens, setItens] = useState<ItemChecklist[]>(processoOriginal.itens);
  const [recusandoId, setRecusandoId] = useState<string | null>(null);
  const [motivo, setMotivo] = useState("");

  function aceitar(itemId: string) {
    setItens((atual) =>
      atual.map((i) => (i.id === itemId ? { ...i, estado: "aceito", motivoRecusa: undefined } : i))
    );
  }

  function confirmarRecusa(itemId: string) {
    setItens((atual) =>
      atual.map((i) =>
        i.id === itemId ? { ...i, estado: "pendente", motivoRecusa: motivo || "Documento não corresponde ao item pedido" } : i
      )
    );
    setRecusandoId(null);
    setMotivo("");
  }

  const blocos = Array.from(new Set(itens.map((i) => i.bloco)));

  return (
    <div>
      <AjudaDaTela titulo="Checklist do processo">
        Cada item tem um estado visível: pendente, recebido, em conferência,
        aceito ou recusado. Ao chegar um documento, confira-o e aceite ou
        recuse com um motivo — a recusa volta o item para pendente e o
        cliente vê o motivo em linguagem simples.
      </AjudaDaTela>

      <div className="space-y-6">
        {blocos.map((bloco) => (
          <div key={bloco}>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">{bloco}</h2>
            <div className="space-y-2">
              {itens
                .filter((i) => i.bloco === bloco)
                .map((item) => (
                  <Card key={item.id}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-medium text-foreground">
                          {item.nomeTecnico}
                          {item.obrigatorio && <span className="ml-1 text-xs text-danger">*obrigatório</span>}
                          {item.tipo === "informacao" && (
                            <span className="ml-1 text-xs text-warning" title="Respondido em texto pelo cliente, sem arquivo">
                              · Informação
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-muted">{item.descricaoSimples}</p>
                      </div>
                      <EstadoItemBadge estado={item.estado} />
                    </div>

                    {item.tipo === "informacao" && item.resposta && (
                      <div className="mt-2 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground/90">
                        &quot;{item.resposta}&quot;
                      </div>
                    )}

                    {item.tipo !== "informacao" && item.documentos.length > 0 && (
                      <ul className="mt-2 space-y-1 border-t border-border pt-2">
                        {item.documentos.map((doc) => (
                          <li key={doc.id} className="flex items-center justify-between text-sm">
                            <Link
                              href={`/advogado/processos/${id}/documentos/${doc.id}`}
                              className="text-primary hover:underline"
                              title="Abrir a conferência deste documento"
                            >
                              {doc.nomeArquivo}
                            </Link>
                            <EstadoItemBadge estado={doc.estado} />
                          </li>
                        ))}
                      </ul>
                    )}

                    {item.motivoRecusa && (
                      <p className="mt-2 text-xs text-danger">Motivo da última recusa: {item.motivoRecusa}</p>
                    )}

                    {(item.estado === "recebido" || item.estado === "em_conferencia") && (
                      <div className="mt-3 flex flex-wrap items-start gap-3 border-t border-border pt-3">
                        <Botao compacto variante="primario" legenda="Confirma que o documento está correto e completo" onClick={() => aceitar(item.id)}>
                          Aceitar
                        </Botao>
                        <Botao
                          compacto
                          variante="perigoso"
                          legenda="Recusa o documento e pede um novo ao cliente, com motivo"
                          onClick={() => setRecusandoId(item.id)}
                        >
                          Recusar
                        </Botao>
                      </div>
                    )}

                    {recusandoId === item.id && (
                      <div className="mt-3 space-y-2 border-t border-border pt-3">
                        <label className="block text-xs font-medium text-foreground" htmlFor={`motivo-${item.id}`}>
                          Motivo da recusa (o cliente vai ver este texto)
                        </label>
                        <textarea
                          id={`motivo-${item.id}`}
                          className="w-full rounded-md border border-border px-3 py-2 text-sm"
                          rows={2}
                          value={motivo}
                          onChange={(e) => setMotivo(e.target.value)}
                          placeholder="Ex.: a foto saiu borrada, não dá para ler"
                        />
                        <div className="flex gap-2">
                          <Botao compacto legenda="Envia a recusa com o motivo escrito acima" onClick={() => confirmarRecusa(item.id)}>
                            Confirmar recusa
                          </Botao>
                          <Botao compacto variante="secundario" legenda="Cancela sem recusar o documento" onClick={() => setRecusandoId(null)}>
                            Cancelar
                          </Botao>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>

      {processoOriginal.triagem.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
            Triagem — documentos enviados fora da lista
          </h2>
          <Aviso tipo="atencao" titulo="Precisam da sua decisão">
            Estes arquivos não entram no dossiê até você vincular a um item,
            criar um item novo ou descartar.
          </Aviso>
          <div className="mt-2 space-y-2">
            {processoOriginal.triagem.map((t) => (
              <Card key={t.id} className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-foreground">{t.nomeArquivo}</p>
                  {t.observacaoCliente && <p className="text-xs text-muted">&quot;{t.observacaoCliente}&quot;</p>}
                </div>
                <div className="flex gap-2">
                  <Botao compacto variante="secundario" legenda="Associa este arquivo a um item existente da checklist">
                    Vincular a um item
                  </Botao>
                  <Botao compacto variante="fantasma" legenda="Remove o arquivo sem incluir no dossiê">
                    Descartar
                  </Botao>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
