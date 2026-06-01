#!/bin/bash
# Updates NEXTAUTH_URL in .env when serveo tunnel reconnects
# Usage: called from systemd ExecStartPost or tunnel script

ENV_FILE="/home/oliver/omix-sms/.env"
LOG_FILE="/home/oliver/logs/omix-sms-tunnel.log"

# Extract latest active tunnel URL
URL=$(grep "Forwarding HTTP traffic from" "$LOG_FILE" | tail -1 | sed 's/.*from //')

if [ -z "$URL" ]; then
    echo "No tunnel URL found in logs"
    exit 1
fi

# Update .env
sed -i "s|NEXTAUTH_URL=.*|NEXTAUTH_URL=\"$URL\"|" "$ENV_FILE"
echo "Updated NEXTAUTH_URL to $URL"

# Restart the app to pick up new URL
systemctl --user restart omix-sms.service
echo "Restarted omix-sms.service"
