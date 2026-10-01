"use client";

import { useState } from "react";
import Link from "next/link";
import { AjudaDaTela } from "@/components/ui/AjudaDaTela";
import { Aviso } from "@/components/ui/Aviso";
import { Botao } from "@/components/ui/Botao";
import { Card } from "@/components/ui/Card";
import { MODELOS } from "@/lib/mock/data";
import type { BlocoModelo } from "@/lib/types";

function mover<T>(lista: T[], de: number, para: number): T[] {
  if (para < 0 || para >= lista.length) return lista;
  const copia = [...lista];
  const [item] = copia.splice(de, 1);
  copia.splice(para, 0, item);
  return copia;
}

// Tela do catálogo de modelos (tarefa 1.8): lista de tipos de causa, edição
// de itens, blocos de argumentação e reordenação.
export default function CatalogoPage() {
  const [modeloId, setModeloId] = useState(MODELOS[0].id);
  const modeloOriginal = MODELOS.find((m) => m.id === modeloId)!;
  const [blocos, setBlocos] = useState<BlocoModelo[]>(modeloOriginal.blocos);

  function trocarModelo(id: string) {
    setModeloId(id);
    setBlocos(MODELOS.find((m) => m.id === id)!.blocos);
  }

  function moverBloco(indice: number, direcao: -1 | 1) {
    setBlocos((atual) => mover(atual, indice, indice + direcao));
  }

  function moverItem(blocoIndice: number, itemIndice: number, direcao: -1 | 1) {
    setBlocos((atual) =>
      atual.map((b, i) =>
        i === blocoIndice ? { ...b, itens: mover(b.itens, itemIndice, itemIndice + direcao) } : b
      )
    );
  }

  return (
    <div>
      <AjudaDaTela titulo="Catálogo de modelos de checklist">
        Cada modelo é uma lista de documentos por tipo de causa. A ordem dos
        blocos e dos itens aqui define a ordem do dossiê quando um processo
        criado a partir deste modelo for exportado.
      </AjudaDaTela>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {MODELOS.map((m) => (
            <Botao
              key={m.id}
              compacto
              variante={m.id === modeloId ? "primario" : "secundario"}
              legenda={`Mostrar o modelo de ${m.nome}`}
              onClick={() => trocarModelo(m.id)}
            >
              {m.nome}
            </Botao>
          ))}
        </div>
        <Link href="/advogado/catalogo/importar">
          <Botao compacto variante="secundario" legenda="Cria um modelo novo colando uma lista de texto">
            Importar lista em texto
          </Botao>
        </Link>
      </div>

      {modeloOriginal.incompleto && (
        <div className="mb-4">
          <Aviso tipo="atencao" titulo="Lista incompleta — faltam os itens específicos deste tipo de causa">
            Só os documentos genéricos (identidade e comprovante de
            residência) estão cadastrados. Peça ao Dr. Ian a lista real de
            locação e compra e venda para completar este modelo, do mesmo
            jeito que ele já mandou as de usucapião, divórcio, trabalhista e
            inventário.
          </Aviso>
        </div>
      )}

      <div className="space-y-4">
        {blocos.map((bloco, bi) => (
          <Card key={bloco.id}>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">{bloco.nome}</h2>
              <div className="flex gap-1">
                <Botao compacto variante="fantasma" legenda="Move este bloco inteiro para cima, mudando a ordem do dossiê" disabled={bi === 0} onClick={() => moverBloco(bi, -1)}>
                  ↑
                </Botao>
                <Botao compacto variante="fantasma" legenda="Move este bloco inteiro para baixo, mudando a ordem do dossiê" disabled={bi === blocos.length - 1} onClick={() => moverBloco(bi, 1)}>
                  ↓
                </Botao>
              </div>
            </div>
            <ul className="space-y-1">
              {bloco.itens.map((item, ii) => (
                <li key={item.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                  <div>
                    <p className="text-sm text-foreground">
                      {item.nomeTecnico}{" "}
                      {item.obrigatorio ? (
                        <span className="text-xs text-danger">(obrigatório)</span>
                      ) : (
                        <span className="text-xs text-muted">(opcional)</span>
                      )}
                      {item.tipo === "informacao" ? (
                        <span className="ml-1 text-xs text-warning" title="Resolvido com uma resposta em texto, não com arquivo">
                          · Informação
                        </span>
                      ) : (
                        item.aceitaMultiplos && <span className="ml-1 text-xs text-info">· aceita vários arquivos</span>
                      )}
                    </p>
                    <p className="text-xs text-muted">{item.descricaoSimples}</p>
                  </div>
                  <div className="flex gap-1">
                    <Botao compacto variante="fantasma" legenda="Move este item para cima dentro do bloco" disabled={ii === 0} onClick={() => moverItem(bi, ii, -1)}>
                      ↑
                    </Botao>
                    <Botao compacto variante="fantasma" legenda="Move este item para baixo dentro do bloco" disabled={ii === bloco.itens.length - 1} onClick={() => moverItem(bi, ii, 1)}>
                      ↓
                    </Botao>
                    <Botao compacto variante="secundario" legenda="Edita nome, descrição e obrigatoriedade deste item">
                      Editar
                    </Botao>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
