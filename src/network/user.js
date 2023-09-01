import { request } from './axios'

export function accountLogin(account, password) {
  return request()({
    method: 'post',
    url: '/users/login',
    data: {
      email: account,
      password: password
    }
  })
}

export function profile() {
  return request()({
    method: 'get',
    url: '/users/profile'
  })
}
