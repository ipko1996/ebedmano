FROM node:lts-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

ENV HOST=0.0.0.0
ENV PORT=3001

WORKDIR /src

# RUN addgroup --system farmer && \
#   adduser --system --group farmer

COPY . .

# RUN chown -R farmer:farmer .

# RUN pnpm config set store-dir ./.pnpm-store
# RUN --mount=type=cache,id=pnpm-store,target=./.pnpm-store
RUN pnpm install --frozen-lockfile --prefer-frozen-lockfile
RUN pnpm dlx prisma generate
RUN pnpm exec nx run farmer:build



WORKDIR /src/dist/apps/farmer

EXPOSE 3001
CMD [ "node", "main.js" ]
