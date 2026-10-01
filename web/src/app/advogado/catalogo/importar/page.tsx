"use client";

import { useState } from "react";
import { AjudaDaTela } from "@/components/ui/AjudaDaTela";
import { Aviso } from "@/components/ui/Aviso";
import { Botao } from "@/components/ui/Botao";
import { Campo, CampoArea } from "@/components/ui/Campo";
import { Card } from "@/components/ui/Card";

const LISTA_EXEMPLO = `Documentos pessoais dos usucapientes:
RG ou CNH
CPF
Certidão de nascimento ou casamento atualizada
Comprovante de residência
Documentos relacionados à posse
Contrato de compra e venda
Recibos de pagamento
Comprovantes de aquisição do imóvel`;

function extrairItensPropostos(texto: string): string[] {
  return texto
    .split("\n")
    .map((linha) => linha.replace(/^[-•\d.)\s]+/, "").trim())
    .filter((linha) => linha.length > 0 && !linha.endsWith(":"));
}

// Tela de importação de lista em texto (tarefa 1.9): colagem, itens
// propostos e revisão obrigatória antes de salvar — pré-carregada com uma
// das listas reais do advogado (usucapião).
export default function ImportarListaPage() {
  const [texto, setTexto] = useState(LISTA_EXEMPLO);
  const [etapa, setEtapa] = useState<"colar" | "revisar" | "concluido">("colar");
  const [propostos, setPropostos] = useState<string[]>([]);
  const [incluidos, setIncluidos] = useState<Record<number, boolean>>({});
  const [nomeModelo, setNomeModelo] = useState("Usucapião (importado)");

  function avancarParaRevisao() {
    const itens = extrairItensPropostos(texto);
    setPropostos(itens);
    setIncluidos(Object.fromEntries(itens.map((_, i) => [i, true])));
    setEtapa("revisar");
  }

  return (
    <div className="max-w-2xl">
      <AjudaDaTela titulo="Importar lista em texto">
        Cole uma lista que você já usa, mesmo bagunçada. O sistema separa os
        itens automaticamente, mas nada é salvo até você revisar e confirmar
        cada um.
      </AjudaDaTela>

      {etapa === "colar" && (
        <Card className="space-y-4">
          <CampoArea
            rotulo="Cole a lista aqui"
            id="lista-texto"
            rows={10}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            legenda="Um documento por linha, como você já escreve hoje. Marcadores e números são ignorados."
          />
          <Botao legenda="Analisa o texto e propõe a separação em itens, sem salvar nada ainda" onClick={avancarParaRevisao}>
            Analisar lista
          </Botao>
        </Card>
      )}

      {etapa === "revisar" && (
        <Card className="space-y-4">
          <Aviso tipo="atencao" titulo="Revise antes de salvar">
            Desmarque o que não for um documento. Nenhum item é salvo até você
            confirmar no final.
          </Aviso>
          <Campo
            rotulo="Nome do modelo"
            id="nome-modelo"
            value={nomeModelo}
            onChange={(e) => setNomeModelo(e.target.value)}
            legenda="Como este conjunto de documentos vai aparecer na lista de modelos."
          />
          <ul className="space-y-2">
            {propostos.map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`item-${i}`}
                  checked={incluidos[i] ?? true}
                  onChange={(e) => setIncluidos((atual) => ({ ...atual, [i]: e.target.checked }))}
                />
                <label htmlFor={`item-${i}`} className="text-sm text-foreground">
                  {item}
                </label>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <Botao legenda="Salva o modelo apenas com os itens marcados acima" onClick={() => setEtapa("concluido")}>
              Confirmar e salvar modelo
            </Botao>
            <Botao variante="secundario" legenda="Volta para editar o texto original" onClick={() => setEtapa("colar")}>
              Voltar e editar texto
            </Botao>
          </div>
        </Card>
      )}

      {etapa === "concluido" && (
        <Aviso tipo="sucesso" titulo="Modelo salvo (simulação)">
          O modelo &quot;{nomeModelo}&quot; foi criado com{" "}
          {Object.values(incluidos).filter(Boolean).length} itens. Neste
          protótipo nada é persistido de verdade.
        </Aviso>
      )}
    </div>
  );
}
