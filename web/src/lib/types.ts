// Tipos de domínio do protótipo. Os nomes seguem o vocabulário das specs em
// openspec/changes/coleta-guiada-de-documentos/specs/ para que a implementação
// real (grupo 2 em diante) reaproveite as mesmas palavras.

export type EstadoItem =
  | "pendente"
  | "recebido"
  | "em_conferencia"
  | "aceito"
  | "recusado";

export type EstadoLink = "ativo" | "expirado" | "revogado";

export type EstadoCobranca = "ativa" | "suspensa";

// "documento": item resolvido com upload de arquivo (comportamento padrão).
// "informacao": item resolvido com uma resposta curta em texto — para
// perguntas de estratégia do caso que o advogado precisa saber mas que não
// são um arquivo (ex.: "há consenso entre as partes?"). Usa os mesmos 5
// estados e o mesmo fluxo de aceitar/recusar de um documento.
export type TipoItem = "documento" | "informacao";

export interface Documento {
  id: string;
  nomeArquivo: string;
  enviadoEm: string; // ISO
  estado: EstadoItem;
  motivoRecusa?: string;
  paginas?: number;
}

export interface ItemChecklist {
  id: string;
  nomeTecnico: string;
  descricaoSimples: string;
  obrigatorio: boolean;
  aceitaMultiplos: boolean;
  bloco: string;
  tipo: TipoItem;
  estado: EstadoItem;
  documentos: Documento[];
  /** Preenchido só quando tipo === "informacao". */
  resposta?: string;
  motivoRecusa?: string;
}

export interface ItemTriagem {
  id: string;
  nomeArquivo: string;
  enviadoEm: string;
  observacaoCliente?: string;
}

export interface EventoHistorico {
  id: string;
  autor: string;
  acao: string;
  dataHora: string; // ISO
}

export interface Cobranca {
  estado: EstadoCobranca;
  cadenciaDias: number;
  limiteLembretes: number;
  lembretesEnviados: number;
  ultimoEnvioEm?: string;
  falhaEntrega?: string;
}

export interface LinkEnvio {
  token: string;
  criadoEm: string;
  validoAte: string;
  revogadoEm?: string;
  estado: EstadoLink;
}

export interface Processo {
  id: string;
  cliente: string;
  tipoCausa: string;
  modeloId: string;
  abertoEm: string;
  ultimaMovimentacaoEm: string;
  pronto: boolean;
  itens: ItemChecklist[];
  triagem: ItemTriagem[];
  historico: EventoHistorico[];
  cobranca: Cobranca;
  link: LinkEnvio;
}

export interface ItemModelo {
  id: string;
  nomeTecnico: string;
  descricaoSimples: string;
  obrigatorio: boolean;
  aceitaMultiplos: boolean;
  /** Padrão "documento" quando ausente. */
  tipo?: TipoItem;
}

export interface BlocoModelo {
  id: string;
  nome: string;
  itens: ItemModelo[];
}

export interface ModeloChecklist {
  id: string;
  nome: string;
  area: string;
  blocos: BlocoModelo[];
  /**
   * true quando a lista real deste tipo de causa ainda não foi recebida do
   * advogado por completo — mostra um aviso no catálogo em vez de fingir
   * que a lista está pronta.
   */
  incompleto?: boolean;
}
