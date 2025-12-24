# 🐾 Meow Reminder: Paw Edition

**A beautiful, self-hosted reminder dashboard with "Deepin Glass" design, smart trash schedule detection, and privacy at its core.**

![Version](https://img.shields.io/badge/version-1.2.3-blue.svg) ![Edition](https://img.shields.io/badge/edition-Paw-pink.svg) ![Docker Pulls](https://img.shields.io/docker/pulls/issymeow/meow-reminder)

---

## 📸 Gallery

![Dashboard](https://raw.githubusercontent.com/IssyMeow/Meow-Reminder/main/public/img/meow-reminder-ss-01.png)
*The Dashboard with Appointments, Birthdays & Notes.*

<p float="left">
  <img src="https://raw.githubusercontent.com/IssyMeow/Meow-Reminder/main/public/img/meow-reminder-ss-02.png" width="45%" />
  <img src="https://raw.githubusercontent.com/IssyMeow/Meow-Reminder/main/public/img/meow-reminder-ss-03.png" width="45%" /> 
</p>
<p float="left">
  <img src="https://raw.githubusercontent.com/IssyMeow/Meow-Reminder/main/public/img/meow-reminder-ss-04.png" width="45%" />
  <img src="https://raw.githubusercontent.com/IssyMeow/Meow-Reminder/main/public/img/meow-reminder-ss-05.png" width="45%" />
</p>

---

## ✨ Features

* **🔒 Privacy First:** No cloud, no tracking. All data is stored locally in your own `data.json`.
* **💎 Deepin Glass UI:** Modern interface with real-time blur, neon glow effects, and smooth animations.
* **📅 Smart Calendar:**
    * **Online Sync (NEU in v1.2.3):** Sync events from external ICS links (e.g., Google Calendar, School, Work).
    * **Trash Detection:** Automatically recognizes and colors trash pickup dates (Blue=Paper, Yellow=Recycle, Brown=Bio, Black=Trash).
    * **Birthdays:** Automatically calculates age ("...turns 30").
* **🖥️ Kiosk Mode (NEU in v1.2.3):** Optional auto-fullscreen mode for wall-mounted displays or tablets.
* **🔔 Smart Notifications:**
    * **Double Alert:** Get notified the evening before (20:00) AND on the day of the event (08:00).
    * **Channels:** Send trash alerts to a family group chat and birthday reminders to your private chat.
    * **Telegram & E-Mail:** Full HTML support.
* **🔄 Integration:**
    * **RSS Feed:** Integrated RSS feed for your Smart Home dashboard (3-day preview).
    * **Import/Export:** Full backup support and ICS import/export.
* **🌍 Multi-Language:** English 🇬🇧, German 🇩🇪, Russian 🇷🇺.

---

## 🚀 Installation

### Option 1: Docker Compose (Recommended)

Create a `docker-compose.yml`:

```yaml
version: '3'
services:
  meow-reminder:
    image: issymeow/meow-reminder:latest
    container_name: meow-reminder
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      # Data folder (Database will be created here automatically)
      - ./data:/app/data
      # Uploads folder for custom wallpapers
      - ./uploads:/app/public/img/uploads
    environment:
      - TZ=Europe/Berlin

```

Start it:

```bash
docker-compose up -d

```

### Option 2: Docker CLI (ZimaOS / CasaOS)

```bash
docker run -d \
  --name meow-reminder \
  --restart unless-stopped \
  -p 3000:3000 \
  -e TZ=Europe/Berlin \
  -v /DATA/AppData/meow-reminder/data:/app/data \
  -v /DATA/AppData/meow-reminder/uploads:/app/public/img/uploads \
  issymeow/meow-reminder:latest

```

*Note: You don't need to create the `data.json` manually anymore. The container will create it automatically in the `/data` folder on the first start.*

---

## ⚙️ Configuration

Open your browser at `http://YOUR-IP:3000`.
Click the **Gear Icon ⚙️** to access settings:

* **Language:** Switch between DE, EN, RU.
* **Wallpaper:** Upload your own background image.
* **Online Calendars:** Add up to 3 ICS links (Google, Outlook, etc.) to sync automatically every 6 hours.
* **Notifications:** Configure your Telegram Bot Token and SMTP settings.
* **Kiosk Mode:** Enable "Auto Fullscreen" if you use this on a dedicated display.

---

## 📜 Changelog

### v1.2.3 (Current)

* **New:** Online Calendar Sync (ICS) - Subscribe to external calendars.
* **New:** Kiosk Mode (Auto Fullscreen toggle).
* **New:** Improved Data Structure (Moved to `/app/data` folder).
* **New:** Added Changelog & Info Menu.
* **Fix:** Notification Logic (Added pre-alerts for events).
* **Fix:** Info Menu Label & Buttons.
* **Fix:** v1.2.0 had the wrong Version Number. v1.1.0 would have been the right one.

### v1.2.0

* **New:** Notification Channels (Split Trash/Birthdays).
* **New:** RSS Feed Integration.
* **New:** Full Docker Support.

### v1.1.0

* **New:** Trash Type Detection logic.
* **New:** Drag & Drop Uploads.
* **Fix:** Scrollbar Issues.

### Alpha 1.0

* Initial Release with Deepin Glass UI.

---

*Made with ❤️ and 🐾 by IssyMeow*

```

```
