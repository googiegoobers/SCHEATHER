"use client";

import React, { useEffect, useRef } from "react";

interface GoogleAnalyticsEmbedProps {
  propertyId: string;
}

export default function GoogleAnalyticsEmbed({
  propertyId,
}: GoogleAnalyticsEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Google Analytics Embed API
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.onload = () => {
      if (window.gapi) {
        window.gapi.load("analytics", () => {
          initAnalytics();
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [propertyId]);

  const initAnalytics = () => {
    if (!window.gapi || !containerRef.current) return;

    window.gapi.analytics.ready(() => {
      // Create the data chart
      const dataChart = new window.gapi.analytics.googleCharts.DataChart({
        query: {
          metrics: "ga:users,ga:pageviews,ga:sessions",
          dimensions: "ga:date",
          "start-date": "30daysAgo",
          "end-date": "today",
        },
        chart: {
          container: containerRef.current,
          type: "LINE",
          options: {
            width: "100%",
            height: 300,
          },
        },
      });

      dataChart.execute();
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Google Analytics Embed (Alternative)
      </h2>
      <div
        ref={containerRef}
        className="w-full h-64 flex items-center justify-center"
      >
        <p className="text-gray-500">Loading Google Analytics data...</p>
      </div>
      <p className="text-sm text-gray-600 mt-2">
        This uses Google Analytics Embed API which may work better with network
        restrictions.
      </p>
    </div>
  );
}

// Add type definitions for the Google Analytics Embed API
declare global {
  interface Window {
    gapi: any;
  }
}
