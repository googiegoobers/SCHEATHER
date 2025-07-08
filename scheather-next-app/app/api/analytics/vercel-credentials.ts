import { BetaAnalyticsDataClient } from '@google-analytics/data';

export function createAnalyticsClient() {
    const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
        ? JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON)
        : undefined;

    return new BetaAnalyticsDataClient({
        credentials,
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || '495490473'
    });
} 