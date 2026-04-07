#!/usr/bin/env bash

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Global variable for compose command (set later)
COMPOSE_CMD=""

# ------------------------------------------------------------
# Helper functions
# ------------------------------------------------------------
color_echo() {
    local color="$1"
    local message="$2"
    echo -e "${color}${message}${NC}"
}

show_help() {
    cat <<EOF
Use: ./manage.sh [ACTION] [-h|--help]

Available actions:
    start         Start all services
    stop          Stop all services
    destroy       Delete services and volumes (data loss!)
    build         Build services images
    force-build   Build services images without using the cache
    backup        Back the database up in a .sql file
    migrate       Migrate the current database to a newer schema version

Options:
    -h, --help    Displays this help

Examples:
    ./manage.sh start
    ./manage.sh backup
    ./manage.sh migrate
EOF
}

test_docker_running() {
    if docker info >/dev/null 2>&1; then
        return 0
    else
        color_echo "$RED" "Docker cannot be accessed. Please ensure Docker daemon is running."
        return 1
    fi
}

load_env() {
    if [[ -f .env ]]; then
        set -a
        # shellcheck source=/dev/null
        source .env
        set +a
    else
        color_echo "$RED" "Environment file .env has not been found!"
        exit 1
    fi
}

# Determine which compose command to use (docker-compose or docker compose)
detect_compose_cmd() {
    if command -v docker-compose &> /dev/null; then
        COMPOSE_CMD="docker-compose"
    elif docker compose version &> /dev/null; then
        COMPOSE_CMD="docker compose"
    else
        color_echo "$RED" "Neither 'docker-compose' nor 'docker compose' found. Please install Docker Compose."
        exit 1
    fi
}

# ------------------------------------------------------------
# Action implementations
# ------------------------------------------------------------
do_start() {
    color_echo "$GREEN" "Starting containers..."
    $COMPOSE_CMD up -d
}

do_stop() {
    color_echo "$GREEN" "Stopping containers..."
    $COMPOSE_CMD down
}

do_destroy() {
    color_echo "$RED" "Deletion of containers and volumes (all data will be lost!)"
    read -rp "Proceed? (y/N) " confirmation
    if [[ "$confirmation" =~ ^[Yy]$ ]]; then
        $COMPOSE_CMD down -v
    else
        echo "Operation cancelled."
    fi
}

do_build() {
    color_echo "$GREEN" "Building services..."
    $COMPOSE_CMD build
}

do_force_build() {
    color_echo "$GREEN" "Building services (no cache)..."
    $COMPOSE_CMD build --no-cache
}

do_backup() {
    color_echo "$GREEN" "Database backup in progress..."

    local backup_dir="db/backups"
    mkdir -p "$backup_dir"

    local backup_file="$backup_dir/backup_$(date +'%Y%m%d_%H%M%S').sql"
    local mysql_container
    mysql_container=$($COMPOSE_CMD ps -q mysql 2>/dev/null || true)

    if [[ -z "$mysql_container" ]]; then
        color_echo "$RED" "MySQL service container not found. Please ensure it has been started."
        exit 1
    fi

    if [[ -z "${MYSQL_ROOT_PASSWORD:-}" ]]; then
        color_echo "$RED" "MYSQL_ROOT_PASSWORD is not set in .env file."
        exit 1
    fi

    docker exec "$mysql_container" mysqldump -u root -p"${MYSQL_ROOT_PASSWORD}" efes_db > "$backup_file"
    if [[ $? -eq 0 ]]; then
        color_echo "$GREEN" "Backup successful: $backup_file"
    else
        color_echo "$RED" "An error occurred during backup!"
        exit 1
    fi
}

do_migrate() {
    color_echo "$GREEN" "Migrations are being applied..."
    $COMPOSE_CMD run --rm flyway
}

# ------------------------------------------------------------
# Main script logic
# ------------------------------------------------------------
main() {
    # No arguments or -h/--help
    if [[ $# -eq 0 ]] || [[ "$1" == "-h" ]] || [[ "$1" == "--help" ]]; then
        show_help
        exit 0
    fi

    # Handle -Action <action> or just <action> (positional)
    local action=""
    if [[ "$1" == "-Action" ]] && [[ $# -ge 2 ]]; then
        action="$2"
    else
        action="$1"
    fi

    # Validate action
    case "$action" in
        start|stop|destroy|build|force-build|backup|migrate)
            ;;
        *)
            color_echo "$RED" "Unknown action '$action'. Use -h or --help for usage."
            exit 1
            ;;
    esac

    # Prerequisites
    detect_compose_cmd
    test_docker_running || exit 1
    load_env

    # Execute requested action
    case "$action" in
        start)       do_start ;;
        stop)        do_stop ;;
        destroy)     do_destroy ;;
        build)       do_build ;;
        force-build) do_force_build ;;
        backup)      do_backup ;;
        migrate)     do_migrate ;;
    esac
}

main "$@"
