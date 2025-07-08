import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET() {
    try {
        console.log('Testing Google Analytics API connection...');

        // Check environment variables
        console.log('Environment check:', {
            hasCredentials: !!process.env.GOOGLE_APPLICATION_CREDENTIALS,
            hasViewId: !!process.env.GA_VIEW_ID,
            viewId: process.env.GA_VIEW_ID
        });

        if (!process.env.GOOGLE_APPLICATION_CREDENTIALS || !process.env.GA_VIEW_ID) {
            return NextResponse.json({
                success: false,
                error: 'Environment variables not set',
                hasCredentials: !!process.env.GOOGLE_APPLICATION_CREDENTIALS,
                hasViewId: !!process.env.GA_VIEW_ID
            });
        }

        // Test authentication
        const auth = new google.auth.GoogleAuth({
            keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
            scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
        });

        const authClient = await auth.getClient();
        console.log('Authentication successful');

        // Test API access
        const analytics = google.analytics('v3');
        google.options({ auth: authClient as any });

        // Simple test query
        const testData = await analytics.data.ga.get({
            ids: `ga:${process.env.GA_VIEW_ID}`,
            'start-date': 'today',
            'end-date': 'today',
            metrics: 'ga:users',
            'max-results': 1
        });

        console.log('API test successful');
        return NextResponse.json({
            success: true,
            message: 'Google Analytics API connection successful',
            data: testData.data
        });

    } catch (error: any) {
        console.error('Test failed:', error);
        return NextResponse.json({
            success: false,
            error: error?.message || 'Unknown error',
            details: {
                code: error?.code,
                status: error?.status
            }
        });
    }
} 