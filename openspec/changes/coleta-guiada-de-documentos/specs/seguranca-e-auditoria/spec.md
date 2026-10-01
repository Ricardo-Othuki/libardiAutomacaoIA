# Spec Delta

## Purpose

Garantir que documento sob sigilo profissional e dado pessoal sensível só sejam
acessados por quem tem direito, pelo tempo necessário, com registro de todo
acesso. Esta capacidade é transversal: as demais dependem dela e nenhuma pode
contorná-la.

## ADDED Requirements

### Requirement: Isolamento de dados entre advogados

Todo dado pertence a um advogado. Nenhum advogado acessa processo, documento ou
cliente de outro, em nenhuma circunstância. O isolamento é aplicado na camada de
dados, não na camada de aplicação, de forma que uma falha de código na aplicação
não seja suficiente para expor dados.

#### Scenario: Tentativa de acesso a processo de outro advogado
- **WHEN** um advogado autenticado requisita um processo que pertence a outro advogado
- **THEN** o sistema responde como se o processo não existisse, sem revelar sua existência
- **AND** registra a tentativa na trilha de auditoria

#### Scenario: Consulta sem filtro explícito
- **WHEN** uma consulta ao banco é feita sem filtro de proprietário
- **THEN** a camada de dados retorna apenas os registros do advogado autenticado

### Requirement: Link de envio com escopo mínimo

O link entregue ao cliente concede a menor permissão que torna o envio possível:
escrever documentos em um único processo. Não concede leitura dos documentos já
enviados, não revela outros processos e não permite alterar ou excluir nada.

#### Scenario: Cliente tenta ler documento já enviado
- **WHEN** o portador do link requisita o conteúdo de um documento já enviado
- **THEN** o sistema nega o acesso
- **AND** o cliente vê apenas o nome do arquivo que ele mesmo enviou e seu estado

#### Scenario: Link usado para acessar outro processo
- **WHEN** o portador altera o identificador do processo na requisição
- **THEN** o sistema nega o acesso e registra a tentativa

### Requirement: Token de envio imprevisível, temporário e revogável

O token do link é gerado por fonte criptograficamente segura, com entropia
suficiente para inviabilizar adivinhação ou varredura. Possui prazo de validade
definido pelo advogado e pode ser revogado a qualquer momento.

#### Scenario: Token expirado
- **WHEN** o portador acessa o link após o prazo de validade
- **THEN** o sistema recusa o acesso e informa que o link expirou
- **AND** oferece instrução para solicitar novo link ao advogado

#### Scenario: Token revogado pelo advogado
- **WHEN** o advogado revoga o link e o portador tenta usá-lo
- **THEN** o acesso é recusado imediatamente

#### Scenario: Varredura de tokens
- **WHEN** há tentativas repetidas de acesso com tokens inválidos a partir da mesma origem
- **THEN** o sistema aplica limitação de taxa
- **AND** registra o padrão para inspeção

### Requirement: Documento nunca exposto por URL permanente

Arquivo armazenado nunca é acessível por URL pública e estável. Todo acesso de
leitura ocorre por URL assinada de curta duração, emitida somente após
verificação de permissão.

#### Scenario: URL assinada após expirar
- **WHEN** alguém usa uma URL assinada depois do prazo
- **THEN** o armazenamento recusa a entrega do arquivo

#### Scenario: Tentativa de acesso direto ao armazenamento
- **WHEN** alguém requisita o caminho do arquivo diretamente, sem assinatura
- **THEN** o armazenamento recusa o acesso

### Requirement: Arquivo recebido tratado como conteúdo não confiável

Todo arquivo enviado é tratado como potencialmente hostil. O sistema valida o
tipo real pelo conteúdo e não pela extensão, impõe limite de tamanho, recusa
formatos fora da lista permitida e nunca executa nem interpreta o arquivo em
contexto privilegiado.

#### Scenario: Extensão mascarando conteúdo diferente
- **WHEN** o cliente envia um arquivo com extensão permitida mas conteúdo de outro tipo
- **THEN** o sistema recusa o arquivo e explica o motivo em linguagem simples

#### Scenario: Arquivo acima do limite
- **WHEN** o arquivo excede o tamanho máximo aceito
- **THEN** o sistema recusa antes de transferir o conteúdo completo

#### Scenario: PDF com conteúdo ativo
- **WHEN** um PDF contendo script ou ação embutida é processado
- **THEN** o conteúdo ativo é removido ou neutralizado antes de qualquer exibição

### Requirement: Trilha de auditoria de acesso a documento

Toda leitura, envio, alteração de estado e exportação de documento é registrada
com autor, ação, data e hora, e origem da requisição. O registro é somente
acréscimo: não pode ser editado nem apagado pela aplicação.

#### Scenario: Advogado exporta dossiê
- **WHEN** o dossiê é exportado
- **THEN** fica registrado quem exportou, quando, e quais documentos foram incluídos

#### Scenario: Consulta à trilha
- **WHEN** o advogado consulta o histórico de um documento
- **THEN** vê a sequência completa de eventos daquele documento

### Requirement: Segredo fora do repositório e do navegador

Chave de acesso, credencial de serviço e segredo de integração nunca são
gravados no repositório nem entregues ao navegador. Operação que exige
credencial privilegiada ocorre apenas no servidor.

#### Scenario: Código enviado ao navegador
- **WHEN** o pacote entregue ao navegador é inspecionado
- **THEN** não contém credencial de serviço nem chave com permissão ampla

### Requirement: Exclusão definitiva a pedido do titular

O titular dos dados pode ter seus documentos removidos em definitivo. A remoção
alcança o arquivo armazenado e seus derivados, e é registrada na trilha sem
preservar o conteúdo excluído.

#### Scenario: Exclusão solicitada
- **WHEN** o advogado executa a exclusão definitiva dos documentos de um processo
- **THEN** arquivos originais e derivados tornam-se irrecuperáveis pelo sistema
- **AND** a trilha registra a exclusão sem reter o conteúdo
