import { ButtonHTMLAttributes } from "react";
import { HelpCircle } from "lucide-react";
import { Dica } from "./Dica";

type Variante = "primario" | "secundario" | "perigoso" | "fantasma";

interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Obrigatório: explica em poucas palavras o que este botão faz — aparece ao passar o mouse no ícone "?". */
  legenda: string;
  variante?: Variante;
  /** Botão menor, para tabelas e listas de ações densas. */
  compacto?: boolean;
}

const estilos: Record<Variante, string> = {
  primario: "bg-primary text-primary-contrast hover:bg-primary-hover shadow-theme-xs",
  secundario: "bg-surface text-foreground border border-border hover:bg-surface-alt shadow-theme-xs",
  perigoso: "bg-danger text-primary-contrast hover:opacity-90 shadow-theme-xs",
  fantasma: "bg-transparent text-primary hover:bg-primary/10",
};

const corIcone: Record<Variante, string> = {
  primario: "text-primary-contrast/70 hover:text-primary-contrast",
  secundario: "text-muted hover:text-foreground",
  perigoso: "text-primary-contrast/70 hover:text-primary-contrast",
  fantasma: "text-primary/70 hover:text-primary",
};

export function Botao({
  legenda,
  variante = "primario",
  compacto = false,
  className = "",
  children,
  ...props
}: BotaoProps) {
  const tamanho = compacto ? "px-2.5 py-1.5 text-xs" : "px-4 py-2.5 text-sm";

  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 ${tamanho} ${estilos[variante]} ${className}`}
      {...props}
    >
      {children}
      <Dica texto={legenda}>
        <HelpCircle size={compacto ? 12 : 14} className={corIcone[variante]} />
      </Dica>
    </button>
  );
}
