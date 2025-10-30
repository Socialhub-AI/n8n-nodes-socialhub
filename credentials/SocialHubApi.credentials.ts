/**
 * SocialHub API Credentials
 * 
 * This credential type handles authentication for SocialHub API integration.
 * It supports OAuth2-style token authentication with automatic token refresh
 * and caching for improved performance.
 * 
 * @author SocialHub Integration Team
 * @version 1.0.0
 * @license MIT
 */

import {
    ICredentialTestRequest,
    ICredentialType,
    INodeProperties,
    IHttpRequestOptions,
    ICredentialDataDecryptedObject,
} from 'n8n-workflow';

/**
 * Token cache entry structure
 */
interface TokenCacheEntry {
    accessToken: string;
    refreshToken?: string;
    expiresAt: number;
}

/**
 * In-memory token cache to avoid unnecessary token requests
 * Key format: "baseUrl::appId"
 */
const tokenCache = new Map<string, TokenCacheEntry>();

/**
 * SocialHub API Credential Implementation
 * 
 * Handles authentication flow including:
 * - Initial token acquisition using App ID and App Secret
 * - Automatic token refresh when expired
 * - Token caching for performance optimization
 * - Comprehensive error handling and validation
 */
export class SocialHubApi implements ICredentialType {
    name = 'socialHubApi';
    displayName = 'SocialHub API';
    documentationUrl = '';

    properties: INodeProperties[] = [
        {
            displayName: 'Base URL',
            name: 'baseUrl',
            type: 'string',
            default: 'https://s1.socialhub.ai/openapi-prod',
            placeholder: 'https://s1.socialhub.ai/openapi-prod',
            description: 'SocialHub API base URL (production: https://s1.socialhub.ai/openapi-prod)',
            required: true,
        },
        {
            displayName: 'App ID',
            name: 'appId',
            type: 'string',
            default: '',
            placeholder: 'Enter your App ID',
            description: 'SocialHub application ID',
            required: true,
        },
        {
            displayName: 'App Secret',
            name: 'appSecret',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            placeholder: 'Enter your App Secret',
            description: 'SocialHub application secret',
            required: true,
        },
    ];

    async authenticate(
        credentials: ICredentialDataDecryptedObject,
        requestOptions: IHttpRequestOptions,
    ): Promise<IHttpRequestOptions> {
        try {
            // Get access token
            const cacheKey = this.getCacheKey(credentials);
            let tokenEntry = tokenCache.get(cacheKey);

            if (!tokenEntry || this.isTokenExpired(tokenEntry.expiresAt)) {
                tokenEntry = await this.fetchAndCacheToken(credentials, tokenEntry?.refreshToken);
                tokenCache.set(cacheKey, tokenEntry);
            }

            const accessToken = tokenEntry.accessToken;

            // Add Bearer token to request headers
            requestOptions.headers = {
                ...requestOptions.headers,
                'Authorization': `${accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'n8n-socialhub-integration/1.0.0',
            };

            return requestOptions;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`SocialHub authentication failed: ${errorMessage}`);
        }
    }

    private async requestAccessToken(credentials: ICredentialDataDecryptedObject): Promise<any> {
        const { baseUrl, appId, appSecret } = credentials;
        
        if (!baseUrl || !appId || !appSecret) {
            throw new Error('Missing required authentication parameters: baseUrl, appId or appSecret');
        }

        try {
            // 使用全局 fetch API (Node.js 18+)
             const response = await (globalThis as any).fetch(`${baseUrl}/v1/auth/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    appId,
                    appSecret,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`HTTP ${response.status}: ${errorData.msg || errorData.resultMessage || response.statusText}`);
            }

            const data = await response.json();
            this.validateTokenResponse(data);

            return data;
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'TypeError' && error.message.includes('fetch')) {
                    throw new Error(`Network connection failed, please check if baseUrl is correct: ${baseUrl}`);
                }
                throw error;
            }
            throw new Error(`Request failed: ${String(error)}`);
        }
    }

    private async refreshAccessToken(credentials: ICredentialDataDecryptedObject, refreshToken: string): Promise<any> {
        const { baseUrl } = credentials;
        
        if (!baseUrl || !refreshToken) {
            throw new Error('Missing required refresh parameters: baseUrl or refreshToken');
        }

        try {
            // 使用全局 fetch API (Node.js 18+)
             const response = await (globalThis as any).fetch(`${baseUrl}/v1/auth/refreshToken`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `${refreshToken}`,
                },
                body: JSON.stringify({
                    refreshToken,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`HTTP ${response.status}: ${errorData.resultMessage || response.statusText}`);
            }

            const data = await response.json();
            this.validateTokenResponse(data);

            return data;
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'TypeError' && error.message.includes('fetch')) {
                    throw new Error(`Network connection failed, please check if baseUrl is correct: ${baseUrl}`);
                }
                throw error;
            }
            throw new Error(`Refresh token request failed: ${String(error)}`);
        }
    }

    test: ICredentialTestRequest = {
        request: {
            baseURL: '={{$credentials.baseUrl}}',
            url: '/v1/auth/token',
            method: 'POST',
            body: {
                appId: '={{$credentials.appId}}',
                appSecret: '={{$credentials.appSecret}}',
            },
        },
        rules: [
            {
                type: 'responseSuccessBody',
                properties: {
                    key: 'code',
                    value: '200',
                    message: 'SocialHub API authentication successful',
                },
            },
        ],
    };

    private getCacheKey(credentials: ICredentialDataDecryptedObject): string {
        return `${credentials.baseUrl}::${credentials.appId}`;
    }

    private isTokenExpired(expiresAt: number): boolean {
        return !Number.isFinite(expiresAt) || Date.now() >= expiresAt;
    }

    private async fetchAndCacheToken(
        credentials: ICredentialDataDecryptedObject,
        refreshToken?: string,
    ): Promise<TokenCacheEntry> {
        if (refreshToken) {
            try {
                const refreshed = await this.refreshAccessToken(credentials, refreshToken);
                return this.buildTokenEntry(refreshed);
            } catch (error) {
                // Refresh token invalid; fall back to requesting a new token
            }
        }

        const tokenResponse = await this.requestAccessToken(credentials);
        return this.buildTokenEntry(tokenResponse);
    }

    private validateTokenResponse(data: any): void {
        if (!data) {
            throw new Error('API response error: empty response');
        }

        // 尝试多种可能的状态码字段名
        const code = data.code || data.resultCode || data.status;
        if (code !== '200' && code !== 200) {
            const message = data.resultMessage || data.message || data.msg || 'Unknown error';
            throw new Error(`API error ${code}: ${message}`);
        }

        if (!data.data || !data.data.accessToken) {
            throw new Error('API response format error: missing accessToken');
        }
    }

    private buildTokenEntry(response: any): TokenCacheEntry {
        const tokenData = response.data ?? {};
        const accessToken = tokenData.accessToken;

        if (!accessToken) {
            throw new Error('API response format error: missing accessToken');
        }

        const expiresAt = this.resolveExpiry(tokenData);

        return {
            accessToken,
            refreshToken: tokenData.refreshToken,
            expiresAt,
        };
    }

    private resolveExpiry(tokenData: any): number {
        const defaultTtlMs = 50 * 60 * 1000; // fallback 50 minutes
        const marginMs = 60 * 1000;
        const now = Date.now();

        const durationKeys = ['expiresIn', 'expireIn', 'expires', 'expireSeconds'];
        for (const key of durationKeys) {
            const raw = tokenData?.[key];
            const parsed = typeof raw === 'string' ? Number.parseInt(raw, 10) : raw;
            if (Number.isFinite(parsed) && parsed > 0 && parsed < 1e8) {
                return now + parsed * 1000 - marginMs;
            }
        }

        const absoluteKeys = ['expireTime', 'expiresAt', 'expirationTime'];
        for (const key of absoluteKeys) {
            const raw = tokenData?.[key];
            if (!raw) {
                continue;
            }

            const parsed = typeof raw === 'string' ? Number.parseInt(raw, 10) : raw;
            if (Number.isFinite(parsed)) {
                const normalized = parsed > 1e12 ? parsed : parsed * 1000;
                if (normalized > now) {
                    return normalized - marginMs;
                }
            }
        }

        return now + defaultTtlMs;
    }
}
