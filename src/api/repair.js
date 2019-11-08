import request from '@/utils/request'
// import Qs from 'qs'

// 报修列表
export function repairsList(params) {
  return request({
    url: '/community/RepairsControlletr/selectRepairs.do',
    method: 'get',
    params
  })
}
// 维修人员列表
export function repairsPersonList(params) {
  return request({
    url: '/community/RepairsControlletr/selectServicemanName.do',
    method: 'get',
    params
  })
}
// 指派处理驳回
export function changeState(params) {
  return request({
    url: '/community/RepairsControlletr/updateRepairs.do',
    method: 'post',
    data: params
  })
}
// 维修人员的列表
export function ServicemanList(params) {
  return request({
    url: '/community/ServicemanController/selectServiceman.do',
    method: 'get',
    params
  })
}
// 添加维修人员
export function addRepairPerson(params) {
  return request({
    url: '/community/ServicemanController/insertServiceman.do',
    method: 'post',
    data: params
  })
}
// 删除维修人员
export function delRepairPerson(params) {
  return request({
    url: '/community/ServicemanController/deletenServicemanById.do',
    method: 'delete',
    params
  })
}
