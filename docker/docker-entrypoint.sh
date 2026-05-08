#!/bin/bash
set -e

echo "Running Omix-SMS entrypoint..."

# Generate app key if not set
if [ -z "$APP_KEY" ]; then
    php artisan key:generate --no-interaction
fi

# Run migrations
php artisan migrate --force --no-interaction

# Clear and cache config
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Create storage link if not exists
if [ ! -L public/storage ]; then
    php artisan storage:link --no-interaction
fi

# Start supervisord
exec /usr/bin/supervisord -n -c /etc/supervisor/supervisor.conf
