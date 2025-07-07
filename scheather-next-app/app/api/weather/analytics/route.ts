import { BigQuery } from '@google-cloud/bigquery';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const bigquery = new BigQuery();

        // Example queries - customize based on what you want to show
        const queries = {
            // Daily active users
            dailyUsers: `
        SELECT 
          event_date,
          COUNT(DISTINCT user_pseudo_id) as daily_active_users
        FROM \`your-project.analytics_XXXXXXXX.events_*\`
        WHERE event_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
        GROUP BY event_date
        ORDER BY event_date
      `,

            // Event counts by type
            eventTypes: `
        SELECT 
          event_name,
          COUNT(*) as event_count
        FROM \`your-project.analytics_XXXXXXXX.events_*\`
        WHERE event_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
        GROUP BY event_name
        ORDER BY event_count DESC
        LIMIT 10
      `,

            // Page views
            pageViews: `
        SELECT 
          page_location,
          COUNT(*) as page_views
        FROM \`your-project.analytics_XXXXXXXX.events_*\`
        WHERE event_name = 'page_view'
        AND event_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
        GROUP BY page_location
        ORDER BY page_views DESC
        LIMIT 10
      `
        };

        // Execute all queries
        const [dailyUsers] = await bigquery.query({ query: queries.dailyUsers });
        const [eventTypes] = await bigquery.query({ query: queries.eventTypes });
        const [pageViews] = await bigquery.query({ query: queries.pageViews });

        return NextResponse.json({
            dailyUsers,
            eventTypes,
            pageViews
        });

    } catch (error) {
        console.error('Analytics API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
