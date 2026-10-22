# Driptide

Driptide is a pnpm monorepo with a Next.js storefront, NestJS API, shared contracts, and Supabase schema.

## Run locally

From this repository root, install dependencies and start both development servers:

```bash
pnpm install
pnpm dev
```

The storefront runs at [http://localhost:3000](http://localhost:3000), and the API runs at `http://localhost:4000/api/v1`. Starting only `apps/web` leaves cart and catalog API requests without a server.

To start just one service, use separate terminals from the repository root:

```bash
pnpm --filter web dev
pnpm --filter @driptide/api dev
```

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for deployment configuration.
