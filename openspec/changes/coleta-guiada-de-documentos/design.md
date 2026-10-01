# Design — coleta guiada de documentos

## Contexto

Duas restrições moldam tudo o que vem abaixo.

**A primeira é de segurança.** Os dados são documentos sob sigilo profissional e
dados pessoais sensíveis sob a LGPD. O portal do cliente é superfície pública
sem autenticação — é o ponto mais exposto do sistema e recebe o desenho mais
restritivo.

**A segunda é de plataforma.** Funções serverless da Vercel limitam o corpo da
requisição a poucos megabytes. Um processo com dezenas de documentos escaneados
ultrapassa isso com folga. Essa restrição decide o caminho do arquivo.

## Decisão 1 — O arquivo nunca passa pela aplicação

```
   navegador                                    Supabase Storage
       |                                              ^
       | 1. pede permissao                            |
       v                                              | 3. envia direto
   Vercel (funcao)                                    |
       |                                              |
       | 2. valida e devolve URL assinada ------------+
       |    de escrita, curta duracao
       |
       | 4. navegador confirma conclusao
       v
   Vercel -> registra documento no banco
```

A aplicação autoriza e registra, mas nunca transporta o conteúdo.

**Por quê:** contorna o limite da Vercel; reduz a superfície de código que toca
conteúdo sigiloso; e evita custo de banda em trânsito dobrado.

**O que isso exige:** a confirmação do passo 4 pode não chegar — o cliente fecha
o navegador, a conexão cai. Arquivo no Storage sem registro no banco é um órfão.
Por isso o registro é criado **antes** do envio, em estado `aguardando`, e a
confirmação apenas o promove. Uma rotina periódica reconcilia registros que
ficaram em `aguardando` além do prazo, verificando se o arquivo existe.

**Alternativa descartada:** upload via função da aplicação. Mais simples de
escrever, mas quebra em qualquer processo volumoso — exatamente o caso que mais
importa.

## Decisão 2 — Isolamento no banco, não na aplicação

Row Level Security no Postgres, com política em toda tabela que contenha dado de
cliente. A aplicação nunca usa credencial que ignore RLS para servir requisição
de usuário.

**Por quê:** um `where` esquecido numa consulta é o vazamento mais banal que
existe. Com RLS, esse erro devolve conjunto vazio em vez de dados de outro
advogado. A proteção passa a não depender da disciplina de quem escreve a
consulta.

**Consequência aceita:** políticas RLS são chatas de escrever e testar, e exigem
atenção em toda migração. É o preço, e vale.

**Credencial de serviço** existe, mas fica restrita a tarefas do n8n que operam
fora de sessão de usuário — nunca em caminho de requisição do navegador.

## Decisão 3 — Token do portal como segredo, não identificador

```
  link = /enviar/<token>

  token   -> aleatorio, alta entropia, gerado por fonte criptografica
  banco   -> guarda apenas o hash do token, nunca ele proprio
  escopo  -> um processo, permissao de escrita, sem leitura de conteudo
  prazo   -> validade definida pelo advogado
  revoga  -> a qualquer momento, efeito imediato
```

Guardar apenas o hash significa que vazamento do banco não entrega os links
ativos. É o mesmo tratamento dado a senha, porque a função é a mesma.

**Limitação de taxa por origem** contra varredura. **Sem enumeração:** token
inválido, expirado e revogado produzem a mesma resposta genérica.

**O que o portador do link não consegue fazer:** ler documento já enviado,
descobrir outro processo, alterar ou excluir qualquer coisa. Se o link vazar em
grupo de WhatsApp, o dano possível é alguém enviar arquivo indevido — visível na
triagem e reversível.

## Decisão 4 — Arquivo recebido é conteúdo hostil

Validação em camadas, na ordem que falha mais barato primeiro:

| Camada | Verifica | Momento |
|---|---|---|
| Navegador | extensão e tamanho | antes de enviar, só conveniência |
| Autorização | tipo declarado e tamanho | antes de emitir a URL |
| Pós-envio | tipo real pelos bytes iniciais | antes de aceitar |
| Conversão | sanitização, remove conteúdo ativo | ao gerar o PDF |

A validação do navegador **não conta como controle** — é dica para o usuário.
Quem decide é o servidor.

PDF aceita JavaScript embutido, ação de abertura e anexo interno. O PDF
derivado, usado no dossiê, é regenerado sem esses elementos. O original fica
preservado, mas nunca é renderizado em contexto privilegiado.

**Exibição em sandbox:** visualização de documento ocorre isolada do contexto da
aplicação, para que conteúdo malicioso não alcance sessão nem dados.

## Decisão 5 — Identidade estável e numeração derivada

Este é o coração do produto.

```
  DURANTE a coleta          NA exportacao
  ------------------        --------------
  id estavel (uuid)   -->   DOC. 1
  + posicao na ordem  -->   DOC. 2
  + nome do item      -->   DOC. 3
```

O número não é atributo do documento. É **função da ordem no instante da
exportação**. Em nenhum lugar do banco existe coluna `numero_doc` persistida.

**Evidência que sustenta a decisão.** A pasta real de um caso protocolado
mostrou três defeitos simultâneos que a numeração manual produz:

```
  DOC. 7 - Curriculo.pdf     |
  DOC. 7 - curriculos.pdf    |  tres arquivos, um numero
  DOC. 7.pdf                 |  a peca cita (DOC. 7) uma vez so

  DOC. 14 - Declaracao Ana.pdf  -> existe na pasta,
                                   nunca citado na peticao
```

Os três defeitos têm tratamento diferente neste desenho:

| Defeito | Tratamento |
|---|---|
| Fora de ordem | impossível: número deriva da ordem vigente |
| Número duplicado | impossível: duas posições não coincidem |
| Documento sem citação | detectável: exige conferir rol contra o texto |
| Citação sem documento | detectável: mesma conferência |

Os dois primeiros somem por construção. Os dois últimos não — o sistema não
escreve a petição, então não controla o que ela cita. Por isso existe a
conferência do rol contra o texto da peça, que é verificação informativa e não
bloqueio: quem decide se a prova fica ou sai é o advogado.

**Por quê:** nas petições reais analisadas, a de 13 documentos saiu com
numeração correta; as de 15 e 31 saíram fora de ordem, uma delas citando um
número inexistente no texto. Numeração manual erra quando o volume cresce — e o
objetivo do produto é justamente aumentar o volume. Persistir número seria
reproduzir o defeito em software.

**Consequência:** reordenar é operação barata e sem risco. Inserir documento no
meio não exige renumerar nada.

## Decisão 6 — n8n fora do caminho crítico

```
  SINCRONO (usuario espera)        ASSINCRONO (n8n)
  -------------------------        ----------------
  autorizar upload                 converter para PDF
  registrar documento              comprimir
  marcar estado                    enviar lembrete
  montar tela                      reconciliar orfaos
  exportar dossie                  notificar falha
```

**Por quê:** n8n é excelente para orquestrar trabalho que pode demorar e ser
repetido. É má escolha para o que o usuário aguarda na tela — acrescenta salto
de rede, ponto de falha e latência imprevisível.

**Regra de integração:** a aplicação publica evento; o n8n consome. O n8n não
escreve direto nas tabelas de domínio — ele chama endpoints da aplicação com
credencial própria e escopo restrito. Assim a regra de negócio permanece num
lugar só.

**Idempotência obrigatória:** todo fluxo do n8n pode executar mais de uma vez
para o mesmo evento. Converter duas vezes é desperdício; cobrar o cliente duas
vezes é constrangimento profissional. Chave de idempotência por evento.

## Decisão 7 — Conversão no servidor, não em serviço externo

Hoje o advogado usa iLovePDF: documento sigiloso de cliente subindo para serviço
de terceiro, sem contrato de tratamento de dados. Substituir isso é ganho de
conformidade além de conveniência.

Conversão e compressão rodam em infraestrutura controlada, acionadas pelo n8n.

**Ponto em aberto para a implementação:** ferramentas de conversão processam
arquivo não confiável e historicamente acumulam vulnerabilidades. Rodar em
ambiente isolado, sem acesso à rede e com limite de recursos.

## Modelo de dados

```
  advogado
     |
     +--< modelo_checklist ---< item_modelo
     |
     +--< cliente
     |
     +--< processo
            |
            +--< item_checklist  (copia do modelo, editavel)
            |       |
            |       +--< documento
            |              |
            |              +--< arquivo_derivado (pdf, comprimido)
            |
            +--< link_envio (hash do token, validade, revogacao)
            |
            +--< evento  (historico + auditoria, somente acrescimo)
            |
            +--< exportacao ---< item_exportado (numero atribuido aqui)
```

**Por que a checklist do processo é cópia, não referência:** editar um modelo não
pode alterar processo em andamento. Um caso protocolado precisa ser auditável
como estava no momento do protocolo.

**Por que `item_exportado` guarda o número:** o número é calculado na exportação,
mas o resultado precisa ser reproduzível para conferência contra a peça
protocolada. Registrar o resultado não contradiz a numeração tardia — o cálculo
continua derivado da ordem, apenas seu resultado fica registrado.

## Estados do documento

```
  aguardando --> recebido --> convertendo --> pronto --> aceito
                    |             |                        |
                    |             +--> falha_conversao      |
                    |                                       |
                    +--> ilegivel (sinalizado)              |
                                                            v
                                            recusado --> (volta a pendente)
```

Nenhuma transição para `aceito` acontece sem ação do advogado. O sistema propõe;
ele confirma. Isso não é preferência de interface — é onde está a
responsabilidade profissional.

## Riscos

**O cliente não usa o link.** Risco de produto, não técnico, e o mais sério.
Toda a economia do desenho — classificação sem IA — depende do cliente escolher
o item ao enviar. Mitigação: a triagem manual cobre o caso, e o portal precisa
ser simples ao ponto de não haver instrução a dar.

**Órfão no Storage.** Arquivo enviado sem confirmação registrada. Mitigado pelo
registro prévio e pela reconciliação periódica.

**Compressão ilegível.** Documento ilegível protocolado é dano profissional.
Mitigado pelo piso de qualidade e pela preferência por fragmentar.

**Custo de armazenamento.** Documentos digitalizados acumulam rápido, e o
original é preservado além do derivado. Precisa de política de retenção — fora
do escopo desta mudança, mas não esquecido.

## Fora de escopo

OCR, classificação automática por conteúdo, gravação e ata de reunião, redação
de peça, integração com JusBrasil, protocolo automático, assinatura digital e
aplicativo móvel nativo.
