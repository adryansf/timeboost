// Components
import ListTasks from "@/components/Tasks/ListTasks";
import CreateTaskButtonDialog from "@/components/Tasks/CreateTaskButtonDialog";

export default function Tasks() {
  return (
    <main>
      <section className="flex m-5">
        {/* Title */}
        <h1 className="font-bold text-xl flex-grow">Tarefas</h1>
        {/* Create */}
        <CreateTaskButtonDialog />
      </section>

      {/* Lista */}
      <ListTasks />
    </main>
  );
}
