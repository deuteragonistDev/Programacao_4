# API Cyberpunk Edgerunners - Backend

Este projeto consiste em uma API RESTful desenvolvida em Node.js com Express e SQLite, provendo dinamismo e autenticação segura via JWT para a interface Front-end do catálogo Cyberpunk.

## ⚙️ Configuração do Ambiente e Instalação

1. Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.
2. Clone ou baixe este repositório.
3. Navegue até a pasta do backend via terminal:
   `cd CyberPunk_backend`
4. Instale as dependências necessárias:
   `npm install`

## 🚀 Execução

- **Para rodar o servidor:** `npm start`
  O servidor inicializará na porta 3000 e repovoará o banco de dados SQLite automaticamente.

- **Para rodar os testes unitários (Jest):**
  `npm test`

## 🔗 Mapeamento dos Endpoints (API)

### Autenticação (Públicas)
* `POST /api/registrar` - Registra um novo usuário no banco de dados. (Requer JSON: `username`, `password`)
* `POST /api/login` - Valida credenciais e retorna o Token JWT. (Requer JSON: `username`, `password`)

### Conteúdos
* `GET /api/conteudos` - (Pública) Retorna a lista de conteúdos do banco, ordenada de forma ascendente pelo campo `ordem_apresentacao`.
* `POST /api/conteudos` - (Protegida) Cria um novo artigo/conteúdo. Exige o Header `Authorization: Bearer <token>`. (Requer JSON: `titulo`, `texto`, `imagem`, `ordem_apresentacao`).
* `DELETE /api/conteudos/:id` - (Protegida) Exclui um registro específico pelo ID. Exige Token JWT no Header.