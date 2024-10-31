"use client";
import { useRef, FormEvent, useState } from "react";
import { XIcon, AlarmClockPlusIcon } from "lucide-react";
import { toast } from "react-toastify";
import { validate, validate as validateUUID } from "uuid";

// Services
import TasksAPI from "@/services/tasks";

// Errors
import { handleError } from "@/errors/handleError";

export default function CreateTaskButtonDialog() {
  const [open, setIsOpen] = useState(false);

  const titleInput = useRef<HTMLInputElement>(null);
  const descriptionInput = useRef<HTMLTextAreaElement>(null);
  const dueDateInput = useRef<HTMLInputElement>(null);
  const idUserInput = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const title = titleInput.current?.value;
    const description = descriptionInput.current?.value;
    const dueDate = dueDateInput.current?.value;
    const idUser = idUserInput.current?.value;

    console.log("submit");

    if (!title || title.length < 3) {
      return toast.error("O título deve ter no mínimo 3 caracteres");
    }

    if (!description || description.length < 10) {
      return toast.error("A descrição deve ter no mínimo 10 caracteres");
    }

    if (!dueDate) {
      return toast.error("A data de vencimento deve ser definida.");
    }

    if (!idUser || !validateUUID(idUser)) {
      return toast.error("Digite o id do usuário.");
    }

    const response = await TasksAPI.create({
      title,
      description,
      dueDate: new Date(dueDate).toISOString(),
      idUser,
    });

    if (!response.ok) return handleError(response);

    toast.success("Tarefa criada com sucesso!");
    handleClose();
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Button */}
      <button
        onClick={handleOpen}
        className="bg-green-500 text-white font-bold p-2 rounded-md"
        title="Adicionar Tarefa"
      >
        <AlarmClockPlusIcon />
      </button>

      {/* Dialog */}
      <dialog
        className="fixed h-screen w-full bg-black/50 z-10 top-0 left-0 flex justify-center items-center data-[open='false']:hidden"
        data-open={String(open)}
        data-testid={"create-task-dialog"}
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col p-5 bg-white rounded-md gap-5 max-w-xs"
        >
          <span className="flex items-center">
            <h1 className="flex-grow text-lg font-bold text-primary">
              Adicionar Tarefa
            </h1>
            <button type="button" title="Fechar" onClick={handleClose}>
              <XIcon className="w-5 h-5 text-gray-400" />
            </button>
          </span>
          <span>
            <label htmlFor="title">Título</label>
            <input
              type="text"
              name="title"
              minLength={3}
              ref={titleInput}
              placeholder="Ex: Estudar para a prova de testes"
              className="text-primary border-b-2 border-primary p-2 w-full"
            />
          </span>

          <span>
            <label htmlFor="description">Descrição</label>
            <textarea
              name="description"
              ref={descriptionInput}
              minLength={10}
              placeholder="Ex: Revisar os capítulos 5, 6 e 7 do livro."
              className="text-primary border-b-2 border-primary p-2 w-full"
            />
          </span>

          <span>
            <label htmlFor="dueDate">Data de Vencimento</label>
            <input
              type="date"
              name="dueDate"
              ref={dueDateInput}
              placeholder="DD/MM/YYYY"
              className="text-primary border-b-2 border-primary p-2 w-full"
            />
          </span>

          <span>
            <label htmlFor="idUser">ID do Usuário</label>
            <input
              type="string"
              name="idUser"
              ref={idUserInput}
              placeholder="Ex: acde070d-8c4c-4f0d-9d8a-162843c10333"
              className="text-primary border-b-2 border-primary p-2 w-full"
            />
          </span>

          <span className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-white border-2 border-green-500 text-green-500 font-bold text-lg rounded-md opacity-80 hover:opacity-100 hover:bg-green-500 hover:text-white transition-all"
            >
              Criar
            </button>
          </span>
        </form>
      </dialog>
    </>
  );
}
