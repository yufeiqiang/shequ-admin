import request from '@/utils/request'
// import Qs from 'qs'

// 请求设备列表
export function equipList(params) {
  return request({
    url: '/community/DoorGuardController/selectDoorGuard.do',
    method: 'get',
    params
  })
}
// 请求楼栋
export function buildingList(params) {
  return request({
    url: '/community/MansionController/selectMansionPage.do',
    method: 'get',
    params
  })
}
// 添加设备
export function equipAdd(params) {
  return request({
    url: '/community/DoorGuardController/insertDoorGuard.do',
    method: 'post',
    data: params
  })
}
// 删除设备
export function equipDelete(params) {
  return request({
    url: '/community/DoorGuardController/deletenDoorGuardById.do',
    method: 'delete',
    params
  })
}
// 请求电表
export function elecMeterList(params) {
  return request({
    url: '/community/elecMeter/queryList.do',
    method: 'post',
    data: params
  })
}
// 添加电表
export function addelecMeter(params) {
  return request({
    url: '/community/elecMeter/addorUpdate.do',
    method: 'post',
    data: params
  })
}
// 删除电表
export function delElecMeter(params) {
  return request({
    url: '/community/elecMeter/delete.do',
    method: 'delete',
    params
  })
}
// 用电记录列表
export function logList(params) {
  return request({
    url: '/community/elecMeter/queryEleHistory.do',
    method: 'post',
    data: params
  })
}
// 查看设备状态
export function seeStateList(params) {
  return request({
    url: '/community/elecMeter/selectOnline.do',
    method: 'get',
    params
  })
}
// 查看设备状态
export function elecMeterDetails(params) {
  return request({
    url: '/community/elecMeter/getById.do',
    method: 'get',
    params
  })
}
// 导出excel
export function excelList(params) {
  return request({
    url: '/community/elecMeter/exportList.do',
    method: 'post',
    data: params
  })
}