"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Tema = "dark" | "light";

// Alterna entre tema escuro (padrão do sistema) e claro, grava a escolha
// e atualiza o atributo lido pelo CSS em globals.css.
export function ThemeToggle() {
  // Primeira renderização assume "dark" — igual ao que o servidor rendeu —
  // para não divergir na hidratação. O efeito abaixo corrige depois, lendo
  // o atributo que o script inline de layout.tsx já aplicou ao <html> a
  // partir do localStorage; isso só dispara uma repintura local do ícone,
  // não uma cascata de efeitos.
  const [tema, setTema] = useState<Tema>("dark");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sincroniza com o atributo já aplicado pelo script anti-flash, não uma cascata
    setTema((document.documentElement.getAttribute("data-theme") as Tema) || "dark");
  }, []);

  function alternar() {
    const novo: Tema = tema === "dark" ? "light" : "dark";
    setTema(novo);
    document.documentElement.setAttribute("data-theme", novo);
    try {
      localStorage.setItem("tema", novo);
    } catch {
      // Armazenamento indisponível (ex.: aba anônima); o tema só não persiste.
    }
  }

  return (
    <button
      type="button"
      onClick={alternar}
      title={tema === "dark" ? "Mudar para o tema claro" : "Mudar para o tema escuro"}
      aria-label={tema === "dark" ? "Mudar para o tema claro" : "Mudar para o tema escuro"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-foreground/80 transition-colors hover:text-foreground"
    >
      {tema === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
