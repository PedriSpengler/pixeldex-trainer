# 🔴 Pokédex Fullstack

![Badge Status](https://img.shields.io/badge/STATUS-FINALIZADO-green)
![Badge License](https://img.shields.io/badge/LICENSE-MIT-blue)
![Badge Stack](https://img.shields.io/badge/STACK-MERN%2FPERN-orange)

> Uma aplicação web interativa que simula uma Pokédex, permitindo aos usuários explorar o mundo Pokémon, filtrar por tipos, ver detalhes e, mediante autenticação, salvar seus favoritos.

---

## 📸 Screenshots

| Login / Home | Detalhes / Favoritos |
|:---:|:---:|
| ![Home Screen](./assets/home-preview.png) | ![Details Screen](./assets/details-preview.png) |

---

## 🚀 Sobre o Projeto

Este projeto foi desenvolvido como um desafio Fullstack para criar uma experiência imersiva inspirada nos consoles clássicos da Nintendo/Gameboy. A aplicação consome a [PokéAPI](https://pokeapi.co/) para dados públicos e utiliza um backend próprio para gerenciar a autenticação de usuários e a persistência de dados (favoritos).

### 🎯 Funcionalidades Principais

-   **🔐 Autenticação Completa:** Cadastro e Login de usuários via JWT (JSON Web Token).
-   **🔍 Explorar e Buscar:** Listagem paginada de Pokémons com barra de busca (por nome ou ID).
-   **🧠 Filtros Avançados:** Filtragem dinâmica por Tipo de Pokémon (Fogo, Água, Grama, etc.).
-   **📄 Detalhes Ricos:** Visualização de stats, habilidades, tipos e evoluções.
-   **⭐ Sistema de Favoritos:** Usuários logados podem favoritar Pokémons, salvando a lista no banco de dados.
-   **🎨 UI/UX Temática:** Design responsivo e nostálgico, adaptável para Desktop e Mobile.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
-   **React** (ou Next.js)
-   **TailwindCSS** (ou Styled Components)
-   **Axios** (Requisições HTTP)
-   **React Router** (Navegação SPA)

### Backend
-   **Node.js** & **Express**
-   **JWT** (Autenticação)
-   **PostgreSQL** com **Prisma** (Ou MongoDB com Mongoose - *ajuste conforme sua escolha*)
-   **Bcrypt** (Hash de senhas)

### Infraestrutura & Dados
-   **PokéAPI** (Fonte de dados externa)
-   **Vercel** (Deploy Frontend)
-   **Render/Railway** (Deploy Backend)

---

## ⚙️ Como Rodar o Projeto Localmente

Siga os passos abaixo para executar a aplicação no seu ambiente de desenvolvimento.

### Pré-requisitos
-   Node.js (v18+)
-   NPM ou Yarn
-   Banco de dados rodando (Postgres ou Mongo)

### 1. Clone o repositório

```bash
git clone [https://github.com/SEU-USUARIO/pokedex-fullstack.git](https://github.com/SEU-USUARIO/pokedex-fullstack.git)
cd pokedex-fullstack
