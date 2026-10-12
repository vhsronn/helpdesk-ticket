# ---------- Stage 1: PHP dependencies ----------
FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-interaction
COPY . .
RUN composer dump-autoload --optimize --no-dev --no-scripts

# ---------- Stage 2: build frontend assets (npm run build) ----------
FROM node:22-slim AS assets
WORKDIR /app
COPY --from=vendor /app /app
RUN npm ci && npm run build

# ---------- Stage 3: production image (Apache + PHP) ----------
FROM php:8.5-apache
RUN docker-php-ext-install pdo_mysql \
    && a2enmod rewrite headers \
    && sed -ri -e 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf \
    && sed -ri -e 's!/var/www/!/var/www/html/public!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf \
    && printf '<Directory /var/www/html/public>\n    AllowOverride All\n    Require all granted\n</Directory>\n' > /etc/apache2/conf-available/laravel.conf \
    && a2enconf laravel

WORKDIR /var/www/html
COPY --from=vendor /app /var/www/html
COPY --from=assets /app/public/build /var/www/html/public/build

RUN mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && sed -i 's/\r$//' docker/start.sh \
    && chmod +x docker/start.sh

ENV APP_ENV=production \
    APP_DEBUG=false

EXPOSE 80
CMD ["./docker/start.sh"]
