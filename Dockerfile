# ベースイメージとしてPHP 8.2を使用
FROM php:8.2-fpm

# 必要なパッケージのインストール
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    nodejs \
    npm \
    default-jdk \
    gradle

# PHPの拡張機能をインストール
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Composerのインストール
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 作業ディレクトリの設定
WORKDIR /var/www/html

# アプリケーションのファイルをコピー
COPY . .

# 依存関係のインストール
RUN composer install --no-interaction --no-dev --optimize-autoloader
RUN npm install
RUN npm run build

# Kotlinのビルド
WORKDIR /var/www/html/app/Kotlin
RUN ./gradlew jar
WORKDIR /var/www/html

# 権限の設定
RUN chown -R www-data:www-data /var/www/html/storage
RUN chown -R www-data:www-data /var/www/html/bootstrap/cache

# 環境変数の設定
COPY .env.example .env
RUN php artisan key:generate

# ポートの設定
EXPOSE 9000

# 起動コマンド
CMD ["php-fpm"] 