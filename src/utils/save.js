const SAVE_KEY = 'text_rpg_save_v1'
export function saveGameData(state) {
  try {
    const s = JSON.stringify(state)
    localStorage.setItem(SAVE_KEY, btoa(unescape(encodeURIComponent(s))))
  } catch (e) {
    console.error('save failed', e)
  }
}
export function loadGameData() {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    const json = decodeURIComponent(escape(atob(raw)))
    return JSON.parse(json)
  } catch (e) {
    console.error('load failed', e)
    return null
  }
}
