import axios from "axios";
import z from "zod/v4";
import dotenv from "dotenv";
import querystring from "querystring";
dotenv.config();

 const configByEnv = {
  sandbox: { baseUrl: "http://treino.bhan.com.br:15200/api/totvsmoda" },
  prod: { baseUrl: "https://www30.bhan.com.br:9443/api/totvsmoda" },
};

async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

class TotvsBaseClient {
  constructor(token, env = 'prod') {
    const envSchema = z.enum(["sandbox", "prod"]);
    this.env = envSchema.parse(env);


    if (token) z.string(token, "token");

    this.token = token;

    this.baseUrl = configByEnv[this.env].baseUrl;

    this.lastRequests = [];
    this.lastResponses = [];
  }



  async *getAllPaginating(url, params = {}) {
    let page = 1;
    let data;

    params.pageSize = params.pageSize || 300;

    do {
      const response = await this.doRequest("POST", url, {
        ...params,
        page,
      });
      
      if (!response.items) {
        const errorObject = new Error('No items returned in response');
        errorObject.type = 'INVALID_RESPONSE';
        errorObject.description = 'The response does not contain an items array';
        throw errorObject;
      }

      data = response.items;
      yield data;
      page++;

      // let it breathe
      await sleep(1);
    } while (data.length >= params.pageSize);
  }

  async doRequest(method, url, body = {}, headers = {}) {
    z.string(method, "method");
    z.string(url, "url");

    // Validate pageSize if it exists
    if (body.pageSize && body.pageSize > 500) {
      const errorObject = new Error('Invalid pageSize');
      errorObject.type = 'INVALID_PAGE_SIZE';
      errorObject.description = 'pageSize cannot be larger than 500';
      throw errorObject;
    }

    method = method.toUpperCase();
    const isAuthorization = url.includes("authorization");

    // Set base headers
    headers = {
      Accept: "application/json",
      Authorization: this.token ? `Bearer ${this.token}` : null,
      ...headers,
    };

    url = `${this.baseUrl}/${url}`;

    // Handle GET requests and content type for non-GET requests
    if (method === "GET") {
      url += `?${querystring.encode(body)}`;
    } else if (isAuthorization) {
      headers["Content-Type"] = "application/x-www-form-urlencoded";
    } else {
      headers["Content-Type"] = "application/json";
    }

    this.lastRequests = this.lastRequests.slice(-5);
    this.lastResponses = this.lastResponses.slice(-5);

    const options = {
      method,
      headers,
      url,
      data: isAuthorization
        ? new URLSearchParams(body).toString()
        : method !== "GET"
          ? JSON.stringify(body)
          : "",
    };


    this.lastRequest = { ...options, data: body };
    this.lastRequests.push(this.lastRequest);

    let response;
    const errorObject = new Error();

    try {
      const res = await axios(options);
      response = res.data;

      this.lastResponse = { body: res.data, headers: res.headers };
      this.lastResponses.push(this.lastResponse);
    } catch (ex) {
      ex.response = ex.response || ex.res;
      if (ex.response) {
        const { response } = ex;

        this.lastResponse = {
          body: response.data,
          headers: response.headers,
        };

        this.lastResponses.push(this.lastResponse);
        const error = response.data && response.data.message ? response.data : null;

        if (error) {
          const { code, message, detailedMessage } = error;
          errorObject.message = message;
          errorObject.description = detailedMessage;
          errorObject.message = message;
          errorObject.code = code;
          throw errorObject;
        }
      }

      errorObject.message = ex.message;
      throw errorObject;
    }

    if (response.message) {
      const { message, detailedMessage, code } = response;
      const err = new Error(`${code} - ${message}`);

      err.description = detailedMessage;
      err.code = code;

      throw err;
    }

    return response.data ? response.data : response;
  }

  async doGetRequest(url, params) {
    return this.doRequest("GET", url, params);
  }
}

export default TotvsBaseClient;
