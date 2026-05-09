# manage.ps1

[CmdletBinding(DefaultParameterSetName='Action')]
param(
    [Parameter(Mandatory=$false, Position=0, ParameterSetName='Action')]
    [ValidateSet('start','stop','destroy','build','force-build','backup','migrate','repair')]
    [string]$Action,

    [Parameter(Mandatory=$false, ParameterSetName='Help')]
    [switch]$Help
)

function Write-Color($color, $message) {
    Write-Host $message -ForegroundColor $color
}

function Show-Help {
    $helpText = @"
Use: .\manage.ps1 [-Action] <action> [-Help]

Available actions:
    start         Start all services
    stop          Stop all services
    destroy       Delete services and volumes (data loss!)
    build         Build services images
    force-build   Build services images without using the cache
    backup        Back the database up in a .sql file
    migrate       Migrate the current database to a newer schema version
    repair        Repair the Flyway table

Options:
    -Help         Displays some help

Examples:
    .\manage.ps1 start
    .\manage.ps1 backup
    .\manage.ps1 -Action migrate
"@
    Write-Host $helpText
}

# Help or no action specified
if ($Help -or [string]::IsNullOrEmpty($Action)) {
    Show-Help
    exit 0
}

function Test-DockerRunning {
    try {
        $output = docker info 2>&1
        if ($LASTEXITCODE -eq 0) {
            return $true
        } else {
            Write-Color Red "Docker cannot be accessed. Please ensure Docker Desktop has been started beforehand."
            return $false
        }
    }
    catch {
        Write-Color Red "Could not run 'docker info' : $_"
        return $false
    }
}

# Check if Docker is running
if (-not (Test-DockerRunning)) {
    exit 1
}

# Load environment variables from .env
if (Test-Path .env) {
    Get-Content .env | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.*)$') {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2], 'Process')
        }
    }
} else {
    Write-Color Red "Environment file .env has not been found!"
    exit 1
}

switch ($Action) {
    'start' {
        Write-Color Green "Starting containers..."
        docker-compose up -d
    }
    'stop' {
        Write-Color Green "Stopping containers..."
        docker-compose down
    }
    'destroy' {
        Write-Color Red "Deletion of containers and volumes (all data will be lost!)"
        $confirmation = Read-Host "Proceed? (y/N)"
        if ($confirmation -eq 'y' -or $confirmation -eq 'Y') {
            docker-compose down -v
        } else {
            Write-Host "Operation cancelled."
        }
    }
    'build' {
        Write-Color Green "Building services..."
        docker-compose build
    }
    'force-build' {
        Write-Color Green "Building services (no cache)..."
        docker-compose build --no-cache
    }
    'backup' {
        Write-Color Green "Database backup in progress..."

	$backupDir = "db\backups"
	if (-not (Test-Path $backupDir)) {
	    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
	}

        $backupFile = "$backupDir\backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql"
        $mysqlContainer = docker-compose ps -q mysql
        if (-not $mysqlContainer) {
            Write-Color Red "MySQL service has not been found. Please ensure it has been started beforehand."
            exit 1
        }
        docker exec $mysqlContainer mysqldump -u root -p"${env:MYSQL_ROOT_PASSWORD}" efes_db > $backupFile
        if ($LASTEXITCODE -eq 0) {
            Write-Color Green "Backup has been successful: $backupFile"
        } else {
            Write-Color Red "An error occurred!"
        }
    }
    'migrate' {
        Write-Color Green "Migrations are being applied..."
        docker-compose run --rm flyway
    }
	'repair' {
		Write-Color Green "Repairing Flyway table"
		docker-compose run --rm flyway repair
	}
    default {
        Write-Color Red "Unknown argument. Please use -Help for more info."
        exit 1
    }
}
