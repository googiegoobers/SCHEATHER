import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const date = searchParams.get("date");

  const key = process.env.WEATHER_API_KEY;
  if (!key || !lat || !lon || !date) {
    return new Response("Missing parameters", { status: 400 });
  }

  try {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${lat},${lon}&dt=${date}&days=7`;
    const res = await fetch(url);

    if (!res.ok) {
      const errorText = await res.text();
      return new Response(`Weather API error: ${errorText}`, { status: res.status });
    }

    const data = await res.json();

    const forecast = data?.forecast?.forecastday?.find((d: any) => d.date === date);

    if (!forecast || !data.location) {
      return new Response("No forecast data found", { status: 404 });
    }

    return Response.json({
      location: data.location,
      forecast,
    });
  } catch (e) {
    return new Response("Failed to fetch", { status: 500 });
  }
}
