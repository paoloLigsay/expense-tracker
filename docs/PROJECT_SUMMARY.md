# Personal Finance Management System - Project Summary

## Project Overview
A personal finance management application to track expenses across multiple accounts (bank accounts, e-wallets, credit cards) with soft allocation buckets (mental categorization of funds - Emergency Fund, Car Fund, Allowance, etc.).

## Tech Stack (T3 Stack)
- **Frontend**: Next.js + React + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: tRPC (type-safe API)
- **Database ORM**: Prisma
- **Database**: Supabase (PostgreSQL, free tier)
- **State Management**: Zustand
- **Testing**: Playwright + Jest (learn after core features)
- **Deployment**: Vercel

## Core Features (MVP)
1. **Multiple Accounts** - Track different wallets/cards (Bank-A, E-wallet, Credit Card)
2. **Allocations** - Soft buckets within accounts (Emergency Fund, Car Fund, Allowance)
3. **Transactions** - Log income, expenses, and allocation transfers
4. **Balance Tracking** - Derive account balance from allocation sum (no separate balance column)
5. **Filtering & Stats** - Filter by account, allocation, date range; view spending by category

## Database Schema

### Accounts
- `id` (PK)
- `userId` (FK → Users)
- `name` (e.g., "Bank-A", "E-wallet")
- `createdAt`, `updatedAt`

### Allocations
- `id` (PK)
- `accountId` (FK → Accounts)
- `name` (e.g., "Emergency Fund", "Car Fund")
- `amount` (current amount allocated)
- `createdAt`, `updatedAt`

### Transactions
- `id` (PK)
- `userId` (FK → Users)
- `accountId` (FK → Accounts)
- `allocationId` (FK → Allocations)
- `amount`
- `type` (income, expense, transfer)
- `description`
- `date` (DateTime)
- `createdAt`, `updatedAt`

### Categories (Optional, for expense tagging)
- `id` (PK)
- `userId` (FK → Users)
- `name` (e.g., "Food", "Transport")
- `createdAt`, `updatedAt`

### Users
- `id` (PK)
- `email` (unique)
- `name`
- `createdAt`, `updatedAt`

## Key Design Decisions

### Balance Tracking
- **Decision**: Derive account balance from allocations sum, NOT store separately
- **Why**: Single source of truth, automatically consistent, no validation logic needed
- **Tradeoff**: Slightly slower (must sum allocations on read), but acceptable for personal finance scale
- **Calculation**: `Account.balance = SUM(Allocations.amount)`

### Allocation Changes
- **Decision**: Log as transactions, not direct updates
- **Why**: Creates audit trail, enables historical tracking, teaches good patterns
- **How**: When user adds $2k to Emergency Fund, create a transaction that increases allocation

### User Authentication
- **Use**: Supabase Auth (comes with Supabase)
- **Why**: Integrated with database, free, simple setup

## Success Metrics
- Can create accounts
- Can create allocations within accounts
- Can log transactions (income/expense)
- Can see current allocation amounts
- Can filter transactions by date/allocation
- Can calculate total spending per allocation/account
