This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Configurazione accesso staff

Imposta queste variabili ambiente su locale e su Vercel:

- `STAFF_ACCESS_CODE`: codice usato dallo staff nella pagina `/staff-login`
- `STAFF_SESSION_TOKEN` (opzionale ma consigliato): token usato per il cookie server-side

Esempio:

```bash
STAFF_ACCESS_CODE=un_codice_lungo_e_sicuro
STAFF_SESSION_TOKEN=un_token_diverso_dal_codice
```

Le pagine `/dashboard` e `/admin` e le API di modifica (barbieri, slot, cancellazione prenotazioni) sono accessibili solo con sessione staff attiva.

### Tabella staff users (necessaria)

Per login con `username + codice`, crea in Supabase la tabella `staff_users`:

```sql
create table if not exists public.staff_users (
	id bigint generated always as identity primary key,
	username text not null unique,
	password_hash text not null,
	created_at timestamptz not null default now()
);
```

Poi puoi creare il primo utente staff con lo script locale:

```bash
NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... node scripts/create_staff_user.js example_admin ChangeMe123!
```

Se ricevi errore "Could not find the table 'public.staff_users'", la tabella non e ancora stata creata nel progetto Supabase corretto.

### Policy Supabase (RLS)

Applica anche le policy RLS dal file [supabase/policies.sql](supabase/policies.sql).

Scelta consigliata per sicurezza:

- `staff_users`: nessun accesso pubblico (`anon`/`authenticated` bloccati), accesso solo server con `SUPABASE_SERVICE_ROLE_KEY`
- `slot_overrides`: lettura pubblica consentita, scrittura solo server (service role)

Se usi API server-side per operazioni sensibili (`/api/staff/*`, CRUD admin), configura in `.env.local` anche:

```bash
SUPABASE_SERVICE_ROLE_KEY=...
```

## Gestione slot orari per data

Per abilitare aggiunta/rimozione slot giornalieri, crea la tabella `slot_overrides` in Supabase:

```sql
create table if not exists public.slot_overrides (
	id bigint generated always as identity primary key,
	slot_date date not null,
	slot_time text not null,
	is_available boolean not null,
	created_at timestamptz not null default now(),
	unique (slot_date, slot_time)
);
```

Effetto nel booking:

- slot standard disattivati in un giorno non compaiono ai clienti
- slot extra aggiunti in un giorno compaiono ai clienti
- gli slot gia prenotati non sono selezionabili

## PWA su mobile

- Android: il browser puo mostrare il prompt installazione in modo non immediato o non ripetuto spesso
- iOS Safari: non esiste prompt automatico, serve usare Condividi > Aggiungi a Home

Nell'app e stato aggiunto un banner installabile che guida sia Android sia iOS per rendere il comportamento piu chiaro.

## Promemoria WhatsApp automatico

Il reminder giornaliero usa il cron di Vercel su [src/app/api/barbers/cron/route.ts](src/app/api/barbers/cron/route.ts) e deve puntare a:

- `NEXT_PUBLIC_SITE_URL` impostata sul dominio vero in produzione
- `CRON_SECRET` opzionale ma consigliato per proteggere l'endpoint

Il cron e schedulato su `vercel.json` alle 08:00 e invia il promemoria alle prenotazioni confermate della giornata.

Variabili da mettere su Vercel:

```bash
NEXT_PUBLIC_SITE_URL=https://tuodominio.it
CRON_SECRET=un_token_lungo_e_sicuro
GREENAPI_URL=https://7107.api.greenapi.com
GREENAPI_ID_INSTANCE=...
GREENAPI_TOKEN=...
```

## QR Code per prenotazioni

Il barbiere puo raggiungere il QR code su:

- Pagina interattiva: `/qr` (visibile, scaricabile, condivisibile)
- Immagine PNG pura: `/api/qr` (per integrazioni)

Il QR punta sempre alla home `/` dove i clienti prenotano. Perfetto da:
- Stampare e mettere in negozio
- Condividere su Instagram
- Mettere su WhatsApp
