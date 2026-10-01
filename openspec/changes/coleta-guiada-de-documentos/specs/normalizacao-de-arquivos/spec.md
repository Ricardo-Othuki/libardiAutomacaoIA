# Spec Delta

## Purpose

Converter para PDF qualquer formato que o cliente envie e ajustar o arquivo aos
limites de tamanho dos tribunais, eliminando o uso de ferramentas externas de
conversão que hoje consomem tempo do advogado e expõem documento sigiloso a
serviço de terceiro.

## ADDED Requirements

### Requirement: Conversão para PDF dos formatos recebidos

Imagem, documento de texto e formatos de escritório recebidos do cliente são
convertidos para PDF. O original é preservado.

#### Scenario: Imagem enviada
- **WHEN** o cliente envia uma foto de documento
- **THEN** o sistema gera um PDF correspondente
- **AND** mantém o arquivo original recuperável

#### Scenario: Arquivo já em PDF
- **WHEN** o arquivo recebido já é PDF válido
- **THEN** nenhuma conversão é feita

#### Scenario: Formato não suportado
- **WHEN** o formato não pode ser convertido
- **THEN** o item é sinalizado ao advogado com o motivo
- **AND** o cliente é orientado em linguagem simples sobre como reenviar

### Requirement: Múltiplas páginas em documento único

Várias imagens que compõem um mesmo documento são reunidas em um único PDF, na
ordem indicada por quem enviou.

#### Scenario: Documento fotografado em várias páginas
- **WHEN** o cliente indica que três fotos pertencem ao mesmo documento
- **THEN** o PDF gerado contém as três páginas na ordem informada

### Requirement: Ajuste ao limite de tamanho do tribunal

O advogado define o limite de tamanho por arquivo conforme o tribunal. Arquivos
acima do limite são comprimidos; quando a compressão não basta, o sistema propõe
fragmentar o documento em partes.

#### Scenario: Compressão suficiente
- **WHEN** o PDF excede o limite e a compressão o traz para dentro dele
- **THEN** a versão comprimida é usada no dossiê

#### Scenario: Compressão insuficiente
- **WHEN** nem a compressão máxima aceitável traz o arquivo para o limite
- **THEN** o sistema propõe a fragmentação em partes numeradas
- **AND** a fragmentação só ocorre após confirmação do advogado

### Requirement: Legibilidade preservada

A compressão nunca degrada o documento a ponto de comprometer a leitura. Há um
piso de qualidade abaixo do qual o sistema prefere fragmentar a comprimir mais.

#### Scenario: Documento no limite da legibilidade
- **WHEN** comprimir mais tornaria o texto ilegível
- **THEN** o sistema interrompe a compressão e apresenta a alternativa ao advogado

### Requirement: Processamento sem bloquear o envio

A conversão ocorre depois do envio, sem obrigar o cliente a aguardar. O estado
do processamento é visível ao advogado.

#### Scenario: Cliente envia e encerra
- **WHEN** o cliente conclui o envio e fecha a página
- **THEN** a conversão prossegue e o resultado aparece para o advogado ao final

#### Scenario: Falha na conversão
- **WHEN** a conversão falha
- **THEN** o documento é marcado com a falha e o advogado é notificado
- **AND** o original permanece íntegro e acessível

### Requirement: Detecção de documento ilegível

O sistema sinaliza ao advogado documentos com indício de ilegibilidade, como
imagem muito escura, borrada ou cortada. A decisão de aceitar ou recusar é
sempre do advogado.

#### Scenario: Foto de baixa qualidade
- **WHEN** a imagem recebida apresenta indício de ilegibilidade
- **THEN** o documento é sinalizado para conferência
- **AND** nenhuma recusa automática acontece
