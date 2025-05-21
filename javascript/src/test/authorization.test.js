import './test-helper.mjs'
import assert from 'node:assert'
import { describe, it } from 'node:test'
import { AuthClient } from '../totvs-api.js'

describe('Totvs authentication', () => {
  const { TOTVS_CLIENT_ID, TOTVS_CLIENT_SECRET, TOTVS_USERNAME, TOTVS_PASSWORD } = process.env 
  let data = {}

  it('Get token client', async () => {
    const auth = new AuthClient(TOTVS_CLIENT_ID, TOTVS_CLIENT_SECRET, TOTVS_USERNAME, TOTVS_PASSWORD)
    const res = await auth.getAccessToken();


    console.log(res)
    assert(res.token_type === 'Bearer');

    data = { ...res };
  });

  it('Refresh token', async () => {
    const auth = new AuthClient(CLIENT_ID, CLIENT_SECRET);
    const res = await auth.getTokenByRefreshToken(data.refresh_token);

    console.log(res);
    assert(res);

    data = { ...res };
  });
})
