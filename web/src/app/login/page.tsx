"use client";

import { useRouter } from "next/navigation";
import { AjudaDaTela } from "@/components/ui/AjudaDaTela";
import { Botao } from "@/components/ui/Botao";
import { Campo } from "@/components/ui/Campo";
import { Card } from "@/components/ui/Card";

// Tela de entrada do sistema. Nesta etapa de protótipo não há autenticação
// real: o botão "Entrar" apenas leva ao painel com dados fictícios.
export default function LoginPage() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm">
        <AjudaDaTela titulo="Tela de login">
          Protótipo visual: não existe senha real nesta etapa. Clique em
          &quot;Entrar&quot; para ver o sistema com um usuário de exemplo.
        </AjudaDaTela>
        <Card>
          <h1 className="text-lg font-semibold text-foreground">Entrar</h1>
          <form
            className="mt-4 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              router.push("/advogado/pendencias");
            }}
          >
            <Campo
              rotulo="E-mail"
              id="email"
              type="email"
              defaultValue="ian@libardiadvocacia.com.br"
              legenda="O e-mail cadastrado do advogado. Neste protótipo já vem preenchido."
            />
            <Campo
              rotulo="Senha"
              id="senha"
              type="password"
              defaultValue="••••••••"
              legenda="A senha de acesso. Neste protótipo não é verificada de verdade."
            />
            <Botao
              legenda="Leva ao painel de pendências com um usuário de exemplo"
              type="submit"
              className="w-full justify-center"
            >
              Entrar
            </Botao>
          </form>
        </Card>
      </div>
    </div>
  );
}
