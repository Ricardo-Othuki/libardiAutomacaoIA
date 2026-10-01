# Spec Delta

## Purpose

Guardar, como dado estruturado e reutilizável, as listas de documentos exigidos
por tipo de causa que o advogado já escreve hoje em texto solto. Essa lista é o
ativo central do produto: dela derivam o que pedir ao cliente, o que ainda falta
e como o documento recebido é rotulado.

## ADDED Requirements

### Requirement: Modelo de checklist por tipo de causa

O advogado mantém modelos de lista de documentos, um por tipo de causa. Cada
modelo tem nome, área do Direito e uma sequência ordenada de itens. O modelo é
dele e não é compartilhado sem ação explícita.

#### Scenario: Criação de modelo
- **WHEN** o advogado cria um modelo informando nome e área
- **THEN** o modelo fica disponível para uso em novos processos

#### Scenario: Alteração de modelo já usado
- **WHEN** o advogado altera um modelo já aplicado a processos existentes
- **THEN** os processos existentes mantêm a checklist como estava
- **AND** apenas processos criados depois usam a versão alterada

### Requirement: Item de checklist com identidade estável

Cada item tem identificador próprio e estável, nome técnico para o advogado,
descrição em linguagem simples para o cliente, indicação de obrigatoriedade e
indicação de se admite múltiplos arquivos. O identificador não muda quando o
nome é editado.

#### Scenario: Item que admite vários arquivos
- **WHEN** um item está marcado como múltiplo, por exemplo holerites
- **THEN** o cliente pode enviar vários arquivos nesse mesmo item

#### Scenario: Renomear item
- **WHEN** o advogado altera o nome de um item
- **THEN** documentos já vinculados a ele permanecem vinculados

### Requirement: Descrição compreensível pelo leigo

Todo item tem uma descrição destinada ao cliente, escrita sem jargão. O sistema
não exibe ao cliente o nome técnico do item quando existe descrição simples.

#### Scenario: Item com nome técnico
- **WHEN** um item chamado "declaração de hipossuficiência" é exibido ao cliente
- **THEN** o cliente vê a descrição simples correspondente, não o nome técnico

### Requirement: Blocos de argumentação dentro do modelo

Itens são agrupados em blocos que refletem a estrutura da peça: identificação
das partes, comprovação de hipossuficiência e blocos de prova por argumento. A
ordem dos blocos e dos itens dentro deles é definida pelo advogado e determina a
ordem do dossiê.

#### Scenario: Reordenar blocos
- **WHEN** o advogado reordena os blocos de um modelo
- **THEN** a nova ordem passa a valer para processos criados a partir dali

### Requirement: Modelos comuns aplicáveis a qualquer causa

Existem conjuntos de itens aplicáveis a diversos tipos de causa, como os exigidos
para pedido de justiça gratuita. O advogado pode incluir um conjunto desses em
qualquer modelo sem redigitar seus itens.

#### Scenario: Inclusão de conjunto comum
- **WHEN** o advogado adiciona o conjunto de justiça gratuita a um modelo
- **THEN** os itens do conjunto passam a integrar a checklist daquele modelo

### Requirement: Importação de lista em texto

O advogado pode colar uma lista de documentos em texto corrido e o sistema
propõe a separação em itens. A proposta é sempre revisada e confirmada por ele
antes de virar modelo.

#### Scenario: Colagem de lista existente
- **WHEN** o advogado cola uma lista em texto com um documento por linha
- **THEN** o sistema apresenta os itens propostos para revisão
- **AND** nenhum item é salvo antes da confirmação
