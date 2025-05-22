import BaseClient from '../core/base-client.js';
import z from 'zod/v4';

class AuthenticationClient extends BaseClient {
    constructor(clientId, clientSecret, username, password) {
        super();
        this.username = username;
        this.password = password;
        this.clientId = clientId;
        this.clientSecret = clientSecret;

        this.accessToken = null;
        this.refreshToken = null;
        this.expiresAt = 0; // timestamp in ms
    }

    get endpoint() {
        return 'authorization/v2';
    }

    /**
     * Authenticate and store access token, refresh token and expiration.
     * Public for testing and direct control.
     */
    async authenticate() {
        z.string(this.username, 'username');
        z.string(this.password, 'password');
        z.string(this.clientId, 'clientId');
        z.string(this.clientSecret, 'clientSecret');

        const res = await this.doRequest(
            'POST',
            `${this.endpoint}/token`,
            {
                grant_type: 'password',
                username: this.username,
                password: this.password,
                client_id: this.clientId,
                client_secret: this.clientSecret
            }
        );

        this._storeTokenData(res);
        return res;
    }

    /**
     * Refresh token and store new token data.
     * Public for testing and direct control.
     */
    async refreshAccessToken() {
        z.string(this.refreshToken, 'refreshToken');

        const res = await this.doRequest(
            'POST',
            `${this.endpoint}/token`,
            {
                grant_type: 'refresh_token',
                refresh_token: this.refreshToken
            }
        );

        this._storeTokenData(res);
        return res;
    }

    /**
     * Internal method to store token data in the client state.
     */
    _storeTokenData(res) {
        this.accessToken = res.access_token;
        this.refreshToken = res.refresh_token;

        const expiresIn = res.expires_in || 3600; // default 1 hour if missing
        // Set expiry time with a 60-second buffer to avoid edge cases
        this.expiresAt = Date.now() + (expiresIn * 1000) - (60 * 1000);
    }

    /**
     * Check if the current access token is expired.
     */
    isTokenExpired() {
        return !this.accessToken || Date.now() >= this.expiresAt;
    }

    /**
     * Get a valid access token, refreshing if necessary.
     * Consumers of the API should primarily use this.
     */
    async getValidAccessToken() {
        if (!this.accessToken) {
            await this.authenticate();
        } else if (this.isTokenExpired()) {
            try {
                await this.refreshAccessToken();
            } catch (err) {
                // Refresh failed — fallback to full authentication
                await this.authenticate();
            }
        }
        return this.accessToken;
    }
}

export default AuthenticationClient;

