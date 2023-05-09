FROM node:16-alpine
WORKDIR /app
# Copy and download dependencies
COPY package.json ./

# Installer les dépendances de l'application
RUN npm install

# Copy the source files into the image
COPY . .

EXPOSE 8000

CMD node index.js
