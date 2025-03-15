# Usar una imagen base de Node.js
FROM node:22.13.0-alpine

# Establecr el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos necesarios al contenedor
COPY package.json ./
COPY package-lock.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Crear las carpetas uploads y logs si no existen
RUN mkdir -p uploads logs

# Exponer el puerto 3000
EXPOSE 3001

# Comando para iniciar el servidor
CMD ["node", "app.js"]