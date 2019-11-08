import request from '@/utils/request'
// import Qs from 'qs'

// 请求列表
export function posterList(params) {
  return request({
    url: '/community/ActivityController/selectActivity.do',
    method: 'get',
    params
  })
}
// 请求详情
export function posterDetails(params) {
  return request({
    url: '/community/ActivityController/selectActivityById.do',
    method: 'get',
    params
  })
}
// 添加广告
export function addPoster(params) {
  return request({
    url: '/community/ActivityController/insertActivity.do',
    method: 'post',
    data: params
  })
}
// 删除广告
export function delPoster(params) {
  return request({
    url: '/community/ActivityController/deletenActivityById.do',
    method: 'delete',
    params
  })
}
// 发布广告
export function publishPoster(params) {
  return request({
    url: '/community/ActivityController/updateReleaseById.do',
    method: 'post',
    data: params
  })
}

