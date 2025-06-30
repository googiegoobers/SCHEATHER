
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  const key = process.env.WEATHER_API_KEY;

  if (!key || !lat || !lon) {
    return new Response("Missing parameters", { status: 400 });
  }

  try {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${lat},${lon}&days=1&aqi=no&alerts=no`;
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok || !data?.location) {
      return new Response("Failed to fetch weather", { status: 500 });
    }

    return Response.json({
      city: data.location.name,
      country: data.location.country,
      localtime: data.location.localtime,
      current: data.current,
      forecast: data.forecast.forecastday[0],
      is_day: data.current.is_day,
    });
  } catch (e) {
    return new Response("Server error", { status: 500 });
  }
}
