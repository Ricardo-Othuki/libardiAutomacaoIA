"use client";

import { Suspense, use, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Aviso } from "@/components/ui/Aviso";
import { Botao } from "@/components/ui/Botao";
import { Card } from "@/components/ui/Card";
import { EstadoBloqueante } from "@/components/portal/EstadoBloqueante";
import { PROCESSOS } from "@/lib/mock/data";
import type { EstadoItem } from "@/lib/types";

type EstadoSimples = "falta_enviar" | "recebemos" | "aprovado" | "nao_deu_certo";

function paraEstadoSimples(e: EstadoItem): EstadoSimples {
  if (e === "pendente") return "falta_enviar";
  if (e === "recusado") return "nao_deu_certo";
  if (e === "aceito") return "aprovado";
  return "recebemos";
}

const RÓTULO: Record<EstadoSimples, string> = {
  falta_enviar: "Falta enviar",
  recebemos: "Recebemos, aguardando conferência",
  aprovado: "Aprovado",
  nao_deu_certo: "Não deu certo",
};

const ESTILO: Record<EstadoSimples, string> = {
  falta_enviar: "bg-border text-foreground/70",
  recebemos: "bg-info-bg text-info",
  aprovado: "bg-success-bg text-success",
  nao_deu_certo: "bg-danger-bg text-danger",
};

// Tela do portal do cliente (tarefas 1.12 e 1.13): checklist em linguagem
// simples, envio por item, envio de documento adicional, progresso,
// confirmação de recebimento e os estados de exceção (link expirado,
// revogado, formato recusado, conexão interrompida, envio retomado) — sem
// nenhum termo técnico visível ao cliente.
export default function PortalPage({ params }: { params: Promise<{ token: string }> }) {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Carregando...</p>}>
      <PortalConteudo params={params} />
    </Suspense>
  );
}

function PortalConteudo({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const searchParams = useSearchParams();
  const estadoForcado = searchParams.get("estado");

  const processo = PROCESSOS.find((p) => p.link.token === token) ?? PROCESSOS[0];
  const [itens, setItens] = useState(processo.itens);
  const [enviando, setEnviando] = useState<string | null>(null);
  const [arquivoAdicionalEnviado, setArquivoAdicionalEnviado] = useState(false);
  const [rascunhos, setRascunhos] = useState<Record<string, string>>({});

  if (estadoForcado === "expirado") {
    return (
      <EstadoBloqueante
        titulo="Este link não está mais disponível"
        texto="O prazo para usar este link acabou. Peça ao seu advogado para enviar um novo."
      />
    );
  }
  if (estadoForcado === "revogado") {
    return (
      <EstadoBloqueante
        titulo="Este link não está mais disponível"
        texto="Este link foi cancelado. Peça ao seu advogado para enviar um novo."
      />
    );
  }

  function simularEnvio(itemId: string) {
    setEnviando(itemId);
    setTimeout(() => {
      setItens((atual) =>
        atual.map((i) =>
          i.id === itemId
            ? {
                ...i,
                estado: "recebido",
                documentos: [
                  ...i.documentos,
                  { id: `novo-${Date.now()}`, nomeArquivo: "arquivo-enviado.jpg", enviadoEm: new Date().toISOString(), estado: "recebido" as const },
                ],
              }
            : i
        )
      );
      setEnviando(null);
    }, 900);
  }

  function enviarResposta(itemId: string) {
    const texto = (rascunhos[itemId] ?? "").trim();
    if (!texto) return;
    setItens((atual) => atual.map((i) => (i.id === itemId ? { ...i, estado: "recebido", resposta: texto } : i)));
  }

  const total = itens.length;
  const concluidos = itens.filter((i) => i.estado === "aceito" || i.estado === "recebido" || i.estado === "em_conferencia").length;

  return (
    <div className="space-y-4">
      {estadoForcado === "conexao_interrompida" && (
        <Aviso tipo="atencao" titulo="A internet caiu no meio de um envio">
          Não se preocupe: o que você já enviou está salvo. Quando a conexão
          voltar, é só continuar de onde parou.
        </Aviso>
      )}
      {estadoForcado === "retomado" && (
        <Aviso tipo="sucesso" titulo="Conexão de volta — pode continuar">
          Tudo o que você já tinha enviado continua salvo. Falta só o que
          aparece como &quot;Falta enviar&quot; abaixo.
        </Aviso>
      )}
      {estadoForcado === "formato_recusado" && (
        <Aviso tipo="perigo" titulo="Não conseguimos usar esse arquivo">
          Esse tipo de arquivo não é aceito. Tente enviar uma foto (JPG) ou
          um PDF do documento.
        </Aviso>
      )}

      <div>
        <p className="text-sm font-medium text-foreground">Olá, {processo.cliente.split(" ")[0]}!</p>
        <p className="text-sm text-foreground/70">Aqui estão os documentos que seu advogado pediu.</p>
      </div>

      <Aviso tipo="info" titulo="Dica para fotos nítidas">
        Se for fotografar um documento de papel, use um aplicativo de
        escaneamento (como o CamScanner) em vez da câmera comum — a imagem
        fica mais legível e o processo anda mais rápido.
      </Aviso>

      <div>
        <div className="mb-1 flex justify-between text-xs text-muted">
          <span>Seu progresso</span>
          <span>{concluidos} de {total} enviados</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-border">
          <div className="h-full bg-primary" style={{ width: `${total ? (concluidos / total) * 100 : 0}%` }} />
        </div>
      </div>

      <div className="space-y-3">
        {itens.map((item) => {
          const estadoSimples = paraEstadoSimples(item.estado);
          return (
            <Card key={item.id}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.descricaoSimples}</p>
                  {!item.obrigatorio && <p className="text-xs text-muted">Este não é obrigatório</p>}
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${ESTILO[estadoSimples]}`}>
                  {RÓTULO[estadoSimples]}
                </span>
              </div>

              {item.motivoRecusa && estadoSimples === "falta_enviar" && (
                <Aviso tipo="atencao" titulo="Por que pedimos de novo">
                  {item.motivoRecusa}
                </Aviso>
              )}

              {item.tipo === "informacao" ? (
                <>
                  {(estadoSimples === "falta_enviar" || estadoSimples === "nao_deu_certo") && (
                    <div className="mt-3 space-y-2">
                      <textarea
                        className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
                        rows={2}
                        placeholder="Escreva sua resposta aqui"
                        value={rascunhos[item.id] ?? ""}
                        onChange={(e) => setRascunhos((atual) => ({ ...atual, [item.id]: e.target.value }))}
                      />
                      <Botao compacto legenda="Envia esta resposta ao seu advogado" onClick={() => enviarResposta(item.id)}>
                        Enviar resposta
                      </Botao>
                    </div>
                  )}
                  {estadoSimples === "recebemos" && item.resposta && (
                    <p className="mt-2 rounded-md bg-success-bg px-3 py-2 text-sm text-success">
                      Você respondeu: &quot;{item.resposta}&quot;
                    </p>
                  )}
                </>
              ) : (
                <>
                  {(estadoSimples === "falta_enviar" || estadoSimples === "nao_deu_certo") && (
                    <div className="mt-3">
                      <Botao
                        compacto
                        legenda="Escolher um arquivo do seu celular ou computador para enviar"
                        onClick={() => simularEnvio(item.id)}
                        disabled={enviando === item.id}
                      >
                        {enviando === item.id ? "Enviando..." : "Enviar arquivo"}
                      </Botao>
                      {item.aceitaMultiplos && (
                        <p className="mt-1 text-xs text-muted">Você pode enviar mais de um arquivo aqui.</p>
                      )}
                    </div>
                  )}
                  {estadoSimples === "recebemos" && (
                    <p className="mt-2 text-xs text-success">Recebemos certinho, obrigado!</p>
                  )}
                </>
              )}
            </Card>
          );
        })}
      </div>

      <div className="border-t border-border pt-4">
        <p className="text-sm font-medium text-foreground">Tem outro documento que acha importante?</p>
        <p className="text-xs text-muted">Pode não estar na nossa lista, mas envie mesmo assim — seu advogado vai dar uma olhada.</p>
        <div className="mt-2">
          <Botao
            compacto
            variante="secundario"
            legenda="Envia um documento que não está na lista acima"
            onClick={() => setArquivoAdicionalEnviado(true)}
          >
            Enviar documento adicional
          </Botao>
          {arquivoAdicionalEnviado && <p className="mt-1 text-xs text-success">Enviado! Seu advogado vai conferir.</p>}
        </div>
      </div>
    </div>
  );
}
