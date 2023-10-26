# ---- Base Node ----
FROM  node:20-bullseye-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# ---- Run Node----
FROM base AS run
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --production
COPY . .

CMD ["pnpm", "dev"]
