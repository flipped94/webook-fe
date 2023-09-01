import { defineStore } from 'pinia'
export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    loginStatus: false,
    jwtToken: '',
    info: {}
  }),
  getters: {
    token: (state) => state.jwtToken,
    login: (stake) => stake.loginStatus
  },
  actions: {
    editToken(s) {
      this.jwtToken = s
    },
    editLoginStatus(b) {
      this.loginStatus = b
    }
  }
})
