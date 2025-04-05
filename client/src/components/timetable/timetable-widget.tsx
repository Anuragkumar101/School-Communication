import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, addHours, set, addDays, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CalendarIcon, ClockIcon, PlusIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import TimetableEntry from "./timetable-entry";
import Spinner from "@/components/ui/spinner";
import { useAuth } from "@/hooks/use-auth";
import { useTimetableEntries, firestoreServices } from "@/hooks/use-firestore";
import { useToast } from "@/hooks/use-toast";

const timeOptions = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 || 12;
  const ampm = i < 12 ? "AM" : "PM";
  return {
    value: i.toString(),
    label: `${hour}:00 ${ampm}`,
  };
});

const timetableEntrySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.date({
    required_error: "Date is required",
  }),
  startHour: z.string({
    required_error: "Start time is required",
  }),
  endHour: z.string({
    required_error: "End time is required",
  }),
}).refine((data) => {
  return parseInt(data.endHour) > parseInt(data.startHour);
}, {
  message: "End time must be after start time",
  path: ["endHour"],
});

type TimetableEntryFormValues = z.infer<typeof timetableEntrySchema>;

const TimetableWidget = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const { data: entries, loading, error } = useTimetableEntries(selectedDate);

  const form = useForm<TimetableEntryFormValues>({
    resolver: zodResolver(timetableEntrySchema),
    defaultValues: {
      title: "",
      description: "",
      date: selectedDate,
      startHour: "9", // Default to 9 AM
      endHour: "10", // Default to 10 AM
    },
  });

  const handlePrevDay = () => {
    setSelectedDate(prev => addDays(prev, -1));
  };

  const handleNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1));
  };

  const handleEditEntry = async (id: string) => {
    if (!id) return;
    
    try {
      const entry = await firestoreServices.getDocument("timetableEntries", id);
      if (!entry) return;
      
      const startDate = entry.startTime.toDate();
      const endDate = entry.endTime.toDate();
      
      form.reset({
        title: entry.title,
        description: entry.description || "",
        date: startDate,
        startHour: startDate.getHours().toString(),
        endHour: endDate.getHours().toString(),
      });
      
      setEditingId(id);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error fetching timetable entry:", error);
      toast({
        title: "Error",
        description: "Failed to load timetable entry",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: TimetableEntryFormValues) => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to create timetable entries",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create date objects with the correct hours
      const startTime = set(values.date, {
        hours: parseInt(values.startHour),
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      });
      
      const endTime = set(values.date, {
        hours: parseInt(values.endHour),
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      });
      
      const entryData = {
        title: values.title,
        description: values.description || "",
        startTime,
        endTime,
        createdBy: currentUser.uid,
      };

      if (editingId) {
        await firestoreServices.updateDocument("timetableEntries", editingId, entryData);
        toast({
          description: "Timetable entry updated",
        });
      } else {
        await firestoreServices.addDocument("timetableEntries", entryData);
        toast({
          description: "Timetable entry added",
        });
      }
      
      form.reset();
      setIsDialogOpen(false);
      setEditingId(null);
      
      // If we're adding to a different day than what's currently displayed,
      // update the selected date to show the new entry
      if (!isSameDay(values.date, selectedDate)) {
        setSelectedDate(values.date);
      }
    } catch (error) {
      console.error("Error saving timetable entry:", error);
      toast({
        title: "Error",
        description: "Failed to save timetable entry",
        variant: "destructive",
      });
    }
  };

  const openNewEntryDialog = () => {
    form.reset({
      title: "",
      description: "",
      date: selectedDate,
      startHour: "9",
      endHour: "10",
    });
    setEditingId(null);
    setIsDialogOpen(true);
  };

  // Sort entries by start time
  const sortedEntries = [...(entries || [])].sort((a, b) => 
    a.startTime.toDate().getTime() - b.startTime.toDate().getTime()
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
      <div className="border-b border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center">
        <h3 className="text-lg font-medium">Timetable</h3>
        
        <Button 
          size="sm" 
          className="rounded-full"
          onClick={openNewEntryDialog}
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Entry
        </Button>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" size="icon" onClick={handlePrevDay}>
            <ChevronLeftIcon className="h-5 w-5" />
            <span className="sr-only">Previous day</span>
          </Button>
          
          <h3 className="text-base font-medium">
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </h3>
          
          <Button variant="ghost" size="icon" onClick={handleNextDay}>
            <ChevronRightIcon className="h-5 w-5" />
            <span className="sr-only">Next day</span>
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Error loading timetable. Please try again.
          </div>
        ) : sortedEntries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No entries for this day. Click the + button to add a new entry.
          </div>
        ) : (
          <div className="space-y-4">
            {sortedEntries.map((entry) => (
              <TimetableEntry
                key={entry.id}
                id={entry.id}
                title={entry.title}
                description={entry.description}
                startTime={entry.startTime.toDate()}
                endTime={entry.endTime.toDate()}
                createdBy={entry.createdBy}
                onEdit={handleEditEntry}
              />
            ))}
          </div>
        )}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Timetable Entry" : "Add Timetable Entry"}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Class, study session, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any additional details" 
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startHour"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select start time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endHour"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select end time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <Spinner size="sm" className="mr-2" />
                  ) : null}
                  {editingId ? "Update" : "Add Entry"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TimetableWidget;
