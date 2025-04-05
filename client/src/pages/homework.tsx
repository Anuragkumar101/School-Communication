import HomeworkBoard from "@/components/homework/homework-board";

const HomeworkPage = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Homework Board</h1>
        <p className="text-muted-foreground">
          Keep track of all your assignments and tasks
        </p>
      </div>

      <HomeworkBoard />
    </div>
  );
};

export default HomeworkPage;
