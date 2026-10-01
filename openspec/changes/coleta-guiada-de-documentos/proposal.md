# Coleta guiada de documentos

## Por quê

O advogado pega 2 a 3 casos por mês e precisaria pegar 4 a 6 para ter saúde
financeira. O que o impede não é a redação da peça — ele já usa IA externa para
isso — mas o intervalo entre contratar o cliente e ter os documentos em mãos.
Nas palavras dele: trava "porque o cliente não encaminhou todos os documentos e
fica me devendo mais provas" e por "excesso de trabalho e desorganização
pessoal".

Hoje esse controle é mental e manual: ele envia uma lista por WhatsApp ou
e-mail, recebe arquivos soltos em formatos mistos, confere de memória o que
falta, cobra na mão e, uma semana depois, refaz a conferência. Cada caso em
aberto ocupa espaço na cabeça dele, e é esse custo — não o de digitar — que
limita quantos casos ele aceita simultaneamente.

A oportunidade está num ativo que ele já produziu sem perceber o valor: as
listas de documentos por tipo de causa, que ele escreveu e trata como
secundárias. Transformadas em checklist ativa, resolvem três problemas de uma
vez — dizem o que pedir, rastreiam o que falta e rotulam o que chegou.

## O que muda

- **Catálogo de tipos de causa**: as listas do advogado viram dados
  estruturados, editáveis, reutilizáveis a cada novo caso.
- **Checklist por processo**: ao abrir um caso, o advogado escolhe o tipo de
  causa e recebe a lista de documentos já montada, ajustável para o caso.
- **Portal do cliente sem cadastro**: link com token; o cliente vê a lista em
  linguagem simples e envia cada documento no item correspondente.
- **Classificação sem IA no caminho principal**: o documento chega já
  identificado, porque o cliente escolheu o item ao enviar. Arquivo enviado
  fora de item vira pendência de triagem para o advogado resolver.
- **Painel de pendências**: uma tela com todos os casos e o que falta em cada
  um, substituindo o controle mental.
- **Cobrança automática**: lembretes ao cliente no prazo definido pelo
  advogado, sempre com o que ainda falta.
- **Conversão para PDF**: jpg, rtf, doc e imagem viram PDF automaticamente,
  eliminando o uso do iLovePDF.
- **Exportação do dossiê**: um PDF por prova, na ordem forense, com numeração
  DOC. N atribuída só neste momento, comprimido ao limite do tribunal.
- **Trilha de auditoria**: todo acesso a documento fica registrado.

Fora de escopo nesta mudança, deliberadamente: OCR, classificação automática
por conteúdo, gravação e ata de reunião, redação de peça, integração com
JusBrasil e protocolo automático no tribunal.

## Capacidades

**Novas:**

| Capacidade | Responsabilidade |
|---|---|
| `catalogo-tipos-de-causa` | Modelos de lista de documentos por tipo de causa |
| `processos` | Ciclo de vida do caso e sua checklist |
| `portal-do-cliente` | Envio por link com token, sem cadastro |
| `cobranca-de-pendencias` | Lembretes automáticos do que falta |
| `normalizacao-de-arquivos` | Conversão para PDF e compressão |
| `montagem-do-dossie` | Ordenação, numeração tardia e exportação |
| `seguranca-e-auditoria` | Controle de acesso, tokens e trilha |

**Modificadas:** nenhuma. Projeto novo.

## Impacto

**Stack:** Next.js na Vercel, Supabase (Postgres, Auth, Storage, RLS), n8n para
trabalho assíncrono, GitHub para versionamento.

**Restrição que molda o desenho:** funções serverless da Vercel limitam o corpo
da requisição a poucos MB, e processos com dezenas de documentos escaneados
passam disso. O upload vai do navegador direto ao Supabase Storage por URL
assinada, sem transitar pela aplicação. Isso também reduz a superfície de
código que toca o arquivo.

**Segurança como requisito de primeira ordem:** os dados são documentos sob
sigilo profissional e dados pessoais sensíveis sob a LGPD. O portal do cliente
é superfície pública, sem autenticação — é o ponto mais exposto do sistema e
recebe o desenho mais restritivo: token de alta entropia com validade e
revogação, escopo de um único processo, permissão de escrita sem leitura do que
já foi enviado.

**Riscos assumidos:**

1. O cliente pode resistir ao link e insistir em mandar tudo por WhatsApp. Se
   isso for a regra e não a exceção, a premissa de classificação sem IA cai. A
   triagem manual cobre o caso, mas a economia do desenho diminui.
2. A validade jurídica do dossiê depende da ordem correta dos anexos; erro aqui
   tem consequência profissional real, não apenas incômodo.
3. Vazamento de documento sigiloso é dano irreversível de reputação e
   responsabilidade — para o advogado e para o produto.
