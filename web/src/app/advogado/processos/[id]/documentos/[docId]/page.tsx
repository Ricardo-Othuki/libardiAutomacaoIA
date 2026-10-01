"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AjudaDaTela } from "@/components/ui/AjudaDaTela";
import { Aviso } from "@/components/ui/Aviso";
import { Botao } from "@/components/ui/Botao";
import { Card } from "@/components/ui/Card";
import { EstadoItemBadge } from "@/components/ui/EstadoBadge";
import { formatarDataHora, getProcesso } from "@/lib/mock/data";

// Tela de conferência de documento (tarefa 1.6): visualização do arquivo,
// motivo de recusa e confirmação — cobre o caminho de aceitar e o de
// recusar.
export default function ConferenciaDocumentoPage({
  params,
}: {
  params: Promise<{ id: string; docId: string }>;
}) {
  const { id, docId } = use(params);
  const processo = getProcesso(id);
  if (!processo) notFound();

  const item = processo.itens.find((i) => i.documentos.some((d) => d.id === docId));
  const documento = item?.documentos.find((d) => d.id === docId);
  if (!item || !documento) notFound();

  const [decisao, setDecisao] = useState<"nenhuma" | "aceito" | "recusado">(
    documento.estado === "aceito" ? "aceito" : documento.estado === "recusado" ? "recusado" : "nenhuma"
  );
  const [motivo, setMotivo] = useState(documento.motivoRecusa ?? "");

  return (
    <div className="mx-auto max-w-3xl">
      <Link href={`/advogado/processos/${id}`} className="text-sm text-primary hover:underline">
        ← Voltar à checklist
      </Link>

      <AjudaDaTela titulo="Conferência de documento">
        Confira o arquivo enviado pelo cliente para o item &quot;{item.nomeTecnico}&quot;.
        Aceite se estiver correto, ou recuse explicando o motivo — o cliente
        verá essa explicação em linguagem simples.
      </AjudaDaTela>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Visualização</p>
          <div className="mt-2 flex aspect-[3/4] items-center justify-center rounded-md border border-dashed border-border bg-background text-sm text-muted">
            {documento.nomeArquivo}
            <br />
            (protótipo: sem arquivo real)
          </div>
          <p className="mt-2 text-xs text-muted">Enviado em {formatarDataHora(documento.enviadoEm)}</p>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-medium text-foreground">{item.nomeTecnico}</p>
            <EstadoItemBadge estado={decisao === "nenhuma" ? documento.estado : decisao} />
          </div>
          <p className="text-sm text-muted">{item.descricaoSimples}</p>

          {decisao === "aceito" && (
            <Aviso tipo="sucesso" titulo="Documento aceito">
              Este documento foi marcado como aceito e vai para o dossiê.
            </Aviso>
          )}

          {decisao !== "aceito" && (
            <div className="flex gap-2">
              <Botao legenda="Confirma que o documento está correto e completo" onClick={() => setDecisao("aceito")}>
                Aceitar documento
              </Botao>
            </div>
          )}

          <div className="space-y-2 border-t border-border pt-4">
            <label className="block text-sm font-medium text-foreground" htmlFor="motivo-recusa">
              Motivo da recusa
            </label>
            <textarea
              id="motivo-recusa"
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
              rows={3}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ex.: documento ilegível, não corresponde ao item pedido"
            />
            <Botao
              variante="perigoso"
              legenda="Recusa o documento, devolve o item a pendente e registra este motivo"
              disabled={!motivo}
              onClick={() => setDecisao("recusado")}
            >
              Recusar com este motivo
            </Botao>
          </div>

          {decisao === "recusado" && (
            <Aviso tipo="perigo" titulo="Documento recusado">
              O item voltou para pendente. O cliente verá: &quot;{motivo}&quot;
            </Aviso>
          )}
        </Card>
      </div>
    </div>
  );
}
