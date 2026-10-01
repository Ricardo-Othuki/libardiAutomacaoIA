// Bolha de explicação que só aparece ao passar o mouse (ou focar via
// teclado) — substitui o antigo padrão de legenda sempre visível. Todo
// controle continua obrigado a ter uma explicação, só muda a visibilidade.
// CSS puro (group-hover/group-focus-within), sem JavaScript.
export function Dica({
  texto,
  children,
  posicao = "cima",
  className = "",
}: {
  texto: string;
  children: React.ReactNode;
  posicao?: "cima" | "baixo";
  className?: string;
}) {
  const posicaoClasse =
    posicao === "cima" ? "bottom-full left-1/2 mb-2 -translate-x-1/2" : "top-full left-1/2 mt-2 -translate-x-1/2";

  return (
    <span className={`group/dica relative inline-flex ${className}`}>
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute z-50 w-max max-w-56 scale-95 rounded-lg bg-black/90 px-2.5 py-1.5 text-center text-xs text-white opacity-0 shadow-tooltip transition-all duration-150 group-hover/dica:scale-100 group-hover/dica:opacity-100 group-focus-within/dica:scale-100 group-focus-within/dica:opacity-100 ${posicaoClasse}`}
      >
        {texto}
      </span>
    </span>
  );
}
