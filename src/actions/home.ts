import request, { csRequest, payRequest } from '@utils/request'

export const getConfigByCode = (code) => {
  return request.get('/config', {
    customError: true,
    noAuth: true,
    params: {
      $filter: `code eq '${code}'`
    }
  })
}

export const getArticleList = (pageData) => {
  const { pageSize, pageNo } = pageData
  return request.get('/article', {
    customError: true,
    noAuth: true,
    params: {
      $top: pageSize,
      $skip: (pageNo - 1) * pageSize,
      $count: true,
      $orderby: 'createTime desc'
    }
  })
}
export const getArticleDetail = (id, userId) => {
  return request.get(`/article(${id})`, { noAuth: true, params: { userId: userId } })
}
export const deleteArticle = (id) => {
  return request.delete(`/article(${id})`, { responseType: 'text' })
}
export const addPraise = (id, addNum, userId) => {
  // 虽然传了userId，但是不会起作用，关联更新多表太费劲，demo里就不做这个逻辑了
  return request.post(`/article(${id})/praise`, { data: { addNum, userId } })
}
export const addArticle = (postData) => {
  return request.post(`/article`, { data: postData })
}
export const getToken = ({ path }) => {
  return csRequest.get(`/bomb/getToken`, {
    params: {
      path: path
    }
  })
}
export const getPayData = (openid) => {
  return payRequest.post(`/pay/${process.env.TARO_ENV === 'h5' ? 'gzh' : 'xcx'}`, {
    data: { openid: openid }
  })
}
