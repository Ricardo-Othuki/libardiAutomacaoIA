"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AjudaDaTela } from "@/components/ui/AjudaDaTela";
import { Aviso } from "@/components/ui/Aviso";
import { Botao } from "@/components/ui/Botao";
import { Campo, CampoSelecao } from "@/components/ui/Campo";
import { Card } from "@/components/ui/Card";
import { MODELOS } from "@/lib/mock/data";

// Tela de abertura de processo (tarefa 1.4): ao trocar o tipo de causa, a
// pré-visualização da checklist muda imediatamente, antes de criar o caso.
export default function NovoProcessoPage() {
  const router = useRouter();
  const [cliente, setCliente] = useState("");
  const [modeloId, setModeloId] = useState(MODELOS[0].id);
  const modelo = MODELOS.find((m) => m.id === modeloId)!;

  return (
    <div>
      <AjudaDaTela titulo="Abrir novo processo">
        Escolha o cliente e o tipo de causa. A checklist à direita é só uma
        prévia — ela é copiada para o processo e pode ser ajustada depois sem
        alterar o modelo original.
      </AjudaDaTela>

      <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
        <Card className="h-fit space-y-4">
          <Campo
            rotulo="Nome do cliente"
            id="cliente"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            placeholder="Ex.: Maria da Silva"
            legenda="Como o cliente vai aparecer no painel de pendências."
          />
          <CampoSelecao
            rotulo="Tipo de causa"
            id="tipo-causa"
            value={modeloId}
            onChange={(e) => setModeloId(e.target.value)}
            legenda="Define qual checklist de documentos será usada neste processo."
          >
            {MODELOS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome}
              </option>
            ))}
          </CampoSelecao>
          <Aviso tipo="info" titulo="Sem modelo adequado?">
            Você também pode abrir o processo com checklist vazia e montar
            item a item depois, dentro do processo.
          </Aviso>
          <Botao
            legenda="Cria o processo com a checklist copiada do modelo escolhido"
            onClick={() => router.push("/advogado/processos/p-recem-aberto")}
          >
            Abrir processo
          </Botao>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold text-foreground">Prévia da checklist — {modelo.nome}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {modelo.blocos.map((bloco) => (
              <div key={bloco.id} className="rounded-lg border border-border p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">{bloco.nome}</p>
                <ul className="mt-2 space-y-1.5">
                  {bloco.itens.map((item) => (
                    <li key={item.id} className="text-sm text-foreground/80">
                      • {item.nomeTecnico}
                      {item.obrigatorio ? (
                        <span className="ml-1 text-xs text-danger">(obrigatório)</span>
                      ) : (
                        <span className="ml-1 text-xs text-muted">(opcional)</span>
                      )}
                      {item.tipo === "informacao" && <span className="ml-1 text-xs text-warning">· informação</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
