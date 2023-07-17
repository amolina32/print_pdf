# Utiliza la imagen de Node.js como base
FROM node:14

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el package.json y package-lock.json al contenedor
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de los archivos del proyecto al contenedor
COPY . .

# Expone el puerto 3000 para que sea accesible desde fuera del contenedor
EXPOSE 3000

# Comando para iniciar el servidor
CMD ["node", "server.js"]
