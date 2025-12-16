# 🐾 Meow Reminder: Paw Edition

Ein wunderschöner, lokal gehosteter Reminder im modernen "Deepin Glass" Design.
Speziell entwickelt für maximale Privatsphäre, Style und smarte Automatisierung.

![Version](https://img.shields.io/badge/version-1.2.0-blue.svg) ![Edition](https://img.shields.io/badge/edition-Paw-pink.svg)

## ✨ Features

* **Privatsphäre First:** Alle Daten bleiben lokal auf deinem Server (`data.json`).
* **Deepin Glass UI:** Modernes, halb-transparentes Design mit Neon-Effekten & Blur.
* **Smart Calendar:**
    * **Müll-Erkennung:** Färbt Termine beim Import automatisch (Blau=Papier, Gelb=Wertstoff, Braun=Bio, Schwarz=Rest).
    * **Wiegenfeste:** Automatische Altersberechnung ("...wird 45").
    * **Wiederholungen:** Täglich, Wöchentlich, Monatlich, Jährlich.
* **Import & Export:**
    * Voller `.ics` Support (Google Kalender, Outlook).
    * Getrennter Import für Termine und Geburtstage.
    * Drag & Drop Wallpaper Upload.
* **Benachrichtigungen (Push):**
    * **Getrennte Kanäle:** Sende Müll-Termine in den Familien-Chat und Geburtstage privat.
    * **Telegram:** Mit HTML-Support und Kanal-Unterstützung.
    * **E-Mail:** Via SMTP.
    * **RSS Feed:** Integriere deine Termine & Notizen in jedes Dashboard (Smart Home, Feedly).
* **International:** Verfügbar in 🇩🇪 Deutsch, 🇬🇧 Englisch und 🇷🇺 Russisch.
* **Responsive:** Optimiert für Desktop (16:9).

## 🚀 Installation mit Docker (Empfohlen)

1.  Repository klonen:
    ```bash
    git clone [https://github.com/IssyMeow/Meow-Reminder.git](https://github.com/IssyMeow/Meow-Reminder.git)
    cd Meow-Reminder
    ```
2.  Container starten:
    ```bash
    docker-compose up -d --build
    ```
3.  Öffne `http://DEINE-IP:3000` im Browser.

## 🛠 Manuelle Installation (Entwickler)

1.  Node.js (v18+) installieren.
2.  Abhängigkeiten laden:
    ```bash
    npm install
    ```
3.  Bauen & Starten:
    ```bash
    npm run build
    node server.js
    ```

## ⚙️ Konfiguration

Alle Einstellungen (Sprache, Hintergrundbild, Telegram-Token, SMTP) können bequem über das **Zahnrad-Symbol** in der Web-Oberfläche vorgenommen werden. Es ist kein Editieren von Config-Dateien nötig!

---

*Made with ❤️ and 🐾 by IssyMeow*
