FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json ./
RUN npm install

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG API_BASE=http://localhost:3001
ENV API_BASE=$API_BASE
RUN npm run build
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/.output ./.output

EXPOSE 3000
ENV PORT=3000
ENV NITRO_PORT=3000
ENV NODE_ENV=production

CMD ["node", ".output/server/index.mjs"]
