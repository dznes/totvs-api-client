import "./test-helper.js";
import { test, describe, expect, beforeEach } from "vitest";
import { AuthClient } from "../totvs-api.js";

const {
  TOTVS_CLIENT_ID,
  TOTVS_CLIENT_SECRET,
  TOTVS_USERNAME,
  TOTVS_PASSWORD,
} = process.env;

let auth;  // shared variable for each test
let data = {};

describe("Totvs authentication", () => {
  beforeEach(() => {
    auth = new AuthClient(
      TOTVS_CLIENT_ID,
      TOTVS_CLIENT_SECRET,
      TOTVS_USERNAME,
      TOTVS_PASSWORD
    );
  });

  test("Authenticate (get access token)", async () => {
    const res = await auth.authenticate();

    console.log(res);
    expect(res.token_type).toBe("Bearer");
    expect(res.refresh_token).toBeTruthy();

    data = { ...res };
  });

  test("Refresh token", async () => {
    // Use existing auth instance
    auth.refreshToken = data.refresh_token;

    const res = await auth.refreshAccessToken();

    console.log(res);
    expect(res.token_type).toBe("Bearer");

    data = { ...res };
  });

  test("Get valid access token - should authenticate if no token", async () => {
    const token = await auth.getValidAccessToken();

    expect(token).toBe(auth.accessToken);
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(0);
  });

  test("Get valid access token - should refresh if token expired", async () => {
    auth.accessToken = "expiredToken";
    auth.refreshToken = data.refresh_token;
    auth.expiresAt = Date.now() - 1000; // expired

    const token = await auth.getValidAccessToken();

    expect(token).toBe(auth.accessToken);
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(0);
    expect(token).not.toBe("expiredToken");
  });

  test("Get valid access token - should return token if still valid", async () => {
    auth.accessToken = "validToken123";
    auth.expiresAt = Date.now() + 60000; // valid for 1 min

    const token = await auth.getValidAccessToken();

    expect(token).toBe("validToken123");
  });
});

