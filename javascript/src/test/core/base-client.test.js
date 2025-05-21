import '../test-helper.mjs'
import assert from 'node:assert'
import test from 'node:test'

import TotvsBaseClient from '../../core/base-client.js'



test('First test', () => {
  assert.strictEqual(1, 1);
})

test('Totvs client initialize / sanitize', () => {
  const { TOTVS_CLIENT_ID, TOTVS_CLIENT_SECRET, TOTVS_USERNAME, TOTVS_PASSWORD } = process.env
  const client = new TotvsBaseClient(TOTVS_CLIENT_ID, TOTVS_CLIENT_SECRET, TOTVS_USERNAME, TOTVS_PASSWORD)
  assert(client);
  assert(client.doRequest)
}

