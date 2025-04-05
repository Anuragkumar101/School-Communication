import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import TaskCard from "./task-card";
import Spinner from "@/components/ui/spinner";
import { useAuth } from "@/hooks/use-auth";
import { useTasks, firestoreServices } from "@/hooks/use-firestore";
import { useToast } from "@/hooks/use-toast";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
});

type TaskFormValues = z.infer<typeof taskSchema>;

const HomeworkBoard = () => {
  const { currentUser } = useAuth();
  const { data: tasks, loading, error } = useTasks();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: new Date(),
    },
  });

  const onSubmit = async (values: TaskFormValues) => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to create tasks",
        variant: "destructive",
      });
      return;
    }

    try {
      const taskData = {
        title: values.title,
        description: values.description || "",
        dueDate: values.dueDate,
        completed: false,
        createdBy: currentUser.uid,
        createdAt: new Date(),
      };

      await firestoreServices.addDocument("tasks", taskData);
      
      toast({
        description: "Task added successfully",
      });
      
      form.reset();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding task:", error);
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Group tasks by completion status
  const activeTask = tasks?.filter(task => !task.completed) || [];
  const completedTask = tasks?.filter(task => task.completed) || [];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
      <div className="border-b border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center">
        <h3 className="text-lg font-medium">Homework Board</h3>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="rounded-full">
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Homework Task</DialogTitle>
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
                        <Input placeholder="Task title" {...field} />
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
                          placeholder="Provide more details about the task" 
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
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date</FormLabel>
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
                
                <DialogFooter>
                  <Button 
                    type="submit" 
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <Spinner size="sm" className="mr-2" />
                    ) : null}
                    Add Task
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Error loading tasks. Please try again.
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No homework tasks yet. Click the + button to add a new task.
          </div>
        ) : (
          <div className="space-y-6">
            {activeTask.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Active Tasks ({activeTask.length})
                </h4>
                {activeTask.map((task) => (
                  <TaskCard
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    description={task.description}
                    dueDate={task.dueDate.toDate()}
                    completed={task.completed}
                    createdBy={task.createdBy}
                    currentUserId={currentUser?.uid || ""}
                  />
                ))}
              </div>
            )}
            
            {completedTask.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Completed Tasks ({completedTask.length})
                </h4>
                {completedTask.map((task) => (
                  <TaskCard
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    description={task.description}
                    dueDate={task.dueDate.toDate()}
                    completed={task.completed}
                    createdBy={task.createdBy}
                    currentUserId={currentUser?.uid || ""}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeworkBoard;
