// Local-only session. No backend — the "account" lives in localStorage on this
// device, in keeping with MannMitra's no-signup, privacy-on-device approach.

const USER_KEY = 'mannmitra.user.v1'

export function loadUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearUser() {
  localStorage.removeItem(USER_KEY)
}
