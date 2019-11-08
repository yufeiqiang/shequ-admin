import request from '@/utils/request'
// import Qs from 'qs'
// 角色列表
export function rolesList(params) {
  return request({
    url: '/community/RolesController/selectRoles.do',
    method: 'get',
    params
  })
}
// 删除角色
export function deleteRole(params) {
  return request({
    url: '/community/RolesController/deleteRolesById.do',
    method: 'delete',
    params
  })
}
// 修改角色
export function insertRoles(params) {
  return request({
    url: '/community/RolesController/insertRoles.do',
    method: 'post',
    data: params
  })
}
// 机构列表
export function OrganizationList(params) {
  return request({
    url: '/community/OrganizationController/Organization.do',
    method: 'get',
    params
  })
}
// 删除机构
export function deleteOrgan(params) {
  return request({
    url: '/community/OrganizationController/deleteOrganizationById.do',
    method: 'delete',
    params
  })
}
// 删除修改添加机构
export function insertOrgan(params) {
  return request({
    url: '/community/OrganizationController/insertOrganization.do',
    method: 'post',
    data: params
  })
}
// 账号列表
export function managerList(params) {
  return request({
    url: '/community/managerController/managerList.do',
    method: 'get',
    params
  })
}
// 删除机构
export function deleteById(params) {
  return request({
    url: '/community/managerController/deleteById.do',
    method: 'delete',
    params
  })
}
// 查询角色列表
export function queryRolesName(params) {
  return request({
    url: '/community/managerController/queryRolesName.do',
    method: 'get',
    params
  })
}
// 查询角色列表
export function organList(params) {
  return request({
    url: '/community/managerController/queryOrganizationName.do',
    method: 'get',
    params
  })
}

// 增加账号
export function addManager(params) {
  return request({
    url: '/community/managerController/addOrUpdateManager.do',
    method: 'post',
    data: params
  })
}
// 判断账号是否重复
export function isUserName(params) {
  return request({
    url: '/community/managerController/queryManagerName.do',
    method: 'get',
    params
  })
}
// 修改密码
export function changePass(params) {
  return request({
    url: '/community/managerController/updatePassword.do',
    method: 'post',
    data: params
  })
}
