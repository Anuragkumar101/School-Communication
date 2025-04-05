import TimetableWidget from "@/components/timetable/timetable-widget";

const TimetablePage = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Class Timetable</h1>
        <p className="text-muted-foreground">
          View and manage your shared class schedule
        </p>
      </div>

      <TimetableWidget />
    </div>
  );
};

export default TimetablePage;
