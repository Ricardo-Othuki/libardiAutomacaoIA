# Spec Delta

## Purpose

Representar o caso do cliente desde a contratação até a exportação do dossiê,
mantendo sempre visível o que já chegou e o que ainda falta. Substitui o
controle mental que hoje limita quantos casos o advogado aceita ao mesmo tempo.

## ADDED Requirements

### Requirement: Abertura de processo a partir de um modelo

Ao abrir um processo, o advogado informa o cliente e escolhe o tipo de causa. A
checklist é criada como cópia do modelo, pertencente àquele processo, e pode ser
ajustada sem afetar o modelo de origem.

#### Scenario: Ajuste da checklist do caso
- **WHEN** o advogado remove ou acrescenta itens na checklist de um processo
- **THEN** o modelo de origem permanece inalterado

#### Scenario: Caso sem modelo adequado
- **WHEN** nenhum modelo serve ao caso
- **THEN** o advogado pode abrir o processo com checklist vazia e montá-la item a item

### Requirement: Estado explícito de cada item

Cada item da checklist está sempre em exatamente um estado observável:
pendente, recebido, em conferência, aceito ou recusado. O estado é visível ao
advogado a qualquer momento.

#### Scenario: Chegada de documento
- **WHEN** o cliente envia um arquivo em um item pendente
- **THEN** o item passa a recebido e aguarda conferência do advogado

#### Scenario: Recusa de documento
- **WHEN** o advogado recusa um documento por ilegibilidade ou por não corresponder ao item
- **THEN** o item volta a pendente com o motivo registrado
- **AND** o motivo fica disponível ao cliente em linguagem simples

### Requirement: Painel de pendências entre processos

O advogado vê, em uma única tela, todos os processos ativos e o que falta em
cada um, ordenados por urgência. A tela responde à pergunta "o que está me
travando agora" sem exigir que ele abra cada processo.

#### Scenario: Visão geral
- **WHEN** o advogado abre o painel
- **THEN** vê cada processo com quantidade de itens pendentes e tempo desde a última movimentação

#### Scenario: Processo sem movimentação
- **WHEN** um processo fica sem novos envios além do prazo configurado
- **THEN** é destacado como parado no painel

### Requirement: Progresso visível ao cliente

O cliente enxerga seu próprio avanço: quantos itens já enviou e quantos faltam.
Nenhuma informação sobre outros processos ou outros clientes é revelada.

#### Scenario: Cliente acompanha o envio
- **WHEN** o cliente abre o link após enviar parte dos documentos
- **THEN** vê quais itens já enviou e quais continuam pendentes

### Requirement: Conclusão da coleta

Quando todos os itens obrigatórios estão aceitos, o processo é marcado como
pronto para montagem do dossiê. Itens opcionais pendentes não impedem a
conclusão, mas são informados ao advogado.

#### Scenario: Obrigatórios completos, opcionais faltando
- **WHEN** todos os itens obrigatórios estão aceitos e restam opcionais pendentes
- **THEN** o processo é marcado como pronto
- **AND** o advogado é avisado de quais opcionais ficaram de fora

### Requirement: Histórico do processo

O processo guarda a sequência de eventos relevantes: abertura, envio de link,
chegada de documento, conferência, cobrança e exportação, com data e hora.

#### Scenario: Consulta ao histórico
- **WHEN** o advogado abre o histórico de um processo
- **THEN** vê os eventos em ordem cronológica com seus responsáveis
