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

// PFADE
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'data.json');
const UPLOAD_DIR = path.join(__dirname, 'public/img/uploads');

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// --- STANDARD DATEN (Dreisprachig) ---
const createDefaultData = () => {
    const defaultData = { 
        birthdays: [
            { id: 'def-bday-1', name: 'Meow Reminder', date: '2025-12-16' }
        ], 
        appointments: [
            { 
                id: 'def-appt-1', 
                // NEU: Titel in 3 Sprachen
                title: 'International Cat Day / Weltkatzentag / Всемирный день кошек 😺', 
                date: '2025-08-08', 
                // NEU: Notiz in 3 Sprachen
                note: 'A day for the cat! / Ein Tag für die Miez! / День для кошки!', 
                type: 'none', 
                recurrence: 'yearly', 
                isAllDay: true 
            }
        ], 
        external_appointments: [], 
        notes: [
            {
                id: 'def-note-1',
                // NEU: Titel in 3 Sprachen
                title: 'Welcome / Willkommen / Добро пожаловать',
                // NEU: Text in 3 Sprachen
                text: 'Thank you for using Meow Reminder! 🐾\nThis is your first note.\n\nDanke, dass du Meow Reminder nutzt! 🐾\nDies ist deine erste Notiz.\n\nСпасибо, что используете Meow Reminder! 🐾\nЭто ваша первая заметка.'
            }
        ], 
        settings: { 
            language: 'de', 
            daily_alert_time: '08:00',
            ics_links: ['', '', ''],
            fullscreen_auto: false
        } 
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
    return defaultData;
};

const readData = () => {
    if (!fs.existsSync(DATA_FILE)) return createDefaultData();
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        if (!data.external_appointments) data.external_appointments = [];
        if (!data.settings.ics_links) data.settings.ics_links = ['', '', ''];
        if (data.settings.fullscreen_auto === undefined) data.settings.fullscreen_auto = false;
        return data;
    } catch (e) { return createDefaultData(); }
};

const detectTrashType = (s) => {
    if(!s) return 'none'; s = s.toLowerCase();
    if(s.includes('papier')||s.includes('blau')) return 'blue';
    if(s.includes('gelb')||s.includes('wertstoff')) return 'yellow';
    if(s.includes('bio')||s.includes('braun')) return 'brown';
    if(s.includes('rest')||s.includes('schwarz')||s.includes('grau')) return 'black';
    return 'none';
};

const syncExternalIcs = async () => {
    const data = readData();
    const links = data.settings.ics_links.filter(l => l && l.startsWith('http'));
    
    if (links.length === 0) {
        if (data.external_appointments.length > 0) {
            data.external_appointments = [];
            fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        }
        return;
    }

    let newExternalAppts = [];
    console.log("🔄 Starte ICS Sync...");

    for (const link of links) {
        try {
            const events = await nodeIcal.async.fromURL(link);
            for (const k in events) {
                const e = events[k];
                if (e.type === 'VEVENT') {
                    const d = new Date(e.start);
                    const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
                    const trash = detectTrashType(e.summary);
                    let isAllDay = e.datetype === 'date' || trash !== 'none';
                    let fullDate = dateStr;
                    if (!isAllDay) fullDate += ` ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;

                    newExternalAppts.push({
                        id: 'ext-' + (e.uid || Math.random().toString(36)),
                        title: e.summary,
                        date: fullDate,
                        note: 'Online Kalender', 
                        type: trash,
                        recurrence: 'none',
                        isAllDay: isAllDay,
                        isExternal: true 
                    });
                }
            }
        } catch (err) { console.error(`Sync Error: ${link}`); }
    }
    data.external_appointments = newExternalAppts;
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    console.log(`✅ Sync fertig.`);
};

const notifyAll = (message, category) => {
    const data = readData();
    const s = data.settings || {};
    if (category === 'appt' && s.tele_appt_active) sendTelegram(s.tele_appt_token, s.tele_appt_chat, message);
    if (category === 'bday' && s.tele_bday_active) sendTelegram(s.tele_bday_token, s.tele_bday_chat, message);
    if (category === 'appt' && s.mail_appt_active) sendEmail({host:s.mail_appt_host, user:s.mail_appt_user, pass:s.mail_appt_pass}, message);
    if (category === 'bday' && s.mail_bday_active) sendEmail({host:s.mail_bday_host, user:s.mail_bday_user, pass:s.mail_bday_pass}, message);
};

const sendTelegram = async (token, chat, msg) => {
    if(!token || !chat) return;
    try { await fetch(`https://api.telegram.org/bot${token}/sendMessage`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({chat_id:chat, text:msg, parse_mode:'HTML'}) }); } catch(e){}
};
const sendEmail = async (conf, msg) => {
    if(!conf.host || !conf.user) return;
    try {
        const t = nodemailer.createTransport({host:conf.host, port:587, secure:false, auth:{user:conf.user, pass:conf.pass}});
        await t.sendMail({from:`"Meow" <${conf.user}>`, to:conf.user, subject:"Meow Reminder", html:msg.replace(/\n/g,'<br>')});
    } catch(e){}
};

// --- CRONJOBS ---
cron.schedule('* * * * *', () => {
    const data = readData();
    const now = new Date();
    const timeStr = now.toLocaleTimeString('de-DE', {hour:'2-digit', minute:'2-digit'});
    
    const today = new Date(now);
    const tomorrow = new Date(now); tomorrow.setDate(now.getDate() + 1);
    const in3Days = new Date(now); in3Days.setDate(now.getDate() + 3);

    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    const in3DaysStr = in3Days.toISOString().split('T')[0];

    const todayMD = todayStr.slice(5); 
    const in3DaysMD = in3DaysStr.slice(5); 

    const alertTime = data.settings?.daily_alert_time || "08:00";

    // 1. GEBURTSTAGE
    data.birthdays.forEach(bday => {
        const bdayMD = bday.date.slice(5);
        const birthYear = parseInt(bday.date.slice(0, 4));
        const age = now.getFullYear() - birthYear;

        if (bdayMD === in3DaysMD && timeStr === "15:00") {
            notifyAll(`⏳ <b>Baldiges Wiegenfest!</b>\nIn 3 Tagen wird ${bday.name} ${age} Jahre alt!`, 'bday');
        }
        if (bdayMD === todayMD && timeStr === "00:00") {
            notifyAll(`🎂 <b>Wiegenfest Alarm!</b>\n\n${bday.name} wird heute <b>${age}</b> Jahre alt! 🎉`, 'bday');
        }
    });

    // 2. TERMINE
    const allAppts = [...data.appointments, ...(data.external_appointments || [])];
    allAppts.forEach(a => {
        let shouldNotify = false;
        let prefix = "";

        if (a.isAllDay && a.date === tomorrowStr && timeStr === "20:00") {
            shouldNotify = true; prefix = "⏳ <b>Morgen:</b> ";
        }
        if (a.isAllDay && a.date === todayStr && timeStr === alertTime) {
            shouldNotify = true; prefix = "📅 <b>Heute:</b> ";
        }
        if (!a.isAllDay) {
            const [d, t] = a.date.split(' ');
            if (d === todayStr && t === timeStr) { shouldNotify = true; prefix = "⏰ <b>Jetzt:</b> "; }
        }
        
        if (shouldNotify) {
            let icon = '';
            if(a.type==='blue') { icon='🔵'; prefix += "Papiermüll"; }
            else if(a.type==='yellow') { icon='🟡'; prefix += "Gelbe Tonne"; }
            else if(a.type==='brown') { icon='🟤'; prefix += "Biotonne"; }
            else if(a.type==='black') { icon='⚫'; prefix += "Restmüll"; }
            notifyAll(`${icon} ${prefix}\n${a.title}`, 'appt');
        }
    });
});

cron.schedule('0 */6 * * *', () => { syncExternalIcs(); });

// --- SERVER SETUP ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        fs.readdir(UPLOAD_DIR, (err, files) => { if(files) files.forEach(f => { if(f.startsWith('custom-bg')) fs.unlinkSync(path.join(UPLOAD_DIR, f)); }); });
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
app.post('/api/trigger-sync', async (req, res) => { await syncExternalIcs(); res.json({ status: 'ok' }); });

app.get('/rss', (req, res) => {
    const data = readData();
    const feed = new RSS({ title:'Meow Reminder', feed_url:`${req.protocol}://${req.get('host')}/rss`, site_url:`${req.protocol}://${req.get('host')}`, language:'de' });
    const now = new Date(); const end = new Date(); end.setDate(now.getDate()+3);
    [...data.appointments, ...(data.external_appointments || [])].forEach(a => {
        const d = new Date(a.date.split(' ')[0]);
        if(d >= new Date(now.toDateString()) && d <= end) feed.item({ title: (a.isExternal?'🌍 ':'')+(a.isAllDay?'📅 ':'⏰ ')+a.title, description: a.note, date: a.date, guid: a.id });
    });
    data.birthdays.forEach(b => {
        const d = new Date(b.date); d.setFullYear(now.getFullYear());
        if(d < new Date(now.toDateString())) d.setFullYear(now.getFullYear()+1);
        if(d >= new Date(now.toDateString()) && d <= end) feed.item({ title: `🎂 ${b.name}`, date: d, guid: b.id });
    });
    data.notes.forEach(n => feed.item({ title: `📝 ${n.title}`, description: n.text, date: now, guid: n.id }));
    res.set('Content-Type', 'text/xml'); res.send(feed.xml());
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
    const current = readData();
    const newData = { ...current, settings: req.body.settings, birthdays: req.body.birthdays, appointments: req.body.appointments, notes: req.body.notes };
    fs.writeFile(DATA_FILE, JSON.stringify(newData, null, 2), (err) => res.json({ status: "ok" }));
});

app.post('/api/upload-wallpaper', upload.single('wallpaper'), (req, res) => {
    if(!req.file) return res.status(400).json({error:'no file'});
    res.json({ url: `/img/uploads/${req.file.filename}` });
});
app.get('/api/export', (req, res) => res.download(DATA_FILE, 'meow-backup.json'));
app.post('/api/import', (req, res) => { fs.writeFile(DATA_FILE, JSON.stringify(req.body, null, 2), () => res.json({status:'ok'})); });

app.get('/api/export/ics', (req, res) => {
    const type = req.query.type; const data = readData(); const calendar = ical({ name: 'Meow' });
    if(!type || type==='appointments') data.appointments.forEach(a => calendar.createEvent({start:new Date(a.date), summary:a.title, allDay:a.isAllDay}));
    if(!type || type==='birthdays') data.birthdays.forEach(b => { const d=new Date(b.date); d.setFullYear(new Date().getFullYear()); calendar.createEvent({start:d, allDay:true, summary:`🎉 ${b.name}`}); });
    res.set('Content-Type', 'text/calendar; charset=utf-8'); res.set('Content-Disposition', `attachment; filename="meow-${type||'full'}.ics"`); res.send(calendar.toString());
});

app.post('/api/import/ics', uploadTemp.single('ics'), async (req, res) => { res.json({status:'ok'}); });

setTimeout(syncExternalIcs, 5000);
app.get(/.*/, (req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));
app.listen(PORT, () => console.log(`😺 Meow Server: http://localhost:${PORT}`));
