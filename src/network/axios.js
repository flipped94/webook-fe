import axios from 'axios'
import { useUserStore } from '../store/user'
const BASE_URL = 'http://live.webook.com'
export function request() {
  const user = useUserStore()
  var instance
  if (user.token != '') {
    instance = axios.create({
      baseURL: BASE_URL,
      timeout: 3000,
      headers: {
        Authorization: 'Bear ' + user.token
      }
    })
  } else {
    instance = axios.create({
      baseURL: BASE_URL,
      timeout: 3000
    })
  }

  instance.interceptors.request.use(
    (data) => {
      return data
    },
    (err) => {
      return err
    }
  )
  instance.interceptors.response.use(
    (data) => {
      return data
    },
    (err) => {
      return err
    }
  )
  return instance
}
