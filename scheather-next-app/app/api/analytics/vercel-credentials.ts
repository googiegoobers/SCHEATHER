import { BetaAnalyticsDataClient } from '@google-analytics/data';

export function createAnalyticsClient() {
    // Check if we're in Vercel with base64 credentials
    if (process.env.GOOGLE_CREDENTIALS_BASE64) {
        const credentials = Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, 'base64').toString();
        return new BetaAnalyticsDataClient({
            credentials: JSON.parse(credentials)
        });
    }

    // Fallback to file-based credentials (local development)
    return new BetaAnalyticsDataClient({
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS || './service-account-key.json',
    });
} 