import TotvsBaseClient from '../core/base-client.js'
import z from 'zod/v4'

class TotvsProductBalanceClient extends TotvsBaseClient {
  get endpoint() { return 'product/v2/balances'; }

    async list(startDate, endDate, page = 1, pageSize = 300) {
    z.number(page, 'page')
    z.number(pageSize, 'pageSize')
    z.string(startDate, 'startDate')
    z.string(endDate, 'endDate')
    
  
    return this.doRequest('POST', `${this.endpoint}/search`, {
      filter: {
        change: {
          startDate,
          endDate,
          inProduct: true,
          inStock: true,
          stockCodeList: [3],
          branchCostCodeList: [1, 2],
        },
      },
      option: {
        balances: [
          {
            branchCode: 1,
            stockCodeList: [3],
            isTransaction: true,
            isSalesOrder: true,
            isProductionOrder: true,
          }
        ]
      },
      page,
      pageSize,
      order: '-productCode',
    })
    }

  getAll(opts = {}) {
    return this.getAllPaginating(`${this.endpoint}/search`, {
      filter: {
        change: {
          startDate: opts.startDate,
          endDate: opts.endDate,
          inProduct: true,
          inStock: true,
          stockCodeList: [3],
          branchCostCodeList: [1, 2],
        },
      },
      option: {
        balances: [
          {
            branchCode: 1,
            stockCodeList: [3],
            isTransaction: true,
            isSalesOrder: true,
            isProductionOrder: true,
          }
        ]
      },
      pageSize: opts.pageSize,
      order: opts.order ?? "-productCode",
    })

    }
}

export default TotvsProductBalanceClient;
