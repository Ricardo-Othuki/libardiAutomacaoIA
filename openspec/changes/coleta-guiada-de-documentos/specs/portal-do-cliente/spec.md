# Spec Delta

## Purpose

Permitir que o cliente do advogado envie seus documentos sem cadastro, sem senha
e sem instalar nada, entendendo com clareza o que está sendo pedido. É a
superfície pública do sistema e a que define se a coleta guiada funciona: se o
cliente não usar, ele volta a mandar tudo solto por WhatsApp.

## ADDED Requirements

### Requirement: Acesso apenas por link, sem cadastro

O cliente acessa por um link que o advogado envia. Não cria conta, não escolhe
senha, não instala aplicativo. O link é o único credenciamento.

#### Scenario: Primeiro acesso
- **WHEN** o cliente abre o link pela primeira vez
- **THEN** vê imediatamente a lista de documentos pedidos, sem etapa de cadastro

#### Scenario: Retorno posterior
- **WHEN** o cliente reabre o mesmo link dias depois
- **THEN** retoma de onde parou, com os envios anteriores preservados

### Requirement: Envio pelo item correspondente

Cada item da lista tem sua própria área de envio. Ao enviar pelo item, o cliente
informa o que o documento é, dispensando classificação posterior.

#### Scenario: Envio no item certo
- **WHEN** o cliente envia um arquivo pela área do item "comprovante de residência"
- **THEN** o documento fica vinculado a esse item sem qualquer inferência do sistema

#### Scenario: Item que aceita vários arquivos
- **WHEN** o item admite múltiplos e o cliente envia vários arquivos
- **THEN** todos ficam vinculados ao mesmo item, preservando a ordem de envio

### Requirement: Envio fora da lista

O cliente pode enviar um documento que julga relevante sem que haja item
correspondente. Esse envio fica separado, marcado para triagem do advogado, e
nunca entra no dossiê sem decisão dele.

#### Scenario: Documento não previsto
- **WHEN** o cliente envia um arquivo pela área de documento adicional
- **THEN** o arquivo fica na triagem do advogado
- **AND** o advogado pode vinculá-lo a um item, criar um novo item ou descartá-lo

### Requirement: Envio pelo celular com foto

O cliente pode fotografar um documento pelo celular e enviar direto, sem
precisar converter o arquivo antes.

#### Scenario: Foto de documento em papel
- **WHEN** o cliente envia uma foto pelo celular
- **THEN** o sistema aceita a imagem e cuida da conversão

#### Scenario: Várias fotos de um mesmo documento
- **WHEN** o cliente envia várias fotos referentes a um documento de múltiplas páginas
- **THEN** pode indicar que pertencem ao mesmo documento, preservando a ordem das páginas

### Requirement: Linguagem sem jargão

Toda comunicação com o cliente usa linguagem cotidiana. Termos técnicos do
Direito e mensagens de erro técnicas nunca são exibidos a ele.

#### Scenario: Erro no envio
- **WHEN** um envio falha por formato não aceito
- **THEN** o cliente vê explicação em linguagem simples e o que fazer
- **AND** não vê código de erro, nome de sistema ou detalhe técnico

### Requirement: Envio em conexão instável

O envio funciona em conexão móvel lenta ou intermitente. Interrupção não obriga
o cliente a recomeçar todos os documentos.

#### Scenario: Conexão cai durante o envio
- **WHEN** a conexão é interrompida no meio de um envio
- **THEN** os documentos já concluídos permanecem salvos
- **AND** o cliente pode retomar apenas o que faltou

### Requirement: Confirmação de recebimento

Ao concluir um envio, o cliente recebe confirmação inequívoca de que o documento
chegou.

#### Scenario: Envio concluído
- **WHEN** o documento termina de ser enviado
- **THEN** o item passa a exibir estado de recebido, de forma visível

### Requirement: Sem exposição de dados ao portador do link

O portador do link vê apenas a lista de itens pedidos e o estado dos envios
daquele processo. Não acessa conteúdo de documento já enviado, dados de outros
processos, nem informação sobre o escritório além do necessário para
identificação.

#### Scenario: Link compartilhado com terceiro
- **WHEN** o link chega a alguém não autorizado
- **THEN** essa pessoa não consegue ler nenhum documento já enviado
- **AND** não descobre outros processos ou clientes do advogado
