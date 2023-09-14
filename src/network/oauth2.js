import { request } from './axios'

export function qrcode() {
  return request()({
    method: 'get',
    url: '/oauth/wechat/qrcode',
    responseType: 'blob'
  })
}

export function heartbeat(key) {
  return request()({
    method: 'get',
    url: '/oauth/wechat/heartbeat',
    params: {
      key: key
    },
  })
}
