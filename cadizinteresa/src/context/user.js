import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)

  const setUser = (newUser) => {
    user.value = newUser
  }

  const logout = () => {
    user.value = null
  }

  return {
    user,
    setUser,
    logout
  }
})
