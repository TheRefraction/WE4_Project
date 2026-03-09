# WE4X-SI40 Project
Group n°10.

## Getting Started
The following tutorial applies on Windows 10 or later. 

### Requirements
- WSL 2
- Docker Desktop
- PhpStorm
- Git

#### Install WSL
1. Make sure hardware virtualization support is enabled in your BIOS 
2. Run the following command in PowerShell as Administrator `wsl --install` and restart your computer. 
Please make sure the following Windows features are being installed:
    - Virtual Machine Platform
    - Windows Subsystem for Linux (WSL)
3. Install a Linux distro using the following command `wsl --install [Distro]` where `[Distro]`
is the name. To view all distributions available for download, enter `wsl --list --online`
4. Configure the Linux distro you chose by supplying a UNIX login and update the system

#### Install Docker Desktop
1. Download the Docker Desktop installer either from the official [Docker website](https://www.docker.com/) 
or using winget (Windows Package Manager) in PowerShell `winget install Docker.DockerDesktop`.
2. On the setup screen, please ensure you select `Use WSL 2` instead of `Hyper-V`
3. When starting Docker for the first time, accept the subscription service agreement. 
You do not need to create an account, working locally is enough
4. Finally Docker will initialize. This may take a few minutes on first launch

#### Install PhpStorm
1. Go on the official [Jetbrains PhpStorm website](https://www.jetbrains.com/fr-fr/phpstorm/) and
download the installer
2. Proceed with installing PhpStorm then log into your account to activate your license

#### Install Git
Trivial

### Project Setup
1. Clone the repo: `git clone https://github.com/TheRefraction/WE4_Project.git` 
and open it in PhpStorm
2. Copy the env file example `.env.example` to `.env` and fill in your values. 
This file should **NEVER** be committed to GitHub
3. Start containers by running the following command from the project folder
`docker compose up -d`. This may take a while the first time
4. Open http://localhost:8080 to view the website

### PhpStorm Setup
#### Set the PHP Interpreter
1. Go to `Settings > PHP`
2. Next to `CLI Interpreter`, click `...`
3. Click `+ > From Docker, ...`
4. Select `Docker Compose`
5. Set:
   - Server: Docker
   - Configuration files: `./docker-compose.yml`
   - Service: `php`
6. Apply and confirm

#### Database Link Configuration
1. On the right panel, click on the `Database` icon
2. Click on the `+` icon and select `MySQL` data source
3. Set host to `localhost`, port to `3306`, and provide login information
as well as the database name
4. Install drivers if prompted
5. Test the connection and save

You may now view the database using the right panel.

## Useful Notes
If you have configured everything correctly, you should have `Connected to MySQL successfully!`
appear on the `index.php` page. You may also check with the `info.php` page.

### Modifying the `.env` file
- You may define a user login and a root password. The latter should not be empty for security
reasons
- You may define a database that will be created and populated accordingly.

### Local URLs
- Open http://localhost:8080 to access the current website. All modifications
made to the files are reloaded when refreshing the page in your
Internet browser
- Open http://localhost:8081 to access PhpMyAdmin. You may access
the dashboard by providing `root` as a username and the password you
defined in your `.env` file.
- Sometimes albeit rare, a computer may fail to resolve `localhost`. Should that happen,
please replace any occurrence of `localhost` by `127.0.0.1`. 

### Database Edition
The database is automatically loaded by Docker using your `.env` file. 
Although the latter is not accessed remotely, this repo provides 2 files
under the `db/init` directory. SQL files are put in the lexicographic order,
because that's the order it's initialized.

If you want to add another database, there should be two files, one for the model
and another for data to use. Thus, make sure you're using the same
database name in both files.

#### DB Schema `01_schema.sql`
This part defines a given database and describes how it is structured.
This is called the **schema**.

#### DB Seed `02_seed.sql`
This part adds data to the database defined before. This may be useful
to share some data with source control. This is called the **seed**.

#### What about the rest?
All information or data you inject with PhpMyAdmin or with PhpStorm is
stored locally in the Docker container. It will not be shared across
other team members.

#### Soft reset 
This will remove all data in the database without destroying its structure.

Via PhpMyAdmin:
1. Login as `root` user
2. Select the database from the left panel
3. Click the SQL tab
4. Copy-paste the contents of `db/init/02_seed.sql` and run it

Via PhpStorm
1. Open the Database panel on the right
2. Connect to the DB if not already done
3. Right-click the database > New > Query Console
4. Copy-paste the contents of `db/init/02_seed.sql` and run it

**Important!** If your seed uses `INSERT` without `TRUNCATE` first, you
may get duplicate data. Please add `TRUNCATE TABLE [NAME];` after `USER [DB];` accordingly,
where `[NAME]` and `[DB]` are respectively the names of table to truncate, and of
the database.

#### Hard reset
This will wipe all data and re-run each `.sql` file under the `db/init` 
directory.

Run the following commands:
- `docker compose down -v`
- `docker compose up -d`

### Docker Commands
Those commands should be ran in the project directory.

- Start and rebuild containers: `docker compose up -d`
- Stop containers: `docker compose down`
- Stop containers and wipes all volumes: `docker compose down -v`. 
This command will also destroy all local database data!
- Get containers info: `docker ps`