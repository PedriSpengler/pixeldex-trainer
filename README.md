# 🔴 Pixeldex Trainer

![Project Status](https://img.shields.io/badge/status-active-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

Uma aplicação **Fullstack** interativa que simula uma Pokédex com estética retrô (Gameboy/Nintendo). O projeto permite que usuários criem contas, naveguem por dados reais da PokéAPI e gerenciem sua própria lista de Pokémons favoritos, com persistência de dados em banco relacional.

---

## 📸 Screenshots

<div align="center">
  <img width="1900" height="921" alt="image" src="https://github.com/user-attachments/assets/264e6c8f-5be7-4190-a1a9-898c307651d7" alt="Preview" />

</div>

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando uma arquitetura moderna e tipada de ponta a ponta.

### Frontend (Client)
* **React + Vite**: Para uma interface rápida e reativa.
* **TypeScript**: Garantia de tipagem estática e segurança no código.
* **Tailwind CSS**: Estilização utilitária para o tema retrô responsivo.
* **Axios**: Gerenciamento de requisições HTTP e interceptors para JWT.
* **Lucide React**: Ícones vetoriais.

### Backend (Server)
* **Node.js + Express**: Servidor RESTful robusto.
* **Prisma ORM**: Camada de acesso ao banco de dados e migrations.
* **PostgreSQL**: Banco de dados relacional (Hospedado no Neon.tech).
* **JWT (JSON Web Tokens)**: Autenticação segura (Stateless).
* **Zod**: Validação rigorosa de esquemas de entrada (payloads).
* **BcryptJS**: Hash de senhas para segurança dos dados.

---

## ✨ Funcionalidades

### 🔐 Autenticação e Segurança
- [x] **Cadastro de Usuário**: Validação de e-mail e criação de conta segura.
- [x] **Login Seguro**: Autenticação via Token JWT.
- [x] **Proteção de Rotas**: Middleware no Backend que bloqueia acesso não autorizado.
- [x] **Persistência de Sessão**: Login mantido via LocalStorage e Axios Headers.

### 🎮 Pokédex Interativa
- [x] **Listagem**: Consumo da PokéAPI com paginação.
- [x] **Busca Inteligente**: Filtragem por Nome ou ID do Pokémon.
- [x] **Filtro por Tipo**: Seleção de tipos (Fogo, Água, Planta, etc.).
- [x] **Detalhes**: Modal com Stats, Habilidades e Sprites.

### ⭐ Sistema de Favoritos
- [x] **Favoritar**: Usuários logados podem salvar Pokémons.
- [x] **Persistência**: Dados salvos no PostgreSQL (não se perdem ao recarregar).
- [x] **Gestão**: Visualização e remoção da lista de favoritos pessoais.

---

## 🚀 Como Rodar o Projeto

Este é um projeto monorepo (Frontend e Backend no mesmo repositório). Siga os passos abaixo:

### Pré-requisitos
* Node.js (v18+)
* NPM ou Yarn

### 1. Configurando o Backend (Servidor)

Navegue até a pasta do servidor e instale as dependências:

```bash
cd server
npm install
```
Crie um arquivo .env dentro da pasta server com as seguintes variáveis:
```
PORT=3001
DATABASE_URL="sua_string_de_conexao_postgresql_aqui"
JWT_SECRET="sua_chave_secreta_super_segura"
```
Rode as migrações do banco de dados (Prisma):
```
prisma migrate dev --name init
```
Inicie o servidor:
```
npm run dev
```
# O servidor rodará em http://localhost:3001
2. Configurando o Frontend (Cliente)Em um novo terminal, volte para a raiz do projeto:
```
cd .. # Caso esteja na pasta server
npm install
```
Inicie a aplicação React:
```
npm run dev
```
O frontend rodará em http://localhost:8080 ou 5173

## 📚 Documentação da API

A API segue os princípios REST e retorna dados em formato JSON.
**Base URL:** `http://localhost:3001`

### 🔐 Autenticação

#### 1. Registrar Usuário
Cria uma nova conta e retorna o token de acesso.

* **URL:** `/auth/register`
* **Método:** `POST`
* **Body (JSON):**
    ```json
    {
      "username": "AshKetchum",
      "email": "ash@pallet.com",
      "password": "pikachu_password"
    }
    ```
* **Resposta (201 Created):**
    ```json
    {
      "user": {
        "id": "uuid-gerado",
        "email": "ash@pallet.com",
        "username": "AshKetchum"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

#### 2. Login
Autentica um usuário existente.

* **URL:** `/auth/login`
* **Método:** `POST`
* **Body (JSON):**
    ```json
    {
      "email": "ash@pallet.com",
      "password": "pikachu_password"
    }
    ```
* **Resposta (200 OK):**
    ```json
    {
      "user": { ... },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

---

### ⭐ Favoritos
⚠️ **Requer Header:** `Authorization: Bearer <seu_token_aqui>`

#### 3. Listar Favoritos
Retorna todos os Pokémons favoritados pelo usuário logado.

* **URL:** `/favorites`
* **Método:** `GET`
* **Resposta (200 OK):**
    ```json
    [
      {
        "id": "fav-uuid-1",
        "pokemonId": 25,
        "name": "pikachu",
        "types": ["electric"],
        "sprite": "[https://raw.githubusercontent.com/PokeAPI/sprites/](https://raw.githubusercontent.com/PokeAPI/sprites/)...",
        "createdAt": "2026-01-13T10:00:00.000Z"
      }
    ]
    ```

#### 4. Adicionar Favorito
Salva um Pokémon na lista do usuário.

* **URL:** `/favorites`
* **Método:** `POST`
* **Body (JSON):**
    ```json
    {
      "pokemonId": 25,
      "name": "pikachu",
      "types": ["electric"],
      "sprite": "[https://raw.githubusercontent.com/](https://raw.githubusercontent.com/)..."
    }
    ```

#### 5. Remover Favorito
Remove um Pokémon dos favoritos pelo ID do registro (não o ID do Pokémon).

* **URL:** `/favorites/:id`
* **Método:** `DELETE`
* **Exemplo:** `/favorites/fav-uuid-1`
* **Resposta (200 OK):**
    ```json
    {
      "message": "Removed from favorites"
    }
    ```
# 📂 Estrutura de Pastaspixeldex-trainer/
```
├── src/                # Código Fonte do Frontend (React)
│   ├── components/     # Componentes UI (Cards, Modais)
│   ├── context/        # Context API (AuthContext)
│   └── pages/          # Rotas da aplicação
├── server/             # Código Fonte do Backend (Node/Express)
│   ├── src/
│   │   ├── middleware/ # Middlewares (Auth)
│   │   ├── routes/     # Rotas da API
│   │   └── server.ts   # Entry point
│   └── prisma/         # Schema do Banco de Dados
└── README.md
```
