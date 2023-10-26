FROM node:20-bullseye-slim
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY package.json  pnpm-lock.yaml ./
RUN pnpm install --production
COPY . .
RUN pnpm run build
ENV NODE_ENV production

# Run the server
CMD [ "node", "dist/index.js" ]
