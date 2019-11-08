import request from '@/utils/request'
// import Qs from 'qs'

// 用户列表

export function userList(params) {
  return request({
    url: '/community/AppUserController/selectAppUser.do',
    method: 'get',
    params
  })
}

// 删除用户
export function delUserinfo(params) {
  return request({
    url: '/community/AppUserController/deleteAppUserById.do',
    method: 'delete',
    params
  })
}

// 用户添加
export function userinfoAdd(params) {
  return request({
    url: '/community/AppUserController/insertAppUser.do',
    method: 'post',
    data: params
  })
}
// 判断用户是否存在
export function isUser(params) {
  return request({
    url: '/community/AppUserController/selectAppUserByUsername.do',
    method: 'get',
    params
  })
}
// 请求楼栋列表
export function MansionList(params) {
  return request({
    url: '/community/MansionController/selectMansionByCommId.do',
    method: 'get',
    params
  })
}
// 请求房间列表
export function HouseList(params) {
  return request({
    url: '/community/HouseController/selectHouseByMansionId.do',
    method: 'get',
    params
  })
}
// 请求绑定的房间列表
export function BindHouseList(params) {
  return request({
    url: '/community/UserHouseController/selectUserHouseList.do',
    method: 'get',
    params
  })
}
// 绑定新的房间
export function addBindRoom(params) {
  return request({
    url: '/community/UserHouseController/insertUserHouse.do',
    method: 'post',
    data: params
  })
}
// 解绑房间
export function delBindRoom(params) {
  return request({
    url: '/community/UserHouseController/deleteUserHouseById.do',
    method: 'delete',
    params
  })
}
// 权限设置
export function updatePower(params) {
  return request({
    url: '/community/AppUserController/updatePowerById.do',
    method: 'post',
    data: params
  })
}
// 人脸识别信息列表
export function FaceInfoList(params) {
  return request({
    url: '/community/HumanFaceController/selectHumanFace.do',
    method: 'get',
    params
  })
}
// 删除人脸识别信息
export function delFaceInfo(params) {
  return request({
    url: '/community/HumanFaceController/deletetHumanFaceById.do',
    method: 'delete',
    params
  })
}
// 审核人脸识别信息
export function examine(params) {
  return request({
    url: '/community/HumanFaceController/checkHumanFace.do',
    method: 'post',
    data: params
  })
}
// 设备列表
export function doorGuardList(params) {
  return request({
    url: '/community/DoorGuardController/selectDoorGuardList.do',
    method: 'get',
    params
  })
}
// 门禁卡列表
export function cardList(params) {
  return request({
    url: '/community/CardUserController/selectCardByUserId.do',
    method: 'get',
    params
  })
}
// 读取门禁卡
export function cardReading(params) {
  return request({
    baseURL: 'http://localhost:9999',
    url: '/v2/getUid',
    method: 'get',
    params
  })
}
// 读取门禁卡
export function writeCard(params) {
  return request({
    baseURL: 'http://localhost:9999',
    url: '/v2/writeCard',
    method: 'post',
    data: params
  })
}
// 添加门禁卡
export function addCard(params) {
  return request({
    url: '/community/CardUserController/insertCard.do',
    method: 'post',
    data: params
  })
}
// 删除门禁卡
export function delCard(params) {
  return request({
    url: '/community/CardUserController/deleteCardById.do',
    method: 'delete',
    params
  })
}