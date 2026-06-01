# Services

## Containers

| Service | Image | Description |
|---|---|---|
| `frontend` | Custom (`nginx:alpine`) | Serves compiled SPA from `/usr/share/nginx/html`. Proxies `/api/` to `backend:3000` via `nginx.conf`. |
| `frontend-dev` | Custom (dev target) | Runs `ng serve` on port 4200. Mounts local `src/` and `public/` for hot reload. |
| `backend` | Custom (prod target) | Runs compiled Node app on port 3000. Reads secrets from `.env` via `env_file`. |
| `backend-dev` | Custom (dev target) | Runs `npm run dev` (`tsx watch`) on port 3000. Mounts local `backend/` for hot reload. |
| `postgres` | `postgres:16-alpine` | Persists DB files in `postgres-data` volume. Exposes port 5432. |
| `mongo` | `mongo:7` | Persists DB files in `mongodb-data` volume. Exposes port 27017. |

Container names are prefixed `efes-` (e.g. `frontend` → `efes-frontend`).

## Ports

Host ports are set in your `.env` as `DOCKER_PORT_*` variables. Container-side ports are fixed.

| Service | Host | Container |
|---|---|---|
| Frontend (prod) | `DOCKER_PORT_FRONTEND` | `80` (Nginx) |
| Frontend (dev) | `DOCKER_PORT_FRONTEND` | `4200` (ng serve) |
| Backend | `DOCKER_PORT_BACKEND` | `3000` |
| Postgres | `DOCKER_PORT_POSTGRES` | `5432` |
| Mongo | `DOCKER_PORT_MONGO` | `27017` |

> **Note:** Inside the Docker network, services talk to each other by service name (e.g. `http://backend:3000`), not `localhost`.

## Volumes

| Volume | Mounted to | Purpose |
|---|---|---|
| `postgres-data` | `/var/lib/postgresql/data` | Persist Postgres DB files |
| `mongodb-data` | `/data/db` | Persist Mongo DB files |
| `backend_node_modules` | `/app/node_modules` | Preserve node_modules across dev rebuilds |

Local mounts used in dev:

| Local path | Container path | Service |
|---|---|---|
| `./frontend/src` | `/app/src` | `frontend-dev` |
| `./frontend/public` | `/app/public` | `frontend-dev` |
| `./backend` | `/app` | `backend-dev` |

## Network

All services share the custom bridge network `app-network`. Cross-container DNS is automatic — e.g. `frontend-dev` can reach the backend at `http://backend:3000`.

## Healthchecks & startup order

- **Postgres** — `pg_isready` healthcheck (see `docker-compose.yml`)
- **Mongo** — `mongosh ping` healthcheck
- `backend` and `backend-dev` both declare `depends_on` with `condition: service_healthy`, so Compose waits for DB readiness before starting them.

## How the frontend reaches the API

| Mode | Mechanism |
|---|---|
| **Production** | Nginx proxies `/api/` → `http://backend:3000/api/` (see `nginx.conf`) |
| **Dev** | `proxy.conf.json` forwards `/api` → `http://backend:3000` (see `proxy.conf.json`) |

Browser JS should always call same-origin paths like `/api/health`. The dev server or Nginx forwards the request to the backend. Do **not** call container names directly from the browser — `http://backend:3000` is only reachable inside Docker.

## Dev vs. production

| | Dev | Production |
|---|---|---|
| **Frontend** | `ng serve` with source mounts | Pre-built SPA served by Nginx |
| **Backend** | `tsx watch` with source mounts | Compiled Node app from `dist/` |
| **Start command** | `docker compose --profile dev up --build` | `docker compose up --build` |

# Commands
Open a terminal window from the project root and make sure Docker Desktop is started.

## Start

| Description | Command |
|---|---|
| Launch full dev environment | `docker compose --profile dev up --build` |
| Launch production services only | `docker compose up --build` |
| Launch in background (detached mode) | `docker compose --profile dev up -d --build` |
| Launch a single service (and dependencies) | `docker compose --profile dev up backend-dev` |

## Build

| Description | Command |
|---|---|
| Build all images | `docker compose build` |
| Build a specific image | `docker compose build frontend` |
| Rebuild without cache | `docker compose build --no-cache` |

## Stop

| Description | Command |
|---|---|
| Stop all containers | `docker compose stop` |
| Stop a specific service | `docker compose stop frontend-dev` |
| Delete containers | `docker compose down` |
| Delete containers **and** volumes | `docker compose down -v` |

## Logs

| Description | Command |
|---|---|
| View all logs | `docker compose logs` |
| Follow logs in real time | `docker compose logs -f` |
| Follow logs for a specific service | `docker compose logs -f postgres` |

## Shell

| Description | Command |
|---|---|
| Open a shell in a container | `docker compose exec frontend-dev sh` |
| Run a command in a container | `docker compose exec frontend-dev <cmd>` |

## Status

| Description | Command |
|---|---|
| View all running services | `docker compose ps` |
| View detailed status of a service | `docker compose ps backend-dev` |

## Restart

| Description | Command |
|---|---|
| Restart all services | `docker compose restart` |
| Restart a specific service | `docker compose restart frontend-dev` |

## Cleanup

| Description | Command |
|---|---|
| Delete a stopped container | `docker compose rm` |
| Force delete a container | `docker compose rm -f` |
| Recreate a specific service | `docker compose up -d --force-recreate frontend-dev` |