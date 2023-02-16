import durex from '@gem-mine/durex'
import { getArticleList } from '@actions/home'
const defaultPageData = {
  pageNo: 1,
  pageSize: 20
}
durex.model({
  name: 'article',
  state: {
    statusDown: 'loading',
    statusUp: 'loading',
    articleList: [],
    pageData: Object.assign({}, defaultPageData)
  },
  reducers: {},
  effects: {
    async getArticleList ({ isFirstPage }) {
      let { pageData, articleList } = this.getState()
      const firstIdOld = articleList.length > 0 ? articleList[0].id : null
      if (isFirstPage) {
        pageData.pageNo = 1
        articleList = []
      }
      this.setField({
        statusDown: 'loading',
        statusUp: 'loading'
      })
      return getArticleList(pageData)
        .then((resData) => {
          const firstIdNew = resData.value.length > 0 ? resData.value[0].id : null
          this.setField({
            pageData: {
              pageSize: pageData.pageSize,
              pageNo: pageData.pageNo + 1
            },
            articleList: articleList.concat(resData.value),
            statusDown: firstIdNew === firstIdOld ? 'noMore' : 'more',
            statusUp:
              resData['@odata.count'] > pageData.pageNo * pageData.pageSize ? 'more' : 'noMore'
          })
        })
        .catch(() => {
          this.setField({ statusDown: 'error', statusUp: 'error' })
        })
    }
  }
})
