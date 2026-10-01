"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AjudaDaTela } from "@/components/ui/AjudaDaTela";
import { Aviso } from "@/components/ui/Aviso";
import { Botao } from "@/components/ui/Botao";
import { CampoArea } from "@/components/ui/Campo";
import { Card } from "@/components/ui/Card";
import {
  DOSSIE_EXEMPLO,
  PECA_EXEMPLO,
  conferirDossieContraPeca,
  getProcesso,
} from "@/lib/mock/data";

// Tela de conferência do dossiê contra a peça (tarefa 1.10a): o advogado
// cola o texto da petição e o sistema aponta documento não citado e
// citação sem documento. Usa um caso de exemplo totalmente fictício, criado
// para não expor dado real de cliente sob sigilo profissional — a estrutura
// (um anexo órfão) reproduz o problema real observado em petições do
// advogado.
export default function ConferenciaDossiePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const processo = getProcesso(id);
  if (!processo) notFound();

  const [peca, setPeca] = useState(PECA_EXEMPLO);
  const [apontamentos, setApontamentos] = useState<ReturnType<typeof conferirDossieContraPeca> | null>(null);

  return (
    <div className="max-w-2xl">
      <Link href={`/advogado/processos/${id}/dossie`} className="text-sm text-primary hover:underline">
        ← Voltar à montagem do dossiê
      </Link>

      <AjudaDaTela titulo="Conferência do dossiê contra a petição">
        Cole o texto da petição. O sistema aponta todo DOC. N citado que não
        existe no dossiê, e todo documento do dossiê que o texto nunca cita —
        prova não referenciada pode não ser apreciada pelo juiz. É só
        informativo: a decisão é sempre sua.
      </AjudaDaTela>

      <Card className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Exemplo pré-carregado (caso fictício, com um anexo órfão proposital)
        </p>
        <CampoArea
          rotulo="Texto da petição"
          id="peca"
          rows={10}
          value={peca}
          onChange={(e) => setPeca(e.target.value)}
          legenda="Cole aqui o texto completo, incluindo as citações no formato DOC. N ou DOCs. 5, 6 e 7."
        />
        <Botao legenda="Compara as citações do texto acima com os documentos do dossiê" onClick={() => setApontamentos(conferirDossieContraPeca(peca, DOSSIE_EXEMPLO))}>
          Conferir
        </Botao>

        {apontamentos && (
          <div className="space-y-2 border-t border-border pt-4">
            {apontamentos.length === 0 ? (
              <Aviso tipo="sucesso" titulo="Dossiê coerente com a peça">
                Toda citação tem documento e todo documento é citado.
              </Aviso>
            ) : (
              apontamentos.map((a, i) =>
                a.tipo === "documento_nao_citado" ? (
                  <Aviso key={i} tipo="atencao" titulo={`DOC. ${a.numero} não citado na petição`}>
                    &quot;{a.descricao}&quot; está no dossiê, mas o texto nunca
                    menciona DOC. {a.numero}. Prova não referenciada pode não
                    ser apreciada.
                  </Aviso>
                ) : (
                  <Aviso key={i} tipo="perigo" titulo={`DOC. ${a.numero} citado sem documento correspondente`}>
                    A petição cita DOC. {a.numero}, mas não existe documento
                    com esse número no dossiê atual.
                  </Aviso>
                )
              )
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
