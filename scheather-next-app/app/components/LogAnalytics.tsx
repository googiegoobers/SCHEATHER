"use client";
import React, { useEffect, useState } from "react";
import { getClientAnalytics } from "../lib/firebaseConfig";

// Dummy data for demonstration. Replace with real data fetching from Firebase Analytics or Firestore.
const dummyAnalytics = {
  totalUsers: 120,
  activeUsers: 45,
  events: [
    { name: "admin_dashboard_viewed", count: 30 },
    { name: "user_signup", count: 15 },
    { name: "event_created", count: 22 },
  ],
};

type AnalyticsData = {
  totalUsers: number;
  activeUsers: number;
  events: { name: string; count: number }[];
};

const LogAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );

  useEffect(() => {
    // Log analytics event
    import("../lib/firebaseConfig").then(async (mod) => {
      const analytics = await mod.getClientAnalytics();
      if (analytics) {
        const { logEvent } = await import("firebase/analytics");
        logEvent(analytics, "admin_dashboard_viewed");
      }
    });
    // Simulate fetching analytics data
    setTimeout(() => {
      setAnalyticsData(dummyAnalytics);
    }, 500);
  }, []);

  if (!analyticsData) {
    return (
      <div className="text-center text-gray-500">Loading analytics...</div>
    );
  }

  return (
    <div className="max-w-xl mx-auto my-8 p-6 bg-gray-50 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Site Analytics</h2>
      <div className="flex justify-around mb-4">
        <div>
          <div className="text-2xl font-semibold text-blue-600">
            {analyticsData.totalUsers}
          </div>
          <div className="text-gray-700">Total Users</div>
        </div>
        <div>
          <div className="text-2xl font-semibold text-green-600">
            {analyticsData.activeUsers}
          </div>
          <div className="text-gray-700">Active Users</div>
        </div>
      </div>
      <h3 className="text-lg font-semibold mt-6 mb-2">Event Counts</h3>
      <ul>
        {analyticsData.events.map((event: { name: string; count: number }) => (
          <li
            key={event.name}
            className="flex justify-between py-1 border-b border-gray-200 last:border-b-0"
          >
            <span className="capitalize">{event.name.replace(/_/g, " ")}</span>
            <span className="font-mono">{event.count}</span>
          </li>
        ))}
      </ul>
      {/* You can add chart libraries like Chart.js or Recharts for real graphs */}
    </div>
  );
};

export default LogAnalytics;
