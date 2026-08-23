# 🏆 SimpleTournaments

> Sistema web moderno, simples e completo para gerenciamento de torneios esportivos e de e-sports com suporte a requisitos personalizados de inscrição, confrontos todos-contra-todos (pontos corridos) e tabela de classificação automática.

---

## 📌 Sobre o Projeto

O **SimpleTournaments** é uma aplicação web full-stack desenvolvida para facilitar a organização, inscrição e controle de torneios. O organizador pode criar torneios definindo quais dados são obrigatórios para os participantes (como Discord, E-mail ou Telefone), inscrever competidores, gerar todos os confrontos automaticamente de forma embaralhada, registrar placares e acompanhar a tabela de classificação em tempo real.

---

## ✨ Funcionalidades

### 👤 Autenticação e Usuários
- Cadastro de novos organizadores.
- Login e controle de sessão com feedback de erros.
- Cabeçalho personalizado com identificação do usuário logado.

### 🏆 Gerenciamento de Torneios
- Criação de torneios com nome, descrição e data de início.
- **Campos Obrigatórios Personalizados**: escolha quais dados exigir na inscrição dos competidores (Discord, E-mail, Telefone).
- Listagem de torneios com status (*Aberto*, *Em Andamento*, *Finalizado*) e contagem dinâmica de participantes.
- Busca em tempo real de torneios por nome.
- Remoção segura de torneios com modal de confirmação.
- **Finalização / Reabertura de Torneios**: botão no rodapé da página para encerrar o torneio e declarar o campeão ou reabri-lo para ajustes.

### 👥 Inscrição de Participantes
- Formulário de inscrição compacto e dinâmico, adaptado aos requisitos do torneio.
- Validação automática de campos obrigatórios.
- Listagem de inscritos com dados de contato e busca/filtro em tempo real.
- Bloqueio automático de novas inscrições após a geração dos confrontos.

### ⚔️ Confrontos e Classificação (Pontos Corridos)
- **Geração de Confrontos**: gera automaticamente todos os jogos possíveis (todos contra todos) totalmente embaralhados.
- **Cards de Partidas**: interface limpa com placar interativo e botão de confirmação.
- **Pontuação e Desempate**:
  - 🟢 **Vitória**: +3 pontos
  - 🟡 **Empate**: +1 ponto para cada lado
  - 🔴 **Derrota**: 0 pontos
  - Critérios de ordenação: **Pontos > Saldo de Gols (SG) > Vitórias (V)**.
- **Atualização Suave**: registro de placares e atualizações sem recarregar ou rolar a página para o topo.
- **Reset de Confrontos**: opção para reiniciar os jogos e reabrir as inscrições se necessário.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **[React 19](https://react.dev/)** — Biblioteca para construção de interfaces reativas e modulares.
- **[Vite](https://vitejs.dev/)** — Ferramenta de build rápida e servidor de desenvolvimento leve.
- **[React Router](https://reactrouter.com/)** — Roteamento declarativo no client-side.
- **Vanilla CSS** — Design responsivo e moderno com variáveis CSS, sombras suaves e micro-animações.

### Backend
- **[Node.js](https://nodejs.org/)** (v22+) — Ambiente de execução JavaScript.
- **[Express 5](https://expressjs.com/)** — Framework web minimalista para APIs RESTful.
- **[TypeScript](https://www.typescriptlang.org/)** — Tipagem estática para robustez e previsibilidade.
- **[TSX](https://github.com/privatenumber/tsx)** — Execução e hot-reload de TypeScript sem compilação prévia manual.
- **[Node.js SQLite (`node:sqlite`)](https://nodejs.org/api/sqlite.html)** — Banco de dados SQLite nativo e embutido com integridade referencial (`PRAGMA foreign_keys = ON;`).

---

## 📁 Estrutura do Projeto

```text
SimpleTournaments 2/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Controladores das rotas (torneio, participante, usuario, partida)
│   │   ├── middleware/       # Middlewares de log e tratamento de erros
│   │   ├── models/           # Camada de acesso ao banco (SQL queries)
│   │   ├── routes/           # Definição das rotas REST
│   │   ├── services/         # Regras de negócio e cálculo de pontuação
│   │   ├── app.ts            # Configuração do Express e CORS
│   │   ├── db.ts             # Conexão SQLite, tabelas e migrações
│   │   └── server.ts         # Inicialização do servidor HTTP
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/           # Ícones e imagens estáticas
│   │   ├── components/       # Componentes React (Home, TorneioDetalhe, TorneioForm, etc.)
│   │   ├── services/         # Integração com a API (fetch)
│   │   ├── App.css           # Estilos globais e componentes da interface
│   │   ├── App.jsx           # Layout principal e rotas
│   │   └── main.jsx          # Ponto de entrada do React
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- **Node.js** (versão 22 ou superior recomendada para suporte ao `node:sqlite`).
- **npm** (incluso com o Node.js).

---

### 1️⃣ Configurando o Backend

1. Abra o terminal e acesse a pasta do backend:
   ```bash
   cd "SimpleTournaments/backend"
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
   > O servidor iniciará em: `http://localhost:3000`

---

### 2️⃣ Configurando o Frontend

1. Em outro terminal, acesse a pasta do frontend:
   ```bash
   cd "SimpleTournaments/frontend"
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor Vite:
   ```bash
   npm run dev
   ```
   > A aplicação estará acessível em: `http://localhost:5173`

---

## 📡 Rotas Principais da API

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/usuarios` | Cadastro de novo usuário |
| `POST` | `/login` | Autenticação de usuário |
| `GET` | `/torneios?usuarioId=:id` | Listagem de torneios por usuário |
| `GET` | `/torneios/:id` | Detalhes de um torneio específico |
| `POST` | `/torneios` | Criação de novo torneio |
| `PUT` | `/torneios/:id` | Atualização de dados/status do torneio |
| `DELETE` | `/torneios/:id` | Remoção de torneio e seus dados |
| `GET` | `/participantes?torneioId=:id` | Listagem de participantes do torneio |
| `POST` | `/participantes` | Inscrição de participante |
| `DELETE` | `/participantes/:id` | Remoção de participante |
| `POST` | `/torneios/:id/confrontos` | Geração automática de confrontos |
| `GET` | `/torneios/:id/confrontos` | Listagem de confrontos e classificação |
| `PUT` | `/partidas/:id/placar` | Registro de placar de uma partida |
| `DELETE` | `/torneios/:id/confrontos` | Reset de confrontos do torneio |

---

Projeto desenvolvido para fins acadêmicos na disciplina de Desenvolvimento Web / Projeto Web.  