
---

# Guia+ Frontend

Este é o frontend da aplicação Guia+, desenvolvida em React. O Guia+ é um sistema para gestão e emissão de guias de transporte para clientes de transportadoras, com funcionalidades como cadastro de clientes, gestão de guias e visualização de guias em um mapa interativo.

## Requisitos

Certifique-se de que você tem as seguintes ferramentas instaladas em sua máquina:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) 

## Como rodar o projeto localmente

Siga as etapas abaixo para clonar e rodar o projeto na sua máquina local:

### 1. Clonar o repositório

```bash
git clone https://github.com/GuiDuarte07/guia-plus-frontend.git
```

### 2. Entrar na pasta do projeto

```bash
cd guia-plus-frontend
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Rodar a aplicação

```bash
npm run dev
```

### 5. Acessar a aplicação

Após rodar o comando anterior, a aplicação estará disponível em: http://localhost:5173

## Estrutura do Projeto

O projeto está estruturado de forma a seguir as boas práticas de desenvolvimento React, com componentes organizados em pastas como:

- `src/components`: Contém os componentes reutilizáveis da aplicação.
- `src/pages`: Contém as páginas principais do sistema, como a página de cadastro de clientes e a página de gestão de guias.
- `src/services`: Contém as integrações com APIs externas, como a API ViaCEP e o backend.

## Comandos Úteis

Aqui estão alguns comandos úteis para o desenvolvimento do projeto:

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Gera a build para produção.
- `npm run preview`: Visualiza a build gerada.
- `npm run lint`: Executa o linter para identificar erros de formatação.

## Tecnologias Utilizadas

- **React**: Biblioteca JavaScript para construção de interfaces.
- **Vite**: Ferramenta de build rápida para desenvolvimento frontend.
- **Leaflet**: Biblioteca de mapas interativos.
- **Axios**: Biblioteca para fazer requisições HTTP.
- **Material UI React**: Bliblioteca de componentes do MUI.
- **React Hooks Form**: Biblioteca para criação e gerencia de formulários.
- **React Router Dom**: Biblioteca de gerenciamento de rotas
