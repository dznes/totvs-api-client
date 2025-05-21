import TotvsBaseClient from '../core/base-client.js'
import z from 'zod/v4'

class TotvsOrderClient extends TotvsBaseClient {
  get endpoint() { return 'sales-order/v2/orders'; }

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
        },
        startOrderDate: '2020-01-01T17:34:58.073Z',
        endOrderDate: endDate,
        branchCodeList: [1, 2],
      },
      page,
      pageSize,
      expand: 'items,shippingAddress,invoices',
    })
    }

  getAll(opts = {}) {
    return this.getAllPaginating(`${this.endpoint}/search`, {
      filter: {
        change: {
          startDate: opts.startDate,
          endDate: opts.endDate,
        },
        startOrderDate: '2020-01-01T17:34:58.073Z',
        endOrderDate: opts.endDate,
        branchCodeList: [1, 2],
      },
      pageSize: opts.pageSize,
      order: opts.order ?? "-orderCode",
      expand: 'items,shippingAddress,invoices',
    })

  }
}

export default TotvsOrderClient;
