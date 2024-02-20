# API - Rinha de backend 2024

Eu sou um programador considerado iniciante, então foi um grande exercicio pra mim participar dessa rinha, além de muito divertido.   

## Stack
  - NodeJS (Javascript Runtime)
  - Fastify (Server HTTP)
  - PostgreSQL (Banco de dados relacional)
  - pg-promise (Conexão com o Postgres)

## Como rodar o projeto

  Esse projeto roda com network_mode HOST do docker, que só é suportado em sistemas operacionais Linux, ou seja, se você estiver usando Windows, você tem duas opções:
  - Usar o docker dentro do WSL2 (foi oq eu fiz)
  - Usar o Rancher Desktop, uma alternativa ao Docker Desktop 

  Nesse reposítorio tem 2 branches, a Main e a "fastify". Sendo a "main" rodando em express e a "fastify" rodando com fastify.

  Nos dois casos, é tão simples quanto baixar o repositório do projeto e rodar o comando:

  ```bash
  docker compose up [-d]
  ```
  Depois disso, o projeto já vai estar rodando na porta 9999  

  Se não rodar ou a API cair, só resetar o container SEM resetar o container de postgres, ai vai funcionar legal (se aparecer "tabelas criadas") ta funfando legal

  Você pode também só baixar o arquivo "compose.yaml" e "nginx.conf" e executar o mesmo comando, só alterando no "compose.yaml" a linha "image" e descomentando ela e comentando a linha "build" que vai rodar do mesmo jeito, já que a imagem do docker já está upada no docker hub.

  Sinta-se a vontade para fuçar no código, dar feedbacks de coisa que eu fiz de um jeito ruim ou qualquer coisa do tipo.   
  Muito obrigado pela atenção.