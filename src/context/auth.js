import { defineStore } from 'pinia'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: true
  }),
  actions: {
    init() {
      const auth = getAuth()
      onAuthStateChanged(auth, (user) => {
        this.user = user ? { uid: user.uid, email: user.email } : null
        this.loading = false
        if (user) {
          sessionStorage.setItem('auth', 'true')
        } else {
          sessionStorage.removeItem('auth')
        }
      })
    },
    logout() {
      const auth = getAuth()
      signOut(auth)
      this.user = null
      sessionStorage.removeItem('auth')
    }
  }
})
