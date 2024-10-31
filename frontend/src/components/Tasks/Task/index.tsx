import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BadgeCheckIcon, BadgeIcon, AlarmMinusIcon } from "lucide-react";
import { toast } from "react-toastify";

// Services
import TasksAPI from "@/services/tasks";

// Types
import { ITask } from "@/services/tasks";

// Errors
import { handleError } from "@/errors/handleError";

interface Props {
  task: ITask;
}

export default function Task({ task }: Props) {
  const handleCheck = async () => {
    const response = await TasksAPI.update(task.id, { completed: true });
    if (!response.ok) return handleError(response);
    toast.success("Tarefada completada com sucesso!");
  };

  const handleDelete = async () => {
    const response = await TasksAPI.delete(task.id);

    if (!response.ok) return handleError(response);
    toast.success("Tarefa deletada com sucesso!");
  };

  return (
    <div
      data-completed={String(task.completed)}
      className="relative max-w-xs bg-secondary p-5 rounded-md shadow-xl w-full items-center flex flex-col data-[completed=true]:opacity-100 opacity-70"
    >
      <div className="flex justify-center absolute -top-5 right-0 bg-secondary p-2 rounded-md gap-2">
        <button
          disabled={task.completed}
          onClick={handleCheck}
          title={task.completed ? "Completa" : "Incompleta"}
          data-completed={String(task.completed)}
          className="opacity-80 data-[completed=false]:hover:opacity-100 transition-all"
          data-testid="task-check-button"
        >
          <BadgeCheckIcon
            data-completed={String(task.completed)}
            className="data-[completed=false]:hidden"
          />
          <BadgeIcon
            data-completed={String(task.completed)}
            className="data-[completed=true]:hidden"
          />
        </button>
        <button
          disabled={task.completed}
          onClick={handleDelete}
          title={"Deletar tarefa"}
          data-completed={String(task.completed)}
          className="opacity-80 data-[completed=false]:hover:opacity-100 data-[completed=true]:hidden transition-all"
        >
          <AlarmMinusIcon className="text-red-500" />
        </button>
      </div>
      <div>
        <p>
          <strong>Título:</strong> {task.title}
        </p>
        <p>
          <strong>ID:</strong> {task.id}
        </p>
        <p>
          <strong>ID Usuário:</strong> {task.idUser}
        </p>
        <p>
          <strong>Descrição:</strong> {task.description}
        </p>
        <p></p>
        <p>
          <strong>Vencimento em:</strong>{" "}
          {format(task.dueDate, "dd/MM/yyyy", {
            locale: ptBR,
          })}
        </p>
        <p>
          <strong>Criado em:</strong>{" "}
          {format(task.createdAt, "dd/MM/yyyy", {
            locale: ptBR,
          })}
        </p>
      </div>
    </div>
  );
}
