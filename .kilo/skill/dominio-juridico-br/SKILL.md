---
name: dominio-juridico-br
description: Vocabulario juridico brasileiro, regras de protocolo em PJe e eproc, tipos de documento por area do Direito e convencoes de numeracao de anexos. Use ao escrever specs, telas, textos de interface ou codigo deste projeto de automacao de documentos para advogado.
---

# Domínio jurídico brasileiro

Referência para quem desenvolve este projeto sem formação em Direito. Evita os
erros que um desenvolvedor comete por desconhecer a prática forense.

## Vocabulário mínimo

| Termo | O que é |
|---|---|
| Petição inicial | Peça que abre o processo. É o gargalo deste projeto |
| Contestação | Resposta do réu |
| Exordial | Sinônimo de petição inicial |
| Autos | O processo como conjunto de documentos |
| Juntada | Ato de anexar documento ao processo |
| Protocolo | Envio da peça ao tribunal |
| Procuração | Documento que autoriza o advogado a representar |
| Hipossuficiência | Declaração de falta de recursos, pede justiça gratuita |
| Provas | Documentos que sustentam cada argumento |
| Rol de documentos | Relação numerada dos anexos |
| DOC. N | Como a peça cita cada anexo no corpo do texto |

## A convenção DOC. N

No corpo da petição, cada documento é citado por número:

```
"...conforme contrato firmado entre as partes (DOC. 4)..."
"...os pagamentos foram realizados (DOCs. 5 e 6)..."
```

Formas encontradas em peças reais: `(DOC. 4)`, `(DOCs. 5 e 6)`,
`(DOCs. 7, 11, 12 e 13)`, e sem parênteses no meio da frase.

**Por que isso é o centro do produto:** o número amarra narrativa e dossiê. Mexeu
na ordem dos anexos, todas as citações do texto precisam ser revisadas.

Em petições reais deste advogado:

| Documentos | Numeração |
|---|---|
| 13 | correta |
| 15 | fora de ordem |
| 31 | fora de ordem, com anexo órfão e número duplicado |

A pasta real de um caso protocolado mostrou os três defeitos da numeração
manual:

```
  DOC. 7 - Curriculo.pdf     |
  DOC. 7 - curriculos.pdf    |  numero duplicado: tres arquivos,
  DOC. 7.pdf                 |  e a peca cita (DOC. 7) uma vez so

  DOC. 14 - Declaracao Ana.pdf  -> anexo orfao: existe na pasta,
                                   a peticao nunca o cita
```

Por que cada um importa juridicamente:

- **Duplicado:** o juiz não sabe qual arquivo a citação invoca.
- **Órfão:** prova juntada e não referenciada pode não ser apreciada.
- **Fora de ordem:** dificulta a leitura e enfraquece a narrativa.

O erro escala com o volume — e o objetivo do produto é justamente aumentar o
volume. Daí a regra de arquitetura: **número é atribuído só na exportação, nunca
persistido no documento.** Duplicidade e desordem tornam-se impossíveis por
construção; órfão e citação sem documento exigem conferir o rol contra o texto
da peça.

## Padrão de nome de arquivo

O advogado já usa, e reconhece ao anexar no tribunal:

```
DOC. 1 - Procuracao.pdf
DOC. 3 - Certidao de Obito.pdf
DOC. 9 - Relatorio Viver Eloa.pdf
```

Gerado pelo sistema, nunca digitado. Sem caractere que os sistemas dos tribunais
recusem.

## Ordem convencional dos anexos

```
1. Procuracao e documentos de identidade
2. Comprovantes de hipossuficiencia (se pede justica gratuita)
3. Provas, agrupadas por bloco de argumentacao
```

Dentro do bloco de provas, a ordem acompanha a cronologia dos fatos ou a
sequência dos argumentos — decisão do advogado, não do sistema.

## Sistemas dos tribunais

PJe (principal), eproc e Projudi. Cada tribunal usa o seu.

Duas regras que afetam o desenho:

- **Cada prova é um PDF separado.** Nunca um PDF único com tudo. Entregar um
  arquivo consolidado não resolve o problema do advogado.
- **Há limite de tamanho por arquivo**, variável por tribunal. PDF pesado
  precisa ser comprimido ou fragmentado em partes.

## Documentos por área

Listas abreviadas. As completas são do advogado e ficam no catálogo do sistema.

**Comum a quase todo caso:** RG ou CNH, CPF, comprovante de residência, certidão
de nascimento ou casamento, procuração assinada.

**Justiça gratuita:** declaração de hipossuficiência, extrato bancário dos
últimos 3 meses, imposto de renda dos últimos 2 anos, CTPS com anotações,
holerites, provas de dívida.

**Trabalhista:** CTPS, contrato de trabalho, holerites, rescisão, comprovantes
de jornada.

**Imobiliário e usucapião:** contrato de compra e venda, escritura ainda que não
registrada, recibos, IPTU, contas de consumo antigas, declarações de vizinhos.

**Família e sucessões:** certidão de casamento, pacto antenupcial, certidões dos
filhos, comprovantes de despesa com escola e saúde, documentos dos bens.

**Sucessões e inventário:** certidão de óbito, documentos dos herdeiros,
documentos dos bens, certidões negativas.

## Erros que um desenvolvedor comete aqui

**Consolidar tudo em um PDF.** Parece organização; quebra o protocolo.

**Persistir o número do documento.** Reproduz em software o defeito manual.

**Classificar automaticamente e aceitar sem confirmação.** A responsabilidade
profissional é do advogado. O sistema propõe, ele confirma.

**Comprimir até caber.** Documento ilegível protocolado tem consequência
processual. Há piso de qualidade; abaixo dele, fragmenta-se.

**Expor jargão ao cliente.** O cliente é leigo. "Declaração de hipossuficiência"
não significa nada para ele; "documento que comprova que você não tem condições
de pagar as custas" significa.

**Tratar documento como arquivo comum.** É sigilo profissional e dado sensível
sob LGPD. Nunca em URL pública, nunca em serviço externo sem contrato, sempre
com registro de acesso.

## Sobre prazos

Prazo processual conta em dias úteis, exclui o dia de início e inclui o de
vencimento, e suspende em feriado. Perder prazo é falta grave.

Este projeto não calcula prazo processual — mas o prazo é o motivo de a coleta
ser urgente. O advogado depende do cliente e o relógio corre contra ele.

## Contexto do usuário

Advogado autônomo, áreas de maior fluxo: trabalhista, imobiliário, família e
sucessões, cível e indenizatórias. Pega 2 a 3 casos por mês e precisa de 4 a 6
para sustentabilidade financeira.

O que limita não é a velocidade de digitar: é o tempo morto esperando documento
do cliente e o custo mental de acompanhar vários casos em aberto ao mesmo tempo.
