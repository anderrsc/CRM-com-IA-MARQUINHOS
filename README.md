# Marquinhos OS CRM

Sistema CRM/ERP para atendimento, cadastro de clientes, agenda, orcamentos, producao, instalacao e base de conhecimento.

## Rodar localmente

```bash
npm install
npm run dev:api
npm run dev
```

Abra:

```text
http://127.0.0.1:5173
```

Login de demonstracao:

```text
admin@marquinhosos.com
123456
```

## Banco de dados

Execute no Supabase o arquivo:

```text
supabase/migrations/20260606133000_initial_schema.sql
```

Os cadastros principais ficam salvos em `app_records` por colecao:

- `leads`
- `visits`
- `measurementSheets`
- `budgets`
- `productions`
- `installations`
- `knowledgeBase`
- `subscriptions`

A caixa de entrada do WhatsApp usa `whatsapp_inbox`.

## Variaveis no Vercel

Configure em **Project Settings > Environment Variables**:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
WHATSAPP_GRAPH_VERSION=v23.0
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_TOKEN=
WHATSAPP_VERIFY_TOKEN=troque-este-token
WHATSAPP_AUTO_REPLY=false
```

Nao configure `VITE_API_BASE_URL` no Vercel. Em producao o frontend usa `/api` no proprio dominio.

## Deploy Vercel

- Build command: `npm run build`
- Output directory: `dist`
- Framework: Vite

O arquivo `vercel.json` ja define o build e preserva as rotas `/api`.
