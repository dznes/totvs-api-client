import z from "zod/v4";

import AuthClient from "./client/authentication.js";
import LegalCustomerClient from "./client/legal-customer-client.js";
import OrderClient from "./client/order.js";
import ProductDetailsClient from "./client/product-details.js";
import ProductCostClient from "./client/product-cost.js";
import ProductBalanceClient from "./client/product-balance.js";
class TotvsApi {
  constructor(token) {
    z.string(token, "token");

    this.token = token;

    this.lastRequests = [];
    this.lastResponses = [];

    this.legalCustomers = this.initClient(LegalCustomerClient);
    this.orders = this.initClient(OrderClient);
    this.productDetails = this.initClient(ProductDetailsClient);
    this.productCost = this.initClient(ProductCostClient);
    this.productBalance = this.initClient(ProductBalanceClient);
  }

  initClient(Client) {
    const client = new Client(this.token);
    const self = this;

    const _doRequest = client.doRequest;

    client.doRequest = async function p() {
      try {
        const res = await _doRequest.apply(client, arguments);
        return res;
      } finally {
        self.lastRequests = self.lastRequests.slice(-5);
        self.lastResponses = self.lastResponses.slice(-5);

        self.lastRequests.push(client.lastRequest);
        self.lastResponses.push(client.lastResponse);
      }
    };

    return client;
  }
}

export { TotvsApi, AuthClient };
