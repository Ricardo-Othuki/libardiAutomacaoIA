# AGENTS.md

## Idioma

- **Este projeto é em PT-BR.** Toda a comunicação com o usuário deve ser
  obrigatoriamente em português do Brasil.
- Comentários de código, mensagens de commit, documentação e nomes de arquivos
  de documentação também em PT-BR.
- Esta é uma preferência permanente do projeto.

## OpenSpec

Este projeto usa OpenSpec (CLI `openspec`, versão 1.13.0) para desenvolvimento
guiado por especificação. As especificações e mudanças ficam em `openspec/`.

### Onde ficam os arquivos de cada ferramenta

O `openspec init` gera os arquivos nas pastas que cada ferramenta espera:

- `.claude/commands/opsx/` e `.claude/skills/` — Claude Code
- `.agents/skills/` — Codex
- `.kilocode/skills/` e `.kilocode/workflows/` — extensão Kilo Code (VS Code)
- `.kilo/command/` — CLI do Kilo (cópia dos workflows, mantida manualmente)

`.kilocode/` é criado e mantido pelo instalador do OpenSpec, portanto é uma
exceção conhecida à regra geral de não usar essa pasta. Arquivos novos escritos
por agentes continuam indo para `.kilo/`.

### Regra de sincronização

Depois de rodar `openspec init` ou `openspec update` novamente, recopie os
workflows para a CLI e reaplique o frontmatter em PT-BR:

```bash
cp .kilocode/workflows/*.md .kilo/command/
```

O frontmatter `description:` de cada arquivo em `.kilo/command/` deve usar texto
simples, sem dois-pontos no valor, porque o parser de frontmatter rejeita.
