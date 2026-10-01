# Tasks

> **Trava de aprovação.** O grupo 1 entrega as telas navegáveis para análise e
> aprovação. Nenhuma tarefa do grupo 2 em diante começa antes da aprovação
> explícita das telas. Telas são protótipo visual: sem banco, sem autenticação
> real, sem envio de arquivo de verdade.

## 1. Telas para aprovação (antes de qualquer código de produção)

- [x] 1.1 Definir o repositório e subir o esqueleto do projeto web com uma página em branco publicada, verificando que a URL de prévia abre — feito em versão local (Next.js em `web/`); publicação no GitHub/Vercel fica para depois da aprovação do protótipo (1.16), por pedido do usuário
- [x] 1.2 Montar a base visual (tipografia, cores, espaçamento, componentes de formulário, botão, tabela e aviso) e verificar que uma página de amostra exibe todos os elementos — `/design`
- [x] 1.3 Tela do painel de pendências: lista de processos com itens faltando, tempo parado e destaque para processos travados, verificando com dados fictícios de pelo menos oito processos em estados diferentes — `/advogado/pendencias`, 10 processos fictícios
- [x] 1.4 Tela de abertura de processo: escolha do cliente, escolha do tipo de causa e pré-visualização da checklist gerada, verificando que trocar o tipo de causa troca a lista exibida — `/advogado/processos/novo`
- [x] 1.5 Tela do processo: checklist com os cinco estados possíveis por item, ações de aceitar e recusar, e área de triagem de documentos enviados fora da lista, verificando que cada estado tem representação visual distinta — `/advogado/processos/[id]`
- [x] 1.6 Tela de conferência de documento: visualização do arquivo, motivo de recusa e confirmação, verificando o caminho completo de aceitar e o de recusar — `/advogado/processos/[id]/documentos/[docId]`
- [x] 1.7 Tela de geração e gestão do link de envio: prazo de validade, revogação e cópia do link, verificando que a revogação é apresentada como ação destrutiva com confirmação — `/advogado/processos/[id]/link`
- [x] 1.8 Tela do catálogo de modelos: lista de tipos de causa, edição de itens, blocos de argumentação e reordenação, verificando o fluxo de reordenar um bloco inteiro — `/advogado/catalogo`
- [x] 1.9 Tela de importação de lista em texto: colagem, itens propostos e revisão antes de salvar, verificando com uma das listas reais do advogado — `/advogado/catalogo/importar`, pré-carregada com a lista real de usucapião
- [x] 1.10 Tela de montagem do dossiê: ordem dos documentos, numeração DOC. N calculada na hora, alertas de pendência e ação de exportar, verificando que reordenar renumera imediatamente na tela — `/advogado/processos/[id]/dossie`
- [x] 1.10a Tela de conferência do dossiê contra a peça: área para colar o texto da petição, apontamentos de documento não citado e de citação sem documento — `/advogado/processos/[id]/dossie/conferencia`. **Desvio deliberado:** em vez da contestação real da Adriana Ue (que contém nome, CPF, RG e dados de guarda de menor sob sigilo), foi usada uma peça fictícia equivalente (mesma estrutura de citação "DOC. N" e o mesmo defeito de anexo órfão), para não expor dado real sob LGPD em um protótipo que pode ir ao ar
- [x] 1.11 Tela de configuração de cobrança: cadência, limite de lembretes, suspensão e disparo manual, verificando os dois estados de cobrança ativa e suspensa — `/advogado/processos/[id]/cobranca`
- [x] 1.12 Portal do cliente, versão celular: lista de itens em linguagem simples, envio por item, envio de documento adicional, progresso e confirmação de recebimento, verificando em largura de tela de celular — `/portal/[token]`
- [x] 1.13 Portal do cliente, estados de exceção: link expirado, link revogado, formato recusado, conexão interrompida e envio retomado, verificando que nenhuma mensagem exibe termo técnico — `/portal/[token]?estado=...`
- [x] 1.14 Tela de histórico e auditoria do processo, verificando que exibe autor, ação e data e hora de cada evento — `/advogado/processos/[id]/historico`
- [x] 1.15 Ligar as telas em um protótipo navegável com dados fictícios e publicar a prévia, verificando que os dois percursos completos são percorríveis: advogado abre processo até exportar, e cliente recebe link até concluir envio — navegação ligada e prévia publicada em https://web-eight-taupe-96.vercel.app
- [ ] 1.16 Apresentar o protótipo para análise e obter aprovação explícita antes de prosseguir
- [x] 1.17 Refinar o aproveitamento de espaço e a hierarquia visual das telas de processo e do catálogo de modelos, com as abas do fluxo do processo (Checklist / Link / Dossiê / Cobrança / Histórico) como cards grandes em vez de abas de texto, verificando em largura de desktop que nenhuma tela fica com área ociosa desproporcional ao conteúdo — abas do processo, itens do catálogo/checklist e a tela de abrir processo agora em grade, sem largura desperdiçada

## 2. Fundação e segurança

- [ ] 2.1 Criar o projeto no Supabase e configurar ambientes separados de desenvolvimento e produção, verificando que as credenciais não estão no repositório
- [ ] 2.2 Modelar as tabelas de advogado, cliente, modelo de checklist e item de modelo, verificando com migração aplicada e revertida sem erro
- [ ] 2.3 Modelar processo, item de checklist, documento, arquivo derivado, link de envio, evento e exportação, verificando a integridade referencial com dados de teste
- [ ] 2.4 Habilitar Row Level Security em todas as tabelas com dado de cliente e escrever as políticas de isolamento por advogado, verificando que nenhuma tabela ficou sem política
- [ ] 2.5 Escrever testes de isolamento que tentam ler dados de outro advogado por consulta direta, verificando que todos retornam conjunto vazio
- [ ] 2.6 Configurar o armazenamento com acesso negado por padrão e sem URL pública, verificando que uma requisição direta ao caminho do arquivo é recusada
- [ ] 2.7 Implementar autenticação do advogado, verificando login, logout, sessão expirada e acesso negado a rota protegida
- [ ] 2.8 Implementar a tabela de eventos como somente acréscimo, verificando que tentativa de alteração e de exclusão são recusadas pelo banco
- [ ] 2.9 Configurar publicação contínua a partir do repositório com variáveis de ambiente por ambiente, verificando que o pacote entregue ao navegador não contém credencial de serviço

## 3. Catálogo de tipos de causa

- [ ] 3.1 Implementar criação, edição e exclusão de modelo de checklist, verificando pelos testes de cada operação
- [ ] 3.2 Implementar itens com identificador estável, nome técnico, descrição simples, obrigatoriedade e múltiplos arquivos, verificando que renomear um item preserva vínculos existentes
- [ ] 3.3 Implementar blocos de argumentação com ordenação, verificando que a ordem persiste após recarregar
- [ ] 3.4 Implementar conjuntos comuns reaproveitáveis, como justiça gratuita, verificando a inclusão em um modelo existente
- [ ] 3.5 Implementar versionamento de modelo para que alteração não afete processos em andamento, verificando que um processo aberto antes da alteração mantém sua checklist
- [ ] 3.6 Implementar importação de lista em texto com revisão obrigatória antes de salvar, verificando com as listas reais de usucapião e divórcio
- [ ] 3.7 Cadastrar os modelos reais das áreas de maior fluxo, verificando com o advogado que cada lista corresponde ao que ele pede hoje

## 4. Processos e checklist

- [ ] 4.1 Implementar abertura de processo a partir de modelo, copiando a checklist, verificando que editar a cópia não altera o modelo
- [ ] 4.2 Implementar a máquina de estados do item e do documento, verificando que toda transição inválida é recusada
- [ ] 4.3 Implementar aceite e recusa de documento com motivo, verificando que a recusa devolve o item a pendente e registra o motivo
- [ ] 4.4 Implementar o painel de pendências com ordenação por urgência, verificando o cálculo de tempo parado
- [ ] 4.5 Implementar a marcação de processo pronto quando os obrigatórios estão aceitos, verificando o caso com opcionais pendentes
- [ ] 4.6 Implementar o histórico do processo alimentado pelos eventos, verificando que toda ação relevante gera registro

## 5. Portal do cliente

- [ ] 5.1 Implementar geração de link com token de alta entropia guardando apenas o hash, verificando que o token em claro não existe no banco
- [ ] 5.2 Implementar validade, revogação e resposta genérica para token inválido, expirado e revogado, verificando que as três respostas são indistinguíveis
- [ ] 5.3 Implementar limitação de taxa por origem no portal, verificando que tentativas repetidas com token inválido passam a ser recusadas
- [ ] 5.4 Implementar a página do portal com a checklist em linguagem simples, verificando que nenhum nome técnico de item é exibido
- [ ] 5.5 Implementar autorização de envio com validação de tipo declarado e tamanho antes de emitir a URL assinada, verificando que arquivo acima do limite é recusado antes da transferência
- [ ] 5.6 Implementar envio direto do navegador ao armazenamento com registro prévio em estado aguardando, verificando que o arquivo não transita pela aplicação
- [ ] 5.7 Implementar confirmação de conclusão e promoção do registro para recebido, verificando o caso de confirmação que nunca chega
- [ ] 5.8 Implementar a rotina de reconciliação de registros órfãos, verificando com um envio interrompido de propósito
- [ ] 5.9 Implementar envio de documento adicional fora da lista para a triagem, verificando que não entra no dossiê sem decisão do advogado
- [ ] 5.10 Implementar envio de múltiplas fotos como documento único com ordem de páginas, verificando a ordem no PDF resultante
- [ ] 5.11 Implementar retomada após conexão interrompida, verificando que envios concluídos permanecem salvos
- [ ] 5.12 Implementar o bloqueio de leitura de documento pelo portador do link, verificando que a tentativa é negada e registrada

## 6. Validação e normalização de arquivos

- [ ] 6.1 Implementar verificação de tipo real pelo conteúdo após o envio, verificando que arquivo com extensão mascarada é recusado
- [ ] 6.2 Implementar o ambiente isolado de conversão sem acesso à rede e com limite de recursos, verificando que o processo não alcança a rede
- [ ] 6.3 Implementar conversão de imagem e de formatos de escritório para PDF preservando o original, verificando com um arquivo de cada formato recebido do cliente
- [ ] 6.4 Implementar sanitização do PDF derivado removendo conteúdo ativo, verificando com um PDF contendo script embutido
- [ ] 6.5 Implementar compressão com piso de qualidade, verificando que a compressão para antes de tornar o texto ilegível
- [ ] 6.6 Implementar proposta de fragmentação quando a compressão não basta, verificando que exige confirmação do advogado
- [ ] 6.7 Implementar sinalização de documento com indício de ilegibilidade, verificando que nenhuma recusa automática acontece
- [ ] 6.8 Implementar visualização de documento isolada do contexto da aplicação, verificando que conteúdo do arquivo não alcança a sessão

## 7. Automações assíncronas

- [ ] 7.1 Instalar o n8n e configurar credencial própria de escopo restrito para chamar a aplicação, verificando que essa credencial não acessa dados de advogado
- [ ] 7.2 Implementar a publicação de eventos pela aplicação e o consumo pelo n8n, verificando que a regra de negócio permanece na aplicação
- [ ] 7.3 Implementar idempotência por chave de evento em todos os fluxos, verificando que reprocessar o mesmo evento não duplica efeito
- [ ] 7.4 Implementar o fluxo de conversão acionado por evento, verificando que falha marca o documento e notifica o advogado
- [ ] 7.5 Implementar o fluxo de lembrete respeitando cadência, limite e suspensão, verificando que nenhum lembrete sai com cobrança desabilitada
- [ ] 7.6 Implementar o conteúdo do lembrete sem dado sensível e sem anexo, verificando o texto gerado
- [ ] 7.7 Implementar o registro de cobranças e a sinalização de falha de entrega, verificando com endereço inválido
- [ ] 7.8 Implementar o disparo manual de lembrete pelo advogado, verificando que não aguarda o ciclo automático

## 8. Montagem e exportação do dossiê

- [ ] 8.1 Implementar o cálculo de numeração derivado da ordem sem persistir número no documento, verificando por teste que nenhuma coluna de número existe fora da exportação
- [ ] 8.2 Implementar a ordem forense padrão a partir dos blocos do modelo, verificando com um processo de cada área de maior fluxo
- [ ] 8.3 Implementar reordenação manual com renumeração imediata, verificando que inserir documento no meio não altera identidade dos demais
- [ ] 8.4 Implementar a verificação de completude antes de exportar com alerta e ciência registrada, verificando o caso de item obrigatório faltando
- [ ] 8.5 Implementar a exportação com um arquivo por prova, nomeado e numerado, verificando com um processo de doze provas
- [ ] 8.6 Implementar a nomenclatura no padrão "DOC. N - descrição.pdf" com tratamento de caractere especial, verificando que dois documentos de mesma descrição não se sobrescrevem
- [ ] 8.7 Implementar a conferência do rol contra o texto da petição, apontando documento não citado e citação sem documento, verificando com a contestação real de trinta e um documentos que contém um anexo órfão
- [ ] 8.8 Implementar a interpretação de citação em bloco na forma "DOCs. 5, 6 e 7", verificando que cada número é considerado individualmente
- [ ] 8.9 Implementar a geração do rol de documentos, verificando que cada número do rol corresponde a um arquivo entregue
- [ ] 8.10 Implementar o registro de exportação como versão consultável, verificando que reexportar preserva o registro anterior
- [ ] 8.11 Implementar a entrega respeitando o limite de tamanho por arquivo do tribunal, verificando que nenhum arquivo excede o limite configurado

## 9. Verificação final

- [ ] 9.1 Executar o percurso completo com um caso real do advogado, da abertura à exportação, verificando que o dossiê sai pronto para protocolo
- [ ] 9.2 Conferir o dossiê exportado contra as citações de uma petição real, verificando que não há número citado sem documento nem documento sem citação
- [ ] 9.3 Executar revisão de segurança cobrindo isolamento entre advogados, escopo do link, exposição de arquivo, validação de conteúdo e presença de segredo no navegador, verificando cada item com evidência
- [ ] 9.4 Executar teste de carga de envio com processo de trinta documentos em conexão lenta, verificando que nenhum envio se perde
- [ ] 9.5 Validar com o advogado em caso real e registrar o tempo gasto contra o processo manual anterior, verificando o ganho efetivo
