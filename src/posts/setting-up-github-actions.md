---
title: Setting up GitHub Actions — a practical guide
date: 2026-06-21
excerpt: From your first workflow file to a CI pipeline that lints, tests, and auto-deploys — how GitHub Actions is structured and how to wire one up end to end.
tags:
  - github-actions
  - ci-cd
  - devops
  - automation
---

GitHub Actions lets you run automated jobs straight from your repo — on every push, every pull request, on a schedule, or on a button press. This is how I think about it and a set of workflows you can copy.

## The mental model

Four nouns do all the work:

- **Workflow** — a `.yml` file in `.github/workflows/`. A repo can have many.
- **Event** — what triggers the workflow (`push`, `pull_request`, `schedule`, `workflow_dispatch`).
- **Job** — a group of steps that run together on one machine (a *runner*). Jobs run in parallel unless you declare dependencies.
- **Step** — a single command or a reusable **action** (e.g. `actions/checkout`).

A workflow lives at `.github/workflows/ci.yml`. The filename doesn't matter; the location does.

## Your first workflow

Here's a minimal CI workflow for a Node project that installs deps, lints, and tests on every push and PR:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Check out code
        uses: actions/checkout@v4

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Test
        run: npm test
```

Commit that and push. Open the **Actions** tab on GitHub and you'll see it run live.

## Anatomy, line by line

- **`on:`** declares the triggers. Here: any push to `main`, and any pull request.
- **`runs-on:`** picks the runner OS. `ubuntu-latest` is fast and free for public repos.
- **`uses:`** pulls in a published action. `actions/checkout@v4` clones your repo into the runner — almost every workflow needs it first.
- **`run:`** executes a shell command on the runner.
- **`cache: npm`** in `setup-node` caches `~/.npm` between runs so installs are quick.

## Matrix builds — test against several versions

Want to test on multiple Node versions at once? A matrix expands one job into many:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node: [20, 22]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
      - run: npm ci
      - run: npm test
```

This runs the job twice in parallel, once per version.

## Secrets

Never hard-code tokens. Add them under **Settings → Secrets and variables → Actions**, then reference them:

```yaml
      - name: Deploy
        run: ./deploy.sh
        env:
          API_TOKEN: ${{ secrets.API_TOKEN }}
```

Secrets are masked in logs and unavailable to workflows triggered from forks, which keeps PRs from third parties safe.

## A real deploy workflow

Tying this back to the previous post — here's a workflow that SSHes into a DigitalOcean Droplet and redeploys a Next.js app whenever `main` updates:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy over SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.DROPLET_HOST }}
          username: deploy
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd ~/your-nextjs-app
            git pull
            npm ci
            npm run build
            pm2 reload nextjs-app
```

Add `DROPLET_HOST` and `SSH_PRIVATE_KEY` as repo secrets, and every merge to `main` ships itself. (Generate a dedicated key pair, put the public key in the Droplet's `~/.ssh/authorized_keys`, and store the private key as the secret.)

## Controlling when jobs run

A few patterns I reach for constantly:

```yaml
# Manual trigger with a button in the Actions tab
on:
  workflow_dispatch:

# Nightly at 02:00 UTC
on:
  schedule:
    - cron: '0 2 * * *'

# Only run a job if an earlier one passed
jobs:
  deploy:
    needs: test
```

You can also gate a step on the branch:

```yaml
      - name: Deploy
        if: github.ref == 'refs/heads/main'
        run: ./deploy.sh
```

## Tips that save time

- **Pin actions to a major version** (`@v4`), not `@main` — you don't want a third party's breaking change to break your CI overnight.
- **Use `npm ci`, not `npm install`** in CI. It's faster and respects the lockfile exactly.
- **Cache aggressively.** `setup-node`'s `cache` option, or `actions/cache` for anything else, turns multi-minute installs into seconds.
- **Fail fast locally first.** Run the same lint/test commands on your machine before pushing — the Actions tab is a slow place to discover a typo.
- **Read the logs.** Every step is expandable; failures almost always tell you exactly which command exited non-zero.

Once you've got CI green on every PR and deploys triggering on merge, a huge chunk of manual work just disappears. Start with the minimal workflow above and grow it one step at a time.
