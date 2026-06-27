// localStorage helpers + seeded entries so the demo opens fully populated

const ENTRIES_KEY = 'mannmitra.entries.v2'
const CONFIG_KEY = 'mannmitra.config.v1'

export function loadEntries() {
  try {
    const raw = localStorage.getItem(ENTRIES_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch { return null }
}

export function saveEntries(entries) {
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries))
}

export function loadConfig() {
  try {
    const raw = localStorage.getItem(CONFIG_KEY)
    return raw ? JSON.parse(raw) : { examTarget: 'NEET', name: 'Aarav' }
  } catch { return { examTarget: 'NEET', name: 'Aarav' } }
}

export function saveConfig(cfg) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg))
}

export function clearAll() {
  localStorage.removeItem(ENTRIES_KEY)
  localStorage.removeItem(CONFIG_KEY)
}
