# CLAUDE.md - Personal Finance Management System

## Project Context
Building a personal finance app (T3 Stack) to track expenses across multiple accounts with soft allocation buckets. Goal: Learn T3 stack deeply while building something genuinely useful.

## Tech Stack & Principles
- **Framework**: Next.js 15+ (App Router, Server Components where possible)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS (utility-first, no custom CSS unless necessary)
- **Backend**: tRPC (type-safe, procedures only - no REST endpoints)
- **ORM**: Prisma (relations, migrations, type safety)
- **Database**: Supabase/PostgreSQL
- **State**: Zustand (client-side only, server state via tRPC)
- **Auth**: Supabase Auth

## Architecture & Patterns

### File Structure
```
src/
├── app/              # Next.js App Router
│   ├── (auth)/       # Auth-related routes
│   ├── dashboard/    # Main app routes (protected)
│   └── layout.tsx
├── server/           # Backend
│   ├── api/          # tRPC router
│   │   ├── root.ts   # Main router
│   │   ├── accounts.ts
│   │   ├── allocations.ts
│   │   └── transactions.ts
│   └── db.ts         # Prisma client
├── client/           # Frontend
│   ├── components/   # React components
│   ├── hooks/        # Custom hooks (useAccounts, useTransactions, etc.)
│   └── stores/       # Zustand stores (ui state, filters)
└── utils/            # Shared utilities
```

### tRPC Procedures
- **Queries**: `accounts.list`, `accounts.getById`, `transactions.list`, etc.
- **Mutations**: `accounts.create`, `transactions.add`, `allocations.update`, etc.
- **Input Validation**: Use Zod for all inputs
- **Error Handling**: Throw tRPC errors with proper status codes

Example:
```typescript
// server/api/accounts.ts
export const accountsRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.account.findMany({ where: { userId: ctx.userId } });
  }),
  create: publicProcedure.input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.account.create({ data: { ...input, userId: ctx.userId } });
    }),
});
```

### Zustand Stores
- **Use for**: UI state only (filters, sorting, modals, loading)
- **Don't use for**: User data (accounts, transactions, allocations)
- **Pattern**: Keep stores small, one concern per store

Example:
```typescript
// client/stores/filterStore.ts
create((set) => ({
  selectedAccountId: null,
  setSelectedAccountId: (id) => set({ selectedAccountId: id }),
}));
```

### Component Organization
- **Page components**: Composition of smaller components, data fetching via tRPC
- **UI components**: Reusable, dumb (props-only, no hooks if possible)
- **Container components**: Handle tRPC calls, state, pass data to UI components

## Core Features & Implementation Order

### Phase 1: Data Layer (Day 2)
- [ ] Prisma schema finalized
- [ ] Database migrations tested
- [ ] Seed data for development (optional)

### Phase 2: API Layer (Day 3)
- [ ] tRPC router setup (accounts, allocations, transactions)
- [ ] Input validation with Zod
- [ ] Error handling

### Phase 3: Frontend (Day 4-5)
- [ ] Account list & create
- [ ] Allocation management (create, edit, view balance)
- [ ] Transaction form (add income/expense)
- [ ] Transaction list with filters
- [ ] Basic stats (total by allocation, by account)

## Design Decisions & Why

### Single Balance Source of Truth
**Decision**: Derive `Account.balance = SUM(Allocations.amount)`, no separate balance column
**Why**: Prevents inconsistency, simpler validation, single source of truth
**Implementation**: Query or cache in frontend/backend

### Transaction-Based Allocations
**Decision**: Every allocation change is a transaction record
**Why**: Creates audit trail, enables history, teaches good patterns
**How**: Transferring $2k to Emergency Fund = create transaction record with type="allocation_transfer"

### No Recurring Transactions (MVP)
**Why**: Adds complexity, not core to learning T3
**When to add**: Only after core features work

### No Complex Budgeting (MVP)
**Why**: Out of scope, focus on tracking first
**Scope**: View spending, not limit spending

## Accuracy & Validation Standards

### Don't Fabricate
- Never assume an API, function, or configuration exists without verifying it first
- Validate facts before implementing (Prisma features, tRPC patterns, library behavior)
- When in doubt, ask or explicitly admit uncertainty rather than guessing
- Don't claim something works until you've actually verified it in the real app
- Read the file/code before editing or making assumptions

### Implementation Approach
- Think critically before executing requests
- Push back if something doesn't align with established structure or makes no sense
- Prioritize correctness over speed

## Code Quality Standards

### TypeScript
- Strict mode enabled
- No `any` types (use `unknown` if needed, then narrow)
- Export types from procedures for frontend use

### Naming
- Variable length matches scope (`i` for loops, `userId` for wider scope)
- Descriptive names for functions: `calculateAllocationBalance`, `filterTransactionsByDateRange`
- Avoid abbreviations unless standard (`db`, `id`, `ctx`)

### Functions
- Keep under 30 lines where practical
- One responsibility per function
- Early returns, avoid deep nesting
- No empty catch blocks

### Comments
- Only comment WHY, never WHAT
- Remove obvious comments like "// Calculate total"
- Only add if non-obvious constraint or workaround

### Error Handling
- Catch errors at boundaries only (API routes, event handlers, external calls)
- Let errors propagate naturally from Prisma/tRPC
- Use tRPC's built-in error handling

## Anti-patterns to Avoid

### Code Quality Anti-patterns
- ❌ No premature abstractions (3 similar lines is OK, don't DRY too early)
- ❌ No over-engineered error handling (catch all errors, only required ones)
- ❌ No "future-proofing" flags or configs (build what's needed now)
- ❌ No long docstrings or multi-line comments
- ❌ No refactoring surrounding code unless asked
- ❌ No adding features to other areas "while you're here"

### Architecture Anti-patterns
- ❌ Don't use REST endpoints, only tRPC
- ❌ Don't store server data in Zustand (use tRPC queries)
- ❌ Don't manually validate input (use Zod in tRPC)
- ❌ Don't create "utility" abstract classes
- ❌ Don't add logging/analytics infrastructure until needed

## Testing & Deployment (Later)

### Testing (After core features)
- Use Playwright for end-to-end flows (create account → add transaction → view balance)
- Use Jest for tRPC procedure logic
- Don't mock database, use real Supabase test instance

### Deployment
- Deploy to Vercel (comes free with Next.js, Supabase has free tier)
- Environment variables: DATABASE_URL, NEXTAUTH_SECRET (via Supabase)
- Before deployment: run migrations, verify env vars

### Docker (Much later)
- Only add if running local Supabase needed
- Use `supabase start` (built-in Docker setup)
- Not needed for learning phase

## Development Workflow

1. **Prisma schema change**: 
   - Modify `prisma/schema.prisma`
   - Run `npx prisma migrate dev --name description`
   - Prisma auto-generates types

2. **tRPC procedure change**:
   - Update `server/api/*.ts`
   - Types auto-sync to frontend via tRPC client

3. **Testing a change**:
   - Run `npm run dev`
   - Test in browser or tRPC devtools
   - Check console for errors

## Success Criteria (MVP Done)
- ✅ Create multiple accounts
- ✅ Create allocations within accounts
- ✅ Log transactions (income/expense/transfer)
- ✅ View current allocation amounts (derived from transactions)
- ✅ Filter transactions by account/allocation/date
- ✅ Calculate spending totals
- ✅ Responsive UI (works on mobile)
- ✅ Authentication (login/logout)

## Learning Goals
- Master Prisma relations & migrations
- Understand tRPC end-to-end type safety
- Build real components (forms, lists, filters)
- Learn Zustand for UI state
- See how T3 pieces fit together
