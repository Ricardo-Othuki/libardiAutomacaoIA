"use client";

import { useState } from "react";
import Link from "next/link";
import { FileWarning, Scale } from "lucide-react";
import { AjudaDaTela } from "@/components/ui/AjudaDaTela";
import { Aviso } from "@/components/ui/Aviso";
import { Botao } from "@/components/ui/Botao";
import { Card } from "@/components/ui/Card";
import { MODELOS } from "@/lib/mock/data";
import type { BlocoModelo } from "@/lib/types";

function contarItens(m: (typeof MODELOS)[number]): number {
  return m.blocos.reduce((soma, b) => soma + b.itens.length, 0);
}

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

      <div className="mb-4 flex items-center justify-end">
        <Link href="/advogado/catalogo/importar">
          <Botao compacto variante="secundario" legenda="Cria um modelo novo colando uma lista de texto">
            Importar lista em texto
          </Botao>
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {MODELOS.map((m) => {
          const ativo = m.id === modeloId;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => trocarModelo(m.id)}
              className={`rounded-xl border p-4 text-left transition-all ${
                ativo
                  ? "border-primary bg-primary text-primary-contrast shadow-theme-md"
                  : "border-border bg-surface text-foreground hover:-translate-y-0.5 hover:shadow-theme-sm"
              }`}
            >
              {m.incompleto ? (
                <FileWarning size={20} className={ativo ? "text-primary-contrast" : "text-warning"} />
              ) : (
                <Scale size={20} className={ativo ? "text-primary-contrast" : "text-primary"} />
              )}
              <p className="mt-2 text-sm font-semibold">{m.nome}</p>
              <p className={`mt-0.5 text-xs ${ativo ? "text-primary-contrast/80" : "text-muted"}`}>
                {m.area} · {contarItens(m)} itens{m.incompleto ? " · incompleto" : ""}
              </p>
            </button>
          );
        })}
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
            <ul className="grid gap-2 sm:grid-cols-2">
              {bloco.itens.map((item, ii) => (
                <li key={item.id} className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2">
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
