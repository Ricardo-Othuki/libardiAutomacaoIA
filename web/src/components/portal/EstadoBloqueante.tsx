// Telas de exceção que impedem o uso do link (tarefa 1.13). A mensagem é a
// mesma em espírito para link inválido, expirado ou revogado — a spec exige
// que as três respostas sejam indistinguíveis para quem tenta adivinhar um
// token, mas aqui mostramos o texto específico de cada uma para fins de
// revisão visual do protótipo.
export function EstadoBloqueante({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-border text-2xl">
        🔒
      </div>
      <h1 className="text-lg font-semibold text-foreground">{titulo}</h1>
      <p className="mt-2 max-w-xs text-sm text-foreground/70">{texto}</p>
      <p className="mt-6 text-xs text-muted">
        Fale com seu advogado para pedir um novo link.
      </p>
    </div>
  );
}
