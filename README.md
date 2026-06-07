# 🏆 SimpleTournaments — Gerenciador de Torneios

## 📋 Ideia do Projeto

O **SimpleTournaments** é uma aplicação fullstack SPA (Single Page Application) para gerenciamento de torneios e competições em geral. O sistema permite criar torneios de qualquer modalidade, cadastrar participantes e gerenciar inscrições.

O projeto segue a arquitetura em camadas ensinada em aula:
- **Backend**: Express.js (TypeScript), seguindo a separação Route → Controller → Service → Model
- **Frontend**: HTML5 semântico + Bootstrap + TypeScript puro (sem frameworks), seguindo a separação Config → API → Services → UI → Main

---

## 🎯 Funcionalidades Principais

- CRUD completo de **Torneios** (criar, listar, editar, remover)
- CRUD completo de **Participantes** (criar, listar, editar, remover)
- **Inscrição** de participantes em torneios (vincular/desvincular)
- Listagem de participantes inscritos por torneio

---

## 🏗️ Classes do Domínio

### 1. `Torneio`
Representa um torneio ou competição.

| Atributo     | Tipo     | Descrição                                       |
|-------------|----------|-------------------------------------------------|
| `id`        | `number` | Identificador único (auto-increment)            |
| `nome`      | `string` | Nome do torneio                                 |
| `descricao` | `string` | Descrição breve do torneio                      |
| `dataInicio`| `string` | Data de início (ISO 8601)                       |
| `status`    | `string` | `"aberto"` · `"em_andamento"` · `"finalizado"`  |
| `criadoEm`  | `string` | Timestamp de criação                            |

---

### 2. `Participante`
Representa um competidor/jogador cadastrado na plataforma.

| Atributo    | Tipo     | Descrição                                       |
|------------|----------|-------------------------------------------------|
| `id`       | `number` | Identificador único (auto-increment)            |
| `nome`     | `string` | Nome do participante                            |
| `email`    | `string` | E-mail de contato                               |
| `criadoEm` | `string` | Timestamp de criação                            |

---

### 3. `Inscricao`
Representa o vínculo de um participante em um torneio (associação N:N).

| Atributo         | Tipo     | Descrição                                  |
|-----------------|----------|--------------------------------------------|
| `id`            | `number` | Identificador único                        |
| `torneioId`     | `number` | FK → Torneio                              |
| `participanteId`| `number` | FK → Participante                          |
| `dataInscricao` | `string` | Data em que o participante se inscreveu    |

---

## ⚙️ Tecnologias

| Camada     | Tecnologia                          |
|-----------|--------------------------------------|
| Backend   | Node.js + Express.js + TypeScript    |
| Frontend  | HTML5 + Bootstrap 5 + TypeScript     |
| Estilo    | Bootstrap 5 + CSS customizado        |
| Build     | `tsc` (TypeScript Compiler)          |
