// Faixa fixa no topo de cada tela do protótipo, explicando em 1-2 frases
// o que a tela faz e como ela se encaixa no fluxo do sistema.
export function AjudaDaTela({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6 rounded-lg border border-info bg-info-bg px-4 py-3">
      <p className="text-sm font-semibold text-info">{titulo}</p>
      <p className="mt-1 text-sm text-foreground/80">{children}</p>
    </div>
  );
}
