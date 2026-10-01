interface Item {
  area: string;
  quantidade: number;
}

// Comparação de magnitude entre categorias: a cor correta aqui é um hue só
// (sequencial), não uma paleta categórica — o comprimento da barra já
// carrega a informação, a cor não precisa distinguir identidade entre
// gráficos. Barras horizontais, maior para a menor, rótulo direto.
export function GraficoPorArea({ itens }: { itens: Item[] }) {
  const ordenados = [...itens].sort((a, b) => b.quantidade - a.quantidade);
  const maior = Math.max(1, ...ordenados.map((i) => i.quantidade));

  return (
    <div>
      <h2 className="text-sm font-semibold text-foreground">Processos por tipo de causa</h2>
      <p className="mt-0.5 text-xs text-muted">Onde está o seu maior fluxo agora</p>

      <ul className="mt-4 space-y-3">
        {ordenados.map((item) => (
          <li key={item.area}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="truncate text-foreground/80">{item.area}</span>
              <span className="font-medium text-foreground">{item.quantidade}</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-surface-alt">
              <div
                className="h-full rounded-full bg-primary transition-opacity hover:opacity-80"
                style={{ width: `${(item.quantidade / maior) * 100}%` }}
                title={`${item.area}: ${item.quantidade} processo(s)`}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
