
import TotvsBaseClient from '../core/base-client.js'
import z from 'zod'

class TotvsColorsClient extends TotvsBaseClient {
  get endpoint() { return 'product/v2/colors'; }

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
      },
      page,
      pageSize,
    })
  }

  getAll(opts = {}) {
    return this.getAllPaginating(`${this.endpoint}/search`, {
            filter: {
        change: {
          startDate: opts.startDate,
          endDate: opts.endDate,
        },
      },
      pageSize: opts.pageSize,
    })
  }
}

export default TotvsColorClient;
