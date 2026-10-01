# Guia OpenSpec — fluxo de trabalho

## A regra que resolve tudo

**Primeiro decide-se o que fazer. Depois escreve-se o código.**

Você nunca pede "implemente X" direto. Você pede um plano, lê, aprova, e só
então manda implementar. O OpenSpec existe para forçar essa ordem.

---

## Antes da primeira tarefa (faz-se uma vez só)

Abra `openspec/config.yaml` e preencha o bloco `context:`, hoje comentado:

```yaml
context: |
  Projeto: automação de geração de documentos jurídicos.
  Stack: <suas tecnologias>
  Domínio: <peças, prazos, clientes — o vocabulário da área>
```

Esse texto é injetado no agente toda vez que ele gera um plano. É o ajuste com
maior retorno sobre a qualidade das propostas — sem ele, o agente supõe.

---

## O ciclo

```
/opsx-propose   →   você lê   →   /opsx-apply   →   /opsx-archive
    planeja           revisa        implementa         encerra
```

Três comandos. O resto é exceção.

---

## Sua primeira tarefa, passo a passo

**1. Peça o plano** — no chat, descreva um pedaço pequeno e concreto:

```
/opsx-propose cadastrar cliente com nome, CPF e endereço
```

O agente cria `openspec/changes/<nome>/` com quatro arquivos e **para**. Ele não
escreve código aqui, mesmo que você tenha dito "implemente".

**2. Leia o que ele planejou** — os quatro arquivos, nesta ordem:

| Arquivo | Pergunta que responde |
|---|---|
| `proposal.md` | por que fazer isso |
| `specs/.../spec.md` | o que o sistema deve fazer |
| `design.md` | como resolver tecnicamente |
| `tasks.md` | quais passos executar |

**Esta é a etapa que importa.** Corrigir uma linha aqui custa segundos; corrigir
depois de implementado custa horas.

**3. Ajuste, se precisar:**

```
/opsx-update    →  o CPF precisa ser validado, e aceitar CNPJ também
```

Ele reescreve os artefatos mantendo todos coerentes entre si. Repita até o plano
estar certo.

**4. Mande implementar:**

```
/opsx-apply
```

Agora sim o código é escrito, seguindo `tasks.md`.

**5. Teste o que saiu.** Se estiver certo, encerre:

```
/opsx-archive
```

A mudança vai para o arquivo e as specs principais em `openspec/specs/` passam a
descrever o sistema já com essa funcionalidade.

**6. Volte ao passo 1** com a próxima funcionalidade.

---

## Como não travar

| Situação | Faça |
|---|---|
| Não sei em que pé está | `openspec status --all` no terminal |
| Não sei o que quero ainda | `/opsx-explore <sua dúvida>` — conversa, não implementa |
| O plano está errado | `/opsx-update` — nunca corrija editando código depois |
| Não lembro o nome da mudança | `openspec list` |
| Quero ver tudo de uma vez | `openspec view` |

---

## Duas coisas que confundem no início

**Existem dois lugares com "specs".** Não são a mesma coisa:

- `openspec/specs/` → como o sistema **é hoje**
- `openspec/changes/<nome>/specs/` → **o que vai mudar** nele

O segundo só é absorvido pelo primeiro no `/opsx-archive`.

**`/opsx-sync` você provavelmente não vai usar.** Ele consolida as specs sem
encerrar a mudança — útil só em trabalho muito longo. O `/opsx-archive` já faz
isso no fluxo normal.

---

## Como digitar os comandos

Aqui no Kilo é `/opsx-propose`. Em outras ferramentas a pontuação muda:

- Claude Code → `/opsx:propose`
- Codex → `$openspec-propose`

---

## O erro clássico

Pedir uma funcionalidade grande demais de uma vez. Uma mudança deve caber na sua
cabeça quando você lê o `tasks.md`. Se a lista tem 30 tarefas, quebre em duas ou
três propostas menores — o agente erra menos e você revisa melhor.

---

## Manutenção

Se algum dia rodar `openspec init` ou `openspec update` novamente, recopie os
comandos para a CLI do Kilo:

```bash
cp .kilocode/workflows/*.md .kilo/command/
```

Depois reaplique o `description:` em PT-BR nos arquivos copiados, sem usar
dois-pontos no valor (o parser do Kilo rejeita).
