FROM php:8.0-apache

ENV COMPOSER_SCRIPT_LOCATION=https://raw.githubusercontent.com/composer/getcomposer.org/76a7060ccb93902cd7576b67264ad91c8a2700e2/web/installer

RUN apt-get update \
    && apt-get install --yes libzip-dev zip \
    && curl $COMPOSER_SCRIPT_LOCATION -o installer.php \
    && php installer.php --install-dir=/usr/bin --filename=composer \
    && docker-php-ext-install zip

WORKDIR /var/app/
COPY ./composer.json ./composer.lock /var/app/
RUN composer install && a2enmod rewrite

# Change apache settings to hide src dir and redirect all paths to app
ENV APACHE_DOCUMENT_ROOT /var/app/public

RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf


COPY ./ /var/app/