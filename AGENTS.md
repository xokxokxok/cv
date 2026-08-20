# Regras

Nunca adicione co-autoria no git ou em qualquer parte do projeto.
Nunca deixe indicativos que esse projeto usou IA.
O idioma padrão de desenvolvimento é o Ingles.
O idioma padrão dos arquivos relacioandos a IA (AGENTS.md, CLAUDE.md e outros) é o portugues, mas pode usar o ingles
quando for se referir a coisas do projeto ou bibliotecas. A idéia é que a explicação e anotações sejam em portugues,
mas os termos tecnicos devem permanecer em sua lingua original.


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

No futuro novas funcionalidades serão adicionadas!

Apenas a pasta ./deploy/public é publicada no google cloud e voce pode encontrar os detalhes desse deploy nos arquivos
referentes ao firebase.
