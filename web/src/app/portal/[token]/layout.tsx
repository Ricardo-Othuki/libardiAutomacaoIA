// Layout do portal do cliente: deliberadamente isolado do menu e da
// navegação do advogado. O portador do link só enxerga o que está aqui —
// nunca outros processos, nem dados de outros clientes.
export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface px-4 py-3">
        <p className="text-sm font-semibold text-foreground">Libardi Advocacia</p>
        <p className="text-xs text-muted">Envio de documentos</p>
      </header>
      <main className="mx-auto max-w-md px-4 py-6">{children}</main>
    </div>
  );
}
