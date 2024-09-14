# Etapa 1: Construcción de dependencias
FROM node:16-alpine AS build

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json para instalar dependencias
COPY package*.json ./

# Instalar dependencias de producción
RUN npm ci --only=production

# Copiar el resto de los archivos de la aplicación
COPY . .

# Instalar Puppeteer y sus dependencias, pero evitar descargar Chromium en esta etapa
RUN npm install puppeteer --unsafe-perm=true

# Establecer variables de entorno necesarias para Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    CHROME_BIN=/usr/bin/chromium-browser

# Etapa 2: Producción
FROM node:16-alpine

# Instalar dependencias necesarias para Puppeteer y Chromium
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    bash

# Establecer directorio de trabajo
WORKDIR /app

# Copiar desde la etapa de construcción solo las dependencias de producción y los archivos de la aplicación
COPY --from=build /app /app

# Establecer variable de entorno para Puppeteer
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Exponer el puerto que usa la aplicación
EXPOSE 3000

# Asignar permisos al usuario no root por motivos de seguridad
RUN addgroup -S puppeteer && adduser -S puppeteer -G puppeteer \
    && chown -R puppeteer:puppeteer /app

# Cambiar al usuario no root
USER puppeteer

# Comando para iniciar la aplicación
CMD ["npm", "start"]
