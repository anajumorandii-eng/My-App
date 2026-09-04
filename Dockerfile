FROM node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

# As dependências de runtime são instaladas à parte: sem isso a imagem final
# levava Vite, TypeScript, Playwright, Vitest e jsdom junto pra produção.
FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
COPY package.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
USER node
EXPOSE 8080
CMD ["node", "dist/server.cjs"]
