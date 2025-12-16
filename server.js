import express from 'express';
import fs from 'fs';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import ical from 'ical-generator'; 
import nodeIcal from 'node-ical';
import cron from 'node-cron';       
import nodemailer from 'nodemailer'; 
import RSS from 'rss';              

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');
const UPLOAD_DIR = path.join(__dirname, 'public/img/uploads');

if (!fs.existsSync(UPLOAD_DIR)){
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// --- HELPER: DATEN ---
const readData = () => {
    if (!fs.existsSync(DATA_FILE)) return { birthdays: [], appointments: [], notes: [], settings: {} };
    try {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (e) { return { birthdays: [], appointments: [], notes: [], settings: {} }; }
};

// --- BENACHRICHTIGUNGEN ---

// 1. TELEGRAM
const sendTelegram = async (token, chatId, message) => {
    if (!token || !chatId) return;
    try {
        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML',
                disable_web_page_preview: true
            })
        });
        console.log("📨 Telegram gesendet");
    } catch (e) { console.error("Telegram Fehler:", e.message); }
};

// 2. E-MAIL
const sendEmail = async (smtpSettings, message) => {
    if (!smtpSettings.host || !smtpSettings.user) return;
    try {
        const transporter = nodemailer.createTransport({
            host: smtpSettings.host,
            port: 587,
            secure: false, // Standard TLS
            auth: { user: smtpSettings.user, pass: smtpSettings.pass },
        });
        await transporter.sendMail({
            from: `"Meow Reminder" <${smtpSettings.user}>`,
            to: smtpSettings.user,
            subject: "🐾 Meow Reminder",
            text: message.replace(/<[^>]*>?/gm, ''),
            html: message.replace(/\n/g, '<br>')
        });
        console.log("📧 E-Mail gesendet");
    } catch (e) { console.error("E-Mail Fehler:", e.message); }
};

// 3. VERTEILER
const notifyAll = (message, category) => {
    const data = readData();
    const s = data.settings || {};

    if (category === 'appt') {
        if (s.tele_appt_active) sendTelegram(s.tele_appt_token, s.tele_appt_chat, message);
        if (s.mail_appt_active) sendEmail({ host: s.mail_appt_host, user: s.mail_appt_user, pass: s.mail_appt_pass }, message);
    }
    
    if (category === 'bday') {
        if (s.tele_bday_active) sendTelegram(s.tele_bday_token, s.tele_bday_chat, message);
        if (s.mail_bday_active) sendEmail({ host: s.mail_bday_host, user: s.mail_bday_user, pass: s.mail_bday_pass }, message);
    }
};

// --- CRONJOB ---
cron.schedule('* * * * *', () => {
    const data = readData();
    const now = new Date();
    const timeStr = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];
    const mdStr = dateStr.slice(5); 
    const alertTime = data.settings?.daily_alert_time || "09:00";

    // 1. GEBURTSTAGE
    if (timeStr === alertTime) {
        data.birthdays.forEach(bday => {
            if (bday.date.slice(5) === mdStr) {
                const age = now.getFullYear() - parseInt(bday.date.slice(0, 4));
                const msg = `🎂 <b>Wiegenfest Alarm!</b>\n\n${bday.name} wird heute <b>${age}</b> Jahre alt! 🎉`;
                notifyAll(msg, 'bday');
            }
        });
    }

    // 2. TERMINE
    data.appointments.forEach(appt => {
        let shouldNotify = false;
        if (appt.isAllDay) {
            if (appt.date === dateStr && timeStr === alertTime) shouldNotify = true;
        } else {
            const [d, t] = appt.date.split(' ');
            if (d === dateStr && t === timeStr) shouldNotify = true;
        }

        if (shouldNotify) {
            let icon = '📅'; let typeText = 'Termin';
            if(appt.type === 'blue') { icon = '🔵'; typeText = 'Papiermüll'; }
            if(appt.type === 'yellow') { icon = '🟡'; typeText = 'Gelbe Tonne'; }
            if(appt.type === 'brown') { icon = '🟤'; typeText = 'Biotonne'; }
            if(appt.type === 'black') { icon = '⚫'; typeText = 'Restmüll'; }

            const msg = `${icon} <b>${typeText}</b>\n\n${appt.title}\n<i>${appt.note || ''}</i>`;
            notifyAll(msg, 'appt');
        }
    });
});

// --- SERVER SETUP ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        fs.readdir(UPLOAD_DIR, (err, files) => {
            if (files) files.forEach(f => { if(f.startsWith('custom-bg')) fs.unlinkSync(path.join(UPLOAD_DIR, f)); });
        });
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => cb(null, 'custom-bg' + path.extname(file.originalname))
});
const upload = multer({ storage });
const uploadTemp = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json({ limit: '10mb' })); 
app.use(express.static(path.join(__dirname, 'dist'))); 
app.use(express.static(path.join(__dirname, 'public'))); 

// --- ROUTEN ---

// RSS
app.get('/rss', (req, res) => {
    const data = readData();
    const feed = new RSS({
        title: 'Meow Reminder',
        description: 'Termine, Geburtstage & Notizen',
        feed_url: `${req.protocol}://${req.get('host')}/rss`,
        site_url: `${req.protocol}://${req.get('host')}`,
        language: 'de',
    });
    const now = new Date();
    const previewEnd = new Date(); previewEnd.setDate(now.getDate() + 3);

    data.appointments.forEach(appt => {
        const d = new Date(appt.date.split(' ')[0]);
        if (d >= new Date(now.toDateString()) && d <= previewEnd) {
            feed.item({ 
                title: (appt.isAllDay ? '📅 ' : '⏰ ') + appt.title + ` (${appt.date})`, 
                description: appt.note || 'Termin', 
                url: `${req.protocol}://${req.get('host')}`, 
                guid: appt.id, 
                date: appt.date 
            });
        }
    });

    data.birthdays.forEach(bday => {
        const bdayDate = new Date(bday.date);
        bdayDate.setFullYear(now.getFullYear());
        if (bdayDate < new Date(now.toDateString())) bdayDate.setFullYear(now.getFullYear() + 1);
        if (bdayDate >= new Date(now.toDateString()) && bdayDate <= previewEnd) {
             feed.item({
                title: `🎂 ${bday.name}`,
                description: 'Wiegenfest',
                url: `${req.protocol}://${req.get('host')}`,
                guid: bday.id + '-' + now.getFullYear(),
                date: bdayDate
            });
        }
    });

    data.notes.forEach(note => {
        feed.item({
            title: `📝 ${note.title}`,
            description: note.text,
            url: `${req.protocol}://${req.get('host')}`,
            guid: note.id,
            date: now 
        });
    });

    res.set('Content-Type', 'text/xml');
    res.send(feed.xml());
});

app.post('/api/test-notification', (req, res) => {
    const { type, settings, category } = req.body;
    let msg = "🔔 <b>Test</b>\n\nDas ist ein Test vom Meow Reminder! 🐾";
    if (category === 'bday') msg = "🎂 <b>Test</b>\n\nDas ist der Geburtstags-Bot! 🎉";

    if (type === 'telegram') {
        if (category === 'appt') sendTelegram(settings.tele_appt_token, settings.tele_appt_chat, msg);
        if (category === 'bday') sendTelegram(settings.tele_bday_token, settings.tele_bday_chat, msg);
    }
    
    if (type === 'email') {
        if (category === 'appt') sendEmail({ host: settings.mail_appt_host, user: settings.mail_appt_user, pass: settings.mail_appt_pass }, msg);
        if (category === 'bday') sendEmail({ host: settings.mail_bday_host, user: settings.mail_bday_user, pass: settings.mail_bday_pass }, msg);
    }
    res.json({ status: 'ok' });
});

app.get('/api/data', (req, res) => res.json(readData()));
app.post('/api/data', (req, res) => {
    fs.writeFile(DATA_FILE, JSON.stringify(req.body, null, 2), (err) => res.json({ status: "ok" }));
});
app.post('/api/upload-wallpaper', upload.single('wallpaper'), (req, res) => {
    if(!req.file) return res.status(400).json({error:'no file'});
    res.json({ url: `/img/uploads/${req.file.filename}` });
});
app.get('/api/export', (req, res) => res.download(DATA_FILE, 'meow-backup.json'));
app.post('/api/import', (req, res) => {
    fs.writeFile(DATA_FILE, JSON.stringify(req.body, null, 2), () => res.json({status:'ok'}));
});

// --- ICS EXPORT (FIXED) ---
app.get('/api/export/ics', (req, res) => {
    const type = req.query.type;
    const data = readData();
    const calendar = ical({ name: 'Meow ' + (type||'Calendar') });
    
    if(!type || type==='appointments') {
        data.appointments.forEach(a => {
            const start = new Date(a.date);
            calendar.createEvent({ start, end: new Date(start.getTime()+3600000), summary: a.title, description: a.note||'', allDay: a.isAllDay || !a.date.includes(':') });
        });
    }
    if(!type || type==='birthdays') {
        data.birthdays.forEach(b => {
            const d = new Date(b.date); d.setFullYear(new Date().getFullYear());
            calendar.createEvent({ start: d, allDay: true, summary: `🎉 ${b.name}`, description: 'Wiegenfest' });
        });
    }

    // FIX: Manuelles Senden statt calendar.serve()
    const filename = `meow-${type || 'full'}.ics`;
    res.set('Content-Type', 'text/calendar; charset=utf-8');
    res.set('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(calendar.toString());
});

const detectTrashType = (s) => {
    if(!s) return 'none'; s = s.toLowerCase();
    if(s.includes('papier')||s.includes('blau')) return 'blue';
    if(s.includes('gelb')||s.includes('wertstoff')) return 'yellow';
    if(s.includes('bio')||s.includes('braun')) return 'brown';
    if(s.includes('rest')||s.includes('schwarz')||s.includes('grau')) return 'black';
    return 'none';
};
app.post('/api/import/ics', uploadTemp.single('ics'), async (req, res) => {
    if(!req.file) return res.status(400).json({error:'no file'});
    const target = req.query.target; 
    try {
        const events = await nodeIcal.async.parseFile(req.file.path);
        const currentData = readData();
        let count = 0;
        for(const k in events) {
            const e = events[k];
            if(e.type === 'VEVENT') {
                const d = new Date(e.start);
                const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
                
                if(target === 'birthdays') {
                    currentData.birthdays.push({ id: Date.now()+Math.random().toString(), name: e.summary.replace('🎉','').trim(), date: dateStr });
                } else {
                    const trash = detectTrashType(e.summary);
                    let isAllDay = e.datetype === 'date' || trash !== 'none';
                    let fullDate = dateStr;
                    if(!isAllDay) fullDate += ` ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
                    currentData.appointments.push({
                        id: Date.now()+Math.random().toString(), title: e.summary, date: fullDate,
                        note: e.description||'', type: trash, recurrence: 'none', isAllDay: isAllDay
                    });
                }
                count++;
            }
        }
        fs.unlink(req.file.path,()=>{});
        fs.writeFile(DATA_FILE, JSON.stringify(currentData,null,2), ()=> res.json({status:`${count} imported`}));
    } catch(e) { res.status(500).json({error:'err'}); }
});

app.get(/.*/, (req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));
app.listen(PORT, () => console.log(`😺 Meow Server: http://localhost:${PORT}`));
