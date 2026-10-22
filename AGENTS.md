# Regras

Nunca adicione co-autoria no git ou em qualquer parte do projeto.
Nunca deixe indicativos que esse projeto usou IA.
O idioma padrão de desenvolvimento é o Ingles.
O idioma padrão dos arquivos relacioandos a IA (AGENTS.md, CLAUDE.md e outros) é o portugues, mas pode usar o ingles
quando for se referir a coisas do projeto ou bibliotecas. A idéia é que a explicação e anotações sejam em portugues,
mas os termos tecnicos devem permanecer em sua lingua original.

# Observação importante:
Atualmente o arquivo [data.json](deploy/public/data.json) é o meu CV. Voce pode usar ele como fonte de informação caso eu peça tarefas não relacionadas ao desenvolvimento.


# Descrição do Projeto

O root do projeto é uma aplicação Ruby on Rails que só será usada localmente em ambiente de desenvolvimento.
O objetivo do projeto é gerenciar e publicar paginas de documentos. Atualmente ele só tem um document que é um Curriculo
Vitae no banco de dados apenas atualizar os arquivos abaixo: 
 
1 - ./deploy/public/data_schema.json
2 - ./deploy/public/data.json

Os JSONs acima são usados no ./deploy/public/index.html

No momento o que deve funcionar é apenas o CRUD de documentos (documents table) funcionar adequadamente. Apos cada
edição de documentos atualizar os arquivos data_schema.json (com o Document#json_schema) e data.json
(com o Document#json_data) usando o unico registro da tabela documents.

Embora o CRUD de documents seja completo podemos assumir que o usuario vai manter um unico registro sempre na tabela.

Cada document também tem uma lista de questions (tabela `questions`, colunas `question` e `answer`). A idéia é
guardar perguntas que no futuro podem complementar as informações do document. Questions não têm um index generico:
elas são sempre listadas dentro de um document (`/documents/:documentId/questions` no frontend,
`/api/documents/:document_id/questions` na API). As questions não entram nos arquivos publicados em ./deploy/public.

No futuro novas funcionalidades serão adicionadas!

Apenas a pasta ./deploy/public é publicada no google cloud e voce pode encontrar os detalhes desse deploy nos arquivos
referentes ao firebase.


# Como iniciar a aplicação (desenvolvimento local)

O ambiente completo (Postgres + Redis + Rails API + Sidekiq + frontend React + CV publicado) sobe via Docker Compose, definido em ./docker-compose.yml:

    docker compose up -d --build

Isso sobe 6 containers:
- cv-db-1: Postgres 16, porta 5432
- cv-redis-1: Redis 7, porta 6379 — fila do Sidekiq
- cv-web-1: Rails API, porta 3000 — roda `bin/rails db:prepare` e `bin/rails server` automaticamente no start;
  dashboard do Sidekiq em http://localhost:3000/sidekiq
- cv-sidekiq-1: worker Sidekiq — executa os jobs que gravam/removem ./deploy/public/data.json e data_schema.json
- cv-frontend-1: Vite + React, porta 5173
- cv-site-1: nginx, porta 8080 — serve ./deploy/public (o CV publicado) localmente, com o mesmo rewrite do
  firebase.json (config em ./deploy/nginx.conf)

Acesse a interface de administração (CRUD de documents) em http://localhost:5173

Acesse o CV publicado (versão local de ./deploy/public) em http://localhost:8080. O index.html carrega o
data.json via fetch, então não funciona abrindo o arquivo direto do disco.

Comandos úteis:
- Logs: `docker logs cv-web-1 --tail 50` / `docker logs cv-frontend-1 --tail 50`
- Derrubar: `docker compose down`

Observação: a primeira carga do frontend após subir os containers costuma ser mais lenta (o Vite faz o pre-bundling
das dependências na primeira requisição); cargas seguintes ficam rápidas.


# Deploy

Apenas ./deploy/public é publicado no Firebase Hosting (projeto `fabiano-ishiy-zaparoli`, config em firebase.json e
.firebaserc). A partir da raiz do projeto:

    firebase deploy --only hosting

Requer o Firebase CLI instalado e autenticado (`firebase login`) na máquina local.


# Convenções do formulário (frontend)

O form é gerado pelo react-jsonschema-form (`@rjsf/antd`) a partir do `json_schema` do document.
Toda a aparência é controlada pelo `frontend/src/components/rjsf/documentUiSchema.ts` — o schema define
os dados, o uiSchema define o layout.

Regras adotadas:

- **Largura de campo**: `ui:options.span` define quantas das 24 colunas do grid do Ant Design o campo
  ocupa. Campos de um mesmo grupo somam 24 para formarem linhas alinhadas. Sem span explícito,
  objects/arrays e textareas ocupam a linha inteira e o resto ocupa metade.
- **Tipo de controle**: campos com um conjunto conhecido de valores usam widget próprio
  (`CvWidgets.tsx`): cor com swatch, ícone com preview do Material Symbol, mês por nome,
  ano numérico, location/contract type com sugestões.
- **Listas de valores curtos** (skills, ferramentas) usam `TagListField` — tags em vez de um input
  por linha.
- **Datas** usam `PeriodFields.tsx`: mês + ano na mesma linha, e "Present" como switch que esconde
  os inputs de fim.
- **Entradas longas** (Professional Experience) usam `ui:options.itemVariant: "collapse"` com
  `itemHeader` — a seção vira uma lista curta de cabeçalhos em vez de um scroll infinito.


# Pesquisa de vagas (tarefa independente)
Essa parge não esta implementada no projeto mas pode ser solicitada como uma tarefa. o arquivo [AGENTS.md](job_search/AGENTS.md) descreve como proceder.