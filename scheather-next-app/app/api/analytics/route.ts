import { NextResponse } from 'next/server';
import { createAnalyticsClient } from './vercel-credentials';

// Initialize Google Analytics Data API v1 (GA4)
const analyticsDataClient = createAnalyticsClient();

const propertyId = process.env.GA_PROPERTY_ID || 'your-property-id-here';

export async function GET() {
    try {
        // Check if environment variables are set
        console.log('Environment check:', {
            hasCredentials: !!process.env.GOOGLE_APPLICATION_CREDENTIALS,
            hasPropertyId: !!process.env.GA_PROPERTY_ID,
            propertyId: process.env.GA_PROPERTY_ID,
            credentialsPath: process.env.GOOGLE_APPLICATION_CREDENTIALS
        });

        if (!process.env.GOOGLE_APPLICATION_CREDENTIALS || !process.env.GA_PROPERTY_ID) {
            console.log('Environment variables not set, returning dummy data');
            return NextResponse.json({
                dailyData: generateDummyDailyData(),
                pageViews: generateDummyPageViews(),
                trafficSources: generateDummyTrafficSources(),
                isDummy: true,
                message: 'Demo data active - Environment variables not configured'
            });
        }

        console.log('✅ Fetching real Google Analytics 4 data...');

        // Get the last 30 days of data
        const [dailyData] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [
                {
                    startDate: '30daysAgo',
                    endDate: 'today',
                },
            ],
            metrics: [
                { name: 'activeUsers' },
                { name: 'screenPageViews' },
                { name: 'sessions' },
                { name: 'bounceRate' },
            ],
            dimensions: [
                { name: 'date' },
            ],
        });

        // Get page views by page
        const [pageViews] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [
                {
                    startDate: '7daysAgo',
                    endDate: 'today',
                },
            ],
            metrics: [
                { name: 'screenPageViews' },
            ],
            dimensions: [
                { name: 'pagePath' },
            ],
            limit: 10,
        });

        // Get user acquisition data
        const [acquisition] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [
                {
                    startDate: '30daysAgo',
                    endDate: 'today',
                },
            ],
            metrics: [
                { name: 'activeUsers' },
            ],
            dimensions: [
                { name: 'sessionDefaultChannelGroup' },
            ],
        });

        console.log('✅ Successfully fetched Google Analytics 4 data with real metrics!');
        return NextResponse.json({
            dailyData: dailyData.rows || [],
            pageViews: pageViews.rows || [],
            trafficSources: acquisition.rows || [],
            isDummy: false
        });

    } catch (error: any) {
        console.error('Analytics API Error:', error);
        console.error('Error details:', {
            message: error?.message || 'Unknown error',
            code: error?.code || 'No code',
            status: error?.status || 'No status',
            stack: error?.stack || 'No stack'
        });

        // Handle specific network errors
        let errorMessage = error?.message || 'Unknown error';
        let isNetworkError = false;

        if (error?.message?.includes('ECONNRESET') ||
            error?.message?.includes('UNAVAILABLE') ||
            error?.code === 14) {
            isNetworkError = true;
            errorMessage = 'Network connectivity issue with Google Analytics API. This could be due to firewall settings, network restrictions, or temporary API service issues.';
        }

        // Return dummy data on error instead of failing
        return NextResponse.json({
            dailyData: generateDummyDailyData(),
            pageViews: generateDummyPageViews(),
            trafficSources: generateDummyTrafficSources(),
            isDummy: true,
            error: `Using demo data due to API error: ${errorMessage}`,
            isNetworkError,
            suggestions: isNetworkError ? [
                '1. Check your firewall settings',
                '2. Try connecting from a different network',
                '3. Wait a few minutes and try again (temporary API issue)',
                '4. Contact your network administrator if on corporate network'
            ] : []
        });
    }
}

// Generate dummy data functions
function generateDummyDailyData() {
    const data = [];
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
        data.push([
            dateStr,
            Math.floor(Math.random() * 50) + 10,
            Math.floor(Math.random() * 100) + 20,
            Math.floor(Math.random() * 80) + 15,
            (Math.random() * 30 + 20).toFixed(2)
        ]);
    }
    return data;
}

function generateDummyPageViews() {
    return [
        ['/', Math.floor(Math.random() * 500) + 100],
        ['/dashboard', Math.floor(Math.random() * 300) + 50],
        ['/events', Math.floor(Math.random() * 200) + 30],
        ['/auth/login', Math.floor(Math.random() * 150) + 20],
        ['/auth/signup', Math.floor(Math.random() * 100) + 10]
    ];
}

function generateDummyTrafficSources() {
    return [
        ['google', Math.floor(Math.random() * 200) + 50],
        ['direct', Math.floor(Math.random() * 150) + 30],
        ['facebook', Math.floor(Math.random() * 100) + 20],
        ['twitter', Math.floor(Math.random() * 80) + 15],
        ['linkedin', Math.floor(Math.random() * 60) + 10]
    ];
} 