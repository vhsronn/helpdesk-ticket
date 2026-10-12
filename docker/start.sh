#!/bin/sh
set -e

# Railway tells the container which port to listen on via $PORT
PORT="${PORT:-80}"
sed -i "s/Listen 80/Listen ${PORT}/" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:80>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/000-default.conf

php artisan package:discover --ansi
php artisan migrate --force
php artisan db:seed --force      # safe to repeat: creates the demo account only once
php artisan config:cache
php artisan route:cache

exec apache2-foreground
