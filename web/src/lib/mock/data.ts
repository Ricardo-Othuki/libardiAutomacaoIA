// Dados fictícios do protótipo. Nenhum dado real de cliente é usado aqui —
// os modelos de checklist reproduzem o conteúdo das listas reais do
// advogado (ver materiais-e-conversas-coIan/dados-de resposta do Ian.txt),
// mas clientes, processos e peças são todos inventados, inclusive o caso
// usado na conferência do dossiê contra a petição (tarefa 1.10a), para não
// expor dado real sob sigilo profissional.
import type {
  Cobranca,
  Documento,
  EventoHistorico,
  ItemChecklist,
  ItemModelo,
  ModeloChecklist,
  Processo,
} from "@/lib/types";

// Data de referência fixa do protótipo, para os cálculos de "tempo parado"
// serem estáveis entre servidor e navegador (evita usar Date.now()).
export const HOJE = new Date("2026-10-01T12:00:00-03:00");

export function diasAtras(n: number): string {
  const d = new Date(HOJE);
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export function horasAtras(n: number): string {
  const d = new Date(HOJE);
  d.setHours(d.getHours() - n);
  return d.toISOString();
}

export function formatarDiasDesde(iso: string): string {
  const diffMs = HOJE.getTime() - new Date(iso).getTime();
  const dias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (dias <= 0) return "hoje";
  if (dias === 1) return "1 dia";
  return `${dias} dias`;
}

export function formatarDataHora(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// --- Conjuntos comuns reaproveitáveis -------------------------------------

const ITENS_JUSTICA_GRATUITA: ItemModelo[] = [
  {
    id: "jg-declaracao-hipossuficiencia",
    nomeTecnico: "Declaração de hipossuficiência",
    descricaoSimples:
      "Um papel simples, assinado por você, dizendo que não tem condições de pagar as custas do processo.",
    obrigatorio: true,
    aceitaMultiplos: false,
  },
  {
    id: "jg-extrato-bancario",
    nomeTecnico: "Extrato bancário dos últimos 3 meses",
    descricaoSimples: "O extrato da sua conta dos últimos 3 meses, de todas as contas que tiver.",
    obrigatorio: true,
    aceitaMultiplos: true,
  },
  {
    id: "jg-imposto-renda",
    nomeTecnico: "Declaração de imposto de renda (2 últimos anos)",
    descricaoSimples:
      "Se você declara imposto de renda, envie a declaração dos últimos 2 anos. Se não declara, não se preocupe com este item.",
    obrigatorio: false,
    aceitaMultiplos: true,
  },
  {
    id: "jg-carteira-trabalho",
    nomeTecnico: "Carteira de trabalho (todas as folhas com anotação)",
    descricaoSimples: "Foto de todas as páginas da carteira de trabalho que tiverem algo escrito.",
    obrigatorio: false,
    aceitaMultiplos: true,
  },
  {
    id: "jg-holerites",
    nomeTecnico: "Holerites",
    descricaoSimples: "Seus últimos contracheques (holerites), se trabalha com carteira assinada.",
    obrigatorio: false,
    aceitaMultiplos: true,
  },
];

// --- Modelos de checklist por tipo de causa --------------------------------

export const MODELOS: ModeloChecklist[] = [
  {
    id: "modelo-usucapiao",
    nome: "Usucapião (rural ou urbana)",
    area: "Direito Imobiliário",
    blocos: [
      {
        id: "bloco-identificacao",
        nome: "Identificação das partes",
        itens: [
          {
            id: "doc-identidade",
            nomeTecnico: "RG ou CNH",
            descricaoSimples: "Uma foto ou cópia do seu documento de identidade com foto.",
            obrigatorio: true,
            aceitaMultiplos: false,
          },
          {
            id: "doc-cpf",
            nomeTecnico: "CPF",
            descricaoSimples: "Cópia do seu CPF, se não aparecer no documento de identidade.",
            obrigatorio: true,
            aceitaMultiplos: false,
          },
          {
            id: "doc-certidao-nascimento-casamento",
            nomeTecnico: "Certidão de nascimento ou casamento atualizada",
            descricaoSimples: "A certidão mais recente que você tiver, de nascimento ou casamento.",
            obrigatorio: true,
            aceitaMultiplos: false,
          },
          {
            id: "doc-comprovante-residencia",
            nomeTecnico: "Comprovante de residência",
            descricaoSimples: "Uma conta de luz, água ou telefone recente, no seu nome ou endereço.",
            obrigatorio: true,
            aceitaMultiplos: false,
          },
        ],
      },
      {
        id: "bloco-posse",
        nome: "Comprovação da posse",
        itens: [
          {
            id: "doc-contrato-compra-venda",
            nomeTecnico: "Contrato de compra e venda ou cessão de direitos",
            descricaoSimples: "Qualquer papel que mostre como você adquiriu o imóvel.",
            obrigatorio: true,
            aceitaMultiplos: true,
          },
          {
            id: "doc-recibos-pagamento",
            nomeTecnico: "Recibos de pagamento do imóvel",
            descricaoSimples: "Recibos de parcelas ou do pagamento integral do imóvel, se guardou algum.",
            obrigatorio: false,
            aceitaMultiplos: true,
          },
          {
            id: "doc-comprovantes-posse",
            nomeTecnico: "Comprovantes de que mora ou cuida do imóvel ao longo do tempo",
            descricaoSimples:
              "Contas antigas e recentes no seu nome no endereço do imóvel, fotos antigas e atuais, notas de obras ou reformas, declaração de vizinhos — quanto mais antigo o comprovante, melhor.",
            obrigatorio: true,
            aceitaMultiplos: true,
          },
        ],
      },
      {
        id: "bloco-imovel",
        nome: "Documentos do imóvel",
        itens: [
          {
            id: "doc-matricula-imovel",
            nomeTecnico: "Matrícula ou transcrição do imóvel, se existir",
            descricaoSimples:
              "Se o imóvel tiver matrícula no cartório, envie uma cópia atualizada. Se não tiver, não se preocupe — isso não impede o pedido.",
            obrigatorio: false,
            aceitaMultiplos: true,
          },
          {
            id: "doc-certidoes-imovel",
            nomeTecnico: "Certidões sobre o imóvel (ônus, ações, débitos)",
            descricaoSimples:
              "Certidões do cartório ou da prefeitura sobre o imóvel, se você já tiver alguma — o escritório pode providenciar as que faltarem.",
            obrigatorio: false,
            aceitaMultiplos: true,
          },
          {
            id: "doc-iptu-itr",
            nomeTecnico: "Carnê de IPTU (urbano) ou ITR (rural)",
            descricaoSimples: "O carnê mais recente do imposto do imóvel, se você tiver.",
            obrigatorio: false,
            aceitaMultiplos: true,
          },
        ],
      },
      {
        id: "bloco-confrontantes",
        nome: "Vizinhos confrontantes",
        itens: [
          {
            id: "doc-dados-confrontantes",
            nomeTecnico: "Dados dos vizinhos confrontantes (quem faz divisa com o imóvel)",
            descricaoSimples:
              "Nome completo, CPF e endereço de cada vizinho que faz divisa com o imóvel — o escritório vai usar para pedir a concordância deles.",
            obrigatorio: false,
            aceitaMultiplos: true,
          },
        ],
      },
      {
        id: "bloco-estrategia-usucapiao",
        nome: "Sobre o seu caso",
        itens: [
          {
            id: "info-modalidade-usucapiao",
            nomeTecnico: "Modalidade de usucapião pretendida",
            descricaoSimples:
              "O imóvel é na cidade ou na zona rural? Você prefere resolver em cartório (quando não há disputa) ou precisa ir à Justiça?",
            obrigatorio: true,
            aceitaMultiplos: false,
            tipo: "informacao",
          },
        ],
      },
      {
        id: "bloco-justica-gratuita",
        nome: "Justiça gratuita",
        itens: ITENS_JUSTICA_GRATUITA,
      },
    ],
  },
  {
    id: "modelo-divorcio",
    nome: "Divórcio",
    area: "Direito de Família",
    blocos: [
      {
        id: "bloco-identificacao",
        nome: "Identificação das partes",
        itens: [
          {
            id: "doc-identidade-ambos",
            nomeTecnico: "Documento de identificação com foto de ambos",
            descricaoSimples: "RG ou CNH seu e do seu cônjuge.",
            obrigatorio: true,
            aceitaMultiplos: true,
          },
          {
            id: "doc-cpf-ambos",
            nomeTecnico: "CPF de ambos",
            descricaoSimples: "CPF seu e do seu cônjuge, se não aparecer no documento de identidade.",
            obrigatorio: true,
            aceitaMultiplos: true,
          },
          {
            id: "doc-comprovante-residencia",
            nomeTecnico: "Comprovante de residência atualizado",
            descricaoSimples: "Uma conta recente no seu nome ou endereço.",
            obrigatorio: true,
            aceitaMultiplos: false,
          },
        ],
      },
      {
        id: "bloco-casamento",
        nome: "Documentos do casamento",
        itens: [
          {
            id: "doc-certidao-casamento",
            nomeTecnico: "Certidão de casamento atualizada",
            descricaoSimples: "A certidão de casamento emitida nos últimos 90 dias, se possível.",
            obrigatorio: true,
            aceitaMultiplos: false,
          },
          {
            id: "doc-pacto-antenupcial",
            nomeTecnico: "Pacto antenupcial, se houver",
            descricaoSimples: "Se vocês fizeram um pacto antes de casar, envie uma cópia.",
            obrigatorio: false,
            aceitaMultiplos: false,
          },
        ],
      },
      {
        id: "bloco-filhos",
        nome: "Documentos dos filhos",
        itens: [
          {
            id: "doc-certidao-nascimento-filhos",
            nomeTecnico: "Certidão de nascimento dos filhos",
            descricaoSimples: "Se vocês têm filhos, a certidão de nascimento de cada um.",
            obrigatorio: false,
            aceitaMultiplos: true,
          },
          {
            id: "doc-comprovantes-despesas-filhos",
            nomeTecnico: "Comprovantes de despesas com os filhos",
            descricaoSimples: "Recibos de escola, saúde ou atividades dos filhos, se tiver.",
            obrigatorio: false,
            aceitaMultiplos: true,
          },
        ],
      },
      {
        id: "bloco-bens-dividas",
        nome: "Bens e dívidas do casal",
        itens: [
          {
            id: "doc-bens-comprovantes",
            nomeTecnico: "Comprovantes de bens (imóveis, veículos, investimentos)",
            descricaoSimples:
              "Documentos de imóveis, veículos, extratos de investimento ou qualquer bem de valor adquirido durante o casamento, se houver.",
            obrigatorio: false,
            aceitaMultiplos: true,
          },
          {
            id: "doc-dividas-comprovantes",
            nomeTecnico: "Contratos de empréstimo ou dívidas em aberto",
            descricaoSimples: "Contratos de financiamento, faturas ou qualquer dívida que o casal tenha junto.",
            obrigatorio: false,
            aceitaMultiplos: true,
          },
        ],
      },
      {
        id: "bloco-estrategia-divorcio",
        nome: "Sobre o seu caso",
        itens: [
          {
            id: "info-consenso",
            nomeTecnico: "Há acordo entre você e seu cônjuge?",
            descricaoSimples:
              "Vocês dois estão de acordo com a separação e com os termos dela, ou é preciso que a Justiça decida algum ponto?",
            obrigatorio: true,
            aceitaMultiplos: false,
            tipo: "informacao",
          },
          {
            id: "info-filhos-menores",
            nomeTecnico: "Há filhos menores ou que dependem de vocês?",
            descricaoSimples: "Se sim, já conversaram sobre onde vão morar e como vai funcionar a convivência?",
            obrigatorio: true,
            aceitaMultiplos: false,
            tipo: "informacao",
          },
          {
            id: "info-pensao",
            nomeTecnico: "Haverá pedido de pensão?",
            descricaoSimples: "Para os filhos, para você ou para o seu cônjuge — conte como está pensando nisso.",
            obrigatorio: false,
            aceitaMultiplos: false,
            tipo: "informacao",
          },
          {
            id: "info-urgencia",
            nomeTecnico: "Existe alguma situação de urgência?",
            descricaoSimples:
              "Alguma situação de ameaça, violência ou risco que precise de uma providência rápida da Justiça? Pode responder livremente.",
            obrigatorio: true,
            aceitaMultiplos: false,
            tipo: "informacao",
          },
        ],
      },
    ],
  },
  {
    id: "modelo-trabalhista",
    nome: "Reclamação trabalhista",
    area: "Direito do Trabalho",
    blocos: [
      {
        id: "bloco-identificacao",
        nome: "Identificação das partes",
        itens: [
          {
            id: "doc-identidade",
            nomeTecnico: "RG ou CNH",
            descricaoSimples: "Foto ou cópia do seu documento de identidade com foto.",
            obrigatorio: true,
            aceitaMultiplos: false,
          },
          {
            id: "doc-comprovante-residencia",
            nomeTecnico: "Comprovante de residência",
            descricaoSimples: "Uma conta recente no seu nome ou endereço.",
            obrigatorio: true,
            aceitaMultiplos: false,
          },
        ],
      },
      {
        id: "bloco-vinculo",
        nome: "Comprovação do vínculo empregatício",
        itens: [
          {
            id: "doc-carteira-trabalho",
            nomeTecnico: "Carteira de trabalho (todas as folhas com anotação)",
            descricaoSimples: "Foto de todas as páginas da carteira de trabalho que tiverem algo escrito.",
            obrigatorio: true,
            aceitaMultiplos: true,
          },
          {
            id: "doc-contrato-trabalho",
            nomeTecnico: "Contrato de trabalho",
            descricaoSimples: "O contrato que você assinou com a empresa, se tiver guardado.",
            obrigatorio: false,
            aceitaMultiplos: false,
          },
          {
            id: "doc-holerites",
            nomeTecnico: "Holerites",
            descricaoSimples: "Seus contracheques do período que trabalhou na empresa.",
            obrigatorio: true,
            aceitaMultiplos: true,
          },
        ],
      },
      {
        id: "bloco-provas-adicionais",
        nome: "Se não teve carteira assinada ou houve acidente",
        itens: [
          {
            id: "doc-conversas-whatsapp",
            nomeTecnico: "Conversas de WhatsApp com a empresa ou colegas",
            descricaoSimples:
              "Se você não teve carteira assinada, exporte a conversa completa do grupo de trabalho e as conversas com quem te contratava — no WhatsApp, abra a conversa, toque nos três pontinhos, \"Mais\" e \"Exportar conversa\". Isso ajuda a provar que você trabalhava mesmo lá.",
            obrigatorio: false,
            aceitaMultiplos: true,
          },
          {
            id: "doc-provas-jornada",
            nomeTecnico: "Provas do seu horário de trabalho",
            descricaoSimples:
              "Fotos de ponto, escalas ou qualquer anotação (mesmo em caderno ou grupo) que mostre os dias e horários que você trabalhava, principalmente se fazia hora extra.",
            obrigatorio: false,
            aceitaMultiplos: true,
          },
          {
            id: "doc-provas-acidente",
            nomeTecnico: "Documentos de acidente de trabalho, se houve",
            descricaoSimples:
              "CAT (comunicação de acidente), atestados, receitas e qualquer documento médico relacionado a um acidente ou afastamento pelo trabalho.",
            obrigatorio: false,
            aceitaMultiplos: true,
          },
        ],
      },
      {
        id: "bloco-justica-gratuita",
        nome: "Justiça gratuita",
        itens: ITENS_JUSTICA_GRATUITA,
      },
    ],
  },
  {
    id: "modelo-inventario",
    nome: "Inventário",
    area: "Direito de Família e Sucessões",
    blocos: [
      {
        id: "bloco-identificacao-inventario",
        nome: "Identificação das partes",
        itens: [
          {
            id: "doc-identidade-falecido-herdeiros",
            nomeTecnico: "Documento de identidade do falecido e dos herdeiros",
            descricaoSimples: "RG, CPF ou CNH da pessoa que faleceu e de cada herdeiro (filhos, ou pais e irmãos se não houver filhos).",
            obrigatorio: true,
            aceitaMultiplos: true,
          },
          {
            id: "doc-comprovante-residencia-herdeiros",
            nomeTecnico: "Comprovante de residência de todos os envolvidos",
            descricaoSimples: "Uma conta recente no nome de cada herdeiro e do falecido (o último endereço conhecido).",
            obrigatorio: true,
            aceitaMultiplos: true,
          },
          {
            id: "doc-certidoes-civis-herdeiros",
            nomeTecnico: "Certidão de casamento, união estável ou nascimento de cada herdeiro",
            descricaoSimples: "A certidão civil mais recente de cada pessoa envolvida.",
            obrigatorio: true,
            aceitaMultiplos: true,
          },
        ],
      },
      {
        id: "bloco-documentos-falecido",
        nome: "Documentos do falecido",
        itens: [
          {
            id: "doc-certidao-obito",
            nomeTecnico: "Certidão de óbito (frente e verso)",
            descricaoSimples: "A certidão de óbito completa, com os dois lados.",
            obrigatorio: true,
            aceitaMultiplos: false,
          },
          {
            id: "doc-imposto-renda-falecido",
            nomeTecnico: "Última declaração de imposto de renda do falecido",
            descricaoSimples: "Se o falecido declarava imposto de renda, a última declaração ajuda a listar os bens dele.",
            obrigatorio: false,
            aceitaMultiplos: false,
          },
        ],
      },
      {
        id: "bloco-bens-imoveis-inventario",
        nome: "Bens imóveis",
        itens: [
          {
            id: "doc-matricula-inventario",
            nomeTecnico: "Matrícula atualizada de cada imóvel",
            descricaoSimples: "A matrícula de cada imóvel que o falecido possuía.",
            obrigatorio: false,
            aceitaMultiplos: true,
          },
          {
            id: "doc-iptu-inventario",
            nomeTecnico: "Carnê de IPTU ou ITR do ano do falecimento",
            descricaoSimples: "Serve para mostrar o valor do imóvel na época.",
            obrigatorio: false,
            aceitaMultiplos: true,
          },
        ],
      },
      {
        id: "bloco-bens-moveis-inventario",
        nome: "Bens móveis",
        itens: [
          {
            id: "doc-extratos-bancarios-falecido",
            nomeTecnico: "Extratos ou dados bancários do falecido",
            descricaoSimples: "Extrato das contas do falecido, ou ao menos os dados de banco e agência.",
            obrigatorio: false,
            aceitaMultiplos: true,
          },
          {
            id: "doc-veiculo-falecido",
            nomeTecnico: "Documento do veículo (CRLV), se houver",
            descricaoSimples: "O documento do veículo do falecido, se ele tinha algum.",
            obrigatorio: false,
            aceitaMultiplos: true,
          },
        ],
      },
      {
        id: "bloco-estrategia-inventario",
        nome: "Sobre o seu caso",
        itens: [
          {
            id: "info-bens-afetivos",
            nomeTecnico: "Há bens de valor afetivo específico?",
            descricaoSimples:
              "Joias, valores em espécie, obras de arte, instrumentos musicais ou qualquer outro bem que precise de atenção especial na partilha, mesmo que não entre formalmente no inventário.",
            obrigatorio: false,
            aceitaMultiplos: false,
            tipo: "informacao",
          },
        ],
      },
    ],
  },
  {
    id: "modelo-imobiliario",
    nome: "Imobiliário (locação e compra e venda)",
    area: "Direito Imobiliário",
    incompleto: true,
    blocos: [
      {
        id: "bloco-identificacao-imobiliario",
        nome: "Identificação das partes",
        itens: [
          {
            id: "doc-identidade-imobiliario",
            nomeTecnico: "RG ou CNH",
            descricaoSimples: "Foto ou cópia do seu documento de identidade com foto.",
            obrigatorio: true,
            aceitaMultiplos: false,
          },
          {
            id: "doc-comprovante-residencia-imobiliario",
            nomeTecnico: "Comprovante de residência",
            descricaoSimples: "Uma conta recente no seu nome ou endereço.",
            obrigatorio: true,
            aceitaMultiplos: false,
          },
        ],
      },
    ],
  },
];

export function getModelo(id: string): ModeloChecklist | undefined {
  return MODELOS.find((m) => m.id === id);
}

// --- Fábrica de itens de checklist a partir de um modelo -------------------

function copiarItensDoModelo(modeloId: string): ItemChecklist[] {
  const modelo = getModelo(modeloId);
  if (!modelo) return [];
  return modelo.blocos.flatMap((bloco) =>
    bloco.itens.map(
      (item): ItemChecklist => ({
        id: item.id,
        nomeTecnico: item.nomeTecnico,
        descricaoSimples: item.descricaoSimples,
        obrigatorio: item.obrigatorio,
        aceitaMultiplos: item.aceitaMultiplos,
        bloco: bloco.nome,
        tipo: item.tipo ?? "documento",
        estado: "pendente",
        documentos: [],
      })
    )
  );
}

/** Busca um item da checklist pelo id — mais seguro que indexar o array,
 * já que a posição dos itens muda sempre que o modelo ganha itens novos. */
function acharItem(itens: ItemChecklist[], id: string): ItemChecklist {
  const item = itens.find((i) => i.id === id);
  if (!item) throw new Error(`Item "${id}" não existe no modelo — confira o id nos dados fictícios.`);
  return item;
}

function doc(
  id: string,
  nomeArquivo: string,
  enviadoEm: string,
  estado: Documento["estado"],
  motivoRecusa?: string
): Documento {
  return { id, nomeArquivo, enviadoEm, estado, motivoRecusa };
}

function cobrancaPadrao(overrides: Partial<Cobranca> = {}): Cobranca {
  return {
    estado: "ativa",
    cadenciaDias: 3,
    limiteLembretes: 4,
    lembretesEnviados: 0,
    ...overrides,
  };
}

function linkPadrao(token: string, overrides: Partial<Processo["link"]> = {}) {
  return {
    token,
    criadoEm: diasAtras(10),
    validoAte: diasAtras(-20),
    estado: "ativo" as const,
    ...overrides,
  };
}

function historicoBase(cliente: string, abertoEm: string): EventoHistorico[] {
  return [
    {
      id: "ev-abertura",
      autor: "Dr. Ian Libardi",
      acao: `Processo aberto para ${cliente}`,
      dataHora: abertoEm,
    },
  ];
}

// --- Processos fictícios (pelo menos 8 estados distintos, tarefa 1.3) -----

export const PROCESSOS: Processo[] = (() => {
  const lista: Processo[] = [];

  // 1. Recém aberto, nada enviado ainda.
  {
    const itens = copiarItensDoModelo("modelo-usucapiao");
    lista.push({
      id: "p-recem-aberto",
      cliente: "Marcos Vieira Santos",
      tipoCausa: "Usucapião (rural ou urbana)",
      modeloId: "modelo-usucapiao",
      abertoEm: diasAtras(1),
      ultimaMovimentacaoEm: diasAtras(1),
      pronto: false,
      itens,
      triagem: [],
      historico: historicoBase("Marcos Vieira Santos", diasAtras(1)),
      cobranca: cobrancaPadrao({ estado: "suspensa" }),
      link: linkPadrao("tok-recem-aberto"),
    });
  }

  // 2. Parado há muito tempo sem movimentação — deve aparecer travado.
  {
    const itens = copiarItensDoModelo("modelo-divorcio");
    const identidade = acharItem(itens, "doc-identidade-ambos");
    identidade.estado = "aceito";
    identidade.documentos = [doc("d1", "rg-ambos.pdf", diasAtras(22), "aceito")];
    lista.push({
      id: "p-travado",
      cliente: "Felipe Andrade Costa",
      tipoCausa: "Divórcio",
      modeloId: "modelo-divorcio",
      abertoEm: diasAtras(24),
      ultimaMovimentacaoEm: diasAtras(19),
      pronto: false,
      itens,
      triagem: [],
      historico: historicoBase("Felipe Andrade Costa", diasAtras(24)),
      cobranca: cobrancaPadrao({
        lembretesEnviados: 4,
        limiteLembretes: 4,
        ultimoEnvioEm: diasAtras(9),
      }),
      link: linkPadrao("tok-travado"),
    });
  }

  // 3. Com documento recém recebido aguardando conferência.
  {
    const itens = copiarItensDoModelo("modelo-trabalhista");
    const identidade = acharItem(itens, "doc-identidade");
    identidade.estado = "recebido";
    identidade.documentos = [doc("d1", "rg-joana.jpg", horasAtras(5), "recebido")];
    lista.push({
      id: "p-aguardando-conferencia",
      cliente: "Joana Pereira Lima",
      tipoCausa: "Reclamação trabalhista",
      modeloId: "modelo-trabalhista",
      abertoEm: diasAtras(6),
      ultimaMovimentacaoEm: horasAtras(5),
      pronto: false,
      itens,
      triagem: [],
      historico: historicoBase("Joana Pereira Lima", diasAtras(6)),
      cobranca: cobrancaPadrao(),
      link: linkPadrao("tok-aguardando-conferencia"),
    });
  }

  // 4. Com documento recém recusado.
  {
    const itens = copiarItensDoModelo("modelo-usucapiao");
    const comprovanteResidencia = acharItem(itens, "doc-comprovante-residencia");
    comprovanteResidencia.estado = "pendente";
    comprovanteResidencia.motivoRecusa = "A foto saiu borrada, não dá para ler o endereço. Pode enviar de novo?";
    comprovanteResidencia.documentos = [
      doc("d1", "conta-luz.jpg", diasAtras(2), "recusado", "Foto borrada, endereço ilegível"),
    ];
    lista.push({
      id: "p-com-recusa",
      cliente: "Patrícia Moura Ribeiro",
      tipoCausa: "Usucapião (rural ou urbana)",
      modeloId: "modelo-usucapiao",
      abertoEm: diasAtras(15),
      ultimaMovimentacaoEm: diasAtras(2),
      pronto: false,
      itens,
      triagem: [],
      historico: historicoBase("Patrícia Moura Ribeiro", diasAtras(15)),
      cobranca: cobrancaPadrao({ lembretesEnviados: 1, ultimoEnvioEm: diasAtras(5) }),
      link: linkPadrao("tok-com-recusa"),
    });
  }

  // 5. Com itens em triagem (documento enviado fora da lista) e com
  // perguntas de estratégia já respondidas pelo cliente, aguardando o
  // advogado conferir.
  {
    const itens = copiarItensDoModelo("modelo-divorcio");
    const consenso = acharItem(itens, "info-consenso");
    consenso.estado = "recebido";
    consenso.resposta = "Estamos de acordo com tudo, só falta assinar os papéis.";
    const urgencia = acharItem(itens, "info-urgencia");
    urgencia.estado = "recebido";
    urgencia.resposta = "Não, nenhuma situação de risco.";
    lista.push({
      id: "p-com-triagem",
      cliente: "Renata Alves Figueiredo",
      tipoCausa: "Divórcio",
      modeloId: "modelo-divorcio",
      abertoEm: diasAtras(8),
      ultimaMovimentacaoEm: diasAtras(1),
      pronto: false,
      itens,
      triagem: [
        {
          id: "tr-1",
          nomeArquivo: "boletim-ocorrencia.pdf",
          enviadoEm: diasAtras(1),
          observacaoCliente: "Achei que isso também era importante para o processo",
        },
      ],
      historico: historicoBase("Renata Alves Figueiredo", diasAtras(8)),
      cobranca: cobrancaPadrao(),
      link: linkPadrao("tok-com-triagem"),
    });
  }

  // 6. Pronto para montagem do dossiê (obrigatórios aceitos).
  {
    const itens = copiarItensDoModelo("modelo-trabalhista").map((item, i) => ({
      ...item,
      estado: "aceito" as const,
      documentos: [doc(`d${i}`, `documento-${i + 1}.pdf`, diasAtras(5 - i), "aceito" as const)],
    }));
    lista.push({
      id: "p-pronto-dossie",
      cliente: "Eduardo Nascimento Silva",
      tipoCausa: "Reclamação trabalhista",
      modeloId: "modelo-trabalhista",
      abertoEm: diasAtras(20),
      ultimaMovimentacaoEm: diasAtras(3),
      pronto: true,
      itens,
      triagem: [],
      historico: historicoBase("Eduardo Nascimento Silva", diasAtras(20)),
      cobranca: cobrancaPadrao({ estado: "suspensa" }),
      link: linkPadrao("tok-pronto-dossie", { estado: "revogado", revogadoEm: diasAtras(2) }),
    });
  }

  // 7. Cobrança suspensa manualmente.
  {
    const itens = copiarItensDoModelo("modelo-usucapiao");
    const identidadeUsucapiao = acharItem(itens, "doc-identidade");
    identidadeUsucapiao.estado = "aceito";
    identidadeUsucapiao.documentos = [doc("d1", "rg.pdf", diasAtras(10), "aceito")];
    lista.push({
      id: "p-cobranca-suspensa",
      cliente: "Camila Torres Nogueira",
      tipoCausa: "Usucapião (rural ou urbana)",
      modeloId: "modelo-usucapiao",
      abertoEm: diasAtras(12),
      ultimaMovimentacaoEm: diasAtras(10),
      pronto: false,
      itens,
      triagem: [],
      historico: historicoBase("Camila Torres Nogueira", diasAtras(12)),
      cobranca: cobrancaPadrao({ estado: "suspensa", lembretesEnviados: 2 }),
      link: linkPadrao("tok-cobranca-suspensa"),
    });
  }

  // 8. Link expirado, cliente nunca enviou nada.
  {
    const itens = copiarItensDoModelo("modelo-divorcio");
    lista.push({
      id: "p-link-expirado",
      cliente: "Gustavo Ramos Albuquerque",
      tipoCausa: "Divórcio",
      modeloId: "modelo-divorcio",
      abertoEm: diasAtras(30),
      ultimaMovimentacaoEm: diasAtras(30),
      pronto: false,
      itens,
      triagem: [],
      historico: historicoBase("Gustavo Ramos Albuquerque", diasAtras(30)),
      cobranca: cobrancaPadrao({
        lembretesEnviados: 4,
        limiteLembretes: 4,
        ultimoEnvioEm: diasAtras(10),
      }),
      link: linkPadrao("tok-link-expirado", { estado: "expirado", validoAte: diasAtras(5) }),
    });
  }

  // 9. Falha de entrega na cobrança (endereço inválido).
  {
    const itens = copiarItensDoModelo("modelo-trabalhista");
    const identidadeTrabalhista = acharItem(itens, "doc-identidade");
    identidadeTrabalhista.estado = "aceito";
    identidadeTrabalhista.documentos = [doc("d1", "rg.pdf", diasAtras(7), "aceito")];
    lista.push({
      id: "p-falha-cobranca",
      cliente: "Letícia Barbosa Correia",
      tipoCausa: "Reclamação trabalhista",
      modeloId: "modelo-trabalhista",
      abertoEm: diasAtras(14),
      ultimaMovimentacaoEm: diasAtras(7),
      pronto: false,
      itens,
      triagem: [],
      historico: historicoBase("Letícia Barbosa Correia", diasAtras(14)),
      cobranca: cobrancaPadrao({
        falhaEntrega: "E-mail inválido ou inexistente",
        lembretesEnviados: 1,
      }),
      link: linkPadrao("tok-falha-cobranca"),
    });
  }

  // 10. Quase completo — só falta um opcional (satisfaz cenário "pronto com opcional pendente").
  {
    const itens = copiarItensDoModelo("modelo-usucapiao").map((item) => {
      if (!item.obrigatorio) return item;
      if (item.tipo === "informacao") {
        return { ...item, estado: "aceito" as const, resposta: "Urbana, pela via judicial — há divergência com um dos confrontantes." };
      }
      return {
        ...item,
        estado: "aceito" as const,
        documentos: [doc(`d-${item.id}`, `${item.id}.pdf`, diasAtras(4), "aceito" as const)],
      };
    });
    lista.push({
      id: "p-opcional-pendente",
      cliente: "Bruno Castilho Mendes",
      tipoCausa: "Usucapião (rural ou urbana)",
      modeloId: "modelo-usucapiao",
      abertoEm: diasAtras(18),
      ultimaMovimentacaoEm: diasAtras(4),
      pronto: true,
      itens,
      triagem: [],
      historico: historicoBase("Bruno Castilho Mendes", diasAtras(18)),
      cobranca: cobrancaPadrao({ estado: "suspensa" }),
      link: linkPadrao("tok-opcional-pendente"),
    });
  }

  return lista;
})();

export function getProcesso(id: string): Processo | undefined {
  return PROCESSOS.find((p) => p.id === id);
}

export function contarPendentes(p: Processo): number {
  return p.itens.filter((i) => i.estado !== "aceito").length;
}

// --- Caso de exemplo para a conferência do dossiê (tarefa 1.10a) ----------
// Caso inteiramente fictício, criado só para demonstrar a conferência do rol
// contra o texto da petição — nenhum dado real de cliente é usado aqui.

export const PECA_EXEMPLO = `EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO

Vem o autor, por seu advogado, propor a presente ação, pelos fatos a seguir:

O autor firmou contrato de prestação de serviços com a ré (DOC. 1), e prestou
os serviços conforme comprovam os relatórios de atividade (DOCs. 2, 3 e 4).

O pagamento acordado não foi efetuado, conforme demonstram os extratos
bancários anexos (DOC. 5) e a notificação extrajudicial enviada à ré (DOC. 6).

A relação de emprego entre as partes é comprovada pela carteira de trabalho
do autor (DOC. 7) e pelos holerites dos últimos seis meses (DOC. 8).

Por fim, para fins de concessão da justiça gratuita, junta-se a declaração de
hipossuficiência do autor (DOC. 9).

Diante do exposto, requer a procedência do pedido.`;

export const DOSSIE_EXEMPLO = [
  { numero: 1, descricao: "Procuração e contrato de honorários" },
  { numero: 2, descricao: "Relatório de atividade - janeiro" },
  { numero: 3, descricao: "Relatório de atividade - fevereiro" },
  { numero: 4, descricao: "Relatório de atividade - março" },
  { numero: 5, descricao: "Extrato bancário" },
  { numero: 6, descricao: "Notificação extrajudicial" },
  { numero: 7, descricao: "Carteira de trabalho" },
  { numero: 8, descricao: "Holerites" },
  { numero: 9, descricao: "Declaração de hipossuficiência" },
  { numero: 10, descricao: "Comprovante de residência" },
];

export type ApontamentoConferencia =
  | { tipo: "documento_nao_citado"; numero: number; descricao: string }
  | { tipo: "citacao_sem_documento"; numero: number };

export function conferirDossieContraPeca(
  peca: string,
  dossie: typeof DOSSIE_EXEMPLO
): ApontamentoConferencia[] {
  const citados = new Set<number>();
  const regexBloco = /DOCs?\.\s*([\d,\se]+)/gi;
  let m: RegExpExecArray | null;
  while ((m = regexBloco.exec(peca))) {
    const numeros = m[1]
      .split(/[,e]/)
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !Number.isNaN(n));
    numeros.forEach((n) => citados.add(n));
  }

  const apontamentos: ApontamentoConferencia[] = [];
  for (const d of dossie) {
    if (!citados.has(d.numero)) {
      apontamentos.push({ tipo: "documento_nao_citado", numero: d.numero, descricao: d.descricao });
    }
  }
  const numerosExistentes = new Set(dossie.map((d) => d.numero));
  for (const n of citados) {
    if (!numerosExistentes.has(n)) {
      apontamentos.push({ tipo: "citacao_sem_documento", numero: n });
    }
  }
  return apontamentos.sort((a, b) => a.numero - b.numero);
}
