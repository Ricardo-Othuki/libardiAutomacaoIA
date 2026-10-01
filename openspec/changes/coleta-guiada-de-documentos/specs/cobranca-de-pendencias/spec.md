# Spec Delta

## Purpose

Eliminar o trabalho de lembrar e cobrar manualmente o que cada cliente ainda
deve. É a capacidade que ataca a trava declarada pelo advogado — ficar
dependendo do cliente — e a que converte tempo morto em casos concluídos.

## ADDED Requirements

### Requirement: Lembrete automático do que falta

O sistema envia ao cliente lembretes do que ainda não foi entregue, conforme
prazo definido pelo advogado. O lembrete sempre lista os itens pendentes e traz
o link de envio.

#### Scenario: Prazo atingido com pendências
- **WHEN** o prazo configurado é atingido e restam itens obrigatórios pendentes
- **THEN** o cliente recebe lembrete com a lista do que falta

#### Scenario: Tudo entregue antes do prazo
- **WHEN** todos os itens obrigatórios já foram aceitos
- **THEN** nenhum lembrete é enviado

### Requirement: Cadência definida pelo advogado

O advogado define o intervalo entre lembretes e o número máximo por processo. A
configuração vale por processo e tem um padrão aplicável a todos.

#### Scenario: Limite de lembretes atingido
- **WHEN** o número máximo de lembretes é alcançado sem resposta
- **THEN** o envio automático cessa
- **AND** o processo é sinalizado ao advogado para intervenção pessoal

### Requirement: Controle do advogado sobre o envio

Nenhum lembrete é enviado sem que o advogado tenha habilitado a cobrança para
aquele processo. Ele pode suspender, retomar ou disparar um lembrete manualmente
a qualquer momento.

#### Scenario: Cobrança suspensa
- **WHEN** o advogado suspende a cobrança de um processo
- **THEN** nenhum lembrete automático é enviado até que ele retome

#### Scenario: Envio imediato
- **WHEN** o advogado dispara um lembrete manual
- **THEN** o cliente o recebe sem aguardar o próximo ciclo

### Requirement: Conteúdo do lembrete sem dado sensível

O lembrete identifica o advogado e o caso de forma genérica, lista os itens
pendentes e traz o link. Não contém documento anexado, dado pessoal do cliente
além do nome, nem detalhe do caso.

#### Scenario: Lembrete interceptado
- **WHEN** a mensagem chega a destinatário indevido
- **THEN** não expõe documento nem detalhe sensível do caso

### Requirement: Registro das cobranças

Toda cobrança enviada fica registrada no histórico do processo com data, canal e
itens listados, servindo de prova de diligência do advogado.

#### Scenario: Consulta ao histórico de cobrança
- **WHEN** o advogado consulta o processo
- **THEN** vê quando cada cobrança foi enviada e o que foi cobrado

### Requirement: Falha de entrega visível

Quando o envio de uma cobrança falha, o advogado é informado. A falha nunca
passa despercebida a ponto de ele supor que o cliente foi cobrado.

#### Scenario: Endereço inválido
- **WHEN** a entrega falha por destinatário inválido ou inexistente
- **THEN** o processo é sinalizado com a falha e o motivo
