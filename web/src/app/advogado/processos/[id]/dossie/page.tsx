"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AjudaDaTela } from "@/components/ui/AjudaDaTela";
import { Aviso } from "@/components/ui/Aviso";
import { Botao } from "@/components/ui/Botao";
import { Card } from "@/components/ui/Card";
import { getProcesso } from "@/lib/mock/data";

interface LinhaDossie {
  id: string;
  descricao: string;
}

function nomeArquivo(numero: number, descricao: string): string {
  const seguro = descricao
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9\s-]/g, "");
  return `DOC. ${numero} - ${seguro}.pdf`;
}

// Referência real: o próprio advogado relatou ter levado 9h para organizar
// 32 documentos na mão (conversa de 16/09). Uso essa proporção só para dar
// uma noção concreta de ganho — não é uma métrica exata.
const MINUTOS_POR_DOCUMENTO_NA_MAO = (9 * 60) / 32;

function formatarHoras(minutos: number): string {
  const horas = Math.floor(minutos / 60);
  const mins = Math.round(minutos % 60);
  if (horas === 0) return `${mins} min`;
  return `${horas}h${mins > 0 ? ` ${mins}min` : ""}`;
}

// Tela de montagem do dossiê (tarefa 1.10): ordem dos documentos, numeração
// DOC. N calculada na hora (nunca persistida) e alertas de pendência antes
// de exportar.
export default function DossiePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const processo = getProcesso(id);
  if (!processo) notFound();

  const itensAceitos = processo.itens.filter((i) => i.estado === "aceito" && i.documentos.length > 0);
  const [linhas, setLinhas] = useState<LinhaDossie[]>(
    itensAceitos.map((i) => ({ id: i.id, descricao: i.nomeTecnico }))
  );
  const obrigatoriosFaltando = processo.itens.filter((i) => i.obrigatorio && i.estado !== "aceito");
  const [exportado, setExportado] = useState(false);
  const [confirmandoComPendencia, setConfirmandoComPendencia] = useState(false);

  function mover(indice: number, direcao: -1 | 1) {
    setLinhas((atual) => {
      const destino = indice + direcao;
      if (destino < 0 || destino >= atual.length) return atual;
      const copia = [...atual];
      [copia[indice], copia[destino]] = [copia[destino], copia[indice]];
      return copia;
    });
  }

  function exportar() {
    if (obrigatoriosFaltando.length > 0 && !confirmandoComPendencia) {
      setConfirmandoComPendencia(true);
      return;
    }
    setExportado(true);
  }

  return (
    <div className="max-w-2xl">
      <AjudaDaTela titulo="Montagem do dossiê">
        O número DOC. N nunca fica salvo — ele é calculado agora, pela ordem
        desta lista. Reordene como quiser: a numeração se ajusta na hora,
        sem afetar a identidade dos documentos já recebidos.
      </AjudaDaTela>

      {obrigatoriosFaltando.length > 0 && (
        <Aviso tipo="atencao" titulo="Itens obrigatórios ainda pendentes">
          {obrigatoriosFaltando.map((i) => i.nomeTecnico).join(", ")}. Você
          pode exportar mesmo assim, mas isso fica registrado.
        </Aviso>
      )}

      {linhas.length > 0 && (
        <div className="mb-4 rounded-lg border border-success bg-success-bg px-4 py-3">
          <p className="text-sm font-semibold text-success">Tempo que isso levaria na mão</p>
          <p className="mt-1 text-sm text-foreground/80">
            Organizar {linhas.length} documento(s) como antes levaria cerca de{" "}
            <strong>{formatarHoras(linhas.length * MINUTOS_POR_DOCUMENTO_NA_MAO)}</strong> — na
            proporção que você mesmo relatou (9h para 32 documentos). Aqui, poucos minutos.
          </p>
        </div>
      )}

      <Card className="mt-4">
        {linhas.length === 0 ? (
          <p className="text-sm text-muted">Nenhum documento aceito ainda — não há o que exportar.</p>
        ) : (
          <ul className="space-y-2">
            {linhas.map((linha, i) => (
              <li key={linha.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                <span className="text-sm text-foreground">{nomeArquivo(i + 1, linha.descricao)}</span>
                <div className="flex gap-1">
                  <Botao compacto variante="fantasma" legenda="Move este documento para cima e renumera tudo" disabled={i === 0} onClick={() => mover(i, -1)}>
                    ↑
                  </Botao>
                  <Botao compacto variante="fantasma" legenda="Move este documento para baixo e renumera tudo" disabled={i === linhas.length - 1} onClick={() => mover(i, 1)}>
                    ↓
                  </Botao>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4">
          <Botao legenda="Gera um PDF por documento, numerado e nomeado, pronto para o tribunal" onClick={exportar} disabled={linhas.length === 0}>
            Exportar dossiê
          </Botao>
          <Link href={`/advogado/processos/${id}/dossie/conferencia`}>
            <Botao variante="secundario" legenda="Compara o rol numerado acima com o texto da petição, apontando divergências">
              Conferir contra a petição
            </Botao>
          </Link>
        </div>

        {confirmandoComPendencia && !exportado && (
          <Aviso tipo="perigo" titulo="Exportar mesmo com pendência?">
            <div className="mt-2 flex gap-2">
              <Botao compacto variante="perigoso" legenda="Exporta assim mesmo; a ciência da pendência fica registrada" onClick={() => setExportado(true)}>
                Exportar mesmo assim
              </Botao>
              <Botao compacto variante="secundario" legenda="Cancela a exportação" onClick={() => setConfirmandoComPendencia(false)}>
                Cancelar
              </Botao>
            </div>
          </Aviso>
        )}

        {exportado && (
          <Aviso tipo="sucesso" titulo="Dossiê exportado (simulação)">
            {linhas.length} arquivo(s) gerado(s) e registrados como esta
            versão da exportação.
          </Aviso>
        )}
      </Card>
    </div>
  );
}
