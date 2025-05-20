
import TotvsBaseClient from '../core/base-client.js'
import z from 'zod'

class TotvsRetailCustomer extends TotvsBaseClient {
  get endpoint() { return 'person/v2/individuals'; }

  async create(customerData = {}) {
    z.parse.object(customerData, 'customerData')
    z.parse.string(customerData.name, 'name')
    z.parse.notNull(customerData.cpf, 'cpf')
    z.parse.(customerDate.rg, 'rg').optional()
    z.parse.string(customerData.birthDate, 'birthDate')
    z.parse.string(customerData.gender, 'gender')
    z.parse.array(customerData.email, 'email').optional()

    return this.doRequest('POST', `${this.endpoint}`, {
      ...customerData,
      branchInsertCode: 1,
      insertDate: new Date(),
      isCustomer: true,
      customerStatus: 'Ativo',
      isInactive: false,
      registrationStatus: 'Normal',
      emails: [
        {
          typeCode: 1,
          typeName: 'COMERCIAL',
          email: customerData.email,
        },
      ],
    })
  }

  async remove(customerCode) {
    z.string(customerCode, 'customerCode')
    return this.doRequest(
      'DELETE',
      `${this.endpoint}/${customerCode}`,
    )
  }

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
          inCustomer: true,
        },
      },
      page,
      pageSize,
      expand: 'emails,phones,addresses,classifications',
    })
  }

    getAll(opts = {}) {
    return this.getAllPaginating(`${this.endpoint}/search`, {
      filter: {
        startDate: opts.startDate,
        endDate: opts.endDate,
      },
      expand: opts.expand ?? "",
      order: opts.order ?? "-personCode",
      pageSize: opts.pageSize ?? 300,
    });
  }
  
  async get(customerCode) {
    z.string(customerCode, 'customerCode')

    return this.doRequest(
      'GET',
      `${this.endpoint}/${customerCode}`,
    )
  }

  async update(customerCode, customerData = {}) {
    z.string(customerCode, 'customerCode')
    z.object(customerData, 'customerData')

    return this.doRequest(
      'POST',
      `${this.endpoint}`,
      customerData,
    )
  }
}

export default TotvsRetailCustomer

