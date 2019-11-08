import request from '@/utils/request'
// import Qs from 'qs'

export function login(data) {
  return request({
    url: '/community/managerLogin/login.do',
    method: 'post',
    data
  })
}

export function getInfo(data) {
  return request({
    url: '/community/managerLogin/getManagerInfo.do',
    method: 'post',
    data: data
  })
}

export function logout(data) {
  return request({
    url: '/community/managerLogin/loginOut.do',
    method: 'get',
    params: data
  })
}
