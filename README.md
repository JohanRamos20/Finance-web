# Finance Web

Aplicação web de finanças pessoais: dashboard com gráficos, controle de transações e metas de economia. Frontend em Next.js consumindo uma API própria (Node/Express/Prisma), com autenticação via JWT em cookie httpOnly.

## Tecnologias utilizadas

- [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/) (tokens de tema via `@theme`, sem `tailwind.config.js`)
- [Recharts](https://recharts.org/) — gráfico de receitas x despesas do Dashboard
- [date-fns](https://date-fns.org/) — formatação de datas (locale `pt-BR`)
- [clsx](https://github.com/lukeed/clsx) — composição condicional de classes
- [ESLint](https://eslint.org/) (`eslint-config-next`)

## Arquitetura

O projeto segue uma separação por responsabilidade dentro de `src/`, descrita na seção de estrutura abaixo. Alguns pontos importantes:

- **Autenticação via cookie httpOnly**: o backend define o JWT num cookie `httpOnly` (não acessível via JavaScript). Por isso, todo dado autenticado é buscado **client-side** (`"use client"` + `fetch` com `credentials: "include"`), já que Server Components não têm acesso ao cookie da mesma forma. Não há dados sensíveis (como o token) armazenados no `localStorage` — apenas um cache não sensível do usuário logado (nome/e-mail) para exibir na sidebar sem precisar de um endpoint `/me`.
- **Rotas protegidas via `proxy.ts`**: o Next 16 substitui o antigo `middleware.ts` por `proxy.ts`. Ele verifica apenas a *presença* do cookie `token` para redirecionar `/`, `/transacoes` e `/metas` para `/login` quando ausente — a validação de fato (assinatura/expiração) acontece no backend a cada requisição.
- **Camada `api/` centralizada por domínio**: todo `fetch` passa por `api/client.ts`, que centraliza a URL base, o `credentials: "include"`, o parsing padronizado de erros (`ApiError`) e o redirecionamento automático para `/login` em respostas `401`. Cada arquivo em `api/` (`user`, `transaction`, `wallet`, `goal`) expõe só as funções daquele domínio, todas finas sobre esse client.
- **`type/` espelha os DTOs reais do backend** — os tipos foram ajustados ao contrato real da API (enums de categoria, formato de resposta, campos opcionais), não ao mock de design original.
- **Componentização em camadas**: `components/ui` guarda primitivos reutilizáveis e sem lógica de negócio (`Button`, `Input`, `Select`, `Textarea`, `Modal`, `Card`, ícones); as demais pastas de `components/` agrupam componentes específicos de cada funcionalidade (`auth`, `dashboard`, `transactions`, `goals`, `layout`); `screens/` contém o conteúdo de cada página completa, e `app/` só faz o roteamento (`export { default } from "@/screens/..."`).
- **Eventos globais leves**: o botão "+" de nova transação vive no `AppShell` (visível em todas as páginas autenticadas). Ao criar uma transação, ele dispara um evento (`src/lib/events.ts`) que o Dashboard e a página de Transações escutam para se atualizar sozinhos, sem acoplar esses componentes entre si.

## Estrutura de pastas

```
src/
├── api/          # Requisições HTTP, uma função por operação, agrupadas por domínio
│   ├── client.ts     # fetch centralizado (base URL, cookies, ApiError, 401 → /login)
│   ├── user.ts        # login, cadastro, troca de senha, logout
│   ├── session.ts      # cache não sensível do usuário logado (nome/e-mail)
│   ├── transaction.ts  # listar/criar transações
│   ├── wallet.ts       # saldo da carteira
│   └── goal.ts          # listar/criar/aportar/excluir metas
├── app/          # Rotas do Next.js (App Router) — só re-exportam telas de screens/
│   ├── login/, cadastro/
│   └── (app)/    # Grupo de rotas autenticadas, com o AppShell (sidebar + FAB)
│       ├── page.tsx           # "/"          → Dashboard
│       ├── transacoes/page.tsx
│       └── metas/page.tsx
├── components/
│   ├── ui/            # Primitivos: Button, Input, Select, Textarea, Modal, Card, icons
│   ├── layout/          # Sidebar, AppShell, ícones de navegação
│   ├── auth/             # Formulários e layout de Login/Cadastro
│   ├── dashboard/        # Cards, gráfico, destaque de metas, transações recentes
│   ├── transactions/     # Tabela e filtros de transações (reaproveitados no Dashboard)
│   └── goals/             # Card de meta e modais de criar/aportar/excluir
├── screens/       # Conteúdo de cada página (LoginPage, DashboardPage, TransactionsPage, ...)
├── type/          # Tipos TypeScript espelhando os DTOs do backend
├── lib/           # Funções puras: formatação de moeda, cálculos de gráfico/totais, eventos
├── styles/        # theme.css — tokens de cor/tema do Tailwind v4
└── proxy.ts       # Middleware de auth (redireciona não-autenticados para /login)
```

## Como rodar

### Pré-requisitos

- Node.js 20.9 ou superior
- O [backend](../Back-end/API) desta aplicação rodando localmente em `http://localhost:3000` (Express + Prisma + PostgreSQL + Redis) — este repositório só cobre o frontend, consulte o `BACKEND_GUIDE.md` do backend para subi-lo.

### Variáveis de ambiente

Crie um arquivo `.env` na raiz com:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Instalação e execução

```bash
npm install

npm run dev     # http://localhost:8080 — servidor de desenvolvimento (Turbopack)
npm run build   # build de produção
npm run start   # sobe o build de produção na porta 8080
npm run lint    # ESLint
```

> O frontend roda fixo na porta **8080** (`next dev -p 8080` / `next start -p 8080`), pois é a origem liberada no CORS do backend.

## Funcionalidades

- **Autenticação**: cadastro, login (JWT em cookie httpOnly) e logout. Rotas autenticadas redirecionam para `/login` quando não há sessão; usuário autenticado é levado direto para o Dashboard.
- **Dashboard**: cards de saldo atual, receitas/despesas/economia do mês, gráfico de receitas x despesas dos últimos 6 meses, destaque das metas em andamento e lista das últimas transações — tudo calculado a partir das transações reais do usuário.
- **Transações**: histórico completo, com busca por texto (descrição/categoria) e filtro por tipo (Todas/Receitas/Despesas). Criação de novas transações pelo botão flutuante, disponível em qualquer página autenticada.
- **Metas**: grid de metas com barra de progresso e percentual atingido, criação de novas metas (nome, valor alvo e descrição opcional), aporte de valores numa meta existente e exclusão com confirmação.
- **Sidebar** comum a todas as páginas autenticadas, com navegação entre Dashboard/Transações/Metas, nome do usuário logado e opção de sair.
