<img width="1900" height="921" alt="image" src="https://github.com/user-attachments/assets/c4ea722a-5b84-4a47-a6a7-8d37e62645ea" /># 🔴 Pixeldex Trainer

![Project Status](https://img.shields.io/badge/status-active-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

Uma aplicação **Fullstack** interativa que simula uma Pokédex com estética retrô (Gameboy/Nintendo). O projeto permite que usuários criem contas, naveguem por dados reais da PokéAPI e gerenciem sua própria lista de Pokémons favoritos, com persistência de dados em banco relacional.

---

## 📸 Screenshots

<div align="center">
  <img width="1900" height="921" alt="image" src="https://github.com/user-attachments/assets/264e6c8f-5be7-4190-a1a9-898c307651d7" /> alt="Preview" />

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
