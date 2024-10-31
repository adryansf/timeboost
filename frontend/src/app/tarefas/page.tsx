// Components
import ListTasks from "@/components/Tasks/ListTasks";
import CreateTaskButtonDialog from "@/components/Tasks/CreateTaskButtonDialog";

export default function Tasks() {
  return (
    <main>
      <section className="flex m-5">
        {/* Titulo pagina*/}
        <h1 className="font-bold text-xl flex-grow">Tarefas</h1>
        {/* Componente que Cria a tarefa */}
        <CreateTaskButtonDialog />
      </section>

      {/* Componente que Lista a tarefa*/}
      <ListTasks />
    </main>
  );
}
