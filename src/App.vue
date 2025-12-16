<script setup>
import { ref, onMounted, computed } from 'vue'
import { 
  PhGear, PhPlus, PhTrash, PhPawPrint, PhCake, PhCalendarBlank, 
  PhNotePencil, PhX, PhFloppyDisk, PhCheck, PhImage, PhArrowsClockwise, 
  PhLink, PhArrowClockwise, PhHouse, PhClock, 
  PhProhibit, PhRecycle, PhNewspaper, PhLeaf, PhUpload, PhDownload, PhCloudArrowUp,
  PhGlobe, PhMonitorPlay, PhPaperPlane, PhVinylRecord, PhDownloadSimple, PhUploadSimple,
  PhBell, PhRss, PhPaperPlaneTilt, PhEnvelope, PhSliders, PhDatabase
} from '@phosphor-icons/vue'

// --- KONFIGURATION ---
const defaultWallpaper = '/img/wallpaper.jpg'
const catIcon = '/img/favicon.svg'
const rssLink = window.location.origin + '/rss'

// --- ÜBERSETZUNGEN ---
const translations = {
  de: {
    nav_home: 'Home', nav_add: 'Neuer Eintrag', nav_settings: 'Einstellungen',
    col_birthdays: 'Wiegenfeste', col_appointments: 'Termine', col_notes: 'Notizen',
    card_turns: 'wird',
    modal_add_title: 'Neuer Eintrag', modal_settings_title: 'Einstellungen',
    tab_appt: 'Termin', tab_bday: 'Wiegenfest', tab_note: 'Notiz',
    lbl_title_bday: 'Name der Person', lbl_title_note: 'Titel der Notiz', lbl_title_appt: 'Bezeichnung',
    lbl_date: 'Datum', lbl_time: 'Uhrzeit', lbl_allday: 'Ganztägig',
    lbl_recurrence: 'Wiederholung', lbl_category: 'Kategorie / Müll', lbl_desc: 'Beschreibung',
    rec_none: 'Einmalig', rec_weekly: 'Wöchentlich', rec_monthly: 'Monatlich', rec_yearly: 'Jährlich',
    ph_title: '...', ph_desc: 'Details...',
    btn_cancel: 'Abbrechen', btn_save: 'Meow',
    
    // SETTINGS TABS
    st_general: 'Allgemein', st_data: 'Daten', st_notify: 'Alerts',

    set_bg: 'Hintergrund-Bild', set_bg_ph: 'Bild-URL oder Upload...', set_bg_current: 'Aktuell', set_upload: 'Bild hochladen',
    set_data: 'System Backup (JSON)', set_export: 'Sichern', set_import: 'Wiederherstellen',
    set_cal_appt: 'Kalender: Termine (ICS)', set_cal_bday: 'Kalender: Wiegenfeste (ICS)',
    set_export_simple: 'Export', set_import_simple: 'Import',
    set_lang: 'Sprache / Language', info_projects: 'IssyMeow Projects',
    set_notify_time: 'Tägliche Alarm-Zeit',
    set_sec_appt: 'Benachrichtigung: Termine & Müll',
    set_sec_bday: 'Benachrichtigung: Wiegenfeste',
    set_tele: 'Telegram Bot', set_tele_token: 'Bot Token', set_tele_chat: 'Chat ID / @Kanal', set_test: 'Testen',
    set_email: 'E-Mail (SMTP)', set_host: 'SMTP Host', set_user: 'User / E-Mail', set_pass: 'Passwort',
    set_rss: 'RSS Feed (3 Tage Vorschau)',
    trash_none: 'Keine', trash_yellow: 'Gelb', trash_blue: 'Papier', trash_brown: 'Bio', trash_black: 'Rest',
    msg_import_success: 'Erfolgreich! Meow!', msg_import_error: 'Fehler beim Importieren.', msg_upload_error: 'Fehler beim Upload.'
  },
  en: {
    nav_home: 'Home', nav_add: 'New Entry', nav_settings: 'Settings',
    col_birthdays: 'Birthdays', col_appointments: 'Appointments', col_notes: 'Notes',
    card_turns: 'turns',
    modal_add_title: 'New Entry', modal_settings_title: 'Settings',
    tab_appt: 'Event', tab_bday: 'Birthday', tab_note: 'Note',
    lbl_title_bday: 'Person Name', lbl_title_note: 'Note Title', lbl_title_appt: 'Title',
    lbl_date: 'Date', lbl_time: 'Time', lbl_allday: 'All Day',
    lbl_recurrence: 'Recurrence', lbl_category: 'Category / Trash', lbl_desc: 'Description',
    rec_none: 'One-time', rec_weekly: 'Weekly', rec_monthly: 'Monthly', rec_yearly: 'Yearly',
    ph_title: '...', ph_desc: 'Details...',
    btn_cancel: 'Cancel', btn_save: 'Meow',

    st_general: 'General', st_data: 'Data', st_notify: 'Alerts',

    set_bg: 'Background Image', set_bg_ph: 'Image URL or Upload...', set_bg_current: 'Current', set_upload: 'Upload Image',
    set_data: 'System Backup (JSON)', set_export: 'Backup', set_import: 'Restore',
    set_cal_appt: 'Calendar: Events (ICS)', set_cal_bday: 'Calendar: Birthdays (ICS)',
    set_export_simple: 'Export', set_import_simple: 'Import',
    set_lang: 'Language', info_projects: 'IssyMeow Projects',
    set_notify_time: 'Daily Alert Time',
    set_sec_appt: 'Notification: Events & Trash',
    set_sec_bday: 'Notification: Birthdays',
    set_tele: 'Telegram Bot', set_tele_token: 'Bot Token', set_tele_chat: 'Chat ID / @Channel', set_test: 'Test',
    set_email: 'E-Mail (SMTP)', set_host: 'SMTP Host', set_user: 'User / Email', set_pass: 'Password',
    set_rss: 'RSS Feed (3 Day Preview)',
    trash_none: 'None', trash_yellow: 'Recycle', trash_blue: 'Paper', trash_brown: 'Bio', trash_black: 'Trash',
    msg_import_success: 'Success! Meow!', msg_import_error: 'Error importing.', msg_upload_error: 'Error uploading.'
  },
  ru: {
    nav_home: 'Главная', nav_add: 'Новая запись', nav_settings: 'Настройки',
    col_birthdays: 'Дни рождения', col_appointments: 'Встречи', col_notes: 'Заметки',
    card_turns: 'исполняется',
    modal_add_title: 'Новая запись', modal_settings_title: 'Настройки',
    tab_appt: 'Встреча', tab_bday: 'День рожд.', tab_note: 'Заметка',
    lbl_title_bday: 'Имя', lbl_title_note: 'Заголовок', lbl_title_appt: 'Название',
    lbl_date: 'Дата', lbl_time: 'Время', lbl_allday: 'Весь день',
    lbl_recurrence: 'Повтор', lbl_category: 'Категория / Мусор', lbl_desc: 'Описание',
    rec_none: 'Один раз', rec_weekly: 'Еженедельно', rec_monthly: 'Ежемесячно', rec_yearly: 'Ежегодно',
    ph_title: '...', ph_desc: 'Подробности...',
    btn_cancel: 'Отмена', btn_save: 'Мяу',

    st_general: 'Общие', st_data: 'Данные', st_notify: 'Уведомл.',

    set_bg: 'Фоновое изображение', set_bg_ph: 'URL или загрузка...', set_bg_current: 'Текущее', set_upload: 'Загрузить',
    set_data: 'Бэкап данных (JSON)', set_export: 'Скачать', set_import: 'Восстановить',
    set_cal_appt: 'Календарь: Встречи (ICS)', set_cal_bday: 'Календарь: Дни рожд. (ICS)',
    set_export_simple: 'Экспорт', set_import_simple: 'Импорт',
    set_lang: 'Язык / Language', info_projects: 'IssyMeow Projects',
    set_notify_time: 'Время уведомления',
    set_sec_appt: 'Уведомления: Встречи и Мусор',
    set_sec_bday: 'Уведомления: Дни рождения',
    set_tele: 'Telegram Бот', set_tele_token: 'Токен бота', set_tele_chat: 'ID чата / @Kanal', set_test: 'Тест',
    set_email: 'E-Mail (SMTP)', set_host: 'SMTP Хост', set_user: 'Польз. / E-Mail', set_pass: 'Пароль',
    set_rss: 'RSS Лента (3 дня)',
    trash_none: 'Нет', trash_yellow: 'Желтый', trash_blue: 'Бумага', trash_brown: 'Био', trash_black: 'Остальное',
    msg_import_success: 'Успешно! Мяу!', msg_import_error: 'Ошибка импорта.', msg_upload_error: 'Ошибка загрузки.'
  }
}

// --- STATE ---
const birthdays = ref([])
const appointments = ref([])
const notes = ref([])
const activeSettingsTab = ref('general') // NEU: Tab-State

const settings = ref({ 
  backgroundUrl: '', language: 'de',
  daily_alert_time: '09:00',
  telegram_active: false, telegram_token: '', telegram_chatid: '',
  email_active: false, smtp_host: '', smtp_user: '', smtp_pass: ''
})

const t = (key) => { const lang = settings.value.language || 'de'; return translations[lang][key] || key }

// Modals
const showAddModal = ref(false)
const showSettingsModal = ref(false)
const showInfoModal = ref(false)

// File Inputs
const fileInputImport = ref(null)
const fileInputWallpaper = ref(null)
const fileInputIcs = ref(null)
const importTarget = ref('appointments') 

const newEntryType = ref('appointment') 
const newItem = ref({ title: '', date: '', time: '', note: '', trashType: 'none', recurrence: 'none', isAllDay: false })

// --- API ---
const loadData = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/data')
    const data = await response.json()
    birthdays.value = data.birthdays || []
    appointments.value = data.appointments || []
    notes.value = data.notes || []
    if (data.settings) settings.value = { ...settings.value, ...data.settings }

    birthdays.value.sort((a, b) => a.date.slice(5).localeCompare(b.date.slice(5)))
    appointments.value.sort((a, b) => new Date(a.date) - new Date(b.date))
  } catch (error) { console.error("Fehler beim Laden:", error) }
}

const saveData = async () => {
  const fullData = { settings: settings.value, birthdays: birthdays.value, appointments: appointments.value, notes: notes.value }
  try {
    await fetch('http://localhost:3000/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullData)
    })
  } catch (error) { console.error("Fehler beim Speichern:", error) }
}

const testNotification = async (type) => {
  const tempSettings = { ...settings.value, type: type };
  try {
    await fetch('http://localhost:3000/api/test-notification', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(tempSettings)
    });
    alert("Test gesendet! / Test sent! 🚀");
  } catch (e) { alert("Fehler beim Testen."); }
}

// --- FILE HANDLERS ---
const triggerWallpaperUpload = () => fileInputWallpaper.value.click()
const handleWallpaperFile = async (event) => {
  const file = event.target.files[0]; if (!file) return
  const formData = new FormData(); formData.append('wallpaper', file)
  try {
    const response = await fetch('http://localhost:3000/api/upload-wallpaper', { method: 'POST', body: formData })
    const data = await response.json()
    if (data.url) { settings.value.backgroundUrl = data.url + '?t=' + Date.now(); saveData() }
  } catch (error) { alert(t('msg_upload_error')) }
}
const triggerExport = () => window.open('http://localhost:3000/api/export', '_blank')
const triggerImport = () => fileInputImport.value.click()
const handleImportFile = async (event) => {
  const file = event.target.files[0]; if (!file) return
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const json = JSON.parse(e.target.result)
      await fetch('http://localhost:3000/api/import', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(json) })
      alert(t('msg_import_success')); location.reload()
    } catch (error) { alert(t('msg_import_error')) }
  }
  reader.readAsText(file)
}
const triggerExportIcs = (type) => window.open(`http://localhost:3000/api/export/ics?type=${type}`, '_blank')
const triggerImportIcs = (target) => { importTarget.value = target; fileInputIcs.value.click() }
const handleImportIcsFile = async (event) => {
  const file = event.target.files[0]; if (!file) return
  const formData = new FormData(); formData.append('ics', file)
  try {
    await fetch(`http://localhost:3000/api/import/ics?target=${importTarget.value}`, { method: 'POST', body: formData })
    alert(t('msg_import_success')); location.reload()
  } catch (error) { alert(t('msg_import_error')) }
}

// --- ACTIONS ---
const openAddModal = () => { newItem.value = { title: '', date: new Date().toISOString().split('T')[0], time: '', note: '', trashType: 'none', recurrence: 'none', isAllDay: false }; showAddModal.value = true }
const openSettingsModal = () => { activeSettingsTab.value = 'general'; showSettingsModal.value = true } // Reset Tab on Open
const openInfoModal = () => showInfoModal.value = true
const closeModal = () => { showAddModal.value = false; showSettingsModal.value = false; showInfoModal.value = false }
const saveSettings = () => { saveData(); closeModal() }

const addEntry = () => {
  const id = Date.now().toString()
  if (newEntryType.value === 'birthday') {
    birthdays.value.push({ id, name: newItem.value.title, date: newItem.value.date })
    birthdays.value.sort((a, b) => a.date.slice(5).localeCompare(b.date.slice(5)))
  } else if (newEntryType.value === 'appointment') {
    let finalDate = newItem.value.date
    if (!newItem.value.isAllDay && newItem.value.time) finalDate += ` ${newItem.value.time}`
    appointments.value.push({ id, title: newItem.value.title, date: finalDate, note: newItem.value.note, type: newItem.value.trashType === 'none' ? undefined : newItem.value.trashType, recurrence: newItem.value.recurrence, isAllDay: newItem.value.isAllDay })
    appointments.value.sort((a, b) => new Date(a.date) - new Date(b.date))
  } else if (newEntryType.value === 'note') {
    notes.value.push({ id, title: newItem.value.title, text: newItem.value.note })
  }
  saveData(); closeModal()
}

const deleteItem = (type, id) => {
  if (!confirm("Meow?")) return
  if (type === 'birthday') birthdays.value = birthdays.value.filter(x => x.id !== id)
  if (type === 'appointment') appointments.value = appointments.value.filter(x => x.id !== id)
  if (type === 'note') notes.value = notes.value.filter(x => x.id !== id)
  saveData()
}

const calculateAge = (dateString) => {
  if (!dateString) return ''
  const today = new Date(); const birthDate = new Date(dateString)
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--
  return age
}
const formatDate = (dateString) => {
  if (!dateString) return ''
  const dateObj = new Date(dateString)
  const hasTime = dateString.includes(':')
  let locale = 'de-DE'
  if (settings.value.language === 'en') locale = 'en-US'
  if (settings.value.language === 'ru') locale = 'ru-RU'
  return dateObj.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric', hour: hasTime ? '2-digit' : undefined, minute: hasTime ? '2-digit' : undefined })
}
const getEntryStyle = (type) => {
  let style = { border: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.05)' }
  if (type === 'yellow') { style.border = '2px solid #facc15'; style.boxShadow = '0 0 10px rgba(250, 204, 21, 0.3), inset 0 0 5px rgba(250, 204, 21, 0.1)' }
  else if (type === 'blue') { style.border = '2px solid #60a5fa'; style.boxShadow = '0 0 10px rgba(96, 165, 250, 0.3), inset 0 0 5px rgba(96, 165, 250, 0.1)' }
  else if (type === 'brown') { style.border = '2px solid #ea580c'; style.boxShadow = '0 0 10px rgba(234, 88, 12, 0.3), inset 0 0 5px rgba(234, 88, 12, 0.1)' }
  else if (type === 'black') { style.border = '2px solid #9ca3af'; style.boxShadow = '0 0 10px rgba(156, 163, 175, 0.2), inset 0 0 5px rgba(156, 163, 175, 0.1)' }
  return style
}
const getRecurrenceLabel = (type) => {
  const map = { daily: 'Täglich', weekly: 'Wöchentlich', monthly: 'Monatlich', yearly: 'Jährlich' }
  const mapEn = { daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly', yearly: 'Yearly' }
  const mapRu = { daily: 'Ежедневно', weekly: 'Еженедельно', monthly: 'Ежемесячно', yearly: 'Ежегодно' }
  if (settings.value.language === 'en') return mapEn[type] || ''
  if (settings.value.language === 'ru') return mapRu[type] || ''
  return map[type] || ''
}
const bgStyle = computed(() => {
  const url = settings.value.backgroundUrl && settings.value.backgroundUrl.length > 5 ? settings.value.backgroundUrl : defaultWallpaper
  return { backgroundImage: `url('${url}')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }
})
onMounted(() => { loadData() })
</script>

<template>
  <div class="min-h-screen w-full text-white font-sans overflow-hidden relative" :style="bgStyle">
    <nav>
      <button :title="t('nav_home')" class="p-1 opacity-90 hover:opacity-100 hover:scale-110 transition bg-white/10 rounded-full mb-2">
        <img :src="catIcon" style="width: 32px; height: 32px;" class="object-contain invert" alt="Home" />
      </button>
      <button :title="t('nav_add')" @click="openAddModal"><PhPlus size="24" /></button>
      <div style="flex-grow:1"></div>
      <button :title="t('nav_settings')" @click="openSettingsModal"><PhGear size="24" /></button>
    </nav>

    <div id="home">
      <div class="dashboard-grid">
        <div class="glass-column">
          <div class="column-header"><PhCake size="20" /> {{ t('col_birthdays') }} <PhCake size="20" /></div>
          <div class="column-content">
            <div v-for="person in birthdays" :key="person.id" class="card-entry relative group flex items-center justify-between">
              <div class="flex-1 pr-2">
                <h3 class="font-black text-xl text-white tracking-wide truncate">{{ person.name }}</h3>
                <p class="text-xs text-gray-400 mt-1 uppercase tracking-wider flex items-center gap-1"><PhCake weight="fill" class="mr-1" /> {{ formatDate(person.date) }}</p>
              </div>
              <div class="flex flex-col items-center justify-center px-4 border-l-2 border-r-2 border-white/20 ml-2 min-w-[90px]">
                <span class="text-[9px] uppercase text-gray-400 font-bold tracking-widest leading-none mb-1 opacity-70">{{ t('card_turns') }}</span>
                <span class="text-4xl font-black text-pink-400 leading-none drop-shadow-md">{{ calculateAge(person.date) + 1 }}</span>
              </div>
              <button @click="deleteItem('birthday', person.id)" class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition cursor-pointer bg-black/50 rounded-full p-1 backdrop-blur-sm z-10"><PhTrash size="14" /></button>
            </div>
          </div>
        </div>
        <div class="glass-column">
          <div class="column-header"><PhCalendarBlank size="20" /> {{ t('col_appointments') }} <PhCalendarBlank size="20" /></div>
          <div class="column-content">
            <div v-for="appt in appointments" :key="appt.id" class="card-entry relative group" :style="getEntryStyle(appt.type)">
               <div class="flex justify-between items-start">
                 <h3 class="font-bold text-lg text-white">{{ appt.title }}</h3>
                 <div v-if="appt.recurrence && appt.recurrence !== 'none'" class="bg-blue-500/20 px-2 py-0.5 rounded text-[10px] text-blue-200 flex items-center gap-1 ml-2"><PhArrowClockwise /> {{ getRecurrenceLabel(appt.recurrence) }}</div>
               </div>
               <p class="text-sm text-gray-300 mt-1 flex items-center gap-2">{{ formatDate(appt.date) }}</p>
               <p v-if="appt.note" class="text-xs text-gray-400 italic mt-2 border-t border-white/5 pt-1">{{ appt.note }}</p>
               <button @click="deleteItem('appointment', appt.id)" class="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition cursor-pointer bg-black/50 rounded-full p-1 backdrop-blur-sm"><PhTrash size="14" /></button>
            </div>
          </div>
        </div>
        <div class="glass-column">
          <div class="column-header"><PhNotePencil size="20" /> {{ t('col_notes') }} <PhNotePencil size="20" /></div>
          <div class="column-content">
            <div v-for="note in notes" :key="note.id" class="card-entry group relative border border-white/10">
              <h3 class="font-bold mb-1 text-white border-b border-white/10 pb-1">{{ note.title }}</h3>
              <p class="text-sm text-gray-300 leading-relaxed mt-2 whitespace-pre-wrap">{{ note.text }}</p>
              <button @click="deleteItem('note', note.id)" class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition cursor-pointer bg-black/50 rounded-full p-1 backdrop-blur-sm"><PhTrash size="14" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div @click="openInfoModal" class="fixed z-[100]" style="top: 24px; right: 24px;">
        <button class="w-[45px] h-[45px] rounded-full bg-[#1e1e1e]/60 backdrop-blur-md border border-white/20 flex justify-center items-center shadow-lg hover:bg-white/20 hover:scale-110 transition cursor-pointer">
            <img :src="catIcon" style="width: 24px; height: 24px;" class="object-contain invert" alt="Info" />
        </button>
    </div>

    <div v-if="showAddModal" class="fixed inset-0 h-screen w-screen z-[9999] flex items-center justify-center blur-overlay transition-all duration-300 p-4">
      <div class="deepin-box w-[90%] max-w-[650px] flex flex-col max-h-[90vh]">
        <div class="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h2 class="text-2xl font-bold text-white flex gap-3 items-center tracking-wide"><span class="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl shadow-lg"><PhPlus weight="bold" class="text-white"/></span> {{ t('modal_add_title') }}</h2>
          <button @click="closeModal" class="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition"><PhX size="28" /></button>
        </div>
        <div class="p-8 overflow-y-auto custom-scrollbar flex-1">
          <div class="grid grid-cols-3 gap-3 mb-8 p-1.5 bg-black/40 rounded-full shadow-inner">
             <button @click="newEntryType = 'appointment'" :class="newEntryType === 'appointment' ? 'bg-gradient-to-b from-blue-600 to-blue-700 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'" class="py-3 rounded-full text-sm font-bold transition">{{ t('tab_appt') }}</button>
             <button @click="newEntryType = 'birthday'" :class="newEntryType === 'birthday' ? 'bg-gradient-to-b from-pink-600 to-pink-700 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'" class="py-3 rounded-full text-sm font-bold transition">{{ t('tab_bday') }}</button>
             <button @click="newEntryType = 'note'" :class="newEntryType === 'note' ? 'bg-gradient-to-b from-emerald-600 to-emerald-700 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'" class="py-3 rounded-full text-sm font-bold transition">{{ t('tab_note') }}</button>
          </div>
          <div class="space-y-6">
            <div class="flex flex-col gap-2">
              <label class="text-sm font-semibold text-gray-300 ml-2">{{ newEntryType === 'birthday' ? t('lbl_title_bday') : (newEntryType === 'note' ? t('lbl_title_note') : t('lbl_title_appt')) }}</label>
              <input v-model="newItem.title" type="text" class="glass-input w-full px-3 py-3 rounded-2xl text-base shadow-inner focus:border-blue-500/50 outline-none transition placeholder-gray-500" :placeholder="t('ph_title')">
            </div>
            <div v-if="newEntryType !== 'note'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div class="flex flex-col gap-2">
                  <label class="text-sm font-semibold text-gray-300 ml-2">{{ t('lbl_date') }}</label>
                  <input v-model="newItem.date" type="date" class="glass-input w-full px-3 py-3 rounded-2xl text-base shadow-inner focus:border-blue-500/50 outline-none transition [color-scheme:dark]">
               </div>
               <div v-if="newEntryType === 'appointment'" class="flex flex-col gap-2">
                  <div class="flex justify-between items-center ml-2 mr-2">
                      <label class="text-sm font-semibold text-gray-300">{{ t('lbl_time') }}</label>
                      <div class="flex items-center gap-2 cursor-pointer" @click="newItem.isAllDay = !newItem.isAllDay">
                          <div :class="newItem.isAllDay ? 'bg-green-500' : 'bg-gray-600'" class="w-8 h-4 rounded-full relative transition-colors duration-300"><div :class="newItem.isAllDay ? 'translate-x-4 bg-white' : 'translate-x-0 bg-gray-300'" class="w-4 h-4 rounded-full absolute top-0 left-0 transition-transform duration-300 shadow-sm"></div></div>
                          <span class="text-xs text-gray-400">{{ t('lbl_allday') }}</span>
                      </div>
                  </div>
                  <input v-if="!newItem.isAllDay" v-model="newItem.time" type="time" class="glass-input w-full px-3 py-3 rounded-2xl text-base shadow-inner focus:border-blue-500/50 outline-none transition [color-scheme:dark]">
                  <div v-else class="w-full px-3 py-3 rounded-2xl text-base bg-white/5 border border-white/5 text-gray-500 text-center italic flex items-center justify-center gap-2"><PhClock size="24"/> {{ t('lbl_allday') }}</div>
               </div>
            </div>
            <div v-if="newEntryType === 'appointment'" class="flex flex-col gap-2">
               <label class="text-sm font-semibold text-gray-300 ml-2">{{ t('lbl_recurrence') }}</label>
               <select v-model="newItem.recurrence" class="glass-input w-full px-3 py-3 rounded-2xl text-base shadow-inner focus:border-blue-500/50 outline-none transition"><option value="none" class="bg-[#1a1a24]">{{ t('rec_none') }}</option><option value="weekly" class="bg-[#1a1a24]">{{ t('rec_weekly') }}</option><option value="monthly" class="bg-[#1a1a24]">{{ t('rec_monthly') }}</option><option value="yearly" class="bg-[#1a1a24]">{{ t('rec_yearly') }}</option></select>
            </div>
            <div v-if="newEntryType === 'appointment'" class="flex flex-col gap-2">
               <label class="text-sm font-semibold text-gray-300 ml-2">{{ t('lbl_category') }}</label>
               <div class="flex justify-between w-full">
                  <button @click="newItem.trashType = 'none'" :class="newItem.trashType === 'none' ? 'ring-4 ring-white/30 scale-105' : 'opacity-60 hover:opacity-100'" class="w-16 h-14 rounded-2xl flex justify-center items-center transition-all shadow-lg bg-gray-700 border border-gray-600 text-white" :title="t('trash_none')"><PhProhibit size="24" weight="bold" /></button>
                  <button @click="newItem.trashType = 'yellow'" :class="newItem.trashType === 'yellow' ? 'ring-4 ring-yellow-200/50 scale-105 opacity-100' : 'opacity-60 hover:opacity-100'" class="w-16 h-14 rounded-2xl transition-all shadow-lg flex justify-center items-center text-white drop-shadow-md" style="background-color: #facc15; border: 2px solid #eab308;" :title="t('trash_yellow')"><PhRecycle size="24" weight="bold" /></button>
                  <button @click="newItem.trashType = 'blue'" :class="newItem.trashType === 'blue' ? 'ring-4 ring-blue-300/50 scale-105 opacity-100' : 'opacity-60 hover:opacity-100'" class="w-16 h-14 rounded-2xl transition-all shadow-lg flex justify-center items-center text-white drop-shadow-md" style="background-color: #3b82f6; border: 2px solid #2563eb;" :title="t('trash_blue')"><PhNewspaper size="24" weight="bold" /></button>
                  <button @click="newItem.trashType = 'brown'" :class="newItem.trashType === 'brown' ? 'ring-4 ring-orange-300/50 scale-105 opacity-100' : 'opacity-60 hover:opacity-100'" class="w-16 h-14 rounded-2xl transition-all shadow-lg flex justify-center items-center text-white drop-shadow-md" style="background-color: #9a3412; border: 2px solid #7c2d12;" :title="t('trash_brown')"><PhLeaf size="24" weight="bold" /></button>
                  <button @click="newItem.trashType = 'black'" :class="newItem.trashType === 'black' ? 'ring-4 ring-gray-400/50 scale-105 opacity-100' : 'opacity-60 hover:opacity-100'" class="w-16 h-14 rounded-2xl transition-all shadow-lg flex justify-center items-center text-white drop-shadow-md" style="background-color: #374151; border: 2px solid #1f2937;" :title="t('trash_black')"><PhTrash size="24" weight="bold" /></button>
               </div>
            </div>
            <div v-if="newEntryType === 'note' || newEntryType === 'appointment'" class="flex flex-col gap-2">
               <label class="text-sm font-semibold text-gray-300 ml-2">{{ t('lbl_desc') }}</label>
               <textarea v-model="newItem.note" rows="4" class="glass-input w-full px-3 py-3 rounded-2xl text-base resize-none shadow-inner focus:border-blue-500/50 outline-none transition placeholder-gray-500" :placeholder="t('ph_desc')"></textarea>
            </div>
          </div>
        </div>
        <div class="p-6 bg-white/5 border-t border-white/10 flex justify-center gap-6 shadow-[0_-10px_20px_rgba(0,0,0,0.2)]">
          <button @click="closeModal" class="px-8 py-3 rounded-full text-base font-medium text-gray-400 bg-white/5 hover:bg-white/10 hover:text-white transition shadow-lg">{{ t('btn_cancel') }}</button>
          <button @click="addEntry" class="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-10 py-3 rounded-full shadow-lg shadow-blue-900/30 flex items-center gap-2 transition font-bold tracking-wide text-base"><PhCheck weight="bold" /> {{ t('btn_save') }}</button>
        </div>
      </div>
    </div>

    <div v-if="showSettingsModal" class="fixed inset-0 h-screen w-screen z-[9999] flex items-center justify-center blur-overlay p-4">
      <div class="deepin-box w-[90%] max-w-[550px] flex flex-col overflow-hidden">
        <div class="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h2 class="text-2xl font-bold text-white flex gap-3 items-center tracking-wide"><PhGear weight="bold" /> {{ t('modal_settings_title') }}</h2>
          <button @click="closeModal" class="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition"><PhX size="28" /></button>
        </div>
        
        <div class="px-6 pt-6 pb-2 border-b border-white/5 flex gap-2">
            <button @click="activeSettingsTab = 'general'" :class="activeSettingsTab === 'general' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'" class="px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2"><PhSliders /> {{ t('st_general') }}</button>
            <button @click="activeSettingsTab = 'data'" :class="activeSettingsTab === 'data' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'" class="px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2"><PhDatabase /> {{ t('st_data') }}</button>
            <button @click="activeSettingsTab = 'notify'" :class="activeSettingsTab === 'notify' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'" class="px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2"><PhBell /> {{ t('st_notify') }}</button>
        </div>

        <div class="p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1">
           
           <div v-if="activeSettingsTab === 'general'" class="space-y-8">
               <div class="flex flex-col gap-3">
                  <label class="text-sm font-semibold text-gray-300 ml-2">{{ t('set_lang') }}</label>
                  <div class="flex gap-4">
                     <button @click="settings.language = 'de'" :class="settings.language === 'de' ? 'bg-blue-600 border-blue-400 text-white' : 'bg-white/5 border-white/10 text-gray-400'" class="flex-1 py-4 border rounded-2xl flex items-center justify-center gap-2 font-bold transition hover:bg-white/10">DE</button>
                     <button @click="settings.language = 'en'" :class="settings.language === 'en' ? 'bg-blue-600 border-blue-400 text-white' : 'bg-white/5 border-white/10 text-gray-400'" class="flex-1 py-4 border rounded-2xl flex items-center justify-center gap-2 font-bold transition hover:bg-white/10">EN</button>
                     <button @click="settings.language = 'ru'" :class="settings.language === 'ru' ? 'bg-blue-600 border-blue-400 text-white' : 'bg-white/5 border-white/10 text-gray-400'" class="flex-1 py-4 border rounded-2xl flex items-center justify-center gap-2 font-bold transition hover:bg-white/10">RU</button>
                  </div>
               </div>

               <div class="flex flex-col gap-3 pt-6 border-t border-white/10">
                  <label class="text-sm font-semibold text-gray-300 ml-2">{{ t('set_bg') }}</label>
                  <div class="flex gap-2">
                     <input v-model="settings.backgroundUrl" type="text" class="glass-input flex-1 px-3 py-3 rounded-2xl text-base shadow-inner focus:border-blue-500/50 outline-none transition" :placeholder="t('set_bg_ph')">
                     <button @click="triggerWallpaperUpload" class="px-4 bg-blue-600/80 hover:bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg transition" :title="t('set_upload')"><PhUpload size="24" weight="bold" /></button>
                  </div>
                  <p class="text-xs text-gray-500 ml-2">{{ t('set_bg_current') }}: {{ settings.backgroundUrl || 'Standard (Lokal)' }}</p>
               </div>
           </div>

           <div v-if="activeSettingsTab === 'data'" class="space-y-8">
               <div class="flex flex-col gap-3">
                  <label class="text-sm font-semibold text-gray-300 ml-2 block mb-3">{{ t('set_data') }}</label>
                  <div class="flex gap-4">
                     <button @click="triggerExport" class="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 transition group">
                        <PhDownloadSimple size="28" class="text-blue-400 group-hover:scale-110 transition" />
                        <span class="text-xs font-bold text-gray-300 uppercase tracking-widest">{{ t('set_export') }}</span>
                     </button>
                     <button @click="triggerImport" class="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 transition group">
                        <PhCloudArrowUp size="28" class="text-pink-400 group-hover:scale-110 transition" />
                        <span class="text-xs font-bold text-gray-300 uppercase tracking-widest">{{ t('set_import') }}</span>
                     </button>
                  </div>
               </div>

               <div class="pt-6 border-t border-white/10">
                  <label class="text-sm font-semibold text-gray-300 ml-2 block mb-3">{{ t('set_cal_appt') }}</label>
                  <div class="flex gap-4 mb-6">
                     <button @click="triggerExportIcs('appointments')" class="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 transition group">
                        <PhDownloadSimple size="28" class="text-green-400 group-hover:scale-110 transition" />
                        <span class="text-xs font-bold text-gray-300 uppercase tracking-widest">{{ t('set_export_simple') }}</span>
                     </button>
                     <button @click="triggerImportIcs('appointments')" class="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 transition group">
                        <PhUploadSimple size="28" class="text-green-400 group-hover:scale-110 transition" />
                        <span class="text-xs font-bold text-gray-300 uppercase tracking-widest">{{ t('set_import_simple') }}</span>
                     </button>
                  </div>

                  <label class="text-sm font-semibold text-gray-300 ml-2 block mb-3">{{ t('set_cal_bday') }}</label>
                  <div class="flex gap-4">
                     <button @click="triggerExportIcs('birthdays')" class="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 transition group">
                        <PhDownloadSimple size="28" class="text-pink-400 group-hover:scale-110 transition" />
                        <span class="text-xs font-bold text-gray-300 uppercase tracking-widest">{{ t('set_export_simple') }}</span>
                     </button>
                     <button @click="triggerImportIcs('birthdays')" class="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 transition group">
                        <PhUploadSimple size="28" class="text-pink-400 group-hover:scale-110 transition" />
                        <span class="text-xs font-bold text-gray-300 uppercase tracking-widest">{{ t('set_import_simple') }}</span>
                     </button>
                  </div>
               </div>
               
               <div class="flex flex-col gap-3 pt-6 border-t border-white/10">
                  <label class="text-sm font-semibold text-gray-300 ml-2 flex items-center gap-2"><PhRss /> {{ t('set_rss') }}</label>
                  <div class="p-3 bg-black/30 rounded-2xl border border-white/10 text-xs text-gray-400 font-mono break-all select-all cursor-pointer hover:text-white" onclick="document.execCommand('copy')">
                     {{ rssLink }}
                  </div>
               </div>
           </div>

           <div v-if="activeSettingsTab === 'notify'" class="space-y-6">
              <div class="flex flex-col gap-2">
                  <label class="text-xs text-gray-400 ml-2">{{ t('set_notify_time') }}</label>
                  <input v-model="settings.daily_alert_time" type="time" class="glass-input w-full px-3 py-3 rounded-2xl text-base shadow-inner">
              </div>

              <div class="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                  <h3 class="text-xs font-bold text-blue-400 uppercase tracking-widest">{{ t('set_sec_appt') }}</h3>
                  <div class="space-y-2">
                      <div class="flex justify-between items-center">
                         <label class="text-xs font-bold text-gray-400 flex items-center gap-2"><PhPaperPlaneTilt /> Telegram</label>
                         <input type="checkbox" v-model="settings.tele_appt_active" class="w-4 h-4 rounded bg-black/50 border-white/20">
                      </div>
                      <div v-if="settings.tele_appt_active" class="space-y-2">
                          <input v-model="settings.tele_appt_token" type="text" class="glass-input w-full px-3 py-2 rounded-xl text-xs" :placeholder="t('set_tele_token')">
                          <div class="flex gap-2">
                              <input v-model="settings.tele_appt_chat" type="text" class="glass-input flex-1 px-3 py-2 rounded-xl text-xs" :placeholder="t('set_tele_chat')">
                              <button @click="testNotification('telegram', 'appt')" class="px-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold transition">{{ t('set_test') }}</button>
                          </div>
                      </div>
                  </div>
                  <div class="space-y-2 pt-2 border-t border-white/5">
                      <div class="flex justify-between items-center">
                         <label class="text-xs font-bold text-gray-400 flex items-center gap-2"><PhEnvelope /> E-Mail</label>
                         <input type="checkbox" v-model="settings.mail_appt_active" class="w-4 h-4 rounded bg-black/50 border-white/20">
                      </div>
                      <div v-if="settings.mail_appt_active" class="space-y-2">
                          <input v-model="settings.mail_appt_host" type="text" class="glass-input w-full px-3 py-2 rounded-xl text-xs" :placeholder="t('set_host')">
                          <input v-model="settings.mail_appt_user" type="text" class="glass-input w-full px-3 py-2 rounded-xl text-xs" :placeholder="t('set_user')">
                          <div class="flex gap-2">
                              <input v-model="settings.mail_appt_pass" type="password" class="glass-input flex-1 px-3 py-2 rounded-xl text-xs" :placeholder="t('set_pass')">
                              <button @click="testNotification('email', 'appt')" class="px-3 bg-green-600 hover:bg-green-500 rounded-xl text-xs font-bold transition">{{ t('set_test') }}</button>
                          </div>
                      </div>
                  </div>
              </div>

              <div class="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                  <h3 class="text-xs font-bold text-pink-400 uppercase tracking-widest">{{ t('set_sec_bday') }}</h3>
                  <div class="space-y-2">
                      <div class="flex justify-between items-center">
                         <label class="text-xs font-bold text-gray-400 flex items-center gap-2"><PhPaperPlaneTilt /> Telegram</label>
                         <input type="checkbox" v-model="settings.tele_bday_active" class="w-4 h-4 rounded bg-black/50 border-white/20">
                      </div>
                      <div v-if="settings.tele_bday_active" class="space-y-2">
                          <input v-model="settings.tele_bday_token" type="text" class="glass-input w-full px-3 py-2 rounded-xl text-xs" :placeholder="t('set_tele_token')">
                          <div class="flex gap-2">
                              <input v-model="settings.tele_bday_chat" type="text" class="glass-input flex-1 px-3 py-2 rounded-xl text-xs" :placeholder="t('set_tele_chat')">
                              <button @click="testNotification('telegram', 'bday')" class="px-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold transition">{{ t('set_test') }}</button>
                          </div>
                      </div>
                  </div>
                  <div class="space-y-2 pt-2 border-t border-white/5">
                      <div class="flex justify-between items-center">
                         <label class="text-xs font-bold text-gray-400 flex items-center gap-2"><PhEnvelope /> E-Mail</label>
                         <input type="checkbox" v-model="settings.mail_bday_active" class="w-4 h-4 rounded bg-black/50 border-white/20">
                      </div>
                      <div v-if="settings.mail_bday_active" class="space-y-2">
                          <input v-model="settings.mail_bday_host" type="text" class="glass-input w-full px-3 py-2 rounded-xl text-xs" :placeholder="t('set_host')">
                          <input v-model="settings.mail_bday_user" type="text" class="glass-input w-full px-3 py-2 rounded-xl text-xs" :placeholder="t('set_user')">
                          <div class="flex gap-2">
                              <input v-model="settings.mail_bday_pass" type="password" class="glass-input flex-1 px-3 py-2 rounded-xl text-xs" :placeholder="t('set_pass')">
                              <button @click="testNotification('email', 'bday')" class="px-3 bg-green-600 hover:bg-green-500 rounded-xl text-xs font-bold transition">{{ t('set_test') }}</button>
                          </div>
                      </div>
                  </div>
              </div>
           </div>

        </div>
        <div class="p-6 border-t border-white/10 flex justify-center gap-6 bg-white/5">
           <button @click="closeModal" class="px-8 py-3 rounded-full text-base font-medium text-gray-400 bg-white/5 hover:bg-white/10 hover:text-white transition shadow-lg">{{ t('btn_cancel') }}</button>
           <button @click="saveSettings" class="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-10 py-3 rounded-full shadow-lg flex items-center gap-2 transition font-bold text-base"><PhFloppyDisk weight="bold"/> {{ t('btn_save') }}</button>
        </div>
      </div>
    </div>

    <div v-if="showInfoModal" class="fixed inset-0 h-screen w-screen z-[9999] flex items-center justify-center blur-overlay p-4">
      <div class="deepin-box w-[90%] max-w-[450px] overflow-hidden text-center p-8 rounded-3xl">
         <div class="w-[280px] h-[280px] mx-auto mb-8 bg-white/10 rounded-full flex items-center justify-center border border-white/20 shadow-2xl">
             <img :src="catIcon" style="width: 240px; height: 240px;" class="object-contain invert drop-shadow-xl" />
         </div>
         <h2 class="text-3xl font-black text-white mb-2">Meow Reminder</h2>
         <p class="text-gray-400 text-base mb-6">v1.1.0 • Paw Edition</p>
         
         <div class="mb-8">
            <p class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">{{ t('info_projects') }}</p>
            <div class="grid grid-cols-2 gap-4">
               <a href="https://github.com/IssyMeow/Meow-Reminder/" target="_blank" class="flex items-center justify-center gap-3 py-4 rounded-2xl bg-[#2a2a35] shadow-xl hover:scale-105 hover:bg-[#353542] transition group" title="GitHub">
                  <PhLink size="24" class="text-white group-hover:text-blue-300" />
                  <span class="text-sm font-bold text-white">GitHub</span>
               </a>
               <a href="http://youtube.com/@MeowTunesOfficial" target="_blank" class="flex items-center justify-center gap-3 py-4 rounded-2xl bg-[#2a2a35] shadow-xl hover:scale-105 hover:bg-[#353542] transition group" title="YouTube">
                  <PhMonitorPlay size="24" class="text-white group-hover:text-red-500" />
                  <span class="text-sm font-bold text-white">YouTube</span>
               </a>
               <a href="http://issymeow.bandcamp.com/" target="_blank" class="flex items-center justify-center gap-3 py-4 rounded-2xl bg-[#2a2a35] shadow-xl hover:scale-105 hover:bg-[#353542] transition group" title="Bandcamp">
                  <PhVinylRecord size="24" class="text-white group-hover:text-teal-400" />
                  <span class="text-sm font-bold text-white">Bandcamp</span>
               </a>
               <a href="http://t.me/MeowTunesOfficial" target="_blank" class="flex items-center justify-center gap-3 py-4 rounded-2xl bg-[#2a2a35] shadow-xl hover:scale-105 hover:bg-[#353542] transition group" title="Telegram">
                  <PhPaperPlane size="24" class="text-white group-hover:text-blue-400" />
                  <span class="text-sm font-bold text-white">Telegram</span>
               </a>
            </div>
         </div>

         <div class="pt-6 border-t border-white/10 flex justify-center">
            <button @click="closeModal" class="w-[70px] h-[70px] rounded-full bg-blue-600/80 backdrop-blur-md border border-blue-400 flex flex-col justify-center items-center shadow-lg hover:bg-blue-500 hover:scale-110 transition cursor-pointer">
               <span class="text-[11px] font-bold uppercase tracking-widest text-white">{{ t('btn_save') }}</span>
               <PhCheck size="24" class="text-white" />
            </button>
         </div>
      </div>
    </div>
    
    <input type="file" ref="fileInputWallpaper" class="hidden" accept="image/*" @change="handleWallpaperFile">
    <input type="file" ref="fileInputImport" class="hidden" accept=".json" @change="handleImportFile">
    <input type="file" ref="fileInputIcs" class="hidden" accept=".ics" @change="handleImportIcsFile">

  </div>
</template>

<style scoped>
.custom-scrollbar {
  scrollbar-width: none; /* Firefox */
}
.custom-scrollbar::-webkit-scrollbar { 
  display: none; /* Chrome/Safari */
}

.blur-overlay {
  background-color: rgba(0, 0, 0, 0.4); 
  backdrop-filter: blur(15px);          
  -webkit-backdrop-filter: blur(15px);  
}

.deepin-box {
  background-color: rgba(30, 30, 40, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
  color: white;
}

/* INPUTS: Explizit dunkel & Rund & KEIN SCROLLBAR */
.glass-input, 
.glass-input option {
  background-color: rgba(0, 0, 0, 0.4) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: white !important;
  
  /* Reset */
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  
  /* Overflow & Width Management - FIX SCROLLBAR */
  overflow: hidden;
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
  
  /* Schrift fixieren damit keine seltsamen Höhen entstehen */
  line-height: normal;
}

/* FIX: Kalender-Icon und inneres Layout - WICHTIG */
.glass-input::-webkit-date-and-time-value {
   margin: 0;
   padding: 0;
   line-height: normal;
   text-align: left;
   display: block; /* Zwingt Block-Layout */
   min-height: 1.2em; /* Platzhalterhöhe */
}

/* Scrollbar Killers */
.glass-input::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

.glass-input::-webkit-inner-spin-button,
.glass-input::-webkit-calendar-picker-indicator {
    margin-left: 10px;
    cursor: pointer;
}

.glass-input:focus {
  border-color: #3b82f6 !important; 
  background-color: rgba(0, 0, 0, 0.6) !important;
}
</style>

