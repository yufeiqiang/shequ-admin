import request from '@/utils/request'
// import Qs from 'qs'

// 小区列表
export function communityList(params) {
  return request({
    url: '/community/CommunityController/selectCommunity.do',
    method: 'get',
    params
  })
}

// 物业类型
export function propertyType(params) {
  return request({
    url: '/community/CommunityController/getCommState.do',
    method: 'get',
    params
  })
}
// 机构类型
export function selectOgrName(params) {
  return request({
    url: '/community/CommunityController/selectOgrName.do',
    method: 'get',
    params
  })
}
// 添加小区
export function addCommunity(params) {
  return request({
    url: '/community/CommunityController/insertCommunity.do',
    method: 'post',
    data: params
  })
}
// 删除小区
export function delCommunity(params) {
  return request({
    url: '/community/CommunityController/deleteCommunityById.do',
    method: 'delete',
    params
  })
}
// 楼栋列表
export function MansionList(params) {
  return request({
    url: '/community/MansionController/selectMansion.do',
    method: 'get',
    params
  })
}
// 请求小区列表
export function selectCommunityList(params) {
  return request({
    url: '/community/MansionController/selectCommunityByOrgId.do',
    method: 'get',
    params
  })
}
// 添加楼栋
export function addMansion(params) {
  return request({
    url: '/community/MansionController/insertMansion.do',
    method: 'post',
    data: params
  })
}
// 删除小区
export function delMansion(params) {
  return request({
    url: '/community/MansionController/deleteMansionById.do',
    method: 'delete',
    params
  })
}
// 房间列表
export function houseList(params) {
  return request({
    url: '/community/HouseController/selectHouse.do',
    method: 'get',
    params
  })
}
// 增加时请求楼栋列表
export function MansionHouseList(params) {
  return request({
    url: '/community/MansionController/selectMansionByOrgId.do',
    method: 'get',
    params
  })
}
// 房屋类型
export function HouseEnum(params) {
  return request({
    url: '/community/HouseController/selectHouseEnum.do',
    method: 'get',
    params
  })
}
// 房屋户型
export function HouseTypeEnum(params) {
  return request({
    url: '/community/HouseController/selectHouseTypeEnum.do',
    method: 'get',
    params
  })
}
// 添加房屋
export function addHouse(params) {
  return request({
    url: '/community/HouseController/insertHouse.do',
    method: 'post',
    data: params
  })
}
// 删除房间
export function delHouseById(params) {
  return request({
    url: '/community/HouseController/deletenHouseById.do',
    method: 'delete',
    params
  })
}