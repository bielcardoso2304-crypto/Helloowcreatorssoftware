# Helloow Creators

Sistema interno da Helloow Creators para cadastro de criadores/influenciadores
filiados. O criador cria uma conta e preenche seu perfil; a equipe Helloow
acessa um painel interno para ver quantos e quais criadores estão cadastrados.

## Stack

Next.js (App Router) + Supabase (Auth + Postgres) + Tailwind CSS.

## Configuração

1. Crie um projeto em [supabase.com](https://supabase.com) (se ainda não tiver um).
2. No SQL Editor do Supabase, rode o conteúdo de `supabase/migrations/0001_init.sql`.
3. Copie `.env.local.example` para `.env.local` e preencha com as chaves do
   seu projeto Supabase (Project Settings → API):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Instale as dependências e rode o servidor de desenvolvimento:

   ```bash
   npm install
   npm run dev
   ```

5. Abra [http://localhost:3000](http://localhost:3000).

## Tornar alguém admin

Por padrão, todo mundo que se cadastra é um "criador". Para dar acesso ao
painel interno (lista de todos os criadores) para alguém da equipe Helloow,
essa pessoa precisa primeiro criar uma conta normalmente pelo app e depois
você roda no SQL Editor do Supabase:

```sql
insert into admins (user_id)
select id from auth.users where email = 'alguem@helloow.com';
```

## Estrutura

- `app/(auth)` — login e cadastro.
- `app/(dashboard)/onboarding` — formulário de perfil (primeiro acesso do criador).
- `app/(dashboard)/perfil` — visualizar/editar o próprio perfil.
- `app/(dashboard)/admin` — painel interno com a lista de todos os criadores (somente admins).
- `supabase/migrations` — schema do banco (tabela `creators`, `admins`, RLS).
