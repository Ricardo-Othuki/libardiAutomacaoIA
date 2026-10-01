type TipoAviso = "info" | "sucesso" | "atencao" | "perigo";

const estilos: Record<TipoAviso, { caixa: string; titulo: string; icone: string }> = {
  info: { caixa: "border-info bg-info-bg", titulo: "text-info", icone: "ℹ" },
  sucesso: { caixa: "border-success bg-success-bg", titulo: "text-success", icone: "✔" },
  atencao: { caixa: "border-warning bg-warning-bg", titulo: "text-warning", icone: "⚠" },
  perigo: { caixa: "border-danger bg-danger-bg", titulo: "text-danger", icone: "⛔" },
};

export function Aviso({
  tipo = "info",
  titulo,
  children,
}: {
  tipo?: TipoAviso;
  titulo: string;
  children?: React.ReactNode;
}) {
  const e = estilos[tipo];
  return (
    <div className={`rounded-lg border px-4 py-3 ${e.caixa}`} role="status">
      <p className={`text-sm font-semibold ${e.titulo}`}>
        {e.icone} {titulo}
      </p>
      {children ? <p className="mt-1 text-sm text-foreground/80">{children}</p> : null}
    </div>
  );
}
