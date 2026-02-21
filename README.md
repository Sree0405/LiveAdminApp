# LifeAdmin Pro

Production-ready mobile app for life admin: records, renewals, expenses, reminders, and analytics. Built with React Native (Expo), TypeScript, and offline-first SQLite.

## Tech Stack

- **React Native** with **Expo** (SDK 54, managed workflow)
- **TypeScript**
- **Expo Router** (file-based navigation)
- **Expo SQLite** – offline database
- **Expo File System** – document storage
- **Expo Document Picker** – attach photos/PDFs
- **Expo Camera** – scanning (optional)
- **Expo Notifications** – reminders
- **Expo Local Authentication** – biometrics
- **Expo Secure Store** – PIN/sensitive data
- **Expo Print** – PDF export
- **Expo Sharing** – share PDF
- **Reanimated** – animations

## Project Structure

```
src/
├── app/              # (Expo Router uses /app at root)
├── components/       # Card, Button, Input, ErrorBoundary
├── screens/          # LockScreen
├── database/         # SQLite init, records, expenses, settings
├── hooks/            # useRecords, useExpenses, useDashboard
├── services/         # storage, reminders, security, pdfExport, autoRenew
├── utils/            # dates, validation
├── theme/            # light/dark theme, accent, spacing
├── context/          # AppContext (theme, lock state)
└── assets/

app/
├── _layout.tsx       # Root: AppProvider, ErrorBoundary, LockScreen
├── (tabs)/
│   ├── _layout.tsx   # Bottom tabs (6)
│   ├── index.tsx    # Dashboard
│   ├── records.tsx  # Records list
│   ├── add.tsx      # Add record
│   ├── expenses.tsx # Expenses list
│   ├── analytics.tsx# Analytics charts
│   └── settings.tsx # Theme, lock, PDF export, reminders
├── record/[id].tsx   # Record detail + attach + expenses
├── expense/add.tsx   # Log expense
└── modal.tsx
```

## Features

- **Dashboard** – Upcoming, overdue, expense summary
- **Records** – CRUD, categories, due dates, repeat presets (1/3/6/12 months)
- **Attach** – Photos and PDFs via document picker; path stored in SQLite
- **Reminders** – 30d, 7d, 3d, 1d, due date; enable in Settings
- **Expenses** – Log per record; view in record detail and Expenses tab
- **Analytics** – Record count and expenses-by-month bars
- **PDF export** – Records + expenses to PDF and share
- **App lock** – PIN + biometrics (Secure Store + Local Authentication)
- **Offline-first** – SQLite and local file storage
- **Auto-renew** – Optional repeat types advance due date when past due
- **Dark/Light/System** theme

## Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo Go (device or simulator)

### Install

```bash
cd LifeAdminPro
npm install
```

### Run

```bash
# Start dev server
npx expo start

# Android
npx expo start --android

# iOS
npx expo start --ios
```

Scan QR with Expo Go or use simulator.

## Build & Deploy

### EAS Build (recommended)

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android
eas build --platform ios
```

### Local production build (Android)

```bash
npx expo run:android
```

### Local production build (iOS)

```bash
npx expo run:ios
```

### Environment

- No env vars required for core features.
- For EAS Submit: configure credentials in EAS (e.g. `eas credentials`).

## Database

- **SQLite** via `expo-sqlite`; DB name: `lifeadminpro.db`.
- **Tables**: `records`, `expenses`, `settings`.
- **Migrations**: Schema is created in `src/database/init.ts` on first open. For future migrations, add version checks and `ALTER TABLE` / new tables in a separate migration step.

## Permissions

- **Notifications** – requested when user taps “Enable reminders” in Settings.
- **Camera** – optional; add when using Expo Camera for scanning.
- **Storage** – document picker and file system use app scoped storage.

## Quality

- TypeScript strict mode
- Error boundaries at root
- Input validation (dates, amounts)
- Defensive checks and try/catch in async flows
- Expo-compatible dependencies only

## License

Private / portfolio use.
