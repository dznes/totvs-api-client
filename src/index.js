import { TotvsApi, AuthClient } from "./totvs-api.js";
import dotenv from "dotenv";
dotenv.config();

const env = process.env.NODE_ENV ?? "sandbox";
const clientId =
  env === "prod"
    ? process.env.TOTVS_CLIENT_ID
    : process.env.TOTVS_SANDBOX_CLIENT_ID;
const clientSecret =
  env === "prod"
    ? process.env.TOTVS_CLIENT_SECRET
    : process.env.TOTVS_SANDBOX_CLIENT_SECRET;
const username =
  env === "prod"
    ? process.env.TOTVS_USERNAME
    : process.env.TOTVS_SANDBOX_USERNAME;
const password =
  env === "prod"
    ? process.env.TOTVS_PASSWORD
    : process.env.TOTVS_SANDBOX_PASSWORD;

const authClient = new AuthClient(
  clientId,
  clientSecret,
  username,
  password,
);

const { access_token, expires_in, refresh_token } =
  await authClient.getAccessToken();
const totvsApi = new TotvsApi(access_token);


const startDate = "2025-01-01T17:17:42.294Z";
const endDate = "2025-02-01T00:00:00.000Z";
// const customersGenerator = await totvsApi.legalCustomers.getAll({
//   startDate,
//   endDate,
// });

// // Collect all results
// const allCustomers = [];
// for await (const page of customersGenerator) {
//   allCustomers.push(...(page.items || []));
// }

// const ordersGenerator = await totvsApi.orders.getAll({
//   startDate,
//   endDate,
// });

// const allOrders = [];
// for await (const page of ordersGenerator) {
//   allOrders.push(...(page.items || []));
// }

// const productDetailsGenerator = await totvsApi.productDetails.getAll({
//   startDate,
//   endDate,
// });

// const allProductDetails = [];
// for await (const page of productDetailsGenerator) {
//   allProductDetails.push(...(page.items || []));
// }

const productCostGenerator = await totvsApi.productCost.getAll({
  startDate,
  endDate,
});

const allProductCost = [];
for await (const page of productCostGenerator) {
  allProductCost.push(...(page.items || []));
}








