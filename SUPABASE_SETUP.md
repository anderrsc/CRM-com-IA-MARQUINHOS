# Supabase - Marquinhos OS

## 1. Criar o banco

No painel do Supabase, abra **SQL Editor** e execute:

```text
supabase/migrations/20260606133000_initial_schema.sql
```

Esse SQL cria as tabelas principais, `whatsapp_inbox` e `app_records`.

## 2. Configurar variaveis

No Vercel, configure:

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

A `SUPABASE_SERVICE_ROLE_KEY` deve ficar somente no servidor/Vercel, nunca no frontend.

## 3. Como os cadastros salvam

O CRM e os modulos do sistema salvam em `app_records` por colecao:

- `leads`
- `visits`
- `measurementSheets`
- `budgets`
- `productions`
- `installations`
- `knowledgeBase`
- `subscriptions`

A Central IA/WhatsApp salva mensagens em `whatsapp_inbox`.

## 4. Rodar local

```bash
npm install
npm run dev:api
npm run dev
```

Abra:

```text
http://127.0.0.1:5173
```

## 5. Webhook WhatsApp

Configure na Meta:

```text
GET/POST https://seu-dominio.vercel.app/api/whatsapp/webhook
```

O token de verificacao deve ser igual a `WHATSAPP_VERIFY_TOKEN`.
