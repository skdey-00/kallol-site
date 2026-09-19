#!/usr/bin/env bash
# Build the production image locally and deploy it to the hetzner server.
# The image is built for the server's architecture (x86_64), then shipped
# over SSH — nothing is built on the server anymore.
#
# Usage: ./scripts/deploy.sh
#
# One-time server prerequisite (after this repo's compose file is pulled):
#   the kallol-site service must reference image: kallol-site:latest so the
#   loaded image is picked up instead of building.
set -euo pipefail

SERVER=hetzner                     # SSH host alias in ~/.ssh/config
REMOTE_DIR=/root/Projects/kallol-site
IMAGE=kallol-site:latest
PLATFORM=linux/amd64               # server is x86_64; this Mac builds arm64 natively

echo "==> Building $IMAGE for $PLATFORM"
docker buildx build --platform "$PLATFORM" -t "$IMAGE" --load .

echo "==> Transferring image to $SERVER"
docker save "$IMAGE" | gzip | ssh "$SERVER" 'docker load'

echo "==> Restarting containers on $SERVER"
ssh "$SERVER" "cd $REMOTE_DIR && docker compose up -d --no-build"

# The previously deployed image is now dangling; remove it (server disk is tight)
echo "==> Pruning old images on $SERVER"
ssh "$SERVER" 'docker image prune -f >/dev/null 2>&1 || true'

echo "==> Done. Deployed $IMAGE to $SERVER"
