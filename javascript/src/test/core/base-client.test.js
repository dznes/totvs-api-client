import "../test-helper.js";
import { test, expect } from "vitest";

import TotvsBaseClient from "../../core/base-client.js";

const { TEST_TOKEN } = process.env;

test("First test", () => {
  expect(1).toBe(1);
});

test("Totvs client initialize / sanitize", () => {
  const client = new TotvsBaseClient(TEST_TOKEN, "sandbox");
  expect(client).toBeTruthy();
  expect(client.doRequest).toBeTruthy();
});
