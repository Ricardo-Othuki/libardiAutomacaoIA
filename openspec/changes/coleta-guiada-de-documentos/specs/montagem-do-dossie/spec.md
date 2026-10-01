# Spec Delta

## Purpose

Produzir o conjunto final de anexos pronto para protocolo: um PDF por prova, na
ordem forense, com a numeração DOC. N atribuída apenas neste momento. A
numeração tardia elimina uma classe de defeito observada em petições reais do
advogado, em que a renumeração manual de anexos deixou citações fora de ordem e
um número citado em nenhum ponto do texto.

## ADDED Requirements

### Requirement: Numeração atribuída apenas na exportação

Enquanto o processo está em andamento, cada documento é identificado por sua
posição na checklist e por seu nome, nunca por número. O número DOC. N é
calculado no momento da exportação, a partir da ordem vigente.

#### Scenario: Documento inserido no meio da coleta
- **WHEN** um novo documento é acrescentado depois de outros já recebidos
- **THEN** nenhum documento existente tem sua identidade alterada
- **AND** a numeração final reflete a ordem correta na exportação seguinte

#### Scenario: Reordenação antes de exportar
- **WHEN** o advogado reordena os documentos
- **THEN** a numeração é recalculada integralmente na exportação

### Requirement: Ordem forense como padrão

A ordem padrão de exportação segue a convenção do advogado: procuração e
documentos de identidade, depois comprovantes de hipossuficiência, depois as
provas agrupadas por bloco de argumentação. O advogado pode alterar a ordem.

#### Scenario: Exportação sem intervenção
- **WHEN** o advogado exporta sem reordenar
- **THEN** o dossiê sai na ordem forense padrão definida no modelo

#### Scenario: Ordem específica do caso
- **WHEN** o advogado reordena documentos para acompanhar a narrativa da peça
- **THEN** a ordem escolhida é preservada e usada na numeração

### Requirement: Um arquivo por prova

A exportação produz um PDF separado por prova, nunca um único PDF com tudo. Cada
arquivo tem nome que identifica seu número e seu conteúdo.

#### Scenario: Exportação concluída
- **WHEN** o advogado exporta um processo com doze provas
- **THEN** recebe doze arquivos PDF separados, nomeados e numerados

### Requirement: Nome de arquivo no padrão já usado pelo advogado

O nome segue o padrão `DOC. N - descrição.pdf`, que é o que o advogado já usa e
o que ele reconhece ao anexar no sistema do tribunal. O nome é gerado pelo
sistema, sem digitação manual, e não contém caractere recusado pelos sistemas
dos tribunais.

#### Scenario: Geração do nome
- **WHEN** um documento é exportado na terceira posição com descrição "certidão de óbito"
- **THEN** o arquivo entregue chama-se "DOC. 3 - Certidao de obito.pdf"

#### Scenario: Descrição com caractere problemático
- **WHEN** a descrição do item contém acento, barra ou caractere especial
- **THEN** o nome gerado é ajustado para formato seguro, preservando a leitura

#### Scenario: Dois documentos com descrição igual
- **WHEN** dois documentos do mesmo item têm a mesma descrição
- **THEN** os nomes gerados permanecem distintos por seus números
- **AND** nenhum arquivo sobrescreve outro na entrega

### Requirement: Rol de documentos gerado

Junto aos anexos, o sistema gera a relação dos documentos com número, nome e
descrição, pronta para ser conferida contra as citações da peça.

#### Scenario: Conferência contra a peça
- **WHEN** o advogado recebe o rol
- **THEN** pode verificar item a item se cada DOC. N citado existe no dossiê

### Requirement: Conferência do dossiê contra as citações da peça

O advogado pode submeter o texto da petição e o sistema compara as citações
DOC. N presentes no texto com os documentos do dossiê, apontando três defeitos:
número citado na peça sem documento correspondente, documento no dossiê que a
peça nunca cita, e citação a número fora do intervalo existente. A conferência é
informativa: o advogado decide o que fazer com cada apontamento.

#### Scenario: Documento juntado sem citação na peça
- **WHEN** o dossiê contém um documento que o texto da petição não menciona
- **THEN** o sistema aponta o documento como não citado
- **AND** explica que prova não referenciada pode não ser apreciada

#### Scenario: Citação sem documento correspondente
- **WHEN** a peça cita um número que não existe no dossiê
- **THEN** o sistema aponta a citação como sem correspondência

#### Scenario: Citação em bloco
- **WHEN** a peça cita vários documentos de uma vez, na forma "DOCs. 5, 6 e 7"
- **THEN** cada número do bloco é considerado individualmente na conferência

#### Scenario: Dossiê coerente com a peça
- **WHEN** toda citação tem documento e todo documento é citado
- **THEN** o sistema confirma a coerência sem apontamentos

### Requirement: Impossibilidade de número duplicado

Dois documentos nunca ocupam o mesmo número. Como o número deriva da posição na
ordem de exportação, a duplicidade é impossível por construção, e o sistema não
oferece forma de atribuir número manualmente.

#### Scenario: Vários arquivos no mesmo item da checklist
- **WHEN** um item admite múltiplos arquivos e recebe três documentos
- **THEN** cada documento recebe seu próprio número na exportação
- **AND** nenhum número é repetido no dossiê

### Requirement: Verificação de completude antes de exportar

Antes de exportar, o sistema verifica pendências que comprometeriam o dossiê:
item obrigatório faltando, documento recusado sem substituição, conversão
pendente ou falha, arquivo acima do limite do tribunal.

#### Scenario: Pendência bloqueante
- **WHEN** há item obrigatório sem documento aceito
- **THEN** o sistema alerta antes de exportar
- **AND** o advogado pode exportar mesmo assim, com ciência registrada

#### Scenario: Dossiê íntegro
- **WHEN** nenhuma pendência é encontrada
- **THEN** a exportação prossegue sem alerta

### Requirement: Exportação reproduzível e registrada

Cada exportação é registrada com data, hora, autor e a lista numerada gerada. O
advogado consegue saber qual versão foi protocolada.

#### Scenario: Reexportação após ajuste
- **WHEN** o advogado exporta novamente depois de alterar documentos
- **THEN** a nova exportação é registrada como versão distinta
- **AND** o registro anterior permanece consultável

### Requirement: Entrega adequada ao volume

O dossiê é entregue de forma que o advogado consiga levá-lo ao sistema do
tribunal sem manipulação adicional, respeitando o limite por arquivo.

#### Scenario: Processo volumoso
- **WHEN** o dossiê contém dezenas de documentos
- **THEN** a entrega preserva a separação por prova e a numeração
- **AND** nenhum arquivo individual excede o limite configurado
