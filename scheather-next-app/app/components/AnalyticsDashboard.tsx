"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AnalyticsData {
  dailyData: Array<any>; // Can be either array format or GA4 object format
  pageViews: Array<any>;
  trafficSources: Array<any>;
  isDummy?: boolean;
  error?: string;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/analytics");
      if (!response.ok) {
        throw new Error("Failed to fetch analytics data");
      }
      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error}</p>
        <button
          onClick={fetchAnalytics}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return <div>No data available</div>;
  }

  // Transform daily data for charts (handle both GA4 and dummy data formats)
  const dailyChartData =
    data.dailyData?.map((row: any) => {
      try {
        // Handle GA4 format (object with dimensionValues and metricValues)
        if (row?.dimensionValues && row?.metricValues) {
          const dateValue = row.dimensionValues[0]?.value || "";
          const users = parseInt(row.metricValues[0]?.value || "0");
          const pageviews = parseInt(row.metricValues[1]?.value || "0");
          const sessions = parseInt(row.metricValues[2]?.value || "0");
          const bounceRate = parseFloat(row.metricValues[3]?.value || "0");

          // GA4 returns dates in YYYYMMDD format, convert to proper date
          let formattedDate = "Unknown";
          if (dateValue && dateValue.length === 8) {
            const year = dateValue.substring(0, 4);
            const month = dateValue.substring(4, 6);
            const day = dateValue.substring(6, 8);
            const date = new Date(`${year}-${month}-${day}`);
            formattedDate = date.toLocaleDateString();
          }

          return {
            date: formattedDate,
            users,
            pageviews,
            sessions,
            bounceRate,
          };
        }

        // Handle dummy data format (array)
        if (Array.isArray(row)) {
          const [date, users, pageviews, sessions, bounceRate] = row;
          return {
            date: new Date(date).toLocaleDateString(),
            users: parseInt(users),
            pageviews: parseInt(pageviews),
            sessions: parseInt(sessions),
            bounceRate: parseFloat(bounceRate),
          };
        }

        // Fallback for unknown format
        return {
          date: "Unknown",
          users: 0,
          pageviews: 0,
          sessions: 0,
          bounceRate: 0,
        };
      } catch (error) {
        console.error("Error processing daily data row:", error, row);
        return {
          date: "Error",
          users: 0,
          pageviews: 0,
          sessions: 0,
          bounceRate: 0,
        };
      }
    }) || [];

  // Transform page views data
  const pageViewsData =
    data.pageViews?.map((row: any) => {
      try {
        // Handle GA4 format
        if (row?.dimensionValues && row?.metricValues) {
          const pagePath = row.dimensionValues[0]?.value || "";
          const pageviews = parseInt(row.metricValues[0]?.value || "0");

          return {
            page:
              pagePath.length > 20
                ? pagePath.substring(0, 20) + "..."
                : pagePath,
            pageviews,
          };
        }

        // Handle dummy data format
        if (Array.isArray(row)) {
          const [pagePath, pageviews] = row;
          return {
            page:
              pagePath.length > 20
                ? pagePath.substring(0, 20) + "..."
                : pagePath,
            pageviews: parseInt(pageviews),
          };
        }

        // Fallback for unknown format
        return {
          page: "Unknown",
          pageviews: 0,
        };
      } catch (error) {
        console.error("Error processing page views row:", error, row);
        return {
          page: "Error",
          pageviews: 0,
        };
      }
    }) || [];

  // Transform traffic sources data
  const trafficSourcesData =
    data.trafficSources?.map((row: any) => {
      try {
        // Handle GA4 format
        if (row?.dimensionValues && row?.metricValues) {
          const source = row.dimensionValues[0]?.value || "Direct";
          const users = parseInt(row.metricValues[0]?.value || "0");

          return {
            source: source || "Direct",
            users,
          };
        }

        // Handle dummy data format
        if (Array.isArray(row)) {
          const [source, users] = row;
          return {
            source: source || "Direct",
            users: parseInt(users),
          };
        }

        // Fallback for unknown format
        return {
          source: "Unknown",
          users: 0,
        };
      } catch (error) {
        console.error("Error processing traffic sources row:", error, row);
        return {
          source: "Error",
          users: 0,
        };
      }
    }) || [];

  return (
    <div className="space-y-6 p-6">
      {/* Demo Data Notification */}
      {data?.isDummy && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Demo Data Active
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  {data.error ||
                    "Showing demo analytics data. Configure Google Analytics API for real data."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Analytics Dashboard
        </h1>
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Refresh Data
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">
            Total Users (30 days)
          </h3>
          <p className="text-2xl font-bold text-gray-900">
            {dailyChartData
              .reduce((sum, day) => sum + day.users, 0)
              .toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">
            Total Page Views (30 days)
          </h3>
          <p className="text-2xl font-bold text-gray-900">
            {dailyChartData
              .reduce((sum, day) => sum + day.pageviews, 0)
              .toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">
            Total Sessions (30 days)
          </h3>
          <p className="text-2xl font-bold text-gray-900">
            {dailyChartData
              .reduce((sum, day) => sum + day.sessions, 0)
              .toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">
            Avg Bounce Rate (30 days)
          </h3>
          <p className="text-2xl font-bold text-gray-900">
            {(
              dailyChartData.reduce((sum, day) => sum + day.bounceRate, 0) /
              dailyChartData.length
            ).toFixed(1)}
            %
          </p>
        </div>
      </div>

      {/* Daily Activity Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Daily Activity (Last 30 Days)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#8884d8"
              name="Users"
            />
            <Line
              type="monotone"
              dataKey="pageviews"
              stroke="#82ca9d"
              name="Page Views"
            />
            <Line
              type="monotone"
              dataKey="sessions"
              stroke="#ffc658"
              name="Sessions"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Page Views Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Top Pages (Last 7 Days)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={pageViewsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="page" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="pageviews" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Traffic Sources Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Traffic Sources (Last 30 Days)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={trafficSourcesData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ source, percent }) =>
                `${source} ${((percent ?? 0) * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="users"
            >
              {trafficSourcesData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
