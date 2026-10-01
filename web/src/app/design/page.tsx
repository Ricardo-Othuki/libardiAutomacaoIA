import { AjudaDaTela } from "@/components/ui/AjudaDaTela";
import { Aviso } from "@/components/ui/Aviso";
import { Botao } from "@/components/ui/Botao";
import { Campo, CampoArea, CampoSelecao } from "@/components/ui/Campo";
import { Card } from "@/components/ui/Card";
import { EstadoCobrancaBadge, EstadoItemBadge, EstadoLinkBadge } from "@/components/ui/EstadoBadge";
import { Tabela } from "@/components/ui/Tabela";
import type { EstadoItem, EstadoLink, EstadoCobranca } from "@/lib/types";

const ESTADOS_ITEM: EstadoItem[] = ["pendente", "recebido", "em_conferencia", "aceito", "recusado"];
const ESTADOS_LINK: EstadoLink[] = ["ativo", "expirado", "revogado"];
const ESTADOS_COBRANCA: EstadoCobranca[] = ["ativa", "suspensa"];

// Página de amostra com todos os elementos de base do sistema, usada para
// aprovar a identidade visual antes de montar as telas reais (tarefa 1.2).
export default function DesignPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 p-6">
      <AjudaDaTela titulo="Página de amostra da base visual">
        Reúne tipografia, cores, espaçamento e os componentes de formulário,
        botão, tabela e aviso que todas as telas do protótipo usam. Serve para
        aprovar a identidade visual de uma vez só.
      </AjudaDaTela>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Tipografia</h2>
        <Card className="space-y-2">
          <p className="text-3xl font-semibold text-foreground">Título grande</p>
          <p className="text-xl font-semibold text-foreground">Título de seção</p>
          <p className="text-base text-foreground">Texto normal de parágrafo</p>
          <p className="text-sm text-muted">Texto auxiliar / legenda</p>
        </Card>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Cores</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {[
            { classe: "bg-primary", rotulo: "Primária" },
            { classe: "bg-success", rotulo: "Sucesso" },
            { classe: "bg-warning", rotulo: "Atenção" },
            { classe: "bg-danger", rotulo: "Perigo" },
            { classe: "bg-info", rotulo: "Informação" },
            { classe: "bg-muted", rotulo: "Neutro" },
          ].map((c) => (
            <div key={c.classe} className="text-center">
              <div className={`h-12 w-full rounded-md ${c.classe}`} />
              <p className="mt-1 text-xs text-muted">{c.rotulo}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Botões</h2>
        <Card className="flex flex-wrap gap-6">
          <Botao legenda="Ação principal da tela, use com moderação">Primário</Botao>
          <Botao variante="secundario" legenda="Ação alternativa, menos destacada">Secundário</Botao>
          <Botao variante="perigoso" legenda="Ação que não pode ser desfeita, exige confirmação">Perigoso</Botao>
          <Botao variante="fantasma" legenda="Ação discreta, geralmente de navegação">Fantasma</Botao>
          <Botao compacto legenda="Em tabelas e listas, a legenda vira dica ao passar o mouse">Compacto</Botao>
        </Card>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Campos de formulário</h2>
        <Card className="grid gap-4 sm:grid-cols-2">
          <Campo
            rotulo="Nome do cliente"
            id="exemplo-nome"
            placeholder="Ex.: Maria da Silva"
            legenda="Como o cliente será identificado nas telas do advogado."
          />
          <CampoSelecao rotulo="Tipo de causa" id="exemplo-causa" legenda="Define qual checklist será usada.">
            <option>Usucapião</option>
            <option>Divórcio</option>
          </CampoSelecao>
          <div className="sm:col-span-2">
            <CampoArea
              rotulo="Observação"
              id="exemplo-obs"
              rows={3}
              legenda="Anotação livre, visível só para o advogado."
            />
          </div>
        </Card>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Estados (badges)</h2>
        <Card className="flex flex-wrap gap-3">
          {ESTADOS_ITEM.map((e) => (
            <EstadoItemBadge key={e} estado={e} />
          ))}
          {ESTADOS_LINK.map((e) => (
            <EstadoLinkBadge key={e} estado={e} />
          ))}
          {ESTADOS_COBRANCA.map((e) => (
            <EstadoCobrancaBadge key={e} estado={e} />
          ))}
        </Card>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Tabela</h2>
        <Tabela colunas={["Item", "Estado"]} legenda="Exemplo de tabela usada em listas do sistema.">
          <tr>
            <td className="px-4 py-2">RG ou CNH</td>
            <td className="px-4 py-2">
              <EstadoItemBadge estado="aceito" />
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2">Comprovante de residência</td>
            <td className="px-4 py-2">
              <EstadoItemBadge estado="pendente" />
            </td>
          </tr>
        </Tabela>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Avisos</h2>
        <div className="space-y-3">
          <Aviso tipo="info" titulo="Informação">Mensagem neutra, só para contexto.</Aviso>
          <Aviso tipo="sucesso" titulo="Tudo certo">Ação concluída com sucesso.</Aviso>
          <Aviso tipo="atencao" titulo="Atenção">Algo precisa da sua revisão antes de continuar.</Aviso>
          <Aviso tipo="perigo" titulo="Ação destrutiva">Isto não pode ser desfeito.</Aviso>
        </div>
      </section>
    </div>
  );
}
