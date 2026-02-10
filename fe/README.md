# Chart Builder Dashboard

Next.js application для створення та візуалізації графіків на основі даних з Notion.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts 3.7
- **Database**: Supabase (PostgreSQL)
- **External APIs**: Notion API, Supabase
- **i18n**: next-intl (українська, англійська)
- **Code Quality**: Biome (formatter, linter)

## Getting Started

```bash
# Install dependencies
yarn install

# Run development server
yarn dev

# Format code
yarn format

# Build for production
yarn build
```

Відкрийте [http://localhost:3000](http://localhost:3000) у браузері.

---

## Структура Проекту

```
fe/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [locale]/          # Інтернаціоналізація
│   │   │   ├── (auth)/        # Маршрути аутентифікації
│   │   │   │   └── actions.ts # Server actions для auth
│   │   │   ├── (protected)/   # Захищені маршрути (потрібна авторизація)
│   │   │   │   ├── (general)/ # Загальні сторінки (dashboard)
│   │   │   │   └── (builder)/ # Chart builder сторінки
│   │   │   │       └── chart/[id]/edit/
│   │   │   └── layout.tsx
│   │   └── api/               # API routes
│   │
│   ├── components/            # React компоненти
│   │   ├── block/            # Блоки контенту (chart/, table/, etc.)
│   │   ├── ui/               # UI компоненти (shadcn/ui)
│   │   └── *.tsx             # Загальні компоненти
│   │
│   ├── models/               # Моделі даних та репозиторії
│   │   ├── workspace.ts      # WorkspaceRepository
│   │   ├── chart.ts          # ChartRepository
│   │   └── _database.types.ts # Supabase типи
│   │
│   ├── services/             # Бізнес-логіка
│   │   ├── notion.ts         # NotionService (інтеграція з Notion API)
│   │   ├── user.ts           # UserService
│   │   ├── workspace.ts      # WorkspaceService
│   │   └── chart.ts          # ChartService
│   │
│   ├── lib/                  # Утиліти та допоміжні функції
│   │   ├── supabase/         # Supabase клієнти
│   │   │   ├── server.ts     # Server-side клієнт
│   │   │   └── client.ts     # Browser клієнт
│   │   └── utils.ts
│   │
│   ├── hooks/                # Custom React hooks
│   ├── helpers/              # Допоміжні функції
│   └── i18n/                 # Конфігурація інтернаціоналізації
│
├── messages/                 # Переклади
│   ├── en.json              # Англійська
│   └── uk.json              # Українська
│
├── public/                   # Статичні файли
├── biome.json               # Конфігурація Biome
└── tsconfig.json            # TypeScript конфігурація
```

---

## Архітектурні Принципи

### 1. Розділення Server vs Client Components

**Server Components (за замовчуванням)**:
- Всі компоненти в `app/` є Server Components
- Використовуються для:
  - Фетчингу даних
  - Доступу до бази даних
  - Серверної логіки
- Не можуть використовувати hooks (`useState`, `useEffect`)

**Client Components (`"use client"`)**:
- Потрібні для:
  - Інтерактивності (обробники подій)
  - React hooks
  - Browser APIs
- Приклади: `src/components/block/chart/view.tsx`

### 2. Layered Architecture

```
Pages (app/) → Services → Models (Repositories) → Database
                ↓
            Components
```

**Layers**:
1. **Pages** (`src/app/*/page.tsx`) - Server Components, фетчать дані
2. **Services** (`src/services/`) - бізнес-логіка, оркестрація
3. **Models** (`src/models/`) - репозиторії для роботи з БД
4. **Components** (`src/components/`) - UI логіка

### 3. Data Flow Pattern

```typescript
// 1. Page component (Server)
export default async function ChartEditPage({ params, searchParams }) {
  const chart = await chartService.getChart(params.id);
  const { chartData, chartLabels } = await notionService.getChartData(chart);
  
  return <ChartView chartData={chartData} chartLabels={chartLabels} />;
}

// 2. Client Component
"use client";
export function ChartView({ chartData, chartLabels }) {
  // Рендер з props
}
```

**Правила**:
- Дані передаються через props (server → client)
- Не фетчати дані в Client Components
- Використовувати Server Actions для мутацій

---

## Правила Неймінгу

### Файли та Директорії

| Тип | Конвенція | Приклад |
|-----|-----------|---------|
| **React компоненти** | `kebab-case.tsx` | `chart-view.tsx` |
| **Хуки** | `use-*.ts` | `use-chart-data.ts` |
| **Утиліти** | `lowercase.ts` | `utils.ts`, `constants.ts` |
| **Типи/моделі** | `lowercase.ts` | `workspace.ts`, `chart.ts` |
| **Сервіси** | `lowercase.ts` | `notion.ts`, `user.ts` |
| **Server actions** | `actions.ts` | `app/.../actions.ts` |
| **API routes** | `route.ts` | `app/api/.../route.ts` |

### Директорії в App Router

- **Route groups**: `(auth)`, `(protected)`, `(builder)` - не впливають на URL
- **Dynamic routes**: `[id]`, `[locale]` - параметри маршруту
- **Parallel routes**: `@modal` - для модальних вікон

### Код

```typescript
// Компоненти - PascalCase
export function ChartView() {}
export const ChartHeader = () => {}

// Функції - camelCase
export function getChartData() {}
export const formatChartLabel = () => {}

// Класи - PascalCase
export class NotionService {}
export class ChartRepository {}

// Константи - UPPER_SNAKE_CASE або camelCase
export const API_BASE_URL = "...";
export const defaultChartConfig = {...};

// Типи та інтерфейси - PascalCase
export type Chart = {...};
export interface ChartConfig {...}

// Енуми - PascalCase для імені, UPPER_CASE для значень
export enum ChartType {
  BAR = "bar",
  LINE = "line",
}
```

### Database Entities

```typescript
// Таблиці в БД - snake_case (множина)
// users, workspaces, charts, selected_workspace

// Поля в БД - snake_case
// user_id, workspace_id, created_at, notion_token

// TypeScript типи - camelCase (відповідність полям БД)
type Workspace = {
  id: string;
  userId: string;
  notionToken: string;
  createdAt: string;
}
```

---

## Особливості Реалізації

### 1. Інтернаціоналізація (i18n)

- Бібліотека: `next-intl`
- Мови: `en`, `uk`
- Переклади: `messages/uk.json`, `messages/en.json`

```typescript
// В Server Components
import { getTranslations } from 'next-intl/server';

const t = await getTranslations('pages.dashboard');
const title = t('title');

// В Client Components
import { useTranslations } from 'next-intl';

const t = useTranslations('pages.dashboard');
```

### 2. API Logging (Cache Tracking)

Для відстеження кешування Next.js всі API запити логуються:

```typescript
// src/services/notion.ts
fetch: (url, init) => {
  console.log('[Notion API] Fetching:', url);
  const start = Date.now();
  return globalThis.fetch(url, init).then(response => {
    const duration = Date.now() - start;
    const cache = response.headers.get('x-vercel-cache') || 'UNKNOWN';
    console.log(`[Notion API] Response: ${duration}ms [Cache: ${cache}]`);
    return response;
  });
}

// src/lib/supabase/server.ts - аналогічно для Supabase
```

### 3. Charts з Recharts 3.7

```typescript
// Використовуємо responsive prop + Tailwind
<LineChart
  data={data}
  responsive
  accessibilityLayer
  className="w-full aspect-video"
>
  {/* ... */}
</LineChart>

// DEPRECATED: НЕ використовувати ResponsiveContainer в recharts 3.x
```

### 4. Server Actions

Всі мутації виконуються через Server Actions:

```typescript
// src/app/[locale]/(protected)/(general)/dashboard/actions.ts
"use server";

export async function createChart(formData: FormData) {
  const supabase = await createClient();
  // Валідація + логіка
  return { success: true };
}

// Використання в Client Component
import { createChart } from './actions';

function Component() {
  const handleSubmit = async (formData) => {
    const result = await createChart(formData);
  };
}
```

---

## Best Practices

### ✅ DO

- Використовувати Server Components де можливо
- Передавати дані через props (server → client)
- Валідувати дані з `zod` в Server Actions
- Використовувати TypeScript строго
- Логувати API запити для debugging
- Слідувати структурі layers (page → service → model)

### ❌ DON'T

- Не фетчити дані в Client Components
- Не використовувати `"use client"` без потреби
- Не дублювати логіку між services/models
- Не ігнорувати TypeScript помилки
- Не міксувати Server/Client код без розуміння

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Notion
NOTION_CLIENT_ID=
NOTION_CLIENT_SECRET=
NEXT_PUBLIC_NOTION_REDIRECT_URL=

# App
NEXT_PUBLIC_SITE_URL=
```

---

## Scripts

```json
{
  "dev": "next dev",           // Розробка
  "build": "next build",       // Білд для продакшну
  "start": "next start",       // Запуск продакшн білду
  "format": "biome check --write ./src" // Форматування коду
}
```
