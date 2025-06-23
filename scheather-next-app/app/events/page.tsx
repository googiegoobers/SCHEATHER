'use client'
import CalendarComponent from '@/app/components/Calendar';

export default function EventsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Event Calendar</h1>
      <CalendarComponent />
    </div>
  );
}