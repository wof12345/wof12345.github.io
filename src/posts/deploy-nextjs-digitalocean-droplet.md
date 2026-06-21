---
title: Deploying a Next.js app to a DigitalOcean Droplet
date: 2026-06-21
excerpt: A full walkthrough — provisioning a Droplet, running a production Next.js build with PM2, putting Nginx in front, wiring up a domain, and locking it down with HTTPS.
tags:
  - nextjs
  - digitalocean
  - nginx
  - devops
---

Vercel is the easy button for Next.js, but sometimes you want a plain Linux box you control — cheaper at scale, no platform limits, and a good way to actually understand what's running. This is the end-to-end path I use to get a Next.js app onto a DigitalOcean Droplet, behind a real domain, with HTTPS.

## What we're building

- An Ubuntu Droplet running Node
- A production Next.js build kept alive by **PM2**
- **Nginx** as a reverse proxy on ports 80/443
- A domain pointed at the Droplet
- Free TLS certificates from **Let's Encrypt**

## 1. Create the Droplet

In the DigitalOcean console: **Create → Droplets**.

- **Image:** Ubuntu 24.04 LTS
- **Plan:** the $6/mo basic plan is fine for a small app; bump RAM if your build is heavy
- **Authentication:** add an SSH key (not a password — you'll thank yourself later)
- **Hostname:** something memorable like `web-01`

Once it boots, grab the public IPv4 address and SSH in:

```bash
ssh root@YOUR_DROPLET_IP
```

## 2. Create a non-root user

Running everything as root is asking for trouble. Make a user and give it sudo:

```bash
adduser deploy
usermod -aG sudo deploy
# copy your SSH key over so you can log in as the new user
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy
```

From here on, log in as `deploy`:

```bash
ssh deploy@YOUR_DROPLET_IP
```

## 3. Install Node and a process manager

Use the NodeSource repo to get a current LTS:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v   # confirm v22.x
```

Install PM2 globally — it keeps your app running and restarts it on crash or reboot:

```bash
sudo npm install -g pm2
```

## 4. Get your code onto the box

Clone from GitHub (or push via `scp` / a deploy pipeline later):

```bash
cd ~
git clone https://github.com/you/your-nextjs-app.git
cd your-nextjs-app
```

Install dependencies and create the production build:

```bash
npm ci
npm run build
```

If you use environment variables, create a `.env.production` (or `.env.local`) on the server. **Never commit secrets** — set them here:

```bash
nano .env.production
```

## 5. Run it with PM2

Next.js serves on port 3000 by default. Start it under PM2:

```bash
pm2 start npm --name "nextjs-app" -- start
```

Confirm it's up:

```bash
pm2 status
curl http://localhost:3000   # should return your app's HTML
```

Make PM2 survive reboots:

```bash
pm2 save
pm2 startup
# run the command it prints, then:
pm2 save
```

## 6. Put Nginx in front

You don't want users hitting port 3000 directly. Nginx handles ports 80/443 and proxies to the app.

```bash
sudo apt-get install -y nginx
```

Create a site config:

```bash
sudo nano /etc/nginx/sites-available/your-app
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
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
```

Enable it and reload:

```bash
sudo ln -s /etc/nginx/sites-available/your-app /etc/nginx/sites-enabled/
sudo nginx -t          # test config
sudo systemctl reload nginx
```

## 7. Open the firewall

Ubuntu ships with `ufw`. Allow SSH and Nginx:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## 8. Point your domain at the Droplet

At your domain registrar (or in DigitalOcean's DNS if you delegate nameservers there), create:

| Type | Host | Value |
|------|------|-------|
| A | `@` | YOUR_DROPLET_IP |
| A | `www` | YOUR_DROPLET_IP |

DNS can take anywhere from a few minutes to a few hours to propagate. Check it with:

```bash
dig +short yourdomain.com
```

When that returns your Droplet's IP, you're ready for HTTPS.

## 9. Add HTTPS with Let's Encrypt

Certbot automates certificate issuance and Nginx config:

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot edits your Nginx config to serve on 443 and sets up an auto-redirect from HTTP. Certificates renew automatically via a systemd timer — verify with:

```bash
sudo certbot renew --dry-run
```

Visit `https://yourdomain.com` and you should see your app with a valid lock icon.

## 10. Redeploying

When you ship new code, the loop is short:

```bash
cd ~/your-nextjs-app
git pull
npm ci
npm run build
pm2 reload nextjs-app
```

`pm2 reload` does a zero-downtime restart so visitors don't see an error mid-deploy.

## Things that bite people

- **Build runs out of memory.** A 1 GB Droplet can OOM during `npm run build`. Add a swap file or build on a bigger plan.
- **Wrong env vars at build time.** Next.js inlines `NEXT_PUBLIC_*` vars at build, so they must be present when you run `npm run build`, not just at runtime.
- **Forgot `pm2 save`.** Without it, your app won't come back after a reboot.
- **DNS not propagated before running Certbot.** Let's Encrypt validates over HTTP — if the domain doesn't resolve to the Droplet yet, issuance fails.

That's the whole path: bare Droplet to a domain-backed, HTTPS-secured Next.js app you fully control. The next post automates the redeploy step with GitHub Actions.
