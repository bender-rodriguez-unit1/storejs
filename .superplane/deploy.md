# Deployment

## How it works

StoreJS runs on a DigitalOcean droplet as a systemd service.

- **Host:** `storejs-prod` droplet (IP may change on recreation)
- **Service:** `storejs.service` (auto-restarts on crash, starts on boot)
- **App directory:** `/opt/storejs`
- **Deploy script:** `scripts/deploy.sh` (git pull, npm install, restart, health check)

## Deploying

SSH into the droplet and run the deploy script:

```bash
ssh -i <key> root@<droplet-ip> "bash /opt/storejs/scripts/deploy.sh"
```

Exit code 0 = success, non-zero = failure.

## SuperPlane Canvas

To set up a deploy-on-push workflow in SuperPlane:

### Secrets needed

| Secret name | Key | Description |
|---|---|---|
| `STOREJS_SSH_DO` | `private_key` | SSH private key for the droplet |

### Canvas structure

```
github.onPush (main branch) → SSH → deploy script → success/failure
```

### Node config

**Trigger:** GitHub `onPush` integration, filtered to `main` branch

**SSH Action:**
- Host: `64.225.2.53`
- User: `root`
- Private key: `{{ secrets.STOREJS_SSH_DO.private_key }}`
- Command: `bash /opt/storejs/scripts/deploy.sh`

### Output channels

- `success` — deploy script exited 0, health check passed
- `failure` — deploy script exited non-zero (install failed, health check failed, etc.)
