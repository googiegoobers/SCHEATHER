import { NextResponse } from 'next/server';
import { createAnalyticsClient } from '../vercel-credentials';

export async function GET() {
    try {
        console.log('Setting up Google Analytics connection...');

        // Check environment variables
        console.log('Environment check:', {
            hasCredentials: !!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON,
            hasPropertyId: !!process.env.GA_PROPERTY_ID,
            propertyId: process.env.GA_PROPERTY_ID
        });

        if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || !process.env.GA_PROPERTY_ID) {
            return NextResponse.json({
                success: false,
                error: 'Environment variables not set',
                instructions: [
                    '1. Make sure GOOGLE_APPLICATION_CREDENTIALS_JSON is set to your service account key JSON string',
                    '2. Make sure GA_PROPERTY_ID is set to your Google Analytics Property ID'
                ]
            });
        }

        // Test the connection
        const analyticsDataClient = createAnalyticsClient();

        // Try a simple query to test the connection
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${process.env.GA_PROPERTY_ID}`,
            dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
            metrics: [{ name: 'activeUsers' }],
            dimensions: [{ name: 'date' }],
        });

        return NextResponse.json({
            success: true,
            message: 'Google Analytics connection successful!',
            property: {
                id: process.env.GA_PROPERTY_ID,
                name: `properties/${process.env.GA_PROPERTY_ID}`
            },
            testData: response.rows || []
        });

    } catch (error: any) {
        console.error('Setup failed:', error);

        let instructions: string[] = [];

        if (error.message?.includes('PERMISSION_DENIED')) {
            instructions = [
                '1. Go to Google Analytics Admin > Property Access Management',
                '2. Add your service account email as a user with "Viewer" permissions',
                '3. The service account email is in your service-account-key.json file (client_email field)',
                '4. Wait a few minutes for permissions to propagate'
            ];
        } else if (error.message?.includes('NOT_FOUND')) {
            instructions = [
                '1. Check that your GA_PROPERTY_ID is correct',
                '2. Go to Google Analytics Admin > Property Settings to find the Property ID',
                '3. Make sure you\'re using a GA4 property, not Universal Analytics'
            ];
        }

        return NextResponse.json({
            success: false,
            error: error?.message || 'Unknown error',
            instructions,
            details: {
                code: error?.code,
                status: error?.status
            }
        });
    }
} 