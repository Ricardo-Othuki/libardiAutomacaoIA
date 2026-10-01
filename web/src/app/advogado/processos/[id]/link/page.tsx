"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AjudaDaTela } from "@/components/ui/AjudaDaTela";
import { Aviso } from "@/components/ui/Aviso";
import { Botao } from "@/components/ui/Botao";
import { Card } from "@/components/ui/Card";
import { EstadoLinkBadge } from "@/components/ui/EstadoBadge";
import { formatarDataHora, getProcesso } from "@/lib/mock/data";

// Tela de geração e gestão do link de envio (tarefa 1.7): prazo de
// validade, revogação (ação destrutiva, com confirmação) e cópia do link.
export default function LinkEnvioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const processo = getProcesso(id);
  if (!processo) notFound();

  const [link, setLink] = useState(processo.link);
  const [confirmandoRevogacao, setConfirmandoRevogacao] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const url = `https://coleta.libardiadvocacia.com.br/portal/${link.token}`;

  return (
    <div className="max-w-xl">
      <AjudaDaTela titulo="Link de envio do cliente">
        Este é o único jeito do cliente acessar a lista de documentos: sem
        cadastro e sem senha. Revogar o link é uma ação destrutiva — o
        cliente perde o acesso imediatamente, mesmo que o prazo ainda não
        tenha vencido.
      </AjudaDaTela>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">Estado do link</p>
          <EstadoLinkBadge estado={link.estado} />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">URL para o cliente</p>
          <div className="mt-1 flex items-center gap-2">
            <code className="flex-1 truncate rounded-md border border-border bg-background px-3 py-2 text-xs">
              {url}
            </code>
            <Botao
              compacto
              variante="secundario"
              legenda="Copia a URL para enviar ao cliente por WhatsApp ou e-mail"
              onClick={() => {
                navigator.clipboard?.writeText(url).catch(() => {});
                setCopiado(true);
              }}
            >
              {copiado ? "Copiado!" : "Copiar"}
            </Botao>
          </div>
        </div>

        <p className="text-sm text-foreground/80">
          Válido até <strong>{formatarDataHora(link.validoAte)}</strong>
        </p>

        {link.estado === "ativo" && !confirmandoRevogacao && (
          <Botao
            variante="perigoso"
            legenda="Cancela o link imediatamente; o cliente não consegue mais enviar documentos por ele"
            onClick={() => setConfirmandoRevogacao(true)}
          >
            Revogar link
          </Botao>
        )}

        {confirmandoRevogacao && (
          <Aviso tipo="perigo" titulo="Confirmar revogação">
            <p className="mb-3">
              Isso não pode ser desfeito. O cliente perderá o acesso ao link
              imediatamente. Você poderá gerar um novo link depois.
            </p>
            <div className="flex gap-2">
              <Botao
                compacto
                variante="perigoso"
                legenda="Confirma a revogação definitiva deste link"
                onClick={() => {
                  setLink((l) => ({ ...l, estado: "revogado", revogadoEm: new Date().toISOString() }));
                  setConfirmandoRevogacao(false);
                }}
              >
                Sim, revogar
              </Botao>
              <Botao
                compacto
                variante="secundario"
                legenda="Mantém o link ativo como está"
                onClick={() => setConfirmandoRevogacao(false)}
              >
                Cancelar
              </Botao>
            </div>
          </Aviso>
        )}

        {link.estado !== "ativo" && (
          <Botao
            legenda="Cria um novo link, substituindo o anterior"
            onClick={() =>
              setLink({ token: link.token, criadoEm: new Date().toISOString(), validoAte: new Date().toISOString(), estado: "ativo" })
            }
          >
            Gerar novo link
          </Botao>
        )}
      </Card>

      <Card className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Ver como o cliente vê (só neste protótipo)
        </p>
        <ul className="mt-2 space-y-1 text-sm">
          <li>
            <Link href={`/portal/${link.token}`} className="text-primary hover:underline">
              Portal normal
            </Link>
          </li>
          <li>
            <Link href={`/portal/${link.token}?estado=expirado`} className="text-primary hover:underline">
              Estado: link expirado
            </Link>
          </li>
          <li>
            <Link href={`/portal/${link.token}?estado=revogado`} className="text-primary hover:underline">
              Estado: link revogado
            </Link>
          </li>
          <li>
            <Link href={`/portal/${link.token}?estado=formato_recusado`} className="text-primary hover:underline">
              Estado: formato de arquivo recusado
            </Link>
          </li>
          <li>
            <Link href={`/portal/${link.token}?estado=conexao_interrompida`} className="text-primary hover:underline">
              Estado: conexão interrompida
            </Link>
          </li>
          <li>
            <Link href={`/portal/${link.token}?estado=retomado`} className="text-primary hover:underline">
              Estado: envio retomado
            </Link>
          </li>
        </ul>
      </Card>
    </div>
  );
}
