# API - Rinha de backend 2024

Eu sou um programador considerado iniciante, então foi um grande exercicio pra mim participar dessa rinha, além de muito divertido.   
Aprendi mt coisa e fiquei horas quebrando a cabeça pra descobrir como usar o EC2 da AWS e OS Linux pra rodar no modo Host do docker (Nunca usei linux), já que no modo Bridge tava dando "IO Execption: premature close", e como aprendemos na outra rinha, o modo host resolvia esse problema.

## Stack
  - Bun (Javascript Runtime)
  - Fastify (Server HTTP)
  - PostgreSQL (Banco de dados relacional)
  - pg (Conexão com o Postgres)

## Como rodar o projeto

  Nesse reposítorio tem 2 branches, a Main e a "mode_bridge". Sendo a main rodando em modo HOST e a mode_brigde rodando no modo Bridge padrão.

  Nos dois casos, é tão simples quanto baixar o repositório do projeto e rodar o comando:

  ```bash
  docker compose up [-d]
  ```
  Depois disso, o projeto já vai estar rodando na porta 9999  

  Você pode também só baixar o arquivo "compose.yaml" e "nginx.conf" e executar o mesmo comando que vai rodar do mesmo jeito, já que a imagem do docker já está upada no docker hub.

  Sinta-se a vontade para fuçar no código, dar feedbacks de coisa que eu fiz de um jeito ruim ou qualquer coisa do tipo.   
  Muito obrigado pela atenção.