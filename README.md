# Converso — App Mobile

CRM para autônomos. "Converso" = conversa + conversão. App mobile em **React Native (Expo + expo-router, TypeScript)**, recriando o protótipo mobile do Converso: tema escuro por padrão, marca indigo, splash + login, tab bar com FAB central e as telas principais.

Repo irmão de `converso-web/` (Next.js) e `crm-api/` (NestJS).

## Como rodar

```bash
npm install
npx expo start
```

Depois pressione `a` (Android), `i` (iOS) ou `w` (web), ou escaneie o QR code com o app Expo Go.

Copie `.env.example` para `.env` se quiser apontar para uma API local:

```bash
cp .env.example .env
# EXPO_PUBLIC_API_URL=http://localhost:3000
```

## Stack

- Expo SDK 52 / React Native 0.76 (new architecture habilitada)
- expo-router 4 (file-based routing, typed routes)
- react-native-svg (ícones de linha + logo + sparkline)
- @react-native-async-storage/async-storage (token JWT)
- axios (cliente HTTP com interceptor Bearer)
- TypeScript estrito

## O que está implementado

Fluxo completo de navegação e as 5 telas principais com dados mock:

- **Splash** (`app/index.tsx`) — animação do logo, navega para o login após ~1.8s.
- **Login** (`app/login.tsx`) — e-mail/senha + "Continuar com WhatsApp" + link "Criar conta".
- **Cadastro** (`app/register.tsx`) — fluxo de 2 passos (dados + área de atuação).
- **Tabs** (`app/(tabs)/_layout.tsx`) — barra inferior escura com 4 itens (Início, Serviços, Funil, Agenda) e um **FAB central +** que abre uma bottom sheet "Criar novo".
  - **Dashboard** (`dashboard.tsx`) — saudação, hero de receita com meta e sparkline, KPIs, agenda de hoje, resumo do funil e atalhos.
  - **Serviços** (`servicos.tsx`) — busca, filtro por categoria e lista de serviços com status.
  - **Funil** (`funil.tsx`) — kanban horizontal por etapa + bottom sheet para mover negócios (estado local).
  - **Agenda** (`agenda.tsx`) — calendário indicativo do mês + agenda do dia + bottom sheet de novo agendamento.
  - **Perfil** (`perfil.tsx`) — cartão de perfil, grupos de configurações e logout com confirmação.
- **Formulário de serviço** (`app/servico-form.tsx`) — rota modal de criar/editar serviço.

## Design system

- `theme/tokens.ts` — cores (dark default + variante light), raios, fontes, cores de etapa do funil e de categoria, helpers `mix`/`alpha`.
- `components/Icon.tsx` — ícones de linha portados para react-native-svg (mesmo conjunto de nomes do protótipo).
- `components/ui.tsx` — primitivos: `CVButton`, `CVCard`, `Avatar`, `Badge`, `Field`, `SectionHead`, `Wordmark`, `LogoMark`, `StatPill`, `EmptyState`.
- `components/MobileTop.tsx`, `components/Sparkline.tsx` — auxiliares de tela.
- `lib/data.ts` — dados mock tipados (clientes, serviços, etapas, negócios, agenda, KPIs, `fmtBRL`, `clienteById`, `catColor`, `user`, etc.).
- `lib/api.ts` — instância axios usando `EXPO_PUBLIC_API_URL` + token via AsyncStorage e interceptor Bearer.

## Nota sobre a API

As telas usam dados mock de `lib/data.ts`. O cliente `lib/api.ts` já está pronto (base URL via `EXPO_PUBLIC_API_URL`, token Bearer via AsyncStorage) para conectar ao `crm-api`. Login/cadastro hoje apenas navegam; integrar autenticação real é o próximo passo.
