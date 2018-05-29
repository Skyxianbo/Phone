import request from '@/utils/request'

export function getGoods(param) {
  return request({
    url: '/goods/find',
    method: 'get',
    params: param
  })
}

export function addGoods(param) {
  return request({
    url: '/goods/add',
    method: 'post',
    data: param
  })
}

export function addClassify(param) {
  return request({
    url: '/classify/add',
    method: 'post',
    data: param
  })
}

export function getClassify(param) {
  return request({
    url: '/classify/find',
    method: 'get',
    params: param
  })
}

export function addTrademark(param) {
  return request({
    url: '/classify/add',
    method: 'post',
    data: param
  })
}

export function getTrademark(param) {
  return request({
    url: '/classify/find',
    method: 'get',
    params: param
  })
}