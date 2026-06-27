// Top-level gate: landing → login → app. Auth is a local session (lib/auth.js).

import { useState } from 'react'
import Landing from './components/Landing'
import Login from './components/Login'
import App from './App'
import { loadUser, saveUser, clearUser } from './lib/auth'

export default function Root() {
  const [user, setUser] = useState(() => loadUser())
  // Returning users with a saved session land straight in the app.
  const [view, setView] = useState(() => (loadUser() ? 'app' : 'landing'))

  function handleLogin(u) {
    saveUser(u)
    setUser(u)
    setView('app')
  }

  function handleSignOut() {
    clearUser()
    setUser(null)
    setView('landing')
  }

  if (view === 'app' && user) {
    return <App user={user} onSignOut={handleSignOut} />
  }
  if (view === 'login') {
    return <Login onLogin={handleLogin} onBack={() => setView('landing')} />
  }
  return <Landing onGetStarted={() => setView('login')} />
}
