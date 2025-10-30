import { CalendarHeader } from "../../../../components/calendar/header";
import { WeekView } from "../../../../components/calendar/week/week-view";

export default async function ScheduledMeetingsPage() {
  return (
    <div className="w-full">
      <CalendarHeader />
      <WeekView />
    </div>
  );
}
