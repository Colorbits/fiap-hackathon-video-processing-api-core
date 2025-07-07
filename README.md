
# Documentação - Fiap Hackathon Video Processing API Core  
### Grupo 5 - 9SOAT
 - Gabriel Ferreira Umbelino



## Introdução
Este projeto é a API principal do sistema de processamento de vídeos, responsável por receber os vídeos enviados pelos usuários, gerenciar o cadastro e autenticação de usuários, e orquestrar o processo de processamento de vídeos. Esta API atua como ponto central de entrada no ecossistema, coordenando os demais microserviços especializados.

O sistema permite que usuários façam upload de vídeos, que são então processados para extração de frames em intervalos configuráveis. Esta API gerencia todo o ciclo de vida do processamento, desde o recebimento do vídeo até o redirecionamento para download das imagens processadas, além de manter os usuários informados sobre o status de suas solicitações.

Este serviço utiliza PostgreSQL para armazenar dados de usuários, metadados dos vídeos e informações de processamento, além de integrar-se com serviços de armazenamento para os vídeos originais. A arquitetura é projetada para funcionar em ambientes Kubernetes, com escalabilidade horizontal para lidar com múltiplas requisições simultâneas de processamento de vídeo.




## Escopo do Sistema

### Gestão de Usuários
- Sistema completo de gerenciamento de usuários:
  - Cadastro e autenticação de usuários
  - Histórico de videos enviados por usuário

### Recebimento e Processamento de Vídeos
- Upload e gestão de vídeos:
  - Recebimento de arquivos de vídeo
  - Armazenamento temporário

### Orquestração de Serviços
- Coordenação entre diferentes microserviços:
  - Monitoramento do progresso de extração de frames
  - Comunicação com serviço de armazenamento de imagens
  - Integração com serviço de notificação

### Monitoramento e Notificações
- Sistema avançado de acompanhamento:
  - Notificações sobre  falhas
  - Logs detalhados para diagnóstico




## Diagramas

### Diagrama de Entidade e Relacionamento
![Diagrama de Entidade e Relacionamento](https://github.com/Colorbits/fiap-hackathon-video-processing-api-core/blob/main/docs/der.png?raw=true)

O sistema de processamento de vídeos utiliza um modelo de dados simples e eficiente, composto por três entidades principais que se relacionam entre si. Abaixo, detalhamos cada uma dessas entidades e suas funções dentro do sistema.

#### 1. User
A entidade User representa os usuários cadastrados no sistema. Esta tabela armazena informações básicas para autenticação e identificação:


#### 2. Video
A entidade Video armazena os metadados dos vídeos enviados para processamento:


#### 3. AuthSession
A entidade AuthSession gerencia as sessões de autenticação dos usuários:



### Arquitetura Clean

![Arquitetura Clean](https://github.com/Colorbits/fiap-hackathon-video-processing-api-core/blob/main/docs/clean-architecture.jpg?raw=true)




### Diagrama de Arquitetura de Microserviços
![Diagrama de Arquitetura](https://github.com/Colorbits/fiap-hackathon-video-processing-api-core/blob/main/docs/microservice-diagram.png?raw=true)


#### Arquitetura de Microserviços

A solução de processamento de vídeo foi projetada usando uma arquitetura de microserviços, com os seguintes componentes:

1. **Video Processing API Core** (Este serviço)
   - Gerenciamento de usuários e autenticação
   - Ponto central de entrada para o sistema
   - Coordenação do processamento de vídeos

2. **Image Upload Service**
   - Armazenamento de frames extraídos
   - Geração de pacotes para download
   - API para acesso às imagens processadas

3. **Notification Service**
   - Alertas sobre erros ou problemas via email

#### Fluxo de Processamento de Vídeo

1. O usuário faz upload de um vídeo através da API principal
2. A API armazena o vídeo temporariamente e registra seus metadados
3. O serviço de processamento extrai os frames do vídeo em intervalos regulares
4. Os frames extraídos são armazenados pelo serviço de upload de imagens
5. O usuário consulta o status do video enviado
6. O usuário pode visualizar e baixar os frames extraídos


## Dicionário de linguagem Ubíqua

 - Vídeo: Arquivo multimídia enviado pelo usuário para processamento e extração de frames.

 - Usuário: Pessoa cadastrada no sistema que pode enviar vídeos e receber os frames processados.

 - API Core: Serviço central que gerencia usuários, recebe vídeos e orquestra o fluxo de processamento.

 - Processamento: Conjunto de operações realizadas sobre um vídeo para extrair frames.

 - Frame: Imagem individual extraída de um vídeo em um momento específico.

 - FPS (Frames Por Segundo): Configuração que define quantos frames serão extraídos por segundo de vídeo.

 - Status de Processamento: Estado atual de um job (pendente, em andamento, concluído, erro).

 - Serviço de Upload: Microserviço responsável pelo armazenamento de frames extraídos.

 - Serviço de Notificação: Microserviço responsável por enviar alertas aos usuários.

 - Fila de Processamento: Sistema de priorização e organização de jobs aguardando processamento.

 - Token de Autenticação: Credencial que identifica um usuário autenticado no sistema.


## Tech Stack

- Node.js 20
- TypeScript
- NestJS (framework)
- PostgreSQL
- TypeORM
- JWT para autenticação
- FFmpeg para processamento de vídeo
- Docker
- Kubernetes
- AWS EKS (para implantação em produção)


## Instalação do projeto

### Kubernetes
Este projeto pode ser executado em um ambiente kubernetes, dispensando qualquer instalação adicional.
Se você não possui o Kubernetes instalado, siga as instruções para seu sistema operacional na [documentação oficial do Kubernetes](https://kubernetes.io/docs/tasks/tools/).

#### 1 - Inicialize o projeto executando o seguinte comando no terminal
```
npm run start:kubernetes
```
Acesse o projeto em: [http://localhost:8080/api](http://localhost:8080/api)

### Node.js
Este projeto pode ser executado utilizando node.js em sua maquina.
Se você não possui o Node.js instalado, siga as instruções para seu sistema operacional na [documentação oficial do Node.js](https://nodejs.org/en/download).

#### 1 - Inicialize o projeto executando o seguinte comando no terminal
```
npm install

npm run start
```


## Execução via Insomnia

Se você já completou um dos passos anteriores ([Instalação do projeto](#instala%C3%A7%C3%A3o-do-projeto) ou [Desenvolvimento](#desenvolvimento)), é possível importar uma coleção JSON do Insomnia com todos os endpoints já configurados para testar diretamente a API.

A coleção do Insomnia está disponível [neste link](https://github.com/Colorbits/fiap-hackathon-video-processing-api-core/blob/main/docs/fiap-x-insomnia.yaml). Você pode baixá-la e importar diretamente no seu Postman para realizar os testes necessários.


## Swagger 

Todos os endpoints da API do projeto também podem ser consultados via Swagger.

Se o projeto estiver sendo executado localmente, o Swagger estará disponível na URL:  
[http://localhost:3000/api](http://localhost:3000/api)

Além disso, você pode acessar o JSON de especificação OpenAPI, que estará disponível na URL:  
[http://localhost:3000/api-json](http://localhost:3000/api-json)
