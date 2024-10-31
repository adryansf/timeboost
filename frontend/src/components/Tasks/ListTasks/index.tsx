"use client";
import { useEffect, useState } from "react";
import { LoaderCircleIcon } from "lucide-react";
import { RefreshCwIcon } from "lucide-react";

// Components
import Task from "@/components/Tasks/Task";

// Services
import TasksAPI from "@/services/tasks";

// Errors
import { handleError } from "@/errors/handleError";

// Types
import { ITask } from "@/services/tasks";

export default function ListTasks() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);

  const forceReload = () => {
    setReload(reload + 1);
  };

  const loadTasks = async () => {
    const response = await TasksAPI.getAll();

    if (!response.ok) {
      handleError(response);
      setTasks([]);
    } else {
      setTasks(response.data);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadTasks();
  }, [reload, setLoading, setTasks, handleError]);

  return (
    <section className="m-5">
      <div className="flex justify-end">
        {/* Refresh */}
        <button onClick={forceReload} data-testid="refresh-button">
          <RefreshCwIcon
            className="w-6 h-6 text-yellow-500 data-[loading='true']:animate-spin"
            data-loading={String(loading)}
          />
        </button>
      </div>

      {/* Loader */}
      <div
        className="justify-center items-center hidden data-[loading='true']:flex"
        data-loading={String(loading)}
        data-testid="loader"
      >
        <LoaderCircleIcon className="w-10 h-10 text-primary animate-spin" />
      </div>

      {/* Lista de Tasks */}
      <ul className="flex flex-row flex-wrap gap-5">
        {tasks.map((t) => (
          <li key={t.id}>
            <Task task={t} />
          </li>
        ))}
      </ul>
    </section>
  );
}
