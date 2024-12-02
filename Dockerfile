# Usa una imagen base de Node.js
FROM node:20

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos necesarios
COPY package.json package-lock.json ./
RUN npm install

# Copia el resto del código
COPY . .

# Compila el código de TypeScript
RUN npm run build

# Expone el puerto en el que corre el API Gateway
EXPOSE 3000

# Comando para iniciar el servicio
CMD ["node", "dist/main.js"]
