---
title: Deploying a three-app stack on a single DigitalOcean Droplet
date: 2026-07-18
excerpt: One API, one Next.js storefront, and one static admin SPA — all living on the same box behind Nginx, with PM2 keeping the Node processes alive and Certbot handling TLS. A command-by-command walkthrough of the whole deploy.
tags:
  - digitalocean
  - nginx
  - pm2
  - devops
  - prisma
---

Most "deploy to a Droplet" guides assume a single app. Real projects rarely look like that. A common shape is three services that ship together:

| App    | What it is              | Runs as                                   |
| ------ | ----------------------- | ----------------------------------------- |
| api    | Express + Prisma        | a Node process managed by **PM2**         |
| client | Next.js storefront      | a Node process managed by **PM2**         |
| admin  | Vite React SPA          | **static files** served straight by Nginx |

All three sit on one box. Nginx sits in front and routes by subdomain; Certbot issues the TLS certs; MySQL runs locally. This post walks the whole thing end to end and explains what every command actually does, so you're not just pasting.

Throughout I'll use placeholders — swap them for your own:

- `example.com` → the storefront
- `admin.example.com` → the admin panel
- `api.example.com` → the API
- `/var/www/myapp` → wherever you clone the repo

## The routing picture

Before any commands, hold the end state in your head. One public IP, three subdomains all pointing at it. Nginx reads the `Host` header on each request and decides:

- `example.com` → proxy to the Next.js process on a local port
- `api.example.com` → proxy to the Express process on a different local port
- `admin.example.com` → serve static files off disk, no proxy at all

The two Node apps never face the internet directly. They listen only on `127.0.0.1`, and Nginx is the single front door.

## 1. Create the Droplet

Ubuntu 24.04 LTS, 2 GB RAM or more. The builds — especially Next.js — are memory-hungry; a 1 GB box can run out of RAM mid-build unless you add swap (step 2).

Before you touch the server, point DNS at it. Create `A` records for the root domain, `admin`, and `api`, all aimed at the Droplet's IP. Do this *first* — Certbot later validates each domain over HTTP, and validation fails if the name doesn't resolve to the box yet. DNS takes time to propagate, so getting it out of the way early means it's ready when you need it.

SSH in as root (or a sudo user) for everything below.

## 2. Base packages

```bash
apt update && apt upgrade -y
apt install -y curl git nginx mysql-server ufw
```

- `apt update` refreshes the list of available packages; `apt upgrade -y` installs pending updates (`-y` auto-confirms so it doesn't stop to ask).
- The second line installs everything the stack needs in one go: `curl` and `git` for fetching, `nginx` as the reverse proxy, `mysql-server` for the database, and `ufw` (Uncomplicated Firewall) to control which ports are open.

### Swap (only on a 1 GB Droplet)

```bash
fallocate -l 2G /swapfile && chmod 600 /swapfile
mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

- `fallocate -l 2G /swapfile` reserves a 2 GB file on disk; `chmod 600` locks its permissions so only root can read it.
- `mkswap` formats that file as swap space; `swapon` activates it immediately.
- The `echo … >> /etc/fstab` line appends an entry to the filesystem table so the swap is re-enabled automatically after a reboot. Skip this whole block on a 2 GB+ box.

### Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
apt install -y nodejs
node -v
```

- The `curl … | bash -` line downloads NodeSource's setup script and runs it, which adds their apt repository for the Node major version you want. The flags: `-f` fail on server errors, `-s` silent, `-S` still show errors, `-L` follow redirects.
- `apt install -y nodejs` then installs Node from that repo.
- `node -v` prints the installed version so you can confirm it's what you expected before moving on.

### PM2

```bash
npm install -g pm2
```

PM2 is a process manager for Node. It keeps the api and client processes running, restarts them if they crash, and (once configured) brings them back after a reboot. `-g` installs it globally so the `pm2` command is available everywhere.

### Firewall

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

- `ufw allow OpenSSH` keeps port 22 open — do this **before** enabling the firewall or you can lock yourself out of your own server.
- `ufw allow 'Nginx Full'` opens ports 80 and 443 (HTTP and HTTPS) — that's the `Nginx Full` profile.
- `ufw enable` turns the firewall on. Everything not explicitly allowed is now blocked, including direct access to the app ports — exactly what we want.

## 3. MySQL

```bash
mysql_secure_installation
mysql -u root -p
```

`mysql_secure_installation` is an interactive script that removes anonymous accounts, disables remote root login, and lets you set a root password — run it once on any fresh install. The second line opens a SQL shell as root (`-p` prompts for the password).

Inside the shell, create a database and a dedicated user for the app:

```sql
CREATE DATABASE myapp CHARACTER SET utf8mb4;
CREATE USER 'myapp_user'@'localhost' IDENTIFIED BY 'REPLACE_WITH_A_STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON myapp.* TO 'myapp_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

- `CREATE DATABASE … CHARACTER SET utf8mb4` makes the database with full Unicode support (utf8mb4 handles emoji and every other character correctly).
- `CREATE USER … @'localhost'` makes an app-specific account that can only connect from the same machine — the app never needs remote DB access.
- `GRANT ALL PRIVILEGES ON myapp.*` gives that user full rights on this one database (and nothing else). `FLUSH PRIVILEGES` reloads the grant tables so the changes take effect.

Give the app its own user rather than reusing root — if the app is ever compromised, the blast radius is one database.

## 4. Clone the repo

```bash
mkdir -p /var/www && cd /var/www
git clone https://github.com/your-org/myapp.git
cd myapp
```

- `mkdir -p /var/www` creates the directory (`-p` means "don't error if it already exists"), then `cd` moves into it.
- `git clone` downloads the repo; the final `cd myapp` steps into it. `/var/www` is the conventional home for web app code on a Linux server.

### Cloning over SSH instead of HTTPS

The HTTPS URL above works for any public repo. For a **private** repo — or if you'd rather not paste a personal access token every time you pull — clone over SSH instead. First generate a key on the Droplet and register its public half with GitHub:

```bash
ssh-keygen -t ed25519 -C "deploy@myapp"       # press Enter through the prompts
cat ~/.ssh/id_ed25519.pub                       # copy this line
```

- `ssh-keygen -t ed25519` generates a modern, compact key pair; `-C` just adds a label so you can recognise it later. Accept the default path and leave the passphrase empty if this key is only for unattended deploys.
- `cat …/id_ed25519.pub` prints the **public** key. Add it to GitHub under **Settings → SSH and GPG keys → New SSH key** (or, for a single repo, as a read-only *deploy key* under the repo's **Settings → Deploy keys**). Never share the matching private key (`id_ed25519`, no `.pub`) — it stays on the Droplet.

Verify the connection, then clone using the SSH URL:

```bash
ssh -T git@github.com                           # confirms auth; a greeting means success
git clone git@github.com:your-org/myapp.git
```

- `ssh -T git@github.com` opens a test connection. On first run it asks you to trust GitHub's host key (type `yes`); a `Hi your-org! You've successfully authenticated` message means the key is wired up.
- The `git@github.com:your-org/myapp.git` form is the SSH remote — same repo, no password prompts on future `git pull`s during redeploys.

## 5. Configure the environment files

Each app reads its own `.env`. Copy the checked-in examples and fill in the blanks:

```bash
cp api/example.env api/.env
cp client/.env.example client/.env
cp admin/.env.example admin/.env
```

Rather than list secrets, here's the *shape* of what each needs — real values stay out of git.

**`api/.env`** — the server's config. Typical variables:

```
PORT=              # local port the API listens on
NODE_ENV=production
CLIENT_URL=        # public URL of the storefront
CORS_ORIGINS=      # comma-separated list of allowed front-end origins
DATABASE_URL=      # mysql://myapp_user:PASSWORD@localhost:3306/myapp
JWT_SECRET=        # long random string for signing tokens
MAIL_API_KEY=      # transactional email provider key
PAYMENT_API_KEY=   # payment gateway key
```

**`client/.env`** — the Next.js front end. Only variables prefixed for public exposure end up in the browser bundle:

```
NEXT_PUBLIC_API_URL=   # public URL of the API
```

**`admin/.env`** — the Vite SPA. Vite **bakes these in at build time**, so they must be set before you build, and any change means a rebuild:

```
VITE_API_URL=          # public URL of the API
```

The pattern to internalise: `NEXT_PUBLIC_*` (Next.js) and `VITE_*` (Vite) variables are compiled into front-end code and are therefore public. Never put a secret behind those prefixes — secrets live only in `api/.env`, which is read at runtime on the server and never shipped to a browser.

## 6. Install and build everything

A root `package.json` wires the three apps together with helper scripts:

```bash
npm run install:all
npm run build
```

- `npm run install:all` installs dependencies in `api/`, `client/`, and `admin/` — one command instead of three `cd`-and-`npm install` cycles.
- `npm run build` compiles all three: the api transpiles to a `dist/` folder, the client produces an optimized Next.js build, and the admin outputs static HTML/JS/CSS into `admin/dist`.

(If your repo doesn't have these convenience scripts, run the install/build in each app directory by hand — same effect.)

## 7. Database schema and seed

```bash
cd api
npx prisma migrate deploy
npm run db:seed
cd ..
```

- `npx prisma migrate deploy` applies all pending migrations to the database. This is the **production** migration command — it runs existing migrations without prompting and never tries to generate new ones. (Its cousin `migrate dev` is for local development only; don't run it on a server.)
- `npm run db:seed` populates initial data — typically the first admin account and any reference tables. Set the seed admin credentials via env vars beforehand, or change the password right after first login.

## 8. Start the Node apps with PM2

```bash
pm2 start api/dist/server.js --name myapp-api --cwd api
pm2 start npm --name myapp-client --cwd client -- start
pm2 save
pm2 startup
```

- The first line starts the compiled API. `--name` labels the process so you can refer to it later; `--cwd api` runs it with the `api/` directory as its working directory so it finds its `.env` and relative paths.
- The second line starts the client. Because Next.js is launched via an npm script, the target is `npm` and everything after `--` (here, `start`) is passed through as the script name — so this runs `npm start` inside `client/`.
- `pm2 save` snapshots the current process list so it can be restored later.
- `pm2 startup` prints a command that registers PM2 as a system service — **run the command it prints**, then the boot-time restore works. Together with `pm2 save`, this is what brings both apps back automatically after a reboot.

Day-to-day commands:

```bash
pm2 status                       # see all processes at a glance
pm2 logs myapp-api               # tail one app's logs
pm2 restart myapp-api myapp-client
```

Note the admin app isn't here — it's static files, so there's no process to manage.

## 9. Nginx: one config, three server blocks

This is where the routing happens. One config file holds three `server` blocks — one per subdomain. Create `/etc/nginx/sites-available/myapp`:

```nginx
# Storefront (Next.js) — proxied to the local client process
server {
    listen 80;
    server_name example.com www.example.com;

    location / {
        proxy_pass http://127.0.0.1:4002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Admin (Vite SPA) — static files served straight off disk
server {
    listen 80;
    server_name admin.example.com;

    root /var/www/myapp/admin/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# API (Express) — proxied to the local api process
server {
    listen 80;
    server_name api.example.com;

    client_max_body_size 20m;   # allow file uploads

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

What the pieces do:

- **`server_name`** is how Nginx matches the incoming `Host` header to the right block. This is the whole subdomain-routing trick.
- **`proxy_pass http://127.0.0.1:PORT`** forwards the request to a Node process on the loopback interface. The two apps only listen locally; Nginx is the only thing exposed.
- **The `proxy_set_header` lines** pass along the real client info. Without `X-Forwarded-For` and `X-Forwarded-Proto`, your app sees every request as coming from `127.0.0.1` over plain HTTP and can't tell it's actually behind HTTPS.
- **`Upgrade` / `Connection 'upgrade'`** on the client block let WebSocket connections pass through — Next.js needs this for hot features and live updates.
- **The admin block has no proxy.** `root` points at the built files and `try_files $uri $uri/ /index.html` means: look for the requested file, then a matching directory, and if neither exists, fall back to `index.html`. That fallback is what makes client-side routing work — refreshing `/admin/settings` serves the SPA instead of a 404.
- **`client_max_body_size 20m`** on the api raises Nginx's default 1 MB request cap so uploads aren't rejected before they reach the app.

Enable and reload:

```bash
ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

- `ln -s` creates a symlink from `sites-available` into `sites-enabled` — the split lets you keep a config on disk without it being live. The symlink is what activates it.
- `nginx -t` **tests** the config for syntax errors. Always run this before reloading; a broken config that's already live is a bad afternoon.
- `systemctl reload nginx` applies the new config without dropping existing connections (unlike `restart`, which fully stops and starts).

## 10. TLS with Certbot

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d example.com -d www.example.com -d admin.example.com -d api.example.com
```

- The first line installs Certbot and its Nginx plugin.
- `certbot --nginx -d …` requests a Let's Encrypt certificate for every domain listed. The `--nginx` plugin does the heavy lifting: it proves you control each domain, **edits your Nginx config in place** to add the `listen 443 ssl` blocks and an HTTP→HTTPS redirect, and reloads Nginx.

Certbot also installs a systemd timer that renews certs automatically before they expire. Confirm it's active:

```bash
systemctl status certbot.timer
```

This is why DNS had to be right in step 1 — Certbot validates each `-d` domain by hitting it over HTTP, and validation fails for any name that doesn't resolve to this Droplet.

## 11. Verify

Walk the whole surface:

- `https://example.com` — storefront loads
- `https://admin.example.com` — admin login page loads
- `https://api.example.com/health` — returns `200`
- Log into admin with the seeded credentials

If a subdomain 502s, the Node process behind it isn't up — check `pm2 status` and `pm2 logs`. If it can't be reached at all, re-check DNS and the `server_name` in the Nginx block.

## 12. Redeploying after a code change

The steady-state loop:

```bash
cd /var/www/myapp
git pull
npm run install:all
npm run build
cd api && npx prisma migrate deploy && cd ..
pm2 restart myapp-api myapp-client
```

- `git pull` fetches and merges the new code.
- `install:all` picks up any new dependencies; `build` recompiles all three apps.
- `prisma migrate deploy` applies any migrations that came with the release.
- `pm2 restart` reloads the two Node apps with the new build.

The admin app needs no restart — Nginx serves whatever is in `admin/dist` on the next request, and `build` just overwrote it. That's the quiet upside of the static-SPA approach: the front end deploys the instant the files change.

## Things worth remembering

- **Build memory.** The Next.js build is the usual OOM culprit on small Droplets. Swap (step 2) or a bigger plan fixes it.
- **Front-end env vars are baked at build time.** Change a `NEXT_PUBLIC_*` or `VITE_*` value and you must rebuild — restarting the process does nothing, because the value is already compiled into the bundle.
- **Locally-uploaded files live on the Droplet.** If the API writes uploads to a folder on disk, that folder isn't in git and won't survive a rebuild of the box. Back it up, or push uploads to object storage.
- **Rotate secrets before going live.** Every `REPLACE_WITH_*` placeholder — DB password, `JWT_SECRET`, API keys — should be a real, unique value, not a copied example.
- **Test Nginx before every reload.** `nginx -t` costs a second and saves you from taking all three sites down with a stray brace.

That's the full path: one bare Ubuntu box to three HTTPS-secured apps — an API, a server-rendered storefront, and a static admin panel — all routed by subdomain from a single Nginx front door.
