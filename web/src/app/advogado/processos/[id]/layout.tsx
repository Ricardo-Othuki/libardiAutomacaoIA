import Link from "next/link";
import { notFound } from "next/navigation";
import { getProcesso } from "@/lib/mock/data";
import { NavProcesso } from "@/components/NavProcesso";
import { ProcessoStepper } from "@/components/ProcessoStepper";

export default async function ProcessoLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const processo = getProcesso(id);
  if (!processo) notFound();

  return (
    <div>
      <Link href="/advogado/pendencias" className="text-sm text-primary hover:underline">
        ← Voltar ao painel de pendências
      </Link>
      <h1 className="mt-2 text-xl font-semibold text-foreground">{processo.cliente}</h1>
      <p className="mb-4 text-sm text-muted">{processo.tipoCausa}</p>
      <ProcessoStepper processo={processo} />
      <NavProcesso processoId={processo.id} />
      {children}
    </div>
  );
}
