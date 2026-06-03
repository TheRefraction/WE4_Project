# Stage 1: Install deps (shared)
FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm ci

# Stage 2: Development
FROM deps AS development

COPY . .

EXPOSE 4200

CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--poll", "500"]

# Stage 3: Build for production
FROM deps AS builder

COPY . .

RUN npm run build -- --configuration production

# Stage 4: Production (final, smallest image)
FROM nginx:alpine AS production

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]