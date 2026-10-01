"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import { AjudaDaTela } from "@/components/ui/AjudaDaTela";
import { Aviso } from "@/components/ui/Aviso";
import { Botao } from "@/components/ui/Botao";
import { Campo } from "@/components/ui/Campo";
import { Card } from "@/components/ui/Card";
import { EstadoCobrancaBadge } from "@/components/ui/EstadoBadge";
import { formatarDataHora, getProcesso } from "@/lib/mock/data";

// Tela de configuração de cobrança (tarefa 1.11): cadência, limite de
// lembretes, suspensão e disparo manual — cobre os dois estados (ativa e
// suspensa).
export default function CobrancaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const processo = getProcesso(id);
  if (!processo) notFound();

  const [cobranca, setCobranca] = useState(processo.cobranca);
  const [enviado, setEnviado] = useState(false);

  return (
    <div className="max-w-xl">
      <AjudaDaTela titulo="Cobrança automática">
        Lembretes saem sozinhos para o cliente, listando o que falta,
        respeitando a cadência e o limite abaixo. Nenhum lembrete sai se a
        cobrança estiver suspensa.
      </AjudaDaTela>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">Estado da cobrança</p>
          <EstadoCobrancaBadge estado={cobranca.estado} />
        </div>

        {cobranca.falhaEntrega && (
          <Aviso tipo="perigo" titulo="Falha na última entrega">
            {cobranca.falhaEntrega}. O cliente pode não saber que ainda falta
            enviar documentos.
          </Aviso>
        )}

        <Campo
          rotulo="Intervalo entre lembretes (dias)"
          id="cadencia"
          type="number"
          min={1}
          value={cobranca.cadenciaDias}
          onChange={(e) => setCobranca((c) => ({ ...c, cadenciaDias: Number(e.target.value) }))}
          legenda="Quantos dias o sistema espera sem resposta antes de enviar o próximo lembrete."
        />
        <Campo
          rotulo="Número máximo de lembretes"
          id="limite"
          type="number"
          min={1}
          value={cobranca.limiteLembretes}
          onChange={(e) => setCobranca((c) => ({ ...c, limiteLembretes: Number(e.target.value) }))}
          legenda="Depois deste número, o envio automático para e você é avisado para intervir pessoalmente."
        />

        <p className="text-sm text-foreground/80">
          Enviados até agora: {cobranca.lembretesEnviados} de {cobranca.limiteLembretes}
          {cobranca.ultimoEnvioEm && <> · último em {formatarDataHora(cobranca.ultimoEnvioEm)}</>}
        </p>

        <div className="flex flex-wrap gap-3 border-t border-border pt-4">
          {cobranca.estado === "ativa" ? (
            <Botao
              variante="secundario"
              legenda="Para os lembretes automáticos até você retomar manualmente"
              onClick={() => setCobranca((c) => ({ ...c, estado: "suspensa" }))}
            >
              Suspender cobrança
            </Botao>
          ) : (
            <Botao
              legenda="Volta a enviar lembretes automáticos a partir de agora"
              onClick={() => setCobranca((c) => ({ ...c, estado: "ativa" }))}
            >
              Retomar cobrança
            </Botao>
          )}
          <Botao
            variante="fantasma"
            legenda="Envia um lembrete agora mesmo, sem esperar o próximo ciclo"
            onClick={() => setEnviado(true)}
          >
            Disparar lembrete agora
          </Botao>
        </div>

        {enviado && (
          <Aviso tipo="sucesso" titulo="Lembrete enviado (simulação)">
            O cliente recebeu a lista do que ainda falta, sem anexo e sem
            dado sensível.
          </Aviso>
        )}
      </Card>
    </div>
  );
}
