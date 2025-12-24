# Wir nutzen ein leichtes Node.js Image auf Alpine-Linux Basis
FROM node:20-alpine

# Arbeitsverzeichnis im Container
WORKDIR /app

# WICHTIG: Zeitzonen-Daten installieren (damit der Reminder zur richtigen Zeit klingelt)
RUN apk add --no-cache tzdata

# Erst nur die Abhängigkeiten kopieren (nutzt den Cache besser)
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
