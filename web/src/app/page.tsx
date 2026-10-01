import Link from "next/link";

// Landing page de vendas de exemplo. É um placeholder institucional, criado
// só para ocupar a rota "/" enquanto o sistema está em protótipo — deve ser
// substituída por uma página de vendas de verdade quando o produto estiver
// pronto. A tela do sistema propriamente dita começa em /login.
const BENEFICIOS = [
  {
    titulo: "Checklist pronta por tipo de causa",
    texto: "As listas que você já usa viram um checklist ativo, reaproveitável a cada novo caso.",
  },
  {
    titulo: "Cliente envia sem complicação",
    texto: "Um link, sem cadastro e sem senha: o cliente manda cada documento no lugar certo.",
  },
  {
    titulo: "Cobrança automática",
    texto: "Lembretes saem sozinhos no prazo que você definir, sempre com o que falta.",
  },
  {
    titulo: "Dossiê pronto para protocolo",
    texto: "Documentos numerados e na ordem certa, sem o trabalho manual de organizar tudo de novo.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <span className="text-base font-semibold text-foreground">Libardi Advocacia · Coleta Guiada</span>
          <Link href="/login" className="text-sm font-medium text-primary hover:underline">
            Entrar no sistema
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="mb-3 inline-block rounded-full bg-info-bg px-3 py-1 text-xs font-medium text-info">
          Página de exemplo — será substituída por uma versão final de vendas
        </p>
        <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
          Pare de perseguir cliente por documento
        </h1>
        <p className="mt-4 text-base text-foreground/70">
          Monte a checklist do tipo de causa uma vez, envie um link ao cliente e
          acompanhe tudo em um painel só — sem planilha, sem WhatsApp perdido.
        </p>
        <Link
          href="/login"
          className="mt-8 inline-block rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-contrast hover:bg-primary-hover"
        >
          Ver o sistema (protótipo)
        </Link>
      </section>

      <section className="mx-auto grid max-w-5xl gap-4 px-6 pb-20 sm:grid-cols-2">
        {BENEFICIOS.map((b) => (
          <div key={b.titulo} className="rounded-lg border border-border bg-surface p-5">
            <h2 className="text-sm font-semibold text-foreground">{b.titulo}</h2>
            <p className="mt-1 text-sm text-foreground/70">{b.texto}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
