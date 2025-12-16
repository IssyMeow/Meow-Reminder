# Basis-Image: Leichtes Node.js
FROM node:20-alpine

# Arbeitsverzeichnis im Container
WORKDIR /app

# Zeitzonen-Daten installieren (wichtig für korrekte Termine!)
RUN apk add --no-cache tzdata

# Erst nur package.json kopieren (nutzt Docker-Cache optimal)
COPY package*.json ./

# Abhängigkeiten installieren
RUN npm install

# Jetzt den gesamten Rest-Code kopieren
COPY . .

# Das Frontend bauen (erstellt den 'dist' Ordner im Container)
RUN npm run build

# Port 3000 freigeben
EXPOSE 3000

# Server starten
CMD ["node", "server.js"]
