import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Evita que o Turbopack suba até a pasta pessoal do usuário procurando
  // lockfile — o projeto raiz é esta pasta "web".
  turbopack: {
    root: path.join(__dirname),
  },
  // Desliga o indicador flutuante de rota do Next.js em desenvolvimento —
  // é só do framework, não do nosso app, e fica no caminho da revisão.
  devIndicators: false,
};

export default nextConfig;
