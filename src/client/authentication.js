import BaseClient from '../core/base-client.js'
import z from 'zod'

class AuthenticationClient extends BaseClient {
    constructor(clientId, clientSecret, username, password) {
        super();
        this.username = username;
        this.password = password;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }

    get endpoint() { return 'authorization/v2'; }

    async getAccessToken() {
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
            },
            { 'Content-Type': 'application/x-www-form-urlencoded' },
        );

        return res;
    }

    async getTokenByRefreshToken(token) {
        z.string(token, 'token');

        const res = await this.doRequest(
            'POST',
            `${this.endpoint}/token`,
            { grant_type: 'refresh_token', refresh_token: token },
        );

        return res;
    }

}

export default AuthenticationClient;