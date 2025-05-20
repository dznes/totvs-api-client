import TotvsBaseClient from '../core/base-client.js'
import z from 'zod'

class TotvsProductDetailsClient extends TotvsBaseClient {
  get endpoint() { return 'product/v2/products'; }

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
          inCost: true,
          branchCostCodeList: [1, 2],
          costCodeList: [2],
          inPrice: true,
          inDigitalPromotionPrice: true,
          branchPriceCodeList: [1, 2],
          priceCodeList: [1, 2],
        },
        startOrderDate: '2020-01-01T17:34:58.073Z',
        endOrderDate: endDate,
        branchCodeList: [1, 2],
      },
      page,
      pageSize,
      order: '-productCode',
      expand: 'classifications,details,referenceCodeSequences',
    })
    }

  getAll(opts = {}) {
    return this.getAllPaginating(`${this.endpoint}/search`, {
      filter: {
        change: {
          startDate: opts.startDate,
          endDate: opts.endDate,
          inProduct: true,
          inCost: true,
          branchCostCodeList: [1, 2],
          costCodeList: [2],
          inPrice: true,
          inDigitalPromotionPrice: true,
          branchPriceCodeList: [1, 2],
          priceCodeList: [1, 2],
        },
        startOrderDate: '2020-01-01T17:34:58.073Z',
        endOrderDate: opts.endDate,
        branchCodeList: [1, 2],
      },
      pageSize: opts.pageSize,
      order: '-productCode',
      expand: 'classifications,details,referenceCodeSequences',
    })
    }
}

export default TotvsProductDetailsClient;