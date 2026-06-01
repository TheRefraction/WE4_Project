# Stage 1 : deps
FROM node:20-alpine AS deps
WORKDIR /app

COPY package*.json ./

RUN npm ci

# Stage 2 : development (hot reload)
FROM node:20-alpine AS development
WORKDIR /app

COPY docker-entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

COPY . .

EXPOSE 3000
ENTRYPOINT ["entrypoint.sh"]
CMD ["npm", "run", "dev"]

# Stage 3 : build TypeScript
FROM deps AS builder

COPY . .

RUN npm run build

# Stage 4 : production
FROM node:20-alpine AS production
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"]