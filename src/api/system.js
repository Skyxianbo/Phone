import request from '@/utils/request'

export function getNotice(param) {
  return request({
    url: '/findNotice',
    method: 'get',
    params: param
  })
}

export function updateNotice(param) {
  return request({
    url: '/addNotice',
    method: 'post',
    data: param
  })
}
