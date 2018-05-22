import request from '@/utils/request'

export function getOrder(param) {
  return request({
    url: '/order/find',
    method: 'get',
    params: param
  })
}

export function addOrder(param) {
  return request({
    url: '/order/add',
    method: 'post',
    data: param
  })
}
