# Engenium - TCC 2

Bem-vindo ao repositório do projeto Engenium, desenvolvido como parte do Trabalho de Conclusão de Curso (TCC 2). Este projeto é uma aplicação web para gerenciar e cadastrar perguntas de diversas categorias relacionadas à Engenharia de Software. A aplicação permite adicionar, editar, buscar e excluir perguntas, garantindo uma interface intuitiva e funcional.

## Índice

- [Engenium - TCC 2](#engenium---tcc-2)
  - [Índice](#índice)
  - [Funcionalidades](#funcionalidades)
  - [Tecnologias Utilizadas](#tecnologias-utilizadas)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação](#instalação)
  - [Uso](#uso)
  - [Estrutura do Projeto](#estrutura-do-projeto)
  - [Contribuição](#contribuição)
  - [Licença](#licença)
  - [Contato](#contato)

## Funcionalidades

- Cadastrar novas perguntas com opções de resposta.
- Buscar perguntas por ID.
- Editar perguntas existentes.
- Excluir perguntas cadastradas.
- Visualizar perguntas de maneira aleatória sem repetição até que todas as perguntas tenham sido exibidas.

## Tecnologias Utilizadas

- **Frontend:**
  - React.js
  - CSS

- **Backend:**
  - Node.js
  - Express

- **Banco de Dados:**
  - MongoDB

## Pré-requisitos

Antes de começar, você precisará ter as seguintes ferramentas instaladas em sua máquina:

- [Node.js](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com/)

## Instalação

1 Clone este repositório:

`sh git clone https://github.com/seu-usuario/engenium-tcc2.git`

2. Navegue até o diretório do projeto:

cd engenium-tcc2

3. Instale as dependências do backend:

cd backend
npm install

4. Instale as dependências do frontend:

cd ../frontend
npm install

## Uso

1. Inicie o servidor backend:

cd backend
npm start

2. Inicie a aplicação frontend:

cd ../frontend
npm start

3. Abra o navegador e acesse http://localhost:3000 para ver a aplicação em funcionamento.

## Estrutura do Projeto

```plaintext
engenium-tcc2/
├── backend/                # Código-fonte do backend
│   ├── controllers/        # Controladores da aplicação
│   ├── models/             # Modelos de dados
│   ├── routes/             # Definição das rotas da API
│   ├── app.js              # Arquivo principal do backend
│   └── ...                 # Outros arquivos e diretórios do backend
│
├── frontend/               # Código-fonte do frontend
│   ├── src/                # Código-fonte do React
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── styles/         # Arquivos de estilo (CSS)
│   │   ├── App.js          # Componente principal
│   │   └── ...             # Outros arquivos e diretórios do frontend
│   ├── public/             # Arquivos públicos estáticos
│   ├── package.json        # Dependências do frontend
│   └── ...                 # Outros arquivos e diretórios do frontend
│
├── README.md               # Documentação do projeto
└── ...                     # Outros arquivos e diretórios do projeto



## Licença
Este projeto está licenciado sob a Licença MIT. Veja o arquivo LICENSE para mais detalhes.

