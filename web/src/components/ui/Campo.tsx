import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { HelpCircle } from "lucide-react";
import { Dica } from "./Dica";

const classeControle =
  "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-4 focus:ring-primary/15";

interface CampoBaseProps {
  rotulo: string;
  /** Obrigatório: explica o que preencher ou escolher aqui — aparece como dica ao passar o mouse no ícone. */
  legenda: string;
  erro?: string;
}

function Rotulo({ texto, legenda, idAlvo }: { texto: string; legenda: string; idAlvo?: string }) {
  return (
    <span className="mb-1 flex items-center gap-1">
      <label className="text-sm font-medium text-foreground" htmlFor={idAlvo}>
        {texto}
      </label>
      <Dica texto={legenda}>
        <HelpCircle size={13} className="text-muted hover:text-foreground" />
      </Dica>
    </span>
  );
}

export function Campo({
  rotulo,
  legenda,
  erro,
  id,
  ...props
}: CampoBaseProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <Rotulo texto={rotulo} legenda={legenda} idAlvo={id} />
      <input id={id} className={classeControle} {...props} />
      {erro && <p className="mt-1 text-xs text-danger">⚠ {erro}</p>}
    </div>
  );
}

export function CampoArea({
  rotulo,
  legenda,
  erro,
  id,
  ...props
}: CampoBaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <Rotulo texto={rotulo} legenda={legenda} idAlvo={id} />
      <textarea id={id} className={classeControle} {...props} />
      {erro && <p className="mt-1 text-xs text-danger">⚠ {erro}</p>}
    </div>
  );
}

export function CampoSelecao({
  rotulo,
  legenda,
  erro,
  id,
  children,
  ...props
}: CampoBaseProps & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      <Rotulo texto={rotulo} legenda={legenda} idAlvo={id} />
      <select id={id} className={classeControle} {...props}>
        {children}
      </select>
      {erro && <p className="mt-1 text-xs text-danger">⚠ {erro}</p>}
    </div>
  );
}
