import type { EstadoCobranca, EstadoItem, EstadoLink } from "@/lib/types";

interface InfoEstado {
  rotulo: string;
  classe: string;
  ponto: string;
  explicacao: string;
}

const ESTADOS_ITEM: Record<EstadoItem, InfoEstado> = {
  pendente: {
    rotulo: "Pendente",
    classe: "bg-border text-foreground/70",
    ponto: "bg-muted",
    explicacao: "Ainda não chegou nenhum arquivo para este item.",
  },
  recebido: {
    rotulo: "Recebido",
    classe: "bg-info-bg text-info",
    ponto: "bg-info",
    explicacao: "O cliente enviou, aguardando o advogado conferir.",
  },
  em_conferencia: {
    rotulo: "Em conferência",
    classe: "bg-warning-bg text-warning",
    ponto: "bg-warning",
    explicacao: "O advogado está analisando este documento agora.",
  },
  aceito: {
    rotulo: "Aceito",
    classe: "bg-success-bg text-success",
    ponto: "bg-success",
    explicacao: "Documento conferido e aprovado, pronto para o dossiê.",
  },
  recusado: {
    rotulo: "Recusado",
    classe: "bg-danger-bg text-danger",
    ponto: "bg-danger",
    explicacao: "O documento foi recusado e o item voltou a pendente.",
  },
};

const ESTADOS_LINK: Record<EstadoLink, InfoEstado> = {
  ativo: { rotulo: "Ativo", classe: "bg-success-bg text-success", ponto: "bg-success", explicacao: "O link pode ser usado pelo cliente." },
  expirado: {
    rotulo: "Expirado",
    classe: "bg-border text-foreground/70",
    ponto: "bg-muted",
    explicacao: "O prazo de validade passou; o cliente não consegue mais enviar por ele.",
  },
  revogado: {
    rotulo: "Revogado",
    classe: "bg-danger-bg text-danger",
    ponto: "bg-danger",
    explicacao: "O link foi cancelado manualmente e não funciona mais.",
  },
};

const ESTADOS_COBRANCA: Record<EstadoCobranca, InfoEstado> = {
  ativa: { rotulo: "Cobrança ativa", classe: "bg-success-bg text-success", ponto: "bg-success", explicacao: "Lembretes automáticos ligados para este processo." },
  suspensa: { rotulo: "Cobrança suspensa", classe: "bg-border text-foreground/70", ponto: "bg-muted", explicacao: "Nenhum lembrete automático será enviado até retomar." },
};

function Badge({ rotulo, classe, ponto, explicacao }: InfoEstado) {
  return (
    <span
      title={explicacao}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${classe}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${ponto}`} />
      {rotulo}
    </span>
  );
}

export function EstadoItemBadge({ estado }: { estado: EstadoItem }) {
  return <Badge {...ESTADOS_ITEM[estado]} />;
}

export function EstadoLinkBadge({ estado }: { estado: EstadoLink }) {
  return <Badge {...ESTADOS_LINK[estado]} />;
}

export function EstadoCobrancaBadge({ estado }: { estado: EstadoCobranca }) {
  return <Badge {...ESTADOS_COBRANCA[estado]} />;
}
