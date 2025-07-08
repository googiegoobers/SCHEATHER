import { BetaAnalyticsDataClient } from '@google-analytics/data';

export function createAnalyticsClient() {
    let credentials;
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
        credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    }
    return new BetaAnalyticsDataClient({
        credentials,
    });
} 